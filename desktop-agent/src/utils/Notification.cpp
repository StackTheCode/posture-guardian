#include <windows.h>
#include <shellapi.h> // Required for NOTIFYICONDATA
#include "Notification.h"
#include <iostream>
void Notification::show(
    const std::string& title,
    const std::string& message,
    DWORD icon
) {
    // Create a hidden window for notifications
    HWND hwnd = CreateWindowExA(
        0, 
        "STATIC", 
        "Posture Guardian",
        WS_OVERLAPPED, 
        0, 0, 0, 0,
        HWND_MESSAGE, 
        NULL, 
        NULL, 
        NULL
    );
    NOTIFYICONDATAA nid = {};
nid.cbSize = sizeof(NOTIFYICONDATA);
nid.hWnd =hwnd;
nid.uID =1;
nid.uFlags = NIF_INFO;
nid.dwInfoFlags = icon;

// Copy strings (max 256 chars)
strncpy_s(nid.szInfoTitle, title.c_str(), _TRUNCATE);
strncpy_s(nid.szInfo, message.c_str(), _TRUNCATE);


Shell_NotifyIconA(NIM_ADD, &nid);
Shell_NotifyIconA(NIM_MODIFY,&nid);

Sleep(3000);
Shell_NotifyIconA(NIM_DELETE,&nid);
DestroyWindow(hwnd);

}

