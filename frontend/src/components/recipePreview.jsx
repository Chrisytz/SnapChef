import React, { useEffect, useState } from 'react';
function RecipePreview({goal, onSeeMore}) {

    return (

        <div className="goal-container">
            <div className="goal-content">
                <h2 className='goal-recipe-name'>{goal.recipe_name}</h2>
                <p className='goal-given-ingredients'> {goal.image_id.id}</p>
                <button className='recipe-button' onClick={onSeeMore}> see more </button>
            </div>
            <img className="overlapping-image" src={goal.image_id.image} alt="Description of the image" />
        </div>
    )
}

export default RecipePreview