import time
import paho.mqtt.client as mqtt
#from jetbot import Robot
from adafruit_servokit import ServoKit
import board
import busio

your mqtt broker ip = ''
your mqtt broker port = 1883

ip = your_mqtt_broker ip
port = your_mqtt_broker_port

i2c_bus0=(busio.I2C(board.SCL_1, board.SDA_1))
kit=ServoKit(channels=16, i2c=i2c_bus0)
print("ServoKit done!")
kit.servo[0].angle=0 #close

#robot = Robot()

def on_message(client, obj, msg):
    # print(f"TOPIC:{msg.topic}, VALUE:{msg.payload}")
    commend = msg.payload.decode("utf-8")
    print("commend: ", commend)
    if commend == 'open':
        kit.servo[0].angle = 120
    elif commend == 'close':
        kit.servo[0].angle = 00


def main():
    # Establish connection to mqtt broker
    client = mqtt.Client()
    client.on_message = on_message
    client.username_pw_set("Door1","Door1")
    client.connect(host= ip, port=port)
    #client.connect(host="192.168.43.45", port=1883)
    client.subscribe('Door1', 0)

    try:
        client.loop_forever()
    except KeyboardInterrupt as e:
        kit.servo[0].angle=180

main()
