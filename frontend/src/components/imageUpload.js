import React, { useState, useEffect } from "react";
import "../styles/imageUpload.css"

function ImageUpload() {
    const [jsonData, setJsonData] = useState({});
   
    const [displayModel, setDisplayModel] = useState(null)

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

            <p>
            <center>
            <form id = "uploadForm" encType = "multipart/form-data"> 
                <input type = "file" name = "image" class = "form-input"/> 
                <button type = "button" value = "Upload" onClick={uploadImage} class = "form-button"> Test </button>
             </form>
             </center>
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
                    <center><img src={displayModel} alt="Preview" /> </center>
                    </div>
                )}
                </div>
                </p>
           
        </div>
        </div>
    )
}

export default ImageUpload;