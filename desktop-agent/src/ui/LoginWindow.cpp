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
    io.FontGlobalScale = 1.6f;


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
        // Clear the screen
        int display_w,display_h;
        glfwGetFramebufferSize(m_window,&display_w,&display_h);
        glViewport(0,0,display_w,display_h);
       
        glClearColor(0.08f, 0.08f, 0.09f, 1.0f); 
        glClear(GL_COLOR_BUFFER_BIT);


        ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(10, 10));
        ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(20, 20));
        ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(10, 15));

// Start ImGui Frame
        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();

        //Dynamic centering
        float box_width = 700.0f;
        float box_height =400.0f;
        ImVec2 center_pos = ImVec2(
            (display_w - box_width) * 0.5f,
         (display_h - box_height) * 0.5f);
        ImGui::SetNextWindowPos(center_pos, ImGuiCond_Always);
        ImGui::SetNextWindowSize(ImVec2(box_width, box_height));

    //    Draw UI
        ImGui::Begin("Login", nullptr,ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);
        ImGui::Text("Sign in to Posture Guardian");
        ImGui::Separator();
        ImGui::Spacing();

        ImGui::PushItemWidth(-0.1f);
        ImGui::Text("Username");
        ImGui::InputText("##User",m_userBuf,64);

        ImGui::Text("Password");
        ImGui::InputText("##Pass",m_passBuf, 64,ImGuiInputTextFlags_Password);
        ImGui::PopItemWidth();

        ImGui::Spacing();
        ImGui::Separator();
        ImGui::Spacing();


        if(ImGui::Button("Login",ImVec2(180,45))){
            m_username =m_userBuf;
            m_password = m_passBuf;
            ImGui::PopStyleVar(3);
            return true;
        }
        ImGui::SameLine();
        if(ImGui::Button("Register", ImVec2(180,45))){
         ShellExecuteA(NULL, "open", "https://posture-guardian.vercel.app/register", NULL, NULL, SW_SHOWNORMAL);
        }

        ImGui::End();

        ImGui::PopStyleVar(3);

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