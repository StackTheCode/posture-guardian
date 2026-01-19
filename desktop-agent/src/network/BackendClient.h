#ifndef BACKEND_CLIENT_H
#define BACKEND_CLIENT_H

#include <iostream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class BackendClient{
    public:
           BackendClient(const std::string& baseUrl, const std::string& username, const std::string& password);

    
        bool login();
        bool isAuthenticated() const { return !token.empty(); }
        bool sendPostureEvent(std::string& postureState, double confidence,double severity);

        bool fetchSettings(int& captureInterval, bool& notificationsEnabled, std::string& sensitivity);


    private:
    std::string baseUrl;
    std::string token;
    std::string password;
    std::string username;
    

    static size_t WriteCallback(void* conents,size_t size, size_t nmemb,void* userp);

};


















#endif