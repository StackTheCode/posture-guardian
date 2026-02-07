#include <iostream>
#include <curl/curl.h>
#include "BackendClient.h"
#include <sstream>
#include <iostream>

BackendClient::BackendClient(const std::string& url, const std::string& user): baseUrl(url), username(user), password(""), token("") {}

void BackendClient::setPassword(const std::string& pass){
    password  = pass;
}

size_t BackendClient::WriteCallback(void *conents, size_t size, size_t nmemb, void *userp)
{
    ((std::string *)userp)->append((char *)conents, size * nmemb);
    return size * nmemb;
}



bool BackendClient::login(){
    CURL* curl = curl_easy_init();

    if(password.empty()){
        std::cerr<<"Password not set. Call setPassword() first" << std::endl;
        return false;
    }

     if (!curl) {
        std::cerr << "Failed to initialize CURL for login" << std::endl;
        return false;
    }

    json loginPayload = {
        {"username", username},
        {"password",password}
    };

    std::string jsonStr = loginPayload.dump();
    std::string readBuffer;
   std::string url = baseUrl + "/auth/login";

    struct curl_slist *headers = nullptr;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    
    curl_easy_setopt(curl,CURLOPT_URL,url.c_str());
    curl_easy_setopt(curl,CURLOPT_HTTPHEADER,headers);
    curl_easy_setopt(curl,CURLOPT_POSTFIELDS,jsonStr.c_str());
    curl_easy_setopt(curl,CURLOPT_WRITEFUNCTION,WriteCallback);
    curl_easy_setopt(curl,CURLOPT_WRITEDATA,&readBuffer);

    CURLcode res = curl_easy_perform(curl);

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
      if (res != CURLE_OK) {
        std::cerr << "Login failed: " << curl_easy_strerror(res) << std::endl;
        return false;
    }
    std::cout << "Full URL: " << url << std::endl;
    std::cout << "Server Response: [" << readBuffer << "]" << std::endl;
    try{
      json response = json::parse(readBuffer);
      token = response["token"];
      std::cout << "Logged in successfully as "<< username<< std::endl;
      return true;
    }  catch(const std::exception& e){
        std::cout<< "Failed to parse login response: " << e.what() << std::endl;
        return false;
    }
}




bool BackendClient::sendPostureEvent(std::string &postureState, double confidence, double severity)
{

    CURL *curl = curl_easy_init();
    if (!curl)
    {
        std::cerr << "Failed to initialize CURL" << std::endl;
    }

    // Get current timestamp in ISO 8601 format
    auto now = std::chrono::system_clock::now();
    auto time = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::gmtime(&time), "%Y-%m-%dT%H:%M:%S");
    std::string timestamp = ss.str();

    json payload = {
        {"postureState", postureState},
        {"confidence", confidence},
        {"severity", severity},
        {"timestamp", timestamp}};

    std::string jsonStr = payload.dump();
    std::string readBuffer;
    std::string url = baseUrl + "/posture/events";

    struct curl_slist *headers = nullptr;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    std::string authHeader = "Authorization: Bearer " + token;
    headers = curl_slist_append(headers, authHeader.c_str());

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonStr.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

   std::cout << "Sending to: " << url << std::endl;
    std::cout << "Payload: " << jsonStr << std::endl;
    std::cout << "Token: " << token.substr(0, 20) << "..." << std::endl;

    CURLcode res = curl_easy_perform(curl);

 long http_code = 0;
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
    std::cout << "HTTP Response Code: " << http_code << std::endl;
    std::cout << "Response Body: " << readBuffer << std::endl;

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK)
    {
        std::cerr << "Failed to send to backend: " << curl_easy_strerror(res) << std::endl;
        return false;
    }

    if(http_code == 401){
        std::cout << "Token expired ,re-authenticating..." <<std::endl;
        if(login()){
            return sendPostureEvent(postureState,confidence,severity);
        }
        return false;
    }
   if (http_code >= 200 && http_code < 300) {
        std::cout << "Posture event sent successfully" << std::endl;
        return true;
    }

    std::cerr << " Backend returned error: " << http_code << std::endl;
    return false;
}


bool BackendClient::fetchSettings(UserSettings& settings){
    CURL* curl = curl_easy_init();
    if (!curl) {
        std::cerr << "Failed to initialize CURL for settings" << std::endl;
        return false;
    }
    std::string readBuffer;
    std::string url = baseUrl + "/settings";

    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    std::string authHeader = "Authorization: Bearer " + token;
    headers = curl_slist_append(headers, authHeader.c_str());

    curl_easy_setopt(curl,CURLOPT_URL,url.c_str());
    curl_easy_setopt(curl,CURLOPT_HTTPHEADER,headers);
    curl_easy_setopt(curl,CURLOPT_WRITEFUNCTION,WriteCallback);
    curl_easy_setopt(curl,CURLOPT_WRITEDATA,&readBuffer);

    long http_code = 0;
    CURLcode res = curl_easy_perform(curl);
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
      if (res != CURLE_OK) {
        std::cerr << "Failed to fetch settings: " << curl_easy_strerror(res) << std::endl;
        return false;
    }
     if (http_code == 401) {
        std::cout << "⚠️ Token expired during settings fetch, re-authenticating..." << std::endl;
        if (login()) {
            return fetchSettings(settings);  // Retry
        }
        return false;
    }

    if (http_code != 200) {
        std::cerr << "Settings fetch failed with HTTP " << http_code << std::endl;
        return false;
    }

try{
    json response = json::parse(readBuffer);
        settings.captureIntervalSeconds = response["captureIntervalSeconds"];
        settings.notificationsEnabled = response["notificationsEnabled"];
        settings.notificationSensitivity = response["notificationSensitivity"];
        settings.workingHoursEnabled = response["workingHoursEnabled"];
        settings.workingHoursStart = response["workingHoursStart"];
        settings.workingHoursEnd = response["workingHoursEnd"];
        settings.cameraIndex = response["cameraIndex"];
        settings.theme = response["theme"];
    
        std::cout << " Fetched settings: interval=" << settings.captureIntervalSeconds 
                  << "s, notifications=" << (settings.notificationsEnabled ? "on" : "off")
                  << ", working_hours=" << (settings.workingHoursEnabled ? "enabled" : "disabled");

        if(settings.workingHoursEnabled){
            std::cout << " (" << settings.workingHoursStart << " - " << settings.workingHoursEnd << ")";
        }
        std::cout << std::endl;

    return true;

} catch(const std::exception& e){
    std::cout << "Failed to fetch settings"<< e.what()<<std::endl;
    return false;
}
}
