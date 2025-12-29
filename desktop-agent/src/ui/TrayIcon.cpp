#include <windows.h>
#include <winuser.h>
#include <shellapi.h>
#include <iostream>
#include "TrayIcon.h"

#define WM_TRAYICON (WM_USER  + 1)
#define ID_TRAY_PAUSE 1001
#define ID_TRAY_SETTINGS 1002
#define ID_TRAY_EXIT 1003


TrayIcon::TrayIcon():hwnd(NULL) ,hMenu(NULL),paused(false){
    ZeroMemory(&nid,sizeof(NOTIFYICONDATAA));
    
}
TrayIcon::~TrayIcon(){
    if(hwnd){
        Shell_NotifyIconA(NIM_DELETE,&nid);
        DestroyWindow(hwnd);
    }
    if(hMenu){
        DestroyMenu(hMenu);
    }

}
bool TrayIcon::initialize(HINSTANCE hInstance){
   WNDCLASSEXA wc = {};
    wc.cbSize = sizeof(WNDCLASSEXA);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = "PostureGuardianTray";

    if(!RegisterClassExA(&wc)){
std::cerr<< "Failed to register window class "<<std::endl;
return false;
    }
     // Create hidden window
    hwnd = CreateWindowExA(
        0, "PostureGuardianTray", "Posture Guardian",
        0, 0, 0, 0, 0,
        HWND_MESSAGE, NULL, hInstance, this
    );
    if(!hwnd){
        std::cerr<< "Failed to create window" <<std::endl;
        return false;
    }
    SetWindowLongPtrA(hwnd,GWLP_USERDATA, (LONG_PTR) this);

    nid.cbSize = sizeof(NOTIFYICONDATAA);
    nid.hWnd = hwnd;
    nid.uID =1;
    nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    nid.uCallbackMessage = WM_TRAYICON;
    nid.hIcon = LoadIcon(NULL,IDI_APPLICATION);
    strcpy_s(nid.szTip,"Posture Guardian -Monitoring");

    if(!Shell_NotifyIconA(NIM_ADD,&nid)){
        std::cerr << "Failed to add tray icon" << std::endl;
  return false;
    }
createContextMenu();
 std::cout << " System tray initialized" << std::endl;
    return true;
}

void TrayIcon::createContextMenu(){
    hMenu = CreatePopupMenu();
    AppendMenuA(hMenu,MF_STRING,ID_TRAY_PAUSE,"Pause Monitoring");
    AppendMenuA(hMenu,MF_STRING,ID_TRAY_SETTINGS,"Settings");
    AppendMenuA(hMenu,MF_SEPARATOR,0,NULL);
    AppendMenuA(hMenu,MF_STRING,ID_TRAY_EXIT,"Exit");
}

void TrayIcon::setTooltip(const std::string& text) {
    strcpy_s(nid.szTip, text.c_str());
    Shell_NotifyIcon(NIM_MODIFY, &nid);
}

void TrayIcon::setIcon(const std::string& state){
    if(state == "good"){
        setTooltip("Poature Guardian -Good Posture");
    }
    else if ( state == "warning"){
        setTooltip("Posture Guardian - Check Posture");
    }
    else{
        setTooltip("posture Guardian - Bad Posture");
    }
}

void TrayIcon::showContextMenu(){
    POINT pt;

    GetCursorPos(&pt);
        // Update pause/resume text

    ModifyMenuA(hMenu,ID_TRAY_PAUSE,MF_BYCOMMAND | MF_STRING,
        ID_TRAY_PAUSE,paused ? "Resume Monitoring"  :  "Pause Monitoring");
SetForegroundWindow(hwnd);
TrackPopupMenu(hMenu,TPM_BOTTOMALIGN | TPM_LEFTALIGN,pt.x,pt.y,0,hwnd,NULL);

    
}

void TrayIcon::processMessages(){
    MSG msg;
    while(PeekMessageA(&msg,NULL,0,0,PM_REMOVE)){
        TranslateMessage(&msg);
        DispatchMessageA(&msg);
    }
}


LRESULT CALLBACK TrayIcon::WindowProc(HWND hwnd,UINT uMsg,WPARAM wParam, LPARAM lParam){
    TrayIcon* tray = (TrayIcon*) GetWindowLongPtrA(hwnd,GWLP_USERDATA);
    switch(uMsg){
        case WM_TRAYICON:
         if(lParam == WM_LBUTTONUP){
            if(tray) tray->showContextMenu();
         }
         break;


        case WM_COMMAND:
          if(tray){
            switch(LOWORD(wParam)){
                case ID_TRAY_PAUSE:
                 tray->togglePause();
                 if(tray->onPauseResume) tray->onPauseResume();
                 break;

                case ID_TRAY_SETTINGS:
                 if(tray->onSettings) tray->onSettings();
                 break;


                case ID_TRAY_EXIT:
                if(tray->onExit) tray->onExit();
                 break;
                 
            }
          }
        break;
    }

    return DefWindowProcA(hwnd,uMsg,wParam,lParam);

}