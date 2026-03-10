#pragma once
#include <string>
#include <imgui.h>
#include "GLFW/glfw3.h"


class LoginWindow{
    public:
    LoginWindow();
    ~LoginWindow();


    bool show();

    std::string getUsername() const {return m_username; }
    std::string getPassword() const {return m_password;}
    
   void setErrorMessage(const std::string& message){m_errorMessage = message;}
    


    private:
       GLFWwindow* m_window;
       char m_userBuf[64] ="";
       char m_passBuf[64] = "";
       std::string m_username;
       std::string m_password;
       std::string m_errorMessage;
       bool m_loginTriggered = false;


       void setupStyles();

};