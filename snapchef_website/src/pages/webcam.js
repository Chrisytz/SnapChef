import React from "react";
import ImageGallery from "../components/imageGallery";
import Webcam from "react-webcam"
export default function WebcamPage(){

  return(
        <div className = "webcam-container">
           <Webcam />
        </div>
  );

}