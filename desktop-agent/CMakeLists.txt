cmake_minimum_required(VERSION 4.2.1)
project(PostureGuardian VERSION 0.1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find packages
find_package(OpenCV REQUIRED)
find_package(CURL REQUIRED)

# Include directories
include_directories(
      ${OpenCV_INCLUDE_DIRS}
    ${CURL_INCLUDE_DIRS}
    ${CMAKE_SOURCE_DIR}/include/nlohmann
)

# Source files
set(SOURCES
src/main.cpp,
src/camera/CameraCapture.cpp,
src/network/MLEngineClient.cpp
src/network/BackendClient.cpp
src/utils/Config.cpp
)

# Executable
add_executable(config.json ${CMAKE_BINARY_DIR}/config.json COPYONLY)

