import React, { useState, useEffect } from "react";

function ImageUpload() {
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
    }
    
    return (
        <div className = "test-wrapper">
            <h1> Upload Image </h1>
            <form method = "POST" action = "http://localhost:8080/upload" encType = "multipart/form-data"> 
                <input type = "file" name = "image" />
                <input type = "submit" onClick={uploadImage}/>
             </form>
        </div>
    )
}

export default ImageUpload;