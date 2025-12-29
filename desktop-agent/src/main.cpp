#include <iostream>
#include <thread>
#include <opencv2/opencv.hpp>
#include "utils/Config.h"
#include "camera/CameraCapture.h"
#include "network/BackendClient.h"
#include "network/MLEngineClient.h"
#include "ui/TrayIcon.h"
#include "utils/Notification.h" 
std::atomic running(true);
std::atomic paused(false);

void monitoringLoop(
    CameraCapture& camera,
    MLEngineClient& mlClient,
    BackendClient& backendClient,
    TrayIcon& tray,
    int interval
) {
    while (running) {
        // Check if paused
        if (paused) {
            std::this_thread::sleep_for(std::chrono::seconds(1));
            continue;
        }
        
        // Capture frame
        cv::Mat frame;
        if (!camera.captureFrame(frame)) {
            std::cerr << "Failed to capture frame, retrying..." << std::endl;
            std::this_thread::sleep_for(std::chrono::seconds(5));
            continue;
        }

        std::cout << "[" << std::time(nullptr) << "] Frame captured" << std::endl;

        // Encode to JPEG
        std::vector imageData = camera.encodeFrameToJpeg(frame);

        // Analyze posture
        PostureResult result;
        if (mlClient.analyzePosture(imageData, result)) {
            std::cout << "  → Posture: " << result.postureState 
                      << " (confidence: " << (result.confidence * 100) << "%)" << std::endl;

            // Update tray icon
            if (result.postureState == "good") {
                tray.setIcon("good");
            } else if (result.severity > 0.5) {
                tray.setIcon("error");
                
                // Show notification for bad posture
                Notification::showWarning(
                    "Posture Alert",
                    result.recommendations[0]
                );
            } else {
                tray.setIcon("warning");
            }

            // Send to backend
            Config& config = Config::getInstance();
            if (!config.getToken().empty()) {
                backendClient.sendPostureEvent(
                    result.postureState,
                    result.confidence,
                    result.severity
                );
            }
        } else {
            std::cerr << " ML analysis failed" << std::endl;
        }

        // Wait for next capture
        std::this_thread::sleep_for(std::chrono::seconds(interval));
    }
}

int main(int argc, char* argv[]) {
    std::cout << " Posture Guardian - Desktop Agent" << std::endl;


    // Load configuration
    Config& config = Config::getInstance();
    if (!config.load("config.json")) {
        std::cerr << "Failed to load configuration" << std::endl;
        return 1;
    }

    // Initialize camera
    CameraCapture camera(config.getCameraIndex());
    if (!camera.initialize()) {
        std::cerr << "Failed to initialize camera" << std::endl;
        return 1;
    }

    // Initialize clients
    MLEngineClient mlClient(config.getEngineUrl());
    BackendClient backendClient(config.getBackendUrl(), config.getToken());

    // Initialize system tray
    TrayIcon tray;
    HINSTANCE hInstance = GetModuleHandle(NULL);
    
    if (!tray.initialize(hInstance)) {
        std::cerr << "Failed to initialize system tray" << std::endl;
        return 1;
    }

    // Set up tray callbacks
    tray.onPauseResume = [&]() {
        paused = tray.isPaused();
        if (paused) {
            std::cout << "Monitoring paused" << std::endl;
            Notification::show("Posture Guardian", "Monitoring paused");
        } else {
            std::cout << "Monitoring resumed" << std::endl;
            Notification::show("Posture Guardian", "Monitoring resumed");
        }
    };

    tray.onSettings = [&]() {
        std::cout << "⚙ Settings clicked" << std::endl;
        Notification::show("Settings", "Settings UI coming soon!");
    };

    tray.onExit = [&]() {
        std::cout << " Exiting..." << std::endl;
        running = false;
    };

 
    std::cout << " Monitoring in background (check system tray)" << std::endl;

    // Show initial notification
    Notification::show(
        "Posture Guardian Started",
        "Monitoring your posture every " + std::to_string(config.getCaptureInterval()) + " seconds"
    );

    // Start monitoring in separate thread
    std::thread monitorThread(
        monitoringLoop,
        std::ref(camera),
        std::ref(mlClient),
        std::ref(backendClient),
        std::ref(tray),
        config.getCaptureInterval()
    );

    // Main message loop for tray icon
    while (running) {
        tray.processMessages();
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    // Wait for monitoring thread to finish
    monitorThread.join();

    std::cout << "Goodbye! " << std::endl;
    return 0;
}