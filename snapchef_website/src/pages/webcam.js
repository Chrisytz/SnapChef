import React, {useState, useEffect} from "react";
import ImageGallery from "../components/imageGallery";
import Webcam from "react-webcam"

import {useRef} from "react"

export default function WebcamPage(){
    const [data, setData] = useState({});
    const [camera, setCamera] = useState(false)
    const [error, setError] = useState(false)
    const cameraRef = useRef(camera);
    const toggleCamera = () => {
        cameraRef.current = !camera
        setCamera(!camera)
        

        const url = cameraRef.current ? 'http://localhost:5000/open_feed': 'http://localhost:5000/close_feed';
       
        
        if(!cameraRef.current) {
            console.log("CLOSE")
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if(camera) {
                        setData(data);
                        console.log(data)
                    }
                   
                
                })
                .catch(error => {
                    console.error('Error from false camera:', error);
                    setError(true)
                });
        } else {
            console.log("OPEN")
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if(camera) {
                        setData(data);
                        console.log("WErewer");
                        console.log(data)
                    }
                
                })
                .catch(error => {
                    console.error('Error from true camera:', error);
                    setError(true)
                });
        }
    }

    useEffect(() => {
        cameraRef.current = camera;
    }, [camera]);

    const handleImageError = () => {
        setError(true)
    }

    return(
            <div className = "webcam-container">
            <h1>Video Stream</h1>
            
            <button onClick={toggleCamera}>
                {camera ? 'Turn Camera Off' : 'Turn Camera On'}
            </button>

            {camera && <img src="http://localhost:5000/video_feed?${new Date().getTime()}" 
                            alt="Video Stream"
                            onError = {handleImageError} />}

            {!camera && 
                <div>
                {Object.entries(data).map(([key, value]) => (
                    <div key={key}>
                    {key}: {value}
                </div>
                ))}
                </div>}
            
            {error && <h1> Camera failed to load</h1>}
            </div>
    );

}