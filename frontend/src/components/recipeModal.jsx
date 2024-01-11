import React, {useEffect, useState} from 'react';
import "../styles/recipeModal.css"
function RecipeModal({goal, onClose}) {
    const [contentToShow, setContentToShow] = useState('');
    const ingredientsMap = JSON.parse(goal.ingredients)

    useEffect(() => {
        // Call showIngredientsClicked by default when the component is mounted
        showIngredientsClicked();
    }, []); // Empty dependency array ensures that this effect runs only once on mount

    const showIngredientsClicked = () => {
        setContentToShow(
            <div className='recipe-modal-ingredients'>
                {Object.entries(ingredientsMap).map(([key, value]) =>
                    (
                        <div className='recipe-modal-ingredient-container'>
                            <input type='checkbox' className='checkbox-list'/>
                            <div className='recipe-modal-ingredient' >{`${key}, ${value}`}</div>
                        </div>
                    )
                )}
            </div>

        )
    }

    const showStepsClicked = () => {
        setContentToShow(
            <div className='recipe-modal-preparation'>
                {goal.steps.map((ingredient, index) =>
                    (<div className='recipe-modal-preparation-step-container'>
                        <div className='recipe-modal-preparation-step-number'>
                            STEP {index + 1}
                        </div>
                        <div className='recipe-modal-preparation-step-instructions'>
                            {ingredient}
                        </div>
                    </div>))}
            </div>
        )
    }


    return (
        <div className='recipe-modal-overlay'>
            <div className='recipe-modal-container'>
                <img className="recipe-modal-image" src={goal.image_id.image} alt="Description of the image" />
                <div className='recipe-modal-info-container'>
                    <div className='recipe-modal-info-container-abs'>
                        <div className='recipe-modal-buttons'>
                            <button className='recipe-modal-button' onClick={showIngredientsClicked}> INGREDIENTS </button>
                            <button className='recipe-modal-button' onClick={showStepsClicked}> PREPARATION </button>

                        </div>
                        <divx> {contentToShow} </divx>
                        <button onClick={onClose}> CLOSE</button>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default RecipeModal