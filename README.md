# Delivery_Cart
[TOC]
## Download the code
```
git clone https://github.com/evanshih1999/Delivery_Cart.git
```
- Move the folders to the corresponding devices
(eg: door/ to door's jetson nano)
- Notice:
    All devices used need to be connected to the same local area network
## MQTT Broker (On Windows PC)
### Environment setup
1. Download and install Mosquitto on Windows from the [Mosquitto official website](mosquitto.org/download) 
2. Open firewall for port 1883
3. In CMD
    ```
    cd C:\Program Files\mosquitto
    ```
    and put IoT.pwd and mosquitto.conf in this folder
4. For adding new username and password
    ```
    cd C:\Program Files\mosquitto
    mosquitto_passwd -b "IoT.pwd" username password
    ```
### Excecution
In CMD
```
cd C:\Program Files\mosquitto
mosquitto – c mosquito.conf -v
```
## Nginx Server (On Windows PC)
### Environment setup
1. Follow the instructions on [this site](https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers) set up Docker remote containers on WSL 2
2. 
    ```
    git clone https://github.com/twtrubiks/nginx-rtmp-tutorial.git
    ```
### Excecution
```
cd nginx-rtmp-tutorial
docker-compose up -d
```
## Website (On user's PC)
### Backend Server
1. In the folder website/backend/, create a .env file that contains the following information (you can refer to the .env.defaults file)
    * MONGO_URL: Your MongoDB database url where you wish to store all the user information
    * EMAIL_SERVICE: The email service used for sending verification codes
    * EMAIL_ADDRESS: The email address used for sending verification codes
    * EMAIL_PASSWORD: The email password used for sending verification codes
    * YOUR_MQTT_BROKER_AND_NGINX_SERVER_IP: The IP of your MQTT broker and your NGINX server
    ```
    MONGO_URL=
    EMAIL_SERVICE=outlook
    EMAIL_ADDRESS=
    EMAIL_PASSWORD=
    YOUR_MQTT_BROKER_AND_NGINX_SERVER_IP=
    ```
2. Open the terminal in the folder website/, and type in the following commands
    ```
    cd backend
    yarn
    yarn server
    ```
### Frontend Server
1. Open the terminal in the folder website/, and type in the following commands
    ```
    cd frontend
    yarn
    yarn start
    ```
## Cart (On jetson nano on JetBot-2GB-AI-Kit)
### Environment setup
1. Download the Jetbot image provided by NVIDIA
2. Boot the Jetson Nano using a plain JetPack 4.5 SD card image and run through the operating system setup
3. Follow the instructions on [this site](https://jetbot.org/master/index.html) to set up Jetbot
4. Install some necessary packages
    ```
    $ pip3 install paho-mqtt
    $ pip3 install adafruit-circuitpython-servokit
    ```
### Excecution
##### for cart streaming
1. make sure nginx server is set up first
2. change your_nginx_server_ip written in car_stream.sh to your nginx server ip
```
$ chmod +x car_stream.sh
$ ./car_stream.sh
```
##### for cart control
1. make sure mqtt broker is set up first
2. change the your_mqtt_broker_ip written in mqtt_control.ipynb to your mqtt broker ip
3. Run the code in mqtt_control.ipynb

## Door (On Door's Jetson Nano)
### Environment setup
```
$ pip install paho-mqtt
$ pip3 install adafruit-circuitpython-servokit
```
### Excecution
##### for door streaming
1. make sure nginx server is set up first
2. change your_nginx_server_ip written in door_stream.sh to your nginx server ip
```
$ chmod +x door_stream.sh
$ ./door_stream.sh
```
##### for door control
1. make sure mqtt broker is set up first
2. change the your_mqtt_broker_ip written in door_control.py to your mqtt broker ip
```
$ python3 door_control.py
```

## Video Porcessing (On PC)
### Environment setup
```
$ pip install face_recognition
$ pip install docopt==0.6.2
$ pip install -U scikit-learn
$ pip install os-sys 
$ pip install imutils
$ pip install opencv-python
$ pip install numpy
```
### Execution
1. make sure both the mqtt and nginx server are set up first
2. change the following variables in both qrcode.py and face.py to the settings of yours
    * your_mqtt_broker_ip
    * your_nginx_server_ip
    
##### for qrcode scanning

```
$ python3 qrcode.py

```
##### for face recognition
1. create your own dir in train_dir to store images of  someone's face
    (e.g. creat a dir named 'evan') to store images of evan's faces
3. load images into your dir and name them in particular order
    (e.g. evan1.jpg, evan2.jpg ... in dir named evan)
```
$ python3 face.py
```
and press 'ENTER' when you want to detect