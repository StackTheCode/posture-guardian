#include <gtest/gtest.h>
#include "network/BackendClient.h"


class BackendClientTest: public ::testing::Test{
    protected:
       BackendClient* client;

       void SetUp() override{
        client = new BackendClient(
            "http://localhost:8080/api/v1",
            "testuser",
            "testpass"
        );
       }

       void TearDown() override {
        delete client;
       }
};

TEST_F(BackendClientTest, Construction){
    EXPECT_NE(client,nullptr);
    EXPECT_FALSE(client->isAuthenticated());

}

TEST_F(BackendClientTest,UserSettingsStructure){
    UserSettings settings;
    settings.captureIntervalSeconds = 30;
    settings.notificationsEnabled = true;
    settings.notificationSensitivity = "medium";
    settings.workingHoursEnabled = false;
    settings.workingHoursStart = "09:00:00";
    settings.workingHoursEnd = "17:00:00";
    settings.cameraIndex =0;
    settings.theme = "dark";

EXPECT_EQ(settings.captureIntervalSeconds,30);
EXPECT_TRUE(settings.notificationsEnabled);
EXPECT_EQ(settings.notificationSensitivity, "medium");
}

TEST_F(BackendClientTest, DISABLED_FetchSettingsIntegration){
        // Requires backend and valid login
    UserSettings settings;

    client->login();
    bool success = client->fetchSettings(settings);

    EXPECT_TRUE(success);
    EXPECT_GE(settings.captureIntervalSeconds,30);
    EXPECT_LE(settings.captureIntervalSeconds,60);

}