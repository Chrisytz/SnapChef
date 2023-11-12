import fiftyone as fo
dataset_dir = "test/test"

# The type of the dataset being imported

curry_dataset = fo.Dataset.from_dir(
    dataset_dir="images/train",
    dataset_type=fo.types.COCODetectionDataset
)

# print(dataset)
#
# session = fo.launch_app(dataset, port=5151)
# session.wait()

