#include "Config.h"
#include "PasswordManager.h"
#include <iostream>
#include <fstream>
#include <exception>
bool Config::load(const std::string &filename)
{
    // Prod defaults
    mlEngineUrl = "https://codesurferstack-posture-guardian-ml.hf.space";
    backendUrl = "https://posture-guardian-egzn.onrender.com/api/v1";
    captureInterval = 30;
    cameraIndex = 0;

    //  Try to load local config (for development/overrides)
    std::ifstream file(filename);
    if (file.is_open())
    {
        try
        {
            json data = json::parse(file);
            if (data.contains("ml_engine_url"))
                mlEngineUrl = data["ml_engine_url"];
            if (data.contains("backend_url"))
                backendUrl = data["backend_url"];
            if (data.contains("username"))
                username = data["username"];

            std::cout << "Loaded local overrides from " << filename << std::endl;
        }
        catch (...)
        {
            std::cerr << "Malformed config.json, using defaults." << std::endl;
        }
    }

    return true;
}

bool Config::save(const std::string &filename){
    try
    {
        json data;
        data["ml_engine_url"] = mlEngineUrl;
        data["backend_url"] = backendUrl;
        data["capture_interval"] = captureInterval;
        data["camera_index"] = cameraIndex;
        data["username"] = username;

        std::ofstream file(filename);
        if (!file.is_open())
            return false;

            // 4spaces
        file << data.dump(4);
        return true;
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error saving config: " << e.what() << std::endl;
        return false;
    }
}

std::string Config::getPassword() const
{
    std::string pass;
    PasswordManager pwm;
    pwm.retreivePassword(this->username, pass);
    return pass;
}
