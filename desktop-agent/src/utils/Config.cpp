#include "Config.h"
#include "PasswordManager.h"
#include <iostream>
#include <fstream>
#include <exception>

bool Config::load(const std::string &filename)
{
    try
    {
        std::ifstream file(filename);
        if (!file.is_open()) {
            std::cerr << "Failed to open file" << filename << std::endl;
            return false;
        }
        json config;
        file >> config;
        mlEngineUrl = config["ml_engine_url"];
        backendUrl = config["backend_url"];
        captureInterval = config["capture_interval_seconds"];
        cameraIndex = config["camera_index"];
        username = config["username"];

        return true;
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error loading config: " << e.what() << std::endl;
        return false;
    }
}
std::string Config::getPassword() const {
    std::string pass;
    PasswordManager pwm;
    pwm.retreivePassword(this->username, pass);
    return pass;
}
