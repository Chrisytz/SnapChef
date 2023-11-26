import {useState} from 'react'
import {useDispatch} from "react-redux";
import {createGoal} from '../features/goals/goalSlice'

import OpenAI from "openai";

const openai = new OpenAI({apiKey: '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', dangerouslyAllowBrowser: true});

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
function GoalForm() {

    const [text, setText] = useState('')

    const dispatch = useDispatch()
    const onSubmit = async (e) => {
        // prevents the default form submission behavior, which would cause a page reload
        e.preventDefault()

        const recipeObject = JSON.parse(await getRecipe(text))

        // we need to have a text: recipe field since in our post request for createGoal we have a required text field
        // that is defined in goalModel.js
        dispatch(createGoal({
                recipe_name: recipeObject['recipe_name'],
                ingredients: JSON.stringify(recipeObject['ingredients']),
                steps: recipeObject['steps']
                }))
        setText('')
    }
    return (
        <section className='form'>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='text'> Ingredients </label>
                    <input
                        type='text'
                        name='text'
                        id='text'
                        // curly braces indicate javascript expression, this is the text state declared on line 7
                        value={text}
                        onChange={(e) => setText(e.target.value)} />
                </div>
                <div className='form-group'>
                    <button className='btn btn-block'>
                        Generate Recipe
                    </button>
                </div>
            </form>
        </section>
    )
}

export default GoalForm