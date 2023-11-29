import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import {createGoal} from "../features/goals/goalSlice";
import {useDispatch} from "react-redux";
import "../styles/imageUpload.css"

function ImageUpload() {
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [displayModel, setDisplayModel] = useState(null)
    const [recipeObject, setRecipeObject] = useState({})

    const [loadingButton, setLoadingButton] = useState(false);

    const openai = new OpenAI({apiKey: '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', dangerouslyAllowBrowser: true});
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
        .then(response => response.json())
        .then(data => {
            // Handle the response as needed
            setDisplayModel(data.json.images.image);
            console.log(displayModel)
            

            setLoadingButton(false);
            
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
            setFinishedLoading(true)
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });        
    }

    return (
        <div className = "container">


        <div className = "test-wrapper">
        {loadingButton && <div class="loader">
                                <div class="loader-inner">
                                    <div class="loader-line-wrap">
                                        <div class="loader-line"></div>
                                    </div>
                                    <div class="loader-line-wrap">
                                        <div class="loader-line"></div>
                                    </div>
                                    <div class="loader-line-wrap">
                                        <div class="loader-line"></div>
                                    </div>
                                    <div class="loader-line-wrap">
                                        <div class="loader-line"></div>
                                    </div>
                                    <div class="loader-line-wrap">
                                        <div class="loader-line"></div>
                                    </div>
                                </div>
                            </div>}
            
            <h1> Snap it, cook it! </h1>
            <h2> Upload Image </h2>
            <br/>

        
            <center>
            <form id = "uploadForm" encType = "multipart/form-data"> 
                <input type = "file" name = "image" className = "form-input"/> 
                <button type = "button" value = "Upload" onClick={uploadImage} className={`form-button ${loadingButton ? 'loading' : ''}`}> 
                <span className="button-text">Submit</span>
               
                </button>
             </form>
             </center>
            <div className = "object-list">
                {finishedLoading && displayModel && (<div className='goals'>

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

                {finishedLoading && displayModel && (
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