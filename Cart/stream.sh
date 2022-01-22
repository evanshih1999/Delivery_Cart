#!/bin/bash
  
gst-launch-1.0 -e \
    nvarguscamerasrc ! \
    "video/x-raw(memory:NVMM), width=(int)854, height=(int)480, format=(string)NV12, framerate=(fraction)10/1" ! \
    queue ! \
    nvv4l2h264enc bitrate=500000 ! \
    h264parse ! \
    flvmux ! \
    rtmpsink location="rtmp://your-Nginx-server-ip/live/car_stream live=1"