#include <gtest/gtest.h>
#include "utils/TimeUtils.h"

TEST(TimeUtilsTest, ParseTimeToMinutes){
    EXPECT_EQ(TimeUtils::parseTimeToMinutes("00:00:00"), 0);
    EXPECT_EQ(TimeUtils::parseTimeToMinutes("1:00:00"), 60);
    EXPECT_EQ(TimeUtils::parseTimeToMinutes("09:30:00"), 570);
    EXPECT_EQ(TimeUtils::parseTimeToMinutes("23:59:00"), 1439);
}


TEST(TimeUtilsTest,ParseTimeShortFormat){
    EXPECT_EQ(TimeUtils::parseTimeToMinutes("09:00"),540);
    EXPECT_EQ(TimeUtils::parseTimeToMinutes("17:30"), 1050);
}

TEST(TimeUtilsTest,IsWithinWorkingHours_NormalRange){
    std::string start = "09:00:00";
    std::string end = "17:00:00";

    int startMinutes = TimeUtils::parseTimeToMinutes(start);
    int endMinutes = TimeUtils::parseTimeToMinutes(end);

    EXPECT_EQ(startMinutes, 540);
    EXPECT_EQ(endMinutes,1020);
    EXPECT_LT(startMinutes,endMinutes);

}

TEST(TimeUtilsTest, IsWithinWorkingHours_SpansMidnight){
     std::string start = "21:00:00";
    std::string end = "3:00:00";

    int startMinutes = TimeUtils::parseTimeToMinutes(start);
    int endMinutes = TimeUtils::parseTimeToMinutes(end);

   EXPECT_GT(startMinutes,endMinutes);
}

TEST(TimeUtilsTest,GetCurrentMinutes){
    int currentMinutes = TimeUtils::getCurrentMinutes();

    EXPECT_GE(currentMinutes,0);
    EXPECT_LE(currentMinutes,1439);
}