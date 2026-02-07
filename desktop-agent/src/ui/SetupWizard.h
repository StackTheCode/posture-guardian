#ifndef SETUP_WIZARD_H
#define SETUP_WIZARD_H
#include <windows.h>
#include <string>
#include "nlohmann/json.hpp"

using json = nlohmann::json;

class SetupWizard{
    public:
        struct Credentials{
            std::string username;
            std::string password;
            std::string backendUrl;
            std::string mlEngineUrl;
        };
        static bool show(Credentials& credentials);
        static bool saveToConfig(const Credentials& creds);
        static bool isFirstRun();


    private:
       static LRESULT CALLBACK DialogProc(HWND hwnd, UINT msg,WPARAM wParam,LPARAM lParam);

};


#endif