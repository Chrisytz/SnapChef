from typing import List, Dict
import yaml
from pprint import pprint
import re
import os


def fix_yolo(standard_path: str, paths_to_change: List[str], label_directories_to_change: List[str]):

    # Open and read the YAML file
    with open(standard_path, 'r') as file:
        base_data = yaml.safe_load(file)

    other_data = []
    for path in paths_to_change:
        with open(path, 'r') as file:
            other_data.append(yaml.safe_load(file))

    base_map = {value: key for key, value in base_data.get("names", {}).items()}

    other_maps = [data.get("names", {}) for data in other_data]

    for dir in label_directories_to_change:
        for filename in os.listdir(dir):
            modified_lines = []
            with open(os.path.join(dir, filename)) as f:
                for line in f:
                    num = re.search(r'\d+', line).group()
                    new_line = line.replace(num, str(base_map[other_maps[1][int(num)]]), 1)
                    modified_lines.append(new_line)

            with open(os.path.join(dir, filename), 'w') as f:
                for line in modified_lines:
                    f.write(line)

    # THEN AT THE END U JUST NEED TO REFORMAT ALL THE FILES AND ALSO MODIFY THE BASE_DATA YAML FILE!!!!


if __name__ == "__main__":
    fix_yolo("train_yolo/dataset.yaml", ["test_yolo/dataset.yaml","valid_yolo/dataset.yaml"], ["test_yolo/labels/val", "valid_yolo/labels/val"])
