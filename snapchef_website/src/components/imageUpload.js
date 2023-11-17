import React, { useState, useEffect } from "react";
import './imageUpload.css'
function ImageUpload() {
    const[image, setImage] = useState("");
    const[imageDB, setImageDB] = useState([]);
    const [jsonData, setJsonData] = useState({});
    const [objectImage, setObjectImage] = useState([])
    const [displayModel, setDisplayModel] = useState(null)

    function convertToBase64(e) {
        console.log(e)

        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            console.log(reader.result);
            setImage(reader.result);
        };

        reader.onerror = error => {
            console.log("Error:", error)
        };
    }
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
            setJsonData(data);
            late_display();
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });        
    }

    function late_display() {
        fetch('http://localhost:8080/getImageModel', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response as needed
            const image64 = data.image; 
            setDisplayModel(image64);
        })
        .catch(error => {
            console.error('Error getting image:', error);
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
                <ul>
                    {Object.keys(jsonData).map(key => (
                    <ul key={key} className = "object-list">
                        {Object.keys(jsonData[key]).map(subKey => (
                        <li key={subKey} className="object-item">
                            <strong>{subKey}:</strong> {jsonData[key][subKey]}
                            
                        </li>
                        ))}
                    </ul>
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