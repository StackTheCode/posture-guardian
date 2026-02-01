#include <gtest/gtest.h>
#include <thread>
#include <chrono>
#include "utils/Config.h"
#include "network/BackendClient.h"
#include "network/MLEngineClient.h"
#include "camera/CameraCapture.h"

class IntegrationTest: public  ::testing::Test{
    protected:
       void SetUp() override{
          Config& config  = Config::getInstance();
        ASSERT_TRUE(config.load("test_config.json"));
       }

};

TEST_F(IntegrationTest, DISABLED_FullWorkflow){
    //  This test requires:
     // 1. ML Engine running on port 8000
    // 2. Backend running on port 8080
    // 3. Camera available
    // Disabled by default - run manually


    Config& config = Config::getInstance();

    // Initialize camera
    CameraCapture camera(config.getCameraIndex());
    ASSERT_TRUE(camera.initialize());


    BackendClient backendClient(
        config.getBackendUrl(),
        config.getUsername(),
        config.getPassword()
    );
    ASSERT_TRUE(backendClient.login());


    MLEngineClient mlClient(config.getEngineUrl());

    // capture Frame
    cv::Mat frame;
    ASSERT_TRUE(camera.captureFrame(frame));
    EXPECT_FALSE(frame.empty());


    std::vector<uchar> imageData = camera.encodeFrameToJpeg(frame);
    EXPECT_GT(imageData.size(),0);

    // Analyze posture

    PostureResult result;
    ASSERT_TRUE(mlClient.analyzePosture(imageData,result));

    EXPECT_FALSE(result.postureState.empty());
    EXPECT_GE(result.confidence,0.0);
    EXPECT_LE(result.confidence,1.0);
    EXPECT_GE(result.severity,0.0);
    EXPECT_LE(result.severity,1.0);

    ASSERT_TRUE(backendClient.sendPostureEvent(result.postureState,result.confidence,result.severity));


    std::cout << " Full workflow completed successfully" << std::endl;


}

TEST_F(IntegrationTest, DISABLED_SettingsSyncWorkflow){

    Config& config = Config::getInstance();

    BackendClient backendClient(
        config.getBackendUrl(),
        config.getUsername(),
        config.getPassword()
    );
    ASSERT_TRUE(backendClient.login());

    UserSettings settings;
    ASSERT_TRUE(backendClient.fetchSettings(settings));

    EXPECT_GE(settings.captureIntervalSeconds,10);
    EXPECT_LE(settings.captureIntervalSeconds,120);

    std::cout << "Settings fetched successfully" << std::endl;
}