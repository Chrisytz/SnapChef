from ultralytics import YOLO

# Load a model
model = YOLO("best.pt")  # load a pretrained model (recommended for training)
results = model("go.jpg")  # predict on an image
