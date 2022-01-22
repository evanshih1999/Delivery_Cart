import face_recognition
import docopt
from sklearn import svm
import os

import imutils
#import time
import cv2
import paho.mqtt.client as mqtt
import numpy as np
import time

your_mqtt_broker_ip = ''
your_mqtt_broker_port = 1883
your_nginx_server_ip = ''
your_nginx_server_port = 1935


#import subprocess
client = mqtt.Client()
client.username_pw_set("Face", "Face")
client.connect(your_mqtt_broker_ip, your_mqtt_broker_ip)
client.loop_start()

#def face_recognize(dir, test):
    # Training the SVC classifier
    # The training data would be all the face encodings from all the known images and the labels are their names

encodings = []
names = []
'''
# Training directory
if dir[-1]!='/':
    dir += '/'
'''
dir = 'train_dir/'
train_dir = os.listdir(dir)

# Loop through each person in the training directory
for person in train_dir:
    pix = os.listdir(dir + person)

    # Loop through each training image for the current person
    for person_img in pix:
        # Get the face encodings for the face in each image file
        face = face_recognition.load_image_file(dir + person + "/" + person_img)
        face_bounding_boxes = face_recognition.face_locations(face)

        #If training image contains exactly one face
        if len(face_bounding_boxes) == 1:
            face_enc = face_recognition.face_encodings(face)[0]
            # Add face encoding for current image with corresponding label (name) to the training data
            encodings.append(face_enc)
            names.append(person)
            print(person + "/" + person_img + " loaded")
        else:
            print(person + "/" + person_img + " can't be used for training")

# Create and train the SVC classifier
clf = svm.SVC(gamma='scale')
clf.fit(encodings,names)
'''
# Load the test image with unknown faces into a numpy array
test_image = face_recognition.load_image_file(test)

# Find all the faces in the test image using the default HOG-based model
'''

aaaa = input() 

myrtmp_addr = f"rtmp://{your_nginx_server_ip}:{your_nginx_server_port}/live/car_stream"
cap = cv2.VideoCapture(myrtmp_addr)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 0)

'''
while True:
    frame = streamer.grab_frame()
    if frame is not None:
        cv2.imshow("Context", frame)
    cv2.waitKey(1) 
'''


#myrtmp_addr = "rtmp://172.20.10.2:1935/live/door_stream"
#cap = cv2.VideoCapture(myrtmp_addr)
#cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

current = ''
start_time = time.time()
current_time = time.time()

try:
    while True:
        ret, frame = cap.read()
        #frame = streamer.grab_frame()

        if frame is None:
            break

        current_time = time.time()
        if current_time - start_time > 5:
            current = ''
            start_time = current_time

        face_locations = face_recognition.face_locations(frame)
        no = len(face_locations)
        #print("Number of faces detected: ", no)

        # Predict all the faces in the test image using the trained classifier
        #print("Found:")
        for i in range(no):
            test_image_enc = face_recognition.face_encodings(frame)[i]
            name = clf.predict([test_image_enc])
            #arr = np.array([1, 2, 3, 4, 5, 6])
            nm = np.array_str(name)
            #print(type(nm))
            if nm != current:
                print(nm)
                client.publish(topic = 'Face', payload = nm)
                current = nm
            #print(*name)

        #cv2.imshow('Mywindow', frame)
        if cv2.waitKey(1) == ord('q'):
            break

except KeyboardInterrupt as e:
    pass

cap.release()
cv2.destroyAllWindows()
'''
def main():
#args = docopt.docopt(__doc__)

#train_dir = args["--train_dir"]
#test_image = args["--test_image"]
face_recognize(train_dir, test_image)

if __name__=="__main__":
main()
'''