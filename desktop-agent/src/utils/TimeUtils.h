
#ifndef TIME_UTILS_H
#define TIME_UTILS_H

#include <string>
#include <iostream>
#include <chrono>
#include <ctime>
class TimeUtils{
 public :
 // Parse "HH:MM:SS" string to minutes since midnight
 static int parseTimeToMinutes(const std::string& timeStr);
    // Get current time in minutes since midnight
 static int getCurrentMinutes();

 static bool isWithinWorkingHours(const std::string& startTime,const std::string& endTime);

};
#endif
