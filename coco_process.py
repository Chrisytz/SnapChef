import json
import fiftyone as fo
import fiftyone.zoo as foz
import fiftyone.utils.random as four
import fiftyone.utils.yolo as fouy

def merge_coco():
    with open('TEST/labels.json', 'r') as file:
        dataset1 = json.load(file)

    # with open('Molang.v2i.coco/valid/labels.json', 'r') as file:
    #     dataset3 = json.load(file)

    with open('object_detection_dataset/test_dataset/labels.json', 'r') as file:
        dataset2 = json.load(file)

    # with open('veggies.json', 'r') as file:
    #     dataset4 = json.load(file)

    supercategory = dataset1["categories"][0]["name"]

    big_coco = dataset1
    json_data = [dataset2]

    category_map_to_id = {}
    repeat = {}
    category_id_to_new_id = {}

    for category in dataset1["categories"]:
        if category["id"] == 0 and category["supercategory"] == "none":
            print(category["name"])
            continue
        category_map_to_id[category["name"]] = category["id"]

    for jsons in json_data:
        last_element = offset = len(big_coco["categories"])
        repeat.clear()

        print(jsons["categories"][0]["name"])
        for category in jsons["categories"]:
            if category["id"] == 0 and category["supercategory"] == "none":
                print(category["name"])
                continue
            if category["name"] not in category_map_to_id:
                category_map_to_id[category["name"]] = last_element

                category_id_to_new_id[category["id"]] = last_element

                category["id"] = last_element

                big_coco["categories"].append(category)
                category["supercategory"] = supercategory
                last_element += 1
            else:
                repeat[category["id"]] = category["name"]

        last_image = image_offset = len(big_coco["images"])
        if jsons["images"][0]["id"] != 0:
            last_image += 1

        for image in jsons["images"]:
            image["id"] = last_image
            last_image += 1
            big_coco["images"].append(image)

        if jsons["categories"][0]["supercategory"] == "none":
            annotation_offset = len(big_coco["annotations"]) + 1
        else:
            annotation_offset = len(big_coco["annotations"])

        print(annotation_offset)

        for annotation in jsons["annotations"]:
            if annotation["category_id"] not in repeat:
                # print(annotation["category_id"])
                annotation["category_id"] = category_id_to_new_id[annotation["category_id"]]
            else:
                annotation["category_id"] = category_map_to_id[repeat[annotation["category_id"]]]

            annotation["image_id"] = image_offset + annotation["image_id"]
            annotation["id"] = annotation_offset

            annotation_offset += 1

            big_coco["annotations"].append(annotation)

    print(category_map_to_id)

    with open("labels.json", 'w') as json_file:
        json.dump(big_coco, json_file, indent=4)


def number_to_string():
    with open('images/test/labels.json', 'r') as file:
        dataset = json.load(file)

    mapping = {
        "0": "potato",
        "1": "tomato",
        "2": "steak",
        "3": "pork",
        "4": "chicken",
        "5": "zucchini",
        "6": "onion",
        "7": "radish",
        "8": "eggplant",
        "9": "green onion",
        "10": "red cabbage",
        "11": "carrot",
        "12": "egg",
        "food": "food"
    }

    for entry in dataset["categories"]:
        entry["name"] = mapping[entry["name"]]

    with open("images/train/labels.json", 'w') as json_file:
        json.dump(dataset, json_file, indent=4)


def split_dataset(path):
    dataset = fo.Dataset.from_dir(
        dataset_dir=path,
        dataset_type=fo.types.COCODetectionDataset
    )

    four.random_split(dataset, {"train": 0.8, "test": 0.1, "val": 0.1})
    train_view = dataset.match_tags("train")
    val_view = dataset.match_tags("val")
    test_view = dataset.match_tags("test")
    train_view.export(
        export_dir=path + "split/train",
        dataset_type=fo.types.COCODetectionDataset
    )
    val_view.export(
        export_dir=path + "split/valid",
        dataset_type=fo.types.COCODetectionDataset
    )
    test_view.export(
        export_dir=path + "split/test",
        dataset_type=fo.types.COCODetectionDataset
    )


# capsicum is sweet peper or smth
def modified_combined_json(path):
    with open(path, 'r') as file:
        dataset = json.load(file)

    vege_marrow_id = 0
    zuch_id = 0
    deapa_id = 0
    green_onion_id = 0
    rediska_id = 0
    redka_id = 0
    radish_id = 0
    index_to_delete = []
    for index, cat in enumerate(dataset["categories"]):
        if cat["name"] == "vegetable marrow":
            vege_marrow_id = cat["id"]
            index_to_delete.append(index)
        if cat["name"] == "zucchini":
            zuch_id = cat["id"]

        if cat["name"] == "daepa":
            deapa_id = cat["id"]
            index_to_delete.append(index)
        if cat["name"] == "green onion":
            green_onion_id = cat["id"]

        if cat["name"] == "rediska":
            rediska_id = cat["id"]
            index_to_delete.append(index)
        if cat["name"] == "redka":
            print("redqward id found!!!! ", cat["id"])
            redka_id = cat["id"]
            index_to_delete.append(index)
        if cat["name"] == "radish":
            radish_id = cat["id"]

        if cat["name"] == "brus capusta":
            cat["name"] = "brussel sprouts"

        if cat["name"] == "cayliflower":
            cat["name"] = "cauliflower"

        if cat["name"] == "salad":
            cat["name"] = "lettuce"

    for index in sorted(index_to_delete, reverse=True):
        del dataset["categories"][index]

    for annot in dataset["annotations"]:
        if annot["category_id"] == vege_marrow_id:
            annot["category_id"] = zuch_id

        if annot["category_id"] == deapa_id:
            annot["category_id"] = green_onion_id

        if annot["category_id"] == rediska_id or annot["category_id"] == redka_id:
            annot["category_id"] = radish_id


    with open(path, 'w') as json_file:
        json.dump(dataset, json_file, indent=4)


if __name__ == "__main__":
    merge_coco()
    # modified_combined_json("TRAIN/labels.json")
    # modified_combined_json("VALID/labels.json")
    # modified_combined_json("TEST/labels.json")

