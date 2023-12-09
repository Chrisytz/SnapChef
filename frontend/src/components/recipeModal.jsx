import React from 'react';
import "../styles/recipeModal.css"
function RecipeModal({goal, onClose}) {

    return (
        <div className='recipe-modal-overlay'>
            <div className='recipe-modal-container'>
                {goal.recipe_name}
                <button onClick={onClose}> CLOSE</button>
            </div>

        </div>
    )
}

export default RecipeModal