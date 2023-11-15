import React, { useState, useEffect } from "react";

function UploadImage() {
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

    async function getImage() {
        fetch("http://localhost:8080/getImage", {
            method: "GET",

        }).then((res) => res.json()).then((data) => {
            console.log(data)
            setImageDB(data.data)
        })
    }

    return (
        <div className = "auth-wrapper">
            <div className = "auth-inner" style = {{width: "auto"}}>
                Upload Image <br/>
            </div>
            <input
                accept = "image/*"
                type = "file"
                onChange = {convertToBase64}
            />
            {image == "" || image==null?"" : <img alt = "test" width = {200} height = {200} src = {image} />}
            <button onClick = {uploadImage}> Upload </button>

            {imageDB.map(data => {
                return(
                    <img alt = "run" src = {data.image} width = {100} height = {100} />
                )
            })}
        </div>
    )
}

export default UploadImage;