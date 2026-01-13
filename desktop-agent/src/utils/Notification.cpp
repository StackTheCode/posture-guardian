#include "Notification.h"
#include "ui/TrayIcon.h"

static TrayIcon* g_tray = nullptr;

void Notification::initialize(TrayIcon* tray) {
    g_tray = tray;
}

void Notification::show(
    const std::string& title,
    const std::string& message,
    DWORD icon
) {
    if (!g_tray) return;
    g_tray->showNotification(title, message, icon);
}
