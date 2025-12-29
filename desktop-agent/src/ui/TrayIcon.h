
#ifndef TRAY_ICON_H
#define TRAY_ICON_H
#include <windows.h>  
#include <functional>
#include <shellapi.h> 
#include <iostream>
#include <string>

class TrayIcon{
    public :
      TrayIcon();
      ~TrayIcon();
    
    bool initialize(HINSTANCE hInstance);
    void setTooltip(const std::string& text);
    void setIcon(const std::string& state);
    void showContextMenu();

    // Callbacks
    std::function<void()> onPauseResume;
    std::function<void()> onSettings;
    std::function<void()> onExit;

    bool isPaused() const {return paused;}
    void togglePause(){paused = !paused;}

    void processMessages();

    private:
       NOTIFYICONDATAA nid;
       HWND hwnd;
       HMENU hMenu;
       bool paused;

       static LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
       void createContextMenu();
};

#endif