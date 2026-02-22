#include "LoginWindow.h"
#include <imgui_impl_glfw.h>
#include <imgui_impl_opengl3.h>
#include <windows.h> 
#include <GL/gl.h>
LoginWindow::LoginWindow(){
    if(!glfwInit()) return;
    m_window = glfwCreateWindow(400,300, "Posture Guardian-Login",nullptr,nullptr);
    glfwMakeContextCurrent(m_window);

    IMGUI_CHECKVERSION();

    ImGui::CreateContext();
    
    ImGuiIO& io = ImGui::GetIO();
    io.FontGlobalScale = 2.0f;


    ImGui_ImplGlfw_InitForOpenGL(m_window,true);
    ImGui_ImplOpenGL3_Init("#version 130");
    setupStyles();
}



void LoginWindow::setupStyles(){
    ImGui::StyleColorsDark();
    auto& style = ImGui::GetStyle();

    style.WindowRounding =12.0f;
    style.FrameRounding = 6.0f;
     style.GrabRounding = 6.0f;

    //  Spacing
     style.WindowPadding =ImVec2(30,30);
     style.FramePadding =ImVec2(12,8);
     style.ItemSpacing = ImVec2(12,12);

    //  Colors

    ImVec4* colors = style.Colors;
 // Background - Deep blue-grey (matches your web app)
    colors[ImGuiCol_WindowBg] = ImVec4(0.11f, 0.11f, 0.15f, 0.98f);  // #1C1C26
    
    // Input fields - Slightly lighter
    colors[ImGuiCol_FrameBg] = ImVec4(0.15f, 0.15f, 0.20f, 1.00f);
    colors[ImGuiCol_FrameBgHovered] = ImVec4(0.18f, 0.18f, 0.24f, 1.00f);
    colors[ImGuiCol_FrameBgActive] = ImVec4(0.20f, 0.20f, 0.26f, 1.00f);
    
    // Buttons - Blue accent
    colors[ImGuiCol_Button] = ImVec4(0.26f, 0.59f, 0.98f, 0.85f);
    colors[ImGuiCol_ButtonHovered] = ImVec4(0.30f, 0.65f, 1.00f, 1.00f);
    colors[ImGuiCol_ButtonActive] = ImVec4(0.20f, 0.50f, 0.90f, 1.00f);
    
    // Text colors
    colors[ImGuiCol_Text] = ImVec4(0.95f, 0.95f, 0.95f, 1.00f);
    colors[ImGuiCol_TextDisabled] = ImVec4(0.50f, 0.50f, 0.55f, 1.00f);
    
    // Borders
    colors[ImGuiCol_Border] = ImVec4(0.25f, 0.25f, 0.30f, 0.50f);

}



bool LoginWindow::show(){

    while(!glfwWindowShouldClose(m_window)){
    glfwPollEvents();
    
    // Check if window was closed
    if(glfwWindowShouldClose(m_window)){
        return false; 
    }
    
    // Clear screen
    int display_w, display_h;
    glfwGetFramebufferSize(m_window, &display_w, &display_h);
    glViewport(0, 0, display_w, display_h);
    glClearColor(0.10f, 0.10f, 0.13f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    // Start ImGui frame
    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplGlfw_NewFrame();
    ImGui::NewFrame();

    // Center window
    ImGui::SetNextWindowPos(ImVec2(display_w * 0.5f, display_h * 0.5f), 
                            ImGuiCond_Always, ImVec2(0.5f, 0.5f));
    ImGui::SetNextWindowSize(ImVec2(900, 520));

    // Main window
    ImGui::Begin("##MainLogin", nullptr, 
                 ImGuiWindowFlags_NoDecoration | 
                 ImGuiWindowFlags_NoMove | 
                 ImGuiWindowFlags_NoResize);

    // Title
    ImGui::SetCursorPosY(ImGui::GetCursorPosY() + 5);
    ImGui::PushStyleColor(ImGuiCol_Text, ImVec4(1.0f, 1.0f, 1.0f, 1.0f));
    ImGui::Text("Welcome Back");
    ImGui::PopStyleColor();
    
    ImGui::PushStyleColor(ImGuiCol_Text, ImVec4(0.65f, 0.65f, 0.7f, 1.0f));
    ImGui::Text("Sign in to Posture Guardian");
    ImGui::PopStyleColor();
    
    ImGui::Dummy(ImVec2(0, 20));

    // Username field
    ImGui::PushStyleColor(ImGuiCol_Text, ImVec4(0.85f, 0.85f, 0.9f, 1.0f));
    ImGui::Text("Username");
    ImGui::PopStyleColor();
    
    ImGui::PushItemWidth(-1);
    ImGui::InputTextWithHint("##User", "Enter your username", m_userBuf, 64);
    
    ImGui::Dummy(ImVec2(0, 10));
    
    // Password field
    ImGui::PushStyleColor(ImGuiCol_Text, ImVec4(0.85f, 0.85f, 0.9f, 1.0f));
    ImGui::Text("Password");
    ImGui::PopStyleColor();
    
    ImGui::InputTextWithHint("##Pass", "Enter your password", m_passBuf, 64, 
                             ImGuiInputTextFlags_Password);
    ImGui::PopItemWidth();

    ImGui::Dummy(ImVec2(0, 25));


    // Login button
       if(ImGui::Button("Sign In", ImVec2(-1, 55))){
            m_username = m_userBuf;
            m_password = m_passBuf;
            ImGui::End();
            ImGui::Render();
            ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
            glfwSwapBuffers(m_window);
            return true;
        }

    ImGui::Dummy(ImVec2(0, 10));

    // Register link
    ImGui::PushStyleColor(ImGuiCol_Button, ImVec4(0, 0, 0, 0));
    ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ImVec4(0.2f, 0.2f, 0.25f, 0.5f));
    ImGui::PushStyleColor(ImGuiCol_ButtonActive, ImVec4(0.15f, 0.15f, 0.20f, 0.5f));
    ImGui::PushStyleColor(ImGuiCol_Text, ImVec4(0.6f, 0.75f, 1.0f, 1.0f));
    
    if(ImGui::Button("Don't have an account? Register here", ImVec2(-1, 32))){
        ShellExecuteA(NULL, "open", "https://posture-guardian.vercel.app/register", 
                     NULL, NULL, SW_SHOWNORMAL);
    }
    
    ImGui::PopStyleColor(4);

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