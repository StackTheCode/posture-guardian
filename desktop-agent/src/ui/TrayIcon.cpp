#include <windows.h>
#include <winuser.h>
#include <shellapi.h>
#include <iostream>
#include "TrayIcon.h"

#define WM_TRAYICON (WM_USER + 1)
#define ID_TRAY_PAUSE 1001
#define ID_TRAY_SETTINGS 1002
#define ID_TRAY_EXIT 1003

TrayIcon::TrayIcon()
    : hwnd(NULL), hMenu(NULL), paused(false)
{
    ZeroMemory(&nid, sizeof(NOTIFYICONDATAA));
}

TrayIcon::~TrayIcon()
{
    if (hwnd) {
        Shell_NotifyIconA(NIM_DELETE, &nid);
        DestroyWindow(hwnd);
    }
    if (hMenu) {
        DestroyMenu(hMenu);
    }
}

bool TrayIcon::initialize(HINSTANCE hInstance)
{
    WNDCLASSEXA wc{};
    wc.cbSize = sizeof(WNDCLASSEXA);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = "PostureGuardianTray";

    if (!RegisterClassExA(&wc)) {
        std::cerr << "Failed to register window class\n";
        return false;
    }

  hwnd = CreateWindowExA(
        0, "PostureGuardianTray", "Posture Guardian",
        0, 0, 0, 0, 0,
        HWND_MESSAGE, NULL, hInstance, this
    );

    if (!hwnd) {
        std::cerr << "Failed to create window\n";
        return false;
    }

    SetWindowLongPtrA(hwnd, GWLP_USERDATA, (LONG_PTR)this);

    nid.cbSize = sizeof(NOTIFYICONDATAA);
    nid.hWnd = hwnd;
    nid.uID = 1;
    nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    nid.uCallbackMessage = WM_TRAYICON;
    nid.hIcon = LoadIcon(NULL, IDI_APPLICATION);
    strcpy_s(nid.szTip, sizeof(nid.szTip), "Posture Guardian - Monitoring");

    if (!Shell_NotifyIconA(NIM_ADD, &nid)) {
        std::cerr << "Failed to add tray icon\n";
        return false;
    }

    Shell_NotifyIconA(NIM_SETVERSION, &nid);

    createContextMenu();

    std::cout << "System tray initialized\n";
    return true;
}

void TrayIcon::showNotification(
    const std::string& title,
    const std::string& message,
    DWORD icon
) {
    nid.uFlags |= NIF_INFO;
    strncpy_s(nid.szInfoTitle, sizeof(nid.szInfoTitle), title.c_str(), _TRUNCATE);
    strncpy_s(nid.szInfo, sizeof(nid.szInfo), message.c_str(), _TRUNCATE);
    nid.dwInfoFlags = icon;

    Shell_NotifyIconA(NIM_MODIFY, &nid);

    nid.uFlags &= ~NIF_INFO;
}

void TrayIcon::createContextMenu()
{
    hMenu = CreatePopupMenu();
    AppendMenuA(hMenu, MF_STRING, ID_TRAY_PAUSE, "Pause Monitoring");
    AppendMenuA(hMenu, MF_STRING, ID_TRAY_SETTINGS, "Settings");
    AppendMenuA(hMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(hMenu, MF_STRING, ID_TRAY_EXIT, "Exit");
}

void TrayIcon::setTooltip(const std::string& text)
{
    strcpy_s(nid.szTip, sizeof(nid.szTip), text.c_str());
    Shell_NotifyIconA(NIM_MODIFY, &nid);
}

void TrayIcon::setIcon(const std::string& state)
{
    if (state == "good") {
        setTooltip("Posture Guardian - Good posture");
    }
    else if (state == "warning") {
        setTooltip("Posture Guardian - Check posture");
    }
    else {
        setTooltip("Posture Guardian - Bad posture");
    }
}

void TrayIcon::showContextMenu() {
    POINT pt;
    GetCursorPos(&pt);

    // This ensures the menu stays on top and behaves like a standard Windows menu
    SetForegroundWindow(hwnd);

    ModifyMenuA(
        hMenu,
        ID_TRAY_PAUSE,
        MF_BYCOMMAND | MF_STRING,
        ID_TRAY_PAUSE,
        paused ? "Resume Monitoring" : "Pause Monitoring"
    );

    // Use TPM_LEFTBUTTON to ensure it works with standard clicks
    TrackPopupMenu(
        hMenu,
        TPM_LEFTALIGN | TPM_BOTTOMALIGN | TPM_RIGHTBUTTON,
        pt.x,
        pt.y,
        0,
        hwnd,
        NULL
    );

    // This prevents the common "menu won't disappear" bug
    PostMessage(hwnd, WM_NULL, 0, 0);
}


void TrayIcon::processMessages()
{
    MSG msg;
    while (PeekMessageA(&msg, NULL, 0, 0, PM_REMOVE)) {
        TranslateMessage(&msg);
        DispatchMessageA(&msg);
    }
}

void TrayIcon::togglePause()
{
    paused = !paused;
}

bool TrayIcon::isPaused() const
{
    return paused;
}

LRESULT CALLBACK TrayIcon::WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    TrayIcon* tray = (TrayIcon*)GetWindowLongPtrA(hwnd, GWLP_USERDATA);

    switch (uMsg)
    {
    case WM_TRAYICON:
       if (LOWORD(lParam) == WM_RBUTTONUP || lParam == WM_RBUTTONUP) {
        if (tray) tray->showContextMenu();
    }
        break;

    case WM_COMMAND:
        if (tray) {
            switch (LOWORD(wParam)) {
            case ID_TRAY_PAUSE:
                tray->togglePause();
                if (tray->onPauseResume) tray->onPauseResume();
                break;

            case ID_TRAY_SETTINGS:
                if (tray->onSettings) tray->onSettings();
                break;

            case ID_TRAY_EXIT:
                if (tray->onExit) tray->onExit();
                break;
            }
        }
        break;
    }

    return DefWindowProcA(hwnd, uMsg, wParam, lParam);
}
