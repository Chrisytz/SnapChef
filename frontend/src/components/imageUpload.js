import React, { useState, useEffect } from "react";
import "../styles/imageUpload.css"


function ImageUpload() {
    const[image, setImage] = useState("");
    const[imageDB, setImageDB] = useState([]);
    const [jsonData, setJsonData] = useState({});
    const [objectImage, setObjectImage] = useState([])
    const [displayModel, setDisplayModel] = useState(null)
    const [fileName, setFileName] = useState('No file chosen');

    const handleButtonClick = () => {
        document.getElementById('file-upload').click();
    };

    const handleFileChange = (event) => {
        setFileName(event.target.files[0].name);
    };

    useEffect(() => {
        // getImage()
        getObjectImage()
    },[])

    async function getImage() {
        fetch("http://localhost:3000/getImage", {
            method: "GET",

        }).then((res) => res.json()).then((data) => {
            console.log(data)
            setImageDB(data.data)
        })
    }

    async function getObjectImage() {
        fetch("http://localhost:3000/getImageSchema", {
            method: "GET",
        }).then((res) => res.json()).then((data) => {
            setObjectImage(data.data)
            console.log(data)
        })
    }

    function uploadImage() {

        const formData = new FormData(document.getElementById('uploadForm'));

        // Make a fetch request to submit the form data
        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response as needed
            console.log(data);
            setJsonData(data.json.objects);
            console.log(jsonData)
            setDisplayModel(data.json.images.image);
            console.log(displayModel)
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });        
    }

    return (
        <div className = "container">
        <div className = "test-wrapper">
            <h1> Snap it, cook it! </h1>
            <h2> Upload Image </h2>
            <br/>

            
            <form id = "uploadForm" encType = "multipart/form-data"> 
                <input type="file" name="image" id="file-upload" style={{ display: 'none' }} 
                onChange={handleFileChange} />
                <button type="button" id="custom-button"
                onClick={handleButtonClick} >Choose File</button>
                
                <input type = "button" value = "Upload" onClick={uploadImage}/>
            </form>
            
            <div className = "object-list">
                <ul className = "object-list">
                {Object.entries(jsonData).map(([key, value]) => (
                    <li key={key} className="object-item" >
                    <strong>{key}:</strong> {value}
                    </li>
                ))}
                </ul>

                {displayModel && (
                    <div>
                    <h2>Image Preview:</h2>
                    <img src={displayModel} alt="Preview" />
                    </div>
                )}
                </div>
                
           
        </div>
        </div>
    )
}

export default ImageUpload;