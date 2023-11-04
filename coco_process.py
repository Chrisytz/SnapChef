import json
def merge_coco():
    with open('recipes.json', 'r') as file:
        dataset1 = json.load(file)
    
    with open('fruits_and_vegetables.json', 'r') as file:
        dataset3 = json.load(file)
    
    supercategory = dataset1["categories"][0]["name"]

    big_coco = dataset1
    json_data = [dataset3]

    category_map_to_id = {}
    repeat = {}
    category_id_to_new_id = {}
    

    for category in dataset1["categories"]:
        if category["id"] == 0: continue
        category_map_to_id[category["name"]] = category["id"]

    for jsons in json_data:
        last_element = offset = len(big_coco["categories"])
        repeat.clear()
        print(jsons["categories"][0]["name"])
        for category in jsons["categories"]:
            if category["id"] == 0: continue
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
    
        for image in jsons["images"]:
            image["id"] = last_image
            last_image += 1
            big_coco["images"].append(image)

        annotation_offset = len(big_coco["annotations"])

        print(annotation_offset)
        for annotation in jsons["annotations"]:
            if annotation["category_id"] not in repeat:
                annotation["category_id"] = category_id_to_new_id[annotation["category_id"]]
            else:
                annotation["category_id"] = category_map_to_id[repeat[annotation["category_id"]]]
            
            annotation["image_id"] = image_offset + annotation["image_id"]
            annotation["id"] = annotation_offset

            annotation_offset += 1

            big_coco["annotations"].append(annotation)

    print(category_map_to_id)

    with open("big_coco_test.json", 'w') as json_file:
        json.dump(big_coco, json_file, indent=4)
    
        
        
        
        



if __name__ == "__main__":
    merge_coco()