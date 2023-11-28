from ultralytics import YOLO
import cv2
import math
from collections import defaultdict
from flask import Flask, render_template, Response, jsonify
import cv2
from flask_cors import CORS
import threading
import os, sys 
import numpy as np
import datetime, time


app = Flask(__name__)
lock = threading.Lock()
CORS(app, resources={r"/*": {"origins": "*"}})


classNames = ["carrot","egg","onion","chicken","pork",
    "steak",
    "red cabbage",
    "zucchini",
    "green onion",
    "tomato",
    "radish",
    "potato",
    "eggplant",
    "broccoli",
    "fasol",
    "lettuce",
    "bell pepper",
    "pumpkin",
    "beet",
    "cauliflower",
    "cabbage",
    "beans",
    "brussel sprouts",
    "hot pepper",
    "avocado",
    "cucumber",
    "garlic",
    "squash-patisson",
    "corn",
    "celery",
    "peas",
    "milk",
    "spam",
    "soybean paste",
    "pepper paste",
    "tofu",
    "tuna can",
    "rice cake",
    "kimchi"]

global objects
objects = {i:0 for i in classNames}

global camera_active
camera_active = False

def gen_frames():
    global cap, camera_active  # Declare cap as global at the start of the function
    camera_active = True
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        cap = cv2.VideoCapture(0)
    
    cap.set(3, 640)
    cap.set(4, 480)
    model = YOLO("flask_backend/best.pt")
    
    global objects
    while camera_active:
        success, frame = cap.read()
        if not success or frame is None: pass
        results = model(frame, stream=True)
       
        # coordinates
        for r in results:
            boxes = r.boxes

            for box in boxes:
                # bounding box
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2) # convert to int values

                # put box in cam
                cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 255), 3)

                # confidence
                confidence = math.ceil((box.conf[0]*100))/100
                print("Confidence --->",confidence)

                # class name
                cls = int(box.cls[0])
                
                # object details
                org = [x1, y1]
                font = cv2.FONT_HERSHEY_SIMPLEX
                fontScale = 1
                color = (255, 0, 0)
                thickness = 2
                
                print(objects)
                objects[classNames[cls]] += 1

                cv2.putText(frame, classNames[cls], org, font, fontScale, color, thickness)

        try:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        except Exception as e:
            pass

@app.route('/close_feed')
def close():
    global cap, camera_active
    camera_active = False
    if cap.isOpened():
        cap.release()
     
    
    global objects
    
    dic = objects.copy()

    non_exist = []
    for i in dic: 
        if dic[i] == 0: non_exist.append(i)  
    
    for i in non_exist: del dic[i]
    
    objects = {i:0 for i in classNames}
    cap.release()
   

    return jsonify(dic)

@app.route('/open_feed')
def open():
    global camera_active, cap
    camera_active = True
    cap = cv2.VideoCapture(0)
    return jsonify({"test": "test"})

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype = 'multipart/x-mixed-replace; boundary=frame', headers={"Cache-Control": "no-cache, no-store, must-revalidate"})

@app.route('/')
def hello():
    return '<h1>Hello, World!</h1>'




if __name__ == "__main__":
    app.run(port=8000, debug=True, host='0.0.0.0')