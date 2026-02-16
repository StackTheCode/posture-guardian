#ifndef CONFIG_H
#define CONFIG_H
#include <iostream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
class Config{
 public:
     static Config& getInstance(){
        static Config instance;
        return instance;
     }
    bool load(const std::string& filename);
    bool save(const std::string& filename);

    std::string getEngineUrl()  const {return mlEngineUrl;}
    std::string getBackendUrl() const {return backendUrl;}
    int getCaptureInterval() const {return captureInterval;}
    int getCameraIndex() const {return cameraIndex;}
    std::string getUsername() const {return username;}
   
    std::string getPassword() const;
  
    void setUsername(std::string uname)  {
        username = uname;
    }


private:
    Config() = default;
    std::string mlEngineUrl;
    std::string backendUrl;
    int captureInterval;
    int cameraIndex;
    std::string username;
 
     
    


};
#endif