#ifndef CAMERA_CAPTURE_H
#define CAMERA_CAPTURE_H
#include <iostream>
#include <opencv2/opencv.hpp>
#include <vector>


class CameraCapture
{
public:
    CameraCapture(int cameraIndex =0);
    ~CameraCapture();

    bool initialize();
    bool captureFrame(cv::Mat& frame);
    std::vector<uchar> encodeFrameToJpeg(const cv::Mat& frame);
    

private:
   int cameraIndex;
   cv::VideoCapture camera;
};

#endif