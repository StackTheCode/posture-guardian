#include "windows.h"
#include "SetupWizard.h"
#include <fstream>
#include <iostream>


bool SetupWizard::isFirstRun(){
    std::ifstream configFile("config.json");
    if(!configFile.is_open()){
        return true; 
    }
    try{
    json config;
    configFile >> config;

    return !config.contains("username") || !config.contains("password") ||
           config["username"].get<std::string>().empty();
    }
    catch(...) {
        return true;
    }
    
}
bool SetupWizard::show(Credentials& credentials){
    std::cout << "Posture Guardian - First Run Setup" << std::endl;
    std::cout << "Backend URL (default: http://localhost:8080/api/v1): ";

    std::getline(std::cin,credentials.backendUrl);

    if(credentials.backendUrl.empty()){
            credentials.backendUrl = "http://localhost:8080/api/v1";
    }
    std::cout << "ML Engine URL (default: http://localhost:8000): ";

    std::getline(std::cin,credentials.mlEngineUrl);

    if(credentials.mlEngineUrl.empty()){
        credentials.mlEngineUrl = "http://localhost:8000";
    }
    std::cout << "\nEnter your Posture Guardian account credentials:" << std::endl;
    std::cout << "Username: ";
    std::getline(std::cin, credentials.username);

    std::cout<< "Password";
    HANDLE hStdin  =GetStdHandle(STD_INPUT_HANDLE);
    DWORD mode =0;
    GetConsoleMode(hStdin,&mode);
    SetConsoleMode(hStdin,mode & (~ENABLE_ECHO_INPUT));

    std::getline(std::cin, credentials.password);

    SetConsoleMode(hStdin,mode);
    std::cout<<"setup Complete";
    return !credentials.username.empty() && !credentials.password.empty();



}

bool SetupWizard::saveToConfig(const Credentials& creds){
    try{
         json config = {
            {"ml_engine_url", creds.mlEngineUrl},
            {"backend_url", creds.backendUrl},
            {"capture_interval_seconds", 30},
            {"camera_index", 0},
            {"username", creds.username},
            {"password", creds.password}
        };

        std::ofstream file("config.json");
        file << config.dump(4);
        file.close();
        std::cout << "Configuration saved to config.json" << std::endl;
        return true;

    }
    catch(const std::exception& e)
    {
        std::cerr << "Failed to save config: " << e.what() << std::endl;
        return false;
    }
    
}