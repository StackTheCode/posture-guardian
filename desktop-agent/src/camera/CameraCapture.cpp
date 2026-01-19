
#include "CameraCapture.h"
#include <iostream>
// #include<vector>
CameraCapture::CameraCapture(int index) : cameraIndex(index) {};
CameraCapture::~CameraCapture(){
    if (camera.isOpened()){
        camera.release();
    }
}
bool CameraCapture::initialize(){
    camera.open(cameraIndex);
    if (!camera.isOpened()){
        std::cerr << "Failed to open camera" << cameraIndex << std::endl;
        return false;
    }

    camera.set(cv::CAP_PROP_FRAME_WIDTH, 640);
    camera.set(cv::CAP_PROP_FRAME_HEIGHT, 480);

    std::cout << "Camera initialized successfully" << std::endl;
    return true;
}

bool CameraCapture::captureFrame(cv::Mat &frame){
    if (!camera.isOpened()){
        std::cerr << "Camera is not initialized" << std::endl;
    }
    camera >> frame;
    if (frame.empty()){
        std::cerr << "Failed to capture frame" << std::endl;
        return false;
    }

    return true;
}

std::vector<uchar> CameraCapture::encodeFrameToJpeg(const cv::Mat& frame){
    std::vector<uchar> buffer;
    std::vector<int> params = {cv::IMWRITE_JPEG_QUALITY,85};
    cv::imencode(".jpg",frame,buffer,params);
    return buffer;

}
