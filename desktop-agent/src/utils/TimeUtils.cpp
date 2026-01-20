#include "TimeUtils.h"
#include <sstream>
#include <iostream>

int TimeUtils::parseTimeToMinutes(const std::string& timeStr){
    int hours =0; 
    int minutes =0;
    char separator;

    std::istringstream ss(timeStr);

    ss >> hours >> separator >> minutes;
   return hours * 60 + minutes;
}

int TimeUtils::getCurrentMinutes(){
    auto now = std::chrono::system_clock::now();
    auto currentTime = std::chrono::system_clock::to_time_t(now);
    struct tm* timeInfo = std::localtime(&currentTime);
    return timeInfo->tm_hour * 60 + timeInfo->tm_min;
}

bool TimeUtils::isWithinWorkingHours(const std::string& startTime,const std::string& endTime){
    int startMinutes = parseTimeToMinutes(startTime);
    int endMinutes = parseTimeToMinutes(endTime);
    int currentMinutes = getCurrentMinutes();

    if(endMinutes < startMinutes){
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
    else{
        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }

}