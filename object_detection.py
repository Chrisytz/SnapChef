# fiftyone convert \
#     --input-dir VALID \
#     --input-type fiftyone.types.COCODetectionDataset \
#     --output-dir valid_yolo \
#     --output-type fiftyone.types.YOLOv5Dataset

import ultralytics
from ultralytics import YOLO

ultralytics.checks()


# Load a model
model = YOLO("yolov8n.pt")  # load a pretrained model

# Use the model
results = model.train(data="/content/test_yolo/dataset.yaml", epochs=5)  # train the model
results = model.val()  # evaluate model performance on the validation data set
results = model("https://ultralytics.com/images/cat.jpg")  # predict on an image
success = YOLO("yolov8n.pt").export(format="onnx")  # export a model to ONNX