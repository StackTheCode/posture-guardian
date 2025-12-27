#include <iostream>
#include <curl/curl.h>
#include "BackendClient.h"
#include <sstream>
BackendClient::BackendClient(const std::string &url, const std::string &t)
    : baseUrl(url), token(t) {}

size_t BackendClient::WriteCallback(void *conents, size_t size, size_t nmemb, void *userp)
{
    ((std::string *)userp)->append((char *)conents, size * nmemb);
    return size * nmemb;
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

    std::cout << "Posture event sent successfully" << std::endl;
    return true;
}
