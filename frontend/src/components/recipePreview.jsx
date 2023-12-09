import React, { useEffect, useState } from 'react';
import '../styles/recipePreview.css'
function RecipePreview({goal, onSeeMore}) {

    return (
        <div className="recipe-preview-content">
            <h2 className='recipe-preview-recipe-name'>{goal.recipe_name}</h2>
            <p className='recipe-preview-given-ingredients'> {goal.image_id.id}</p>
            <button className='recipe-preview-recipe-button' onClick={onSeeMore}> see more </button>
            <img className="recipe-preview-overlapping-image" src={goal.image_id.image} alt="Description of the image" />
        </div>
    )
}

export default RecipePreview