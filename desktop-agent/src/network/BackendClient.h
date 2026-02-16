#ifndef BACKEND_CLIENT_H
#define BACKEND_CLIENT_H

#include <iostream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;



struct UserSettings{
    int captureIntervalSeconds;
    bool notificationsEnabled;
    std::string notificationSensitivity;
    bool workingHoursEnabled;
    std::string workingHoursStart;
    std::string workingHoursEnd;
    int cameraIndex;
    std::string theme;
};

class BackendClient{
    public:
           BackendClient(const std::string& baseUrl, const std::string& username);

        void setPassword(const std::string& password);
         void setUsername(const std::string& password);
        bool login();
        bool isAuthenticated() const { return !token.empty(); }
        bool sendPostureEvent(std::string& postureState, double confidence,double severity);


        bool fetchSettings(UserSettings& settings);


    private:
    std::string baseUrl;
    std::string token;
    std::string password;
    std::string username;
    

    static size_t WriteCallback(void* conents,size_t size, size_t nmemb,void* userp);

};
#endif