#ifndef PASSWORD_MANAGER_H
#define PASSWORD_MANAGER_H


#include <string>
#include <windows.h>
#include <wincred.h>


class PasswordManager{
    public:
         static bool storePassword(const std::string& username, const std::string& password);
         static bool retreivePassword(const std::string& username, std::string& password);
         static bool deletePassword(const std::string& username);

};
#endif