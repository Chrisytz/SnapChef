from ultralytics import YOLO
import sys
# Load a model

if len(sys.argv) > 1:
    base64 = sys.argv[1]
    print("input from js")


model = YOLO("best.pt")  # load a pretrained model (recommended for training)
results = model("porky.jpg", save = True, save_txt = True, show = True)  # predict on an image




