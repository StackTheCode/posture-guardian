#ifndef CONFIG_H
#define CONFIG_H
#include <iostream>
#include "json.hpp"
#include <nlohmann/json.hpp>

using json = nlohmann::json;
class Config{
 public:
     static Config& getinstance(){
        static Config instance;
        return instance;
     }
    bool load(const std::string& filename);

    std::string getEngineUrl()  const {return mlEngineUrl;}
    std::string getBackendUrl() const {return backendUrl;}
    int getCaptureinterval() const {return captureInterval;}
    int getCameraIndex() const {return cameraIndex;}
    std::string getUsername() const {return token;}
    void setToken(const std::string& t){token = t;}

private:
    Config() = default;
    std::string mlEngineUrl;
    std::string backendUrl;
    int captureInterval;
    int cameraIndex;
    std::string username;
    std::string token;

    


};
#endif