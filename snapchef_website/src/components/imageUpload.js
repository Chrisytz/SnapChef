import React, { useState, useEffect } from "react";

function ImageUpload() {
    const[image, setImage] = useState("");
    const[imageDB, setImageDB] = useState([]);
    
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
        getImage()
    },[])

    async function getImage() {
        fetch("http://localhost:8080/getImage", {
            method: "GET",

        }).then((res) => res.json()).then((data) => {
            console.log(data)
            setImageDB(data.data)
        })
    }

    function uploadImage() {
        fetch("http://localhost:8080/uploadImage", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control_Allow-Origin": "*",
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
        .then(response => {
            // Handle the response as needed
            console.log('Form submitted successfully');
            // You can update the DOM or perform other actions based on the response
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
                <input type = "submit" onClick={uploadImage}/>
             </form>

             {/* {imageDB.map(data => {
                return(
                    <img alt = "run" src = {data.image} width = {100} height = {100} />
                )
            })} */}
        </div>
    )
}

export default ImageUpload;