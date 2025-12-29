#include <winuser.h>
#ifndef NOTIFICATION_H
#define NOTIFICATION_H
#include <iostream>
// #include <windef.h>

#include <shellapi.h>
class Notification{
    public:
        static void show(
        const std::string& title,
        const std::string& message,
        DWORD icon = NIIF_INFO
    );
    
    static void showWarning(const std::string& title, const std::string& message) {
        show(title, message, NIIF_WARNING);
    }
    
    static void showError(const std::string& title, const std::string& message) {
        show(title, message, NIIF_ERROR);
    }
};

#endif