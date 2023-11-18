import React, { useState, useEffect } from "react";
import './imageUpload.css'

function ImageUpload() {
    const[image, setImage] = useState("");
    const[imageDB, setImageDB] = useState([]);
    const [jsonData, setJsonData] = useState({});
    const [objectImage, setObjectImage] = useState([])
    const [displayModel, setDisplayModel] = useState(null)

    useEffect(() => {
        // getImage()
        getObjectImage()
    },[])

    async function getImage() {
        fetch("http://localhost:8080/getImage", {
            method: "GET",

        }).then((res) => res.json()).then((data) => {
            console.log(data)
            setImageDB(data.data)
        })
    }

    async function getObjectImage() {
        fetch("http://localhost:8080/getImageSchema", {
            method: "GET",
        }).then((res) => res.json()).then((data) => {
            setObjectImage(data.data)
            console.log(data)
        })
    }

    function uploadImage() {
        fetch("http://localhost:8080/uploadImage", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                base64: image
            })
        }).then((res) => res.json()).then((data) => console.log(data))

        const formData = new FormData(document.getElementById('uploadForm'));

        // Make a fetch request to submit the form data
        fetch('http://localhost:8080/upload', {
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
        <div className = "test-wrapper">
            <h1> Upload Image </h1>
            <form id = "uploadForm" encType = "multipart/form-data"> 
                <input type = "file" name = "image" />
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
             {/* {objectImage.map(data => {
                return(
                    <img alt = "run" src = {data.image} width = {100} height = {100} />
                )
            })} */}
        </div>
    )
}

export default ImageUpload;