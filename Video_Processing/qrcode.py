from pyzbar import pyzbar
#import argparse
#import datetime
import imutils
#import time
import cv2
import subprocess
import paho.mqtt.client as mqtt
import time

your_mqtt_broker_ip = ''
your_mqtt_broker_port = 1883
your_nginx_server_ip = ''
your_nginx_server_port = 1935

client = mqtt.Client()
client.username_pw_set("QRcode", "QRcode")
client.connect(your_mqtt_broker_ip, your_mqtt_broker_port)
client.loop_start()

#myrtmp_addr = "rtmp://192.168.55.1/rtmp/live"
myrtmp_addr = f"rtmp://{your_nginx_server_ip}:{your_nginx_server_ip}/live/door_stream"
cap = cv2.VideoCapture(myrtmp_addr)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
'''
fps = int(cap.get(cv2.CAP_PROP_FPS))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

print(fps)
print(width)
print(height)

rtmp_url = 'rtmp://172.20.10.2:1935/live/qrcode'

command = ['ffmpeg',
           '-y',
           '-f', 'rawvideo',
           '-vcodec', 'rawvideo',
           '-pix_fmt', 'bgr24',
           '-s', "{}x{}".format(width, height),
           '-r', str(fps),
           '-i', '-',
           '-c:v', 'libx264',
           '-pix_fmt', 'yuv420p',
           '-preset', 'ultrafast',
           '-f', 'flv',
           rtmp_url]

p = subprocess.Popen(command, stdin=subprocess.PIPE)
'''

current = ''
start_time = time.time()
current_time = time.time()

try:
    while True:

        ret, frame = cap.read()
        if not ret:
            client.loop_stop()
            break

        current_time = time.time()
        if current_time - start_time > 5:
            current = ''
            start_time = current_time
        
        frame = imutils.resize(frame, width = width, height = height)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        barcodes = pyzbar.decode(frame)

        frame_count = 1

        for barcode in barcodes:
            print("[Barcode] starting analyze barcode %d ..." % frame_count)
            frame_count += 1
            
            # extract the bounding box location of the barcode and draw
            # the bounding box surrounding the barcode on the image
            (x, y, w, h) = barcode.rect

            # the barcode data is a bytes object so if we want to draw it
            # on our output image we need to convert it to a string first
            barcodeData = barcode.data.decode("utf-8")
            #print(barcodeData)
            if barcodeData != current:
                print(barcodeData)
                client.publish(topic = 'QRcode', payload = barcodeData)
                current = barcodeData
            barcodeType = barcode.type
            '''
            # draw the barcode data and barcode type on the image
            if barcodeData == 'http://zh.wikipedia.org/':
                print('correct person')
                #text = "{} ({})".format(barcodeData, barcodeType)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(frame, text, (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                client.publish(topic=args['topic'], payload=payload)
            else:
                text = "{} ({})".format(barcodeData, barcodeType)
                #text = 'NOT POPE'
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
                cv2.putText(frame, text, (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            '''

            # if the barcode text is currently not in our CSV file, write
            # the timestamp + barcode to disk and update the set
            '''
            if barcodeData not in found:
                csv.write("{},{}\n".format(datetime.datetime.now(),
                    barcodeData))
                csv.flush()
                found.add(barcodeData)
            '''


        
        #cv2.imshow('QRcode', frame)
        #encoded, buffer = cv2.imencode('.jpg',frame,[cv2.IMWRITE_JPEG_QUALITY,80])
        
        #message = base64.b64encode(buffer)
        #print(len(message))
        #server_socket.sendto(message,client_addr)
        #p.stdin.write(frame.tobytes())
        #p.stdin.write(bytes(message))
        #print("len(message):", len(bytes(message)))
        
        if cv2.waitKey(1) == ord('q'):
            break

except KeyboardInterrupt as e:
    client.loop_stop()
    pass

cap.release()
cv2.destroyAllWindows()