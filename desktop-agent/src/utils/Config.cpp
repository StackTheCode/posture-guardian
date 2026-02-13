#include "Config.h"
#include "PasswordManager.h"
#include <iostream>
#include <fstream>
#include <exception>

bool Config::load(const std::string &filename){
    // Prod defaults
    mlEngineUrl = "https://codesurferstack-posture-guardian-ml.hf.space";
    backendUrl = "https://posture-guardian-egzn.onrender.com/api/v1";
    captureInterval = 30;
    cameraIndex = 0;

//  Try to load local config (for development/overrides)
std::ifstream file(filename);
if(file.is_open()){  
try{  
        json data= json::parse(file);
      if (data.contains("ml_engine_url")) mlEngineUrl = data["ml_engine_url"];
      if (data.contains("backend_url")) backendUrl = data["backend_url"];
      if (data.contains("username")) username = data["username"];

      std::cout << "Loaded local overrides from " << filename << std::endl;
    }
    catch (...){
       std::cerr << "Malformed config.json, using defaults." << std::endl;

    }

}

return true;



}
std::string Config::getPassword() const {
    std::string pass;
    PasswordManager pwm;
    pwm.retreivePassword(this->username, pass);
    return pass;
}
