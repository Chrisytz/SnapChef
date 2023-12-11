import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import {createGoal} from "../features/goals/goalSlice";
import {useDispatch} from "react-redux";
import "../styles/imageUpload.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import { faUpload} from '@fortawesome/free-solid-svg-icons';
function ImageUpload() {
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [displayModel, setDisplayModel] = useState(null)
    const [recipeObject, setRecipeObject] = useState({})
    const fileInputRef = React.useRef(null);

    const [loadingButton, setLoadingButton] = useState(false);

    const [errorMsg, setErrorMsg] = useState("")

    const [filename, setFilename] = useState("")

    const [displayRecipe, setDisplayRecipe] = useState(false)
    
    const [ingredientStep, setIngredientStep] = useState(false)

    const statusCodeMessages = {
        420: "No ingredients found",
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
            console.log(data.json.id)
            setDisplayModel(data.json.images.image);
            console.log(displayModel)
            
            if(Object.keys(data.json.objects).length === 0) {
                console.log("Error 420");
                throw new Error("420");
            }
            
            return data
        })
        .then(data => {
            const ingredients = Object.keys(data.json.objects).join(',')
            return Promise.all([data.json.id, getRecipe(ingredients)])
        })
        .then(([id, recipeString]) => {
            const recipe = JSON.parse(recipeString)
            setRecipeObject(recipe)

            // we need to have a text: recipe field since in our post request for createGoal we have a required text field
            // that is defined in recipeModel.js
            dispatch(createGoal({
                recipe_name: recipe['recipe_name'],
                ingredients: JSON.stringify(recipe['ingredients']),
                steps: recipe['steps'],
                image_id: id
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
            } else if(error.message === "420") {
                console.log("set")
                setErrorMsg(statusCodeMessages[420]);
            } else {
                console.log(error);
            }
            setLoadingButton(false);
            setFinishedLoading(false);
            setFilename("");
        });        
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setFilename(file.name);
        }
      };

    const displayRecipes = (event) => {
        setDisplayRecipe(!displayRecipe)
    };

    const setStepIngredient = (state) => (event) => {
        setIngredientStep(state)
        console.log(state)
    }

    return (
        <div className = "image-upload-container">

        <div className = {!finishedLoading ? "test-wrapper" : "recipe"}>
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
            
            <h1 className="up-header">  Snap it, cook it! </h1>
            <text className="image-upload"> Upload an image of your ingredients to see what food you can make! </text>
            <br/>
            
        
            <center>
            <form id = "uploadForm" encType = "multipart/form-data"> 
            <div className="wrapper">
            <div className="container2">
                <h1 className="image-upload-file-text">Upload a file</h1>
                <div className="upload-container">
                <div className="border-container">
                    <div className="icons fa-4x">
                    <h1 class="imgupload"><i class="fa fa-file-image-o"></i></h1>
                    </div>
                   {!filename && <p> Drag and drop files here! </p>}
                   {filename && <p> {filename} </p>}


                    <a  className = "water-btn" href = "#" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                    <span> <FontAwesomeIcon icon = {faUpload} /> <h1 className="water-text"> Upload </h1> </span>
                    <div class="liquid"></div>
                    </a>
            

                <input type = "file" ref={fileInputRef} onChange = {handleFileChange} name = "image" className = "form-input"/> 
                </div>
                </div>
            </div>
            </div>
                {!finishedLoading && <div className="error-message">{errorMsg}</div>}
                <button type = "button" value = "Upload" onClick={uploadImage} className={`form-button ${loadingButton ? 'loading' : ''}`}> 
                <span className="button-text">  Submit </span>
               
                </button>
            </form>
            </center>
            </div>}

            {finishedLoading && <div> 
                <FontAwesomeIcon className = "arrow-left" icon = {faAngleLeft} onClick={(event) => {setFinishedLoading(false); setFilename("")}} />
                </div>}

            
            <div className = "object-list">
               

                {finishedLoading && (<div className='goals'>

                    <div class="card-container">
                    <div class="card u-clearfix">
                        <div class="card-body">
                        
                        <h2 class="card-title"> {recipeObject["recipe_name"]} </h2>
                        <span class="card-description subtle">These last few weeks I have been working hard on a new brunch recipe for you all.</span>
                        <div class="card-read" onClick={displayRecipes}> {displayRecipe ? "Close" : "Read"} </div>
                        {displayRecipe && <div className = "card-ingredients"> <span className={`recipe-steps ${ingredientStep ? "recipe-normal" : "recipe-bold"}`} onClick={setStepIngredient(false)}> Steps </span> 
                                                                                    <span className={`recipe-ingredients ${ingredientStep ? "recipe-bold" : "recipe-normal"}`} onClick={setStepIngredient(true)}> Ingredients </span> </div>}
                        
                        {displayRecipe && <div class = "recipe-display"> 
                            {!ingredientStep && <p>{recipeObject["steps"].map((ingredient, index) => (
                            <div key={index} className="fade-in-element">{ingredient}</div>
                            ))}</p>}

                            {ingredientStep && Object.entries(recipeObject["ingredients"]).map(([key, value]) => (
                                                        <li key={key}>
                                                            {key}: {value}
                                                        </li>
                                                    ))}
                        </div>}
                        
                       
                       
                        <span class="card-tag card-circle subtle">C</span>
                        </div>

                       
                        <center><img src={displayModel} alt="Preview" className="card-media" width = "300px"/> </center>
                        
                        </div>
                    <div class="card-shadow"></div>
                    </div>

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
                    <div>{recipeObject["steps"].map((ingredient, index) => (
                        <div key={index}>{ingredient}</div>
                    ))}</div>
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