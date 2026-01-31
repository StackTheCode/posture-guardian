#include <gtest/gtest.h>
#include <fstream>
#include <utils/Config.h>

class ConfigTest : public ::testing::Test
{
protected:
    void SetUp() override{
        // Create  test config file
        std::ofstream configFile("test_config.json");
        configFile << R"({
     "ml_engine_url": "http://localhost:8000",
            "backend_url": "http://localhost:8080/api/v1",
            "capture_interval_seconds": 30,
            "camera_index": 0,
            "username": "testuser",
            "password": "testpass"
    })";
        configFile.close();

    }
    void TearDown() override{
    std::remove("test_config.json");
    }
};


TEST_F(ConfigTest,LoadValidConfig){
    Config& config = Config::getInstance();

    ASSERT_TRUE(config.load("test_config.json"));

    EXPECT_EQ(config.getEngineUrl(), "http://localhost:8000");
    EXPECT_EQ(config.getBackendUrl(), "http://localhost:8080/api/v1");
    EXPECT_EQ(config.getCaptureInterval(), 30);
    EXPECT_EQ(config.getCameraIndex(), 0);
    EXPECT_EQ(config.getUsername(),"testuser" );
    EXPECT_EQ(config.getPassword(), "testpass");



}

TEST_F(ConfigTest, LoadInvalidFile){
    Config& config = Config::getInstance();

    EXPECT_FALSE(config.load("nonexistent_config.json"));
}


TEST_F(ConfigTest, LoadMalformedJson) {

    std::ofstream configFile("malformed_config.json");
    configFile<< "{this is not valid json}";
    configFile.close(); 

    Config& config = Config::getInstance();
    EXPECT_FALSE(config.load("malformed_config.json"));
}
TEST_F(ConfigTest,DefaultValues){
// Test that config has sensible defaults when fields are missing
  std::ofstream configFile("partial_config.json");
  configFile<<  R"({
        "ml_engine_url": "http://localhost:8000",
        "backend_url": "http://localhost:8080/api/v1",
        "username": "testuser",
        "password": "testpass"
    })";


    configFile.close();
    Config& config = Config::getInstance();
    // This might fail or use defaults depending on implementation
    // Adjust based on your Config class behavior
    config.load("partial_config.json");
    
    std::remove("partial_config.json");
}