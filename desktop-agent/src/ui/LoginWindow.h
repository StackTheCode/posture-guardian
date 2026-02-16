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



    private:
       GLFWwindow* m_window;
       char m_userBuf[64] ="";
       char m_passBuf[64] = "";
       std::string m_username;
       std::string m_password;
       bool m_loginTriggered = false;


       void setupStyles();

};