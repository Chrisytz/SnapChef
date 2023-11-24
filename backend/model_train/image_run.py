from ultralytics import YOLO
import glob
import os
from collections import defaultdict
import shutil
import json
import time
import sys
# Load a model

categories = {
    "0": "carrot",
    "1": "egg",
    "2": "onion",
    "3": "chicken",
    "4": "pork",
    "5": "steak",
    "6": "red cabbage",
    "7": "zucchini",
    "8": "green onion",
    "9": "tomato",
    "10": "radish",
    "11": "potato",
    "12": "eggplant",
    "13": "broccoli",
    "14": "fasol",
    "15": "lettuce",
    "16": "bell pepper",
    "17": "pumpkin",
    "18": "beet",
    "19": "cauliflower",
    "20": "cabbage",
    "21": "beans",
    "22": "brussel sprouts",
    "23": "hot pepper",
    "24": "avocado",
    "25": "cucumber",
    "26": "garlic",
    "27": "squash-patisson",
    "28": "corn",
    "29": "celery",
    "30": "peas",
    "31": "milk",
    "32": "spam",
    "33": "soybean paste",
    "34": "pepper paste",
    "35": "tofu",
    "36": "tuna can",
    "37": "rice cake",
    "38": "kimchi"
}

def main():
    directory = ""
    pattern = os.path.join(directory, 'model_train/model*')
    print(pattern)
    match_file = glob.glob(pattern)
    
    try:
        file_path =  match_file[0]
        print("yo", file_path)
        model = YOLO("model_train/best.pt")  # load a pretrained model (recommended for training)
        results = model(file_path, save = True, save_txt = True)  # predict on an image
        
        model_file = "runs/detect/predict/labels/model.txt"

        detected = defaultdict(int)

        if os.path.exists(model_file): 
            with open(model_file, 'r') as file:
                for line in file:
                    first_word = line.split()[0]
                    detected[categories[first_word]] += 1
        
        
        with open('../objects.json', 'w') as json_file:
            json.dump(detected, json_file)
        

    except Exception as e:
        print("invalid file")
        print(e)


if __name__ == "__main__":
    # This block will be executed only if the script is run, not if it's imported as a module
    main()

