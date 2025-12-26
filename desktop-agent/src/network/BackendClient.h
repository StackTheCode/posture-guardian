#ifndef BACKEND_CLIENT_H
#define BACKEND_CLIENT_H

#include <iostream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class BackendClient{
    public:
        BackendClient(const std::string& baseUrl, const std::string& token);
    bool sendPostureEvent(std::string& postureState, double confidence,double severity);

    private:
    std::string baseUrl;
    std:: string token;

    static size_t WriteCallback(void* conents,size_t size, size_t nmemb,void* userp);

};


















#endif