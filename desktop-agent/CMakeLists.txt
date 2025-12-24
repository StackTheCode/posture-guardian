cmake_minimum_required(VERSION 3.20)
project(PostureGuardian VERSION 0.1.0)


set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


find_package(OpenCV REQUIRED)
find_package(CURL REQUIRED)
find_package(nlohmann_json REQUIRED)

# Source files
set(SOURCES
    src/main.cpp
    src/camera/CameraCapture.cpp
    # src/network/MLEngineClient.cpp
    # src/network/BackendClient.cpp
    # src/utils/Config.cpp
)

# Executable
add_executable(posture-guardian ${SOURCES})

# Link libraries
target_link_libraries(posture-guardian
    ${OpenCV_LIBS}
    CURL::libcurl
    nlohmann_json::nlohmann_json
)

# Copy config file to build directory
configure_file(config.json ${CMAKE_CURRENT_BINARY_DIR}/config.json COPYONLY)