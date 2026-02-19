cmake_minimum_required(VERSION 3.20)
project(PostureGuardian VERSION 0.1.0)


set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(OpenCV REQUIRED)
find_package(CURL REQUIRED)
find_package(nlohmann_json REQUIRED)
find_package(GTest CONFIG)
find_package(imgui CONFIG REQUIRED)


# Source files
set(SOURCES
    src/camera/CameraCapture.cpp
    src/network/MLEngineClient.cpp
    src/network/BackendClient.cpp
    src/utils/Config.cpp
    src/utils/Notification.cpp
    src/utils/TimeUtils.cpp
    src/utils/PasswordManager.cpp
    src/ui/TrayIcon.cpp
    src/ui/LoginWindow.cpp
    src/ui/resources.rc
    src/ui/resource.h
)

# Executable
add_executable(PostureGuardian WIN32 src/main.cpp ${SOURCES})

target_include_directories(PostureGuardian PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src)

# Link libraries
target_link_libraries(PostureGuardian
    ${OpenCV_LIBS}
    CURL::libcurl
    nlohmann_json::nlohmann_json
    shell32
    imgui::imgui
    opengl32
)
enable_testing()

add_executable(posture-guardian-tests 
tests/unit/ConfigTest.cpp
tests/unit/BackendClientTest.cpp
tests/unit/TimeUtilsTest.cpp
src/network/BackendClient.cpp
src/utils/Config.cpp
src/utils/TimeUtils.cpp
src/utils/PasswordManager.cpp

)

target_include_directories(posture-guardian-tests
PRIVATE 
${CMAKE_CURRENT_SOURCE_DIR}/src
${OpenCV_INCLUDE_DIRS}
)

target_link_libraries( posture-guardian-tests
${OpenCV_LIBS}
CURL::libcurl
GTest::gtest
GTest::gtest_main
shell32
)

include(GoogleTest)
gtest_discover_tests(posture-guardian-tests)


# Copy config file to build directory
configure_file(config.json ${CMAKE_CURRENT_BINARY_DIR}/config.json COPYONLY)
configure_file(tests/test_config.json ${CMAKE_BINARY_DIR}/test_config.json COPYONLY)