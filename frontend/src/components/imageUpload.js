import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import {createGoal} from "../features/goals/goalSlice";
import {useDispatch} from "react-redux";
import "../styles/imageUpload.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUpload} from '@fortawesome/free-solid-svg-icons';
function ImageUpload() {
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [displayModel, setDisplayModel] = useState(null)
    const [recipeObject, setRecipeObject] = useState({})
    const fileInputRef = React.useRef(null);

    const [loadingButton, setLoadingButton] = useState(false);

    const [errorMsg, setErrorMsg] = useState("")

    const statusCodeMessages = {
        450: "No file submitted",
        460: "File type not supported, we only support .png and .jpg"
    }

    const openai = new OpenAI({apiKey: process.env.REACT_APP_GPT_API_KEY, dangerouslyAllowBrowser: true});
        const dispatch = useDispatch()
    
        async function getRecipe(ingredients) {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content:
                            "you are a chef who is going to give out simple recipes with ingredients and steps based on a list of ingredients the user will provide in JSON format." +
                            "Please also add the necessary spices and ingredients, make sure the ones you add are common in households" +
                            "Here are the specifications of the formatting." +
                            "The name of the recipe should be a key value pair with the key being \"recipe_name\"" +
                            "The ingredients of the recipe should be in a nested dictionary with key \"ingredients\" and inside that nested dictionary" +
                            "each ingredient should have the key be the ingredient name and the value be the quantity/details" +
                            "finally the steps to prepare the recipe should be in a list with key \"steps\""},
                    { role: "user", content: ingredients}],
                model: "gpt-3.5-turbo-1106",
                response_format: { type: "json_object" },
            });
    
            console.log(completion.choices[0].message.content);
            return completion.choices[0].message.content
        }
    
    function uploadImage() {
        setLoadingButton(true);

        setFinishedLoading(false)
        const formData = new FormData(document.getElementById('uploadForm'));

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if(response.status === 450) {
                throw new Error("450")
            } else if(response.status === 460) {
                throw new Error("460")
            }
            setErrorMsg("")
            return response.json()
        })
        .then(data => {
            // Handle the response as needed
            setDisplayModel(data.json.images.image);
            console.log(displayModel)
            
            
            
            return data
        })
        .then(data => {
            const ingredients = Object.keys(data.json.objects).join(',')
            return getRecipe(ingredients)
        })
        .then((recipeString) => {
            const recipe = JSON.parse(recipeString)
            setRecipeObject(recipe)

            // we need to have a text: recipe field since in our post request for createGoal we have a required text field
            // that is defined in goalModel.js
            dispatch(createGoal({
                recipe_name: recipe['recipe_name'],
                ingredients: JSON.stringify(recipe['ingredients']),
                steps: recipe['steps']
            }))
        })
        .then(() => {
            setLoadingButton(false);
            setFinishedLoading(true)
        })
        .catch(error => {
            console.error('Error submitting form:', error);

            if(error.message === "450") {
                setErrorMsg(statusCodeMessages[450]);
            } else if(error.message === "460") {
                setErrorMsg(statusCodeMessages[460]);
            } else {
                console.log(error);
            }
            setLoadingButton(false);
            setFinishedLoading(false);
        });        
    }

    return (
        <div className = "container">

        <div className = "test-wrapper">
        {!finishedLoading && <div className="submit-form" >
        {loadingButton && <div className="loader">
                                <div className="loader-inner">
                                    <div className="loader-line-wrap">
                                        <div className="loader-line"></div>
                                    </div>
                                    <div className="loader-line-wrap">
                                        <div className="loader-line"></div>
                                    </div>
                                    <div className="loader-line-wrap">
                                        <div className="loader-line"></div>
                                    </div>
                                    <div className="loader-line-wrap">
                                        <div className="loader-line"></div>
                                    </div>
                                    <div className="loader-line-wrap">
                                        <div className="loader-line"></div>
                                    </div>
                                </div>
                            </div>}
            
            <h1 className="up-header"> Snap it, cook it! </h1>
            <text className="image-upload"> Upload an image of your ingredients to see what food you can make! </text>
            <br/>
            
        
            <center>
            <form id = "uploadForm" encType = "multipart/form-data"> 
            <div className="wrapper">
            <div className="container2">
                <h1>Upload a file</h1>
                <div className="upload-container">
                <div className="border-container">
                    <div className="icons fa-4x">
                    <h1 class="imgupload"><i class="fa fa-file-image-o"></i></h1>
                    </div>
                    <p> Drag and drop files here! </p>
                    <button 
                        type="button" 
                        className="button3"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >

                        <span className="button-text"> <FontAwesomeIcon icon={faUpload} />   Upload Image</span>
                    </button>


                <input type = "file" ref={fileInputRef} name = "image" className = "form-input"/> 
                </div>
                </div>
            </div>
            </div>
                
               
                
                <button type = "button" value = "Upload" onClick={uploadImage} className={`form-button ${loadingButton ? 'loading' : ''}`}> 
                <span className="button-text">Submit</span>
               
                </button>
            </form>
            </center>
            </div>}

            {finishedLoading && <div> 
                <button onClick={() => setFinishedLoading(false)} >
                <span className="arrow">&#8592;</span> Back
                </button>
                </div>}

            
            <div className = "object-list">
                {!finishedLoading && <div className="error-message">{errorMsg}</div>}

                {finishedLoading && (<div className='goals'>

                    <h2>{recipeObject["recipe_name"]}</h2>
                    <h3> Ingredients </h3>
                    <ul>
                        {Object.entries(recipeObject["ingredients"]).map(([key, value]) => (
                            <li key={key}>
                                {key}: {value}
                            </li>
                        ))}
                    </ul>
                    <h3> Steps </h3>
                    <p>{recipeObject["steps"].map((ingredient, index) => (
                        <div key={index}>{ingredient}</div>
                    ))}</p>
                </div>)}

                {finishedLoading && (
                    <div>
                    <h2>Image Preview:</h2>
                    <center><img src={displayModel} alt="Preview" /> </center>
                    </div>
                )}
                </div>

           
        </div>
        </div>
    )
}

export default ImageUpload;