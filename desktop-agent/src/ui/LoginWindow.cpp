#include "LoginWindow.h"
#include <imgui_impl_glfw.h>
#include <imgui_impl_opengl3.h>
#include <windows.h> 
LoginWindow::LoginWindow(){
    if(!glfwInit()) return;
    m_window = glfwCreateWindow(400,300, "Posture Guardian-Login",nullptr,nullptr);
    glfwMakeContextCurrent(m_window);

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGui_ImplGlfw_InitForOpenGL(m_window,true);
    ImGui_ImplOpenGL3_Init("#version 130");
    setupStyles();
}



void LoginWindow::setupStyles(){
    ImGui::StyleColorsDark();
    auto& style = ImGui::GetStyle();
    style.WindowRounding =8.0f;
    style.FrameRounding =4.0f;

}

bool LoginWindow::show(){

    while(!glfwWindowShouldClose(m_window)){
        glfwPollEvents();
        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();

        ImGui::SetNextWindowPos(ImVec2(50,50), ImGuiCond_Always);
        ImGui::SetNextWindowSize(ImVec2(300,200));
        ImGui::Begin("Login", nullptr,ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove);
        ImGui::Text("Sign in to Posture Guardian");
        ImGui::Separator();
        ImGui::Spacing();

        ImGui::InputText("Username",m_userBuf,64);
        ImGui::InputText("Password",m_passBuf, 64,ImGuiInputTextFlags_Password);
        if(ImGui::Button("Login",ImVec2(100,0))){
            m_username =m_userBuf;
            m_password = m_passBuf;
            return true;
        }
        ImGui::SameLine();
        if(ImGui::Button("Register", ImVec2(1000,2))){
 ShellExecuteA(NULL, "open", "https://posture-guardian.vercel.app/settings", NULL, NULL, SW_SHOWNORMAL);
        }

        ImGui::End();
        ImGui::Render();
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
        glfwSwapBuffers(m_window);
    }
    return false;
    
}
LoginWindow::~LoginWindow(){
    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplGlfw_Shutdown();
    ImGui::DestroyContext();
    glfwDestroyWindow(m_window);
}