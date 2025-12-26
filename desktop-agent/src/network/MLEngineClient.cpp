#include "MLEngineClient.h"
#include "curl/curl.h"
#include <iostream>

#include <utils/Config.h>
MLEngineClient::MLEngineClient(const std::string& url) : baseUrl(url){};
size_t MLEngineClient::WriteCallback(void* contents,size_t size,size_t nmemb,void* userp){
    ((std::string*) userp) ->append((char*) contents,size * nmemb);
    return size * nmemb;
}
bool MLEngineClient::analyzePosture(const std::vector<unsigned char>& imageData,PostureResult& result){
    CURL* curl = curl_easy_init();
    if(!curl){
        std::cerr<< "Failed to initialize CURL" <<std::endl;
        return false;
    }
    std::string readBuffer;
    std::string url = baseUrl + "/analyze-posture";
        // Create multipart form data
    curl_mime* form = curl_mime_init(curl);
    curl_mimepart* field = curl_mime_addpart(form);

    curl_mime_name(field,"file");
    curl_mime_data(field,(const char*)imageData.data(),imageData.size());
    curl_mime_filename(field,"frame.jpg");
    curl_mime_type(field,"image.jpeg");

    curl_easy_setopt(curl,CURLOPT_URL,url.c_str());
    curl_easy_setopt(curl,CURLOPT_MIMEPOST,form);
    curl_easy_setopt(curl,CURLOPT_WRITEFUNCTION,WriteCallback);
    curl_easy_setopt(curl,CURLOPT_WRITEDATA, &readBuffer);
    
    CURLcode res = curl_easy_perform(curl);
    curl_mime_free(form);
    curl_easy_cleanup(curl);

    if(res !=CURLE_OK){
        std::cerr << "CURL error: " << curl_easy_strerror(res) << std::endl;
        return false;
    }
    try{
        json response = json::parse(readBuffer);
        result.postureState = response["posture_state"];
        result.confidence = response["confidence"];
        result.severity = response["severity"];
        result.recommendations= response["recommendations"] ;

        for(const auto& rec :response["recommendations"]){
            result.recommendations.push_back(rec);
        }

        return true;
    
    } catch(const std::exception& e){
        std::cerr<< "Failed to parse ML response: "<< e.what()<< std::endl;
        return false;
    }


}