#include "PasswordManager.h"
#include <iostream>

bool PasswordManager::storePassword(const std::string& username, const std::string& password) {
    std::wstring wideUsername(username.begin(), username.end());
    CREDENTIALW cred = {0};
    cred.Type = CRED_TYPE_GENERIC;
    cred.TargetName = (LPWSTR)L"PostureGuardian";
    cred.CredentialBlobSize = (DWORD)password.size();
    cred.CredentialBlob = (LPBYTE)password.data();
    cred.Persist = CRED_PERSIST_LOCAL_MACHINE;
    cred.UserName = (LPWSTR)wideUsername.c_str();
    
    return CredWriteW(&cred, 0);
}


 bool PasswordManager::retreivePassword(const std::string& username, std::string& password){
    PCREDENTIALW pcred;
     
    if(CredReadW(L"PostureGuardian",CRED_TYPE_GENERIC,0,&pcred)){
    password = std::string((char*) pcred ->CredentialBlob,pcred->CredentialBlobSize);
    CredFree(pcred);
    return true; 
    }
    return false;
 }
 bool PasswordManager::deletePassword(const std::string& username){
    return CredDeleteW(L"PostureGuardian", CRED_TYPE_GENERIC,0);
 }

