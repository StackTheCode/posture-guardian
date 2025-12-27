#include <iostream>
#include <opencv2/opencv.hpp>
#include "utils/Config.h"
#include "camera/CameraCapture.h"
#include "network/BackendClient.h"
#include "network/MLEngineClient.h"
void showNotification(const PostureResult) {}

int main()
{
    Config &config = Config::getInstance();
    if (!config.load("config.json"))
    {
        std::cerr << "Failed to load configuration file" << std::endl;
        return 1;
    }
    std::cout << "Configuration loaded" << std::endl;

    // Initialize camera

    CameraCapture camera(config.getCameraIndex());
    if (!camera.initialize()){
        std::cerr << "Failed to initialize camera" << std::endl;
        return 1;
    }
    std::cout << " Camera initialized" << std::endl;

    // initialize clients
    MLEngineClient mlClient(config.getEngineUrl());
    BackendClient backendClient(config.getBackendUrl(), config.getToken());

    std::cout << " Network clients ready" << std::endl;
    std::cout << "\nMonitoring posture every " << config.getCaptureInterval()
              << " seconds..." << std::endl;
    std::cout << "Press Ctrl+C to stop\n"
              << std::endl;

    while (true){
        // Capture frame
        cv::Mat frame;
        if (!camera.captureFrame(frame)){
            std::cerr << "Failed to capture frame, retrying..." << std::endl;
            std::this_thread::sleep_for(std::chrono::seconds(5));
            continue;
        }
        std::cout << "[" << std::time(nullptr) << "] Frame captured" << std::endl;

        // Encode to jpg
        std::vector imageData = camera.encodeFrameToJpeg(frame);

          // Analyze posture with ML engine
        PostureResult result;
        if (mlClient.analyzePosture(imageData, result)) {
            std::cout << "  → Posture: " << result.postureState 
                      << " (confidence: " << (result.confidence * 100) << "%)" << std::endl;

            // Show notification if bad posture
            if (result.postureState != "good" && result.severity > 0.5) {
                showNotification(result);
            }

            // Send to backend
            if (!config.getToken().empty()) {
                backendClient.sendPostureEvent(
                    result.postureState,
                    result.confidence,
                    result.severity
                );
            } else {
                std::cout << "No token configured, skipping backend sync" << std::endl;
            }
        } else {
            std::cerr << "ML analysis failed" << std::endl;
        }

        std::this_thread::sleep_for(
            std::chrono::seconds(config.getCaptureInterval())
        );
        return 0;

}

}
