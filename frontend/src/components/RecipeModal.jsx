import React from 'react';
function RecipeModal({goal, onClose}) {

    return (
        <div className='recipe-modal-overlay'>
            <div className='recipe-modal'>
                {goal.recipe_name}
                <button onClick={onClose}> CLOSE</button>
            </div>

        </div>
    )
}

export default RecipeModal