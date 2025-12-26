#ifndef ML_ENGINE_CLIENT_H
#define ML_ENGINE_CLIENT_H
#include <nlohmann/json.hpp>
#include <iostream>




struct PostureResult{
std::string postureState;
double confidence;
double severity;
std::vector<std::string> recommendations;
};

class MLEngineClient{
public :
  MLEngineClient(const std::string& baseUrl);
  bool analyzePosture(const std::vector<unsigned char>& imageData,PostureResult& result);

private:
  std::string baseUrl;
  static size_t WriteCallback(void* contents,size_t size,size_t nmemb,void* userp);
};

#endif