import React, {useState, useEffect} from "react";
import ImageGallery from "../components/imageGallery";
import OpenAI from "openai";
import {createGoal} from "../features/goals/goalSlice";
import "../styles/imageUpload.css"
import {useRef} from "react"

export default function WebcamPage(){
    const [data, setData] = useState(null);
    const [camera, setCamera] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading]  = useState(false)
    const cameraRef = useRef(camera);
    
    const openai = new OpenAI({apiKey: process.env.REACT_APP_GPT_API_KEY, dangerouslyAllowBrowser: true});
  

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
    
    const toggleCamera = () => {
        cameraRef.current = !camera
        setCamera(!camera)
        

        const url = cameraRef.current ? 'http://localhost:8000/open_feed': 'http://localhost:8000/close_feed';
       
        
        if(!cameraRef.current) {
            console.log("CLOSE")
            fetch(url)
                
                .then(response => response.json())
                .then(data => {
                    if(camera) {
                        setData(data);
                        
                        if (Object.keys(data).length === 0) {
                            return "na";
                        } else {
                            setLoading(true)
                            
                            const ingredients = Object.keys(data).join(', ');
                            return Promise.all([getRecipe(ingredients)])
                        }
                        
                    }
                   
                
                }).then(([data]) => {
                    const recipe = JSON.parse(data)
                    if(recipe === "na") {
                        setData("na")
                    } else {
                        setData(recipe);
                    }
                    console.log("RUNNING")
                    setLoading(false)
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
           
            {loading && <div className="loader">
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
           

            {camera && <img src="http://localhost:8000/video_feed?${new Date().getTime()}"
                            alt="Video Stream"
                            onError = {handleImageError} />}

            {data === "na" && !loading && <h1> There were no ingredients detected </h1>}

            {!loading && data && !camera && <div><h2>{data["recipe_name"]}</h2>
                    <h3> Ingredients </h3>
                    <ul>
                        {Object.entries(data["ingredients"]).map(([key, value]) => (
                            <li key={key}>
                                {key}: {value}
                            </li>
                        ))}
                    </ul>   
                    <h3> Steps </h3>
                    <div>{data["steps"].map((ingredient, index) => (
                        <div key={index}>
                            {ingredient}
                        </div>
                    ))}</div> </div>}

           
            
            {error && <h1> Camera failed to load</h1>}
            </div>
    );

}