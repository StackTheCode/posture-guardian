# Posture Guardian Desktop Agent Documentation
This document provides a technical overview and setup guide for the Posture Guardian Desktop Agent, a C++ application designed to monitor user posture via webcam and provide real-time feedback.

## Project Overview
The Desktop Agent serves as the local interface of the Posture Guardian system. It captures images at set intervals, communicates with a Machine Learning (ML) engine for analysis, and alerts the user through system tray updates and native Windows notifications.   

### Core Components
The agent is built using three primary modules:



### Camera Module:
Utilizes OpenCV to initialize the webcam and capture frames as JPEG-encoded data. 



### Network Clients: 
Handles communication with the ML Engine (for posture analysis) and the Backend (for data logging and user synchronization).   



### UI Module:
Manages the Windows System Tray icon, context menus (Pause, Settings, Exit), and native toast notifications.   


## Technical Prerequisites
To build and run the agent, the following tools and libraries must be installed:

Compiler: MSVC (Visual Studio 2017 or newer).

Build System: CMake 3.20+.

Package Manager: vcpkg (for library management).

### Libraries:

*OpenCV* (Image processing).   

*CURL* (HTTP requests).

*nlohmann_json* (Configuration and API parsing).

## Configuration
The application relies on a config.json file located in the executable directory. Key parameters include:

**cameraIndex**: The ID of the webcam to use.   



**captureInterval**: Time in seconds between posture checks.   



**mlEngineUrl**: The endpoint for the ML analysis service.   

**backendUrl**: The endpoint for the central data server.   

## Usage and Interaction


Startup: Upon launching, the agent initializes all systems and displays a "Posture Guardian Started" notification.   


Background Operation: The app runs in the system tray to stay out of the user's workspace.   

Monitoring States:



Good Posture: The tray icon reflects a healthy state.   



Bad Posture: If severity exceeds 0.5, a Windows notification appears with specific corrective recommendations.   



Manual Control: Right-clicking the tray icon allows the user to pause monitoring, access settings, or exit the program.   

## Build Commands
To compile the agent in Release mode, use the following steps in your terminal:

``` bash
# Configure the project with the vcpkg toolchain 
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=[path_to_vcpkg]/scripts/buildsystems/vcpkg.cmake

```


```bash 
# Build the executable
cmake --build build --config Release
