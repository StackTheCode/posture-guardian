#include <iostream>
#include <thread>
#include <opencv2/opencv.hpp>
#include "utils/Config.h"
#include "camera/CameraCapture.h"
#include "network/BackendClient.h"
#include "network/MLEngineClient.h"
#include "ui/TrayIcon.h"
#include "utils/Notification.h"

std::atomic<bool> running(true);
std::atomic<bool> paused(false);



std::atomic<int> captureInterval(30);
std::atomic<bool> notificationsEnabled(true);
std::string notificationSensitivity = "medium";
void monitoringLoop(
    CameraCapture &camera,
    MLEngineClient &mlClient,
    BackendClient &backendClient,
    TrayIcon &tray)
{
    auto lastSettingsCheck = std::chrono::steady_clock::now();
    while (running){
        // Check if paused
        if (paused)
        {
            std::this_thread::sleep_for(std::chrono::seconds(1));
            continue;
        }
        // Check for settings updates every 30 seconds
      auto now = std::chrono::steady_clock::now();
if (std::chrono::duration_cast<std::chrono::seconds>(now - lastSettingsCheck).count() >= 30)
{
    int newInterval;
    bool newNotificationsEnabled;
    std::string newSensitivity;
    
    if (backendClient.fetchSettings(newInterval, newNotificationsEnabled, newSensitivity))
    {
        captureInterval.store(newInterval);
        notificationsEnabled.store(newNotificationsEnabled);
        notificationSensitivity = newSensitivity;
         std::cout << " Settings updated: interval=" << newInterval 
                          << "s, notifications=" << (newNotificationsEnabled ? "on" : "off")
                          << ", sensitivity=" << newSensitivity << std::endl;
    }
    
    lastSettingsCheck = now;
}

        // Capture frame
        cv::Mat frame;
        if (!camera.captureFrame(frame))
        {
            std::cerr << "Failed to capture frame, retrying..." << std::endl;
            std::this_thread::sleep_for(std::chrono::seconds(5));
            continue;
        }

        std::cout << "[" << std::time(nullptr) << "] Frame captured" << std::endl;

        // Encode to JPEG
        std::vector imageData = camera.encodeFrameToJpeg(frame);

        // Analyze posture
        PostureResult result;
        if (mlClient.analyzePosture(imageData, result)){
            std::cout << "  → Posture: " << result.postureState
                      << " (confidence: " << (result.confidence * 100) << "%)" << std::endl;

            // Update tray icon
            if (result.postureState == "good"){
                tray.setIcon("good");
            }
            else if (result.severity > 0.5){
                tray.setIcon("error");

                if(notificationsEnabled.load()){
                      bool shouldNotify = false;
                    if (notificationSensitivity == "low" && result.severity > 0.8) {
                        shouldNotify = true;
                    } else if (notificationSensitivity == "medium" && result.severity > 0.5) {
                        shouldNotify = true;
                    } else if (notificationSensitivity == "high" && result.severity > 0.3) {
                        shouldNotify = true;
                    }
                    
                    if (shouldNotify && !result.recommendations.empty()) {
                        Notification::showWarning("Posture Alert", result.recommendations[0]);
                    }
                }
            }  else{
                tray.setIcon("warning");
            }

            // Send to backend
            if (backendClient.isAuthenticated())
            {
                backendClient.sendPostureEvent(
                    result.postureState,
                    result.confidence,
                    result.severity);
            }
        } else {
            std::cerr << "ML analysis failed" << std::endl;
        }

        // Wait for next capture
        std::this_thread::sleep_for(std::chrono::seconds(captureInterval.load()));
    }
}

int main(int argc, char *argv[])
{
    std::cout << "Posture Guardian - Desktop Agent" << std::endl;

    // Load configuration
    Config &config = Config::getInstance();
    if (!config.load("config.json"))
    {
        std::cerr << "Failed to load configuration" << std::endl;
        return 1;
    }

        captureInterval.store(config.getCaptureInterval());


    // Initialize camera
    CameraCapture camera(config.getCameraIndex());
    if (!camera.initialize())
    {
        std::cerr << "Failed to initialize camera" << std::endl;
        return 1;
    }

    // Initialize clients
    MLEngineClient mlClient(config.getEngineUrl());
    BackendClient backendClient(config.getBackendUrl(), config.getUsername(), config.getPassword());

    if (!backendClient.login())
    {
        std::cerr << " Failed to login. Check username/password in config.json" << std::endl;
        return 1;
    }
    // Initialize system tray
    TrayIcon tray;
    HINSTANCE hInstance = GetModuleHandle(NULL);
    
    if (!tray.initialize(hInstance))
    {
        std::cerr << "Failed to initialize system tray" << std::endl;
        return 1;
    }
    Notification::initialize(&tray);

    // Set up tray callbacks
    tray.onPauseResume = [&]()
    {
        paused = tray.isPaused();
        if (paused)
        {
            std::cout << "Monitoring paused" << std::endl;
            Notification::show("Posture Guardian", "Monitoring paused");
        }
        else
        {
            std::cout << "Monitoring resumed" << std::endl;
            Notification::show("Posture Guardian", "Monitoring resumed");
        }
    };

    tray.onSettings = [&]()
    {
        std::cout << "Settings clicked" << std::endl;
        Notification::show("Settings", "Settings UI coming soon!");
    };

    tray.onExit = [&]()
    {
        std::cout << "Exiting..." << std::endl;
        running = false;
    };

    std::cout << "Monitoring in background (check system tray)" << std::endl;

    // Show initial notification
    Notification::show(
        "Posture Guardian Started",
        "Monitoring your posture every " + std::to_string(config.getCaptureInterval()) + " seconds");

    // Start monitoring in separate thread
    std::thread monitorThread(
        monitoringLoop,
        std::ref(camera),
        std::ref(mlClient),
        std::ref(backendClient),
        std::ref(tray));

    // Main message loop for tray icon
    while (running)
    {
        tray.processMessages();
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    // Wait for monitoring thread to finish
    monitorThread.join();

    std::cout << "Goodbye! " << std::endl;
    return 0;
}