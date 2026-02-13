#include <iostream>
#include <thread>
#include <atomic>
#include <opencv2/opencv.hpp>
#include "utils/Config.h"
#include "utils/TimeUtils.h"
#include "utils/PasswordManager.h"  
#include "ui/SetupWizard.h" 
#include "camera/CameraCapture.h"
#include "network/BackendClient.h"
#include "network/MLEngineClient.h"
#include "ui/TrayIcon.h"
#include "utils/Notification.h"
#include "ui/SetupWizard.h"

std::atomic<bool> running(true);
std::atomic<bool> paused(false);

UserSettings currentSettings;
std::mutex settingsMutex;
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
if (std::chrono::duration_cast<std::chrono::seconds>(now - lastSettingsCheck).count() >= 30){
    UserSettings newSettings;
    
    if (backendClient.fetchSettings(newSettings)){
        std::lock_guard<std::mutex> lock(settingsMutex);
       currentSettings = newSettings;
    }
    
    lastSettingsCheck = now;
}

{
    std::lock_guard<std::mutex> lock(settingsMutex);
    if(currentSettings.workingHoursEnabled){
        if(!TimeUtils::isWithinWorkingHours(currentSettings.workingHoursStart,currentSettings.workingHoursEnd)){
            int currentMinutes = TimeUtils::getCurrentMinutes();
            int hours = currentMinutes / 60;
            int mins = currentMinutes % 60;
            std::cout << "Outside working hours (current: " 
                              << (hours < 10 ? "0" : "") << hours << ":" 
                              << (mins < 10 ? "0" : "") << mins 
                              << ", working: " << currentSettings.workingHoursStart 
                              << " - " << currentSettings.workingHoursEnd << ")" << std::endl;

            std::this_thread::sleep_for(std::chrono::minutes(1));
            continue;
        }
    }
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
        std::vector<uchar> imageData = camera.encodeFrameToJpeg(frame);

        // Analyze posture
        PostureResult result;
        if (mlClient.analyzePosture(imageData, result)){
            std::cout << "Posture: " << result.postureState
                      << " (confidence: " << (result.confidence * 100) << "%)" << std::endl;

            // Update tray icon
            if (result.postureState == "good"){
                tray.setIcon("good");
            }
             else if (result.severity > 0.5){
                tray.setIcon("error");

                bool shouldNotify = false;
                {
                    std::lock_guard<std::mutex> lock(settingsMutex);
                    
                    if (currentSettings.notificationsEnabled)
                    {
                        // Apply sensitivity threshold
                        if (currentSettings.notificationSensitivity == "low" && result.severity > 0.8) {
                            shouldNotify = true;
                        } else if (currentSettings.notificationSensitivity == "medium" && result.severity > 0.5) {
                            shouldNotify = true;
                        } else if (currentSettings.notificationSensitivity == "high" && result.severity > 0.3) {
                            shouldNotify = true;
                        }
                    }
                }
                
                if (shouldNotify && !result.recommendations.empty()){
                    Notification::showWarning("Posture Alert", result.recommendations[0]);
                }
            }  else{
                tray.setIcon("warning");
            }

            // Send to backend
            if (backendClient.isAuthenticated()){
                backendClient.sendPostureEvent(
                    result.postureState,
                    result.confidence,
                    result.severity);
            }
        } else {
            std::cerr << "ML analysis failed" << std::endl;
        }
        int interval;
        {
            std::lock_guard<std::mutex> lock (settingsMutex);
            interval = currentSettings.captureIntervalSeconds;
        }
        // Wait for next capture
        std::this_thread::sleep_for(std::chrono::seconds(interval));
    }
}

int main(int argc, char *argv[])
{
    std::cout << "Posture Guardian - Desktop Agent" << std::endl;
    
    if(SetupWizard::isFirstRun()){
    SetupWizard::Credentials credentials;
    if(!SetupWizard::show(credentials)){
        std::cerr<< "Setup cancelled"<< std::endl;
        return 1;
    }
    PasswordManager::storePassword(credentials.username,credentials.password);
    SetupWizard::saveToConfig(credentials);
    }
    
    // Load configuration
    Config &config = Config::getInstance();
    if (!config.load("config.json")) {
        std::cerr << "Failed to load configuration" << std::endl;
        return 1;
    }
// Initialize settings with config defaults
       currentSettings.captureIntervalSeconds = config.getCaptureInterval();
       currentSettings.notificationsEnabled = true;
       currentSettings.notificationSensitivity = "medium";
       currentSettings.workingHoursEnabled = false;
       currentSettings.cameraIndex = config.getCameraIndex();


    // Initialize camera
    CameraCapture camera(config.getCameraIndex());
    if (!camera.initialize())
    {
        std::cerr << "Failed to initialize camera" << std::endl;
        return 1;
    }

    // Initialize clients
    MLEngineClient mlClient(config.getEngineUrl());
    BackendClient backendClient(config.getBackendUrl(), config.getUsername());


    std::string password;
    bool loggedIn = false;
    if(PasswordManager::retreivePassword(config.getUsername(),password)){
        backendClient.setPassword(password);
        if(backendClient.login()){
            loggedIn = true;
        }
    }
   if (!loggedIn) {
        std::cout << "Login failed. Opening Setup Wizard..." << std::endl;
        SetupWizard::Credentials credentials;
        if(SetupWizard::show(credentials)) {
            PasswordManager::storePassword(credentials.username, credentials.password);
            backendClient.setPassword(credentials.password);
            if(!backendClient.login()) return 1;
        } else {
            return 1;
        }
    }
    

    //Fetch initial settings
    UserSettings initialSettings;
    if(backendClient.fetchSettings(initialSettings)){
        std::lock_guard<std::mutex> lock(settingsMutex);
        currentSettings = initialSettings;
        std::cout <<"Initial Settings loaded" << std::endl;
    }




    // Initialize system tray
    TrayIcon tray;
    HINSTANCE hInstance = GetModuleHandle(NULL);
    
    if (!tray.initialize(hInstance)){
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
       ShellExecuteA(NULL, "open", "https://your-app.vercel.app/dashboard", NULL, NULL, SW_SHOWNORMAL);
    };

    tray.onExit = [&]()
    {
        std::cout << "Exiting..." << std::endl;
        running = false;
    };

    int initialInterval;
    {
        std::lock_guard<std::mutex> lock(settingsMutex);
        initialInterval = currentSettings.captureIntervalSeconds;
    }

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