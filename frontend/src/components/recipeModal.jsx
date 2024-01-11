import React, {useEffect, useState} from 'react';
import "../styles/recipeModal.css"
function RecipeModal({goal, onClose}) {
    const [contentToShow, setContentToShow] = useState('');
    const [activeButton, setActiveButton] = useState('');

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
        setActiveButton(
            <div className='recipe-modal-buttons'>
                <button className='recipe-modal-button'  style={{color: "black", borderColor: "deeppink"}} onClick={showIngredientsClicked}> INGREDIENTS </button>
                <button className='recipe-modal-button' onClick={showStepsClicked}> PREPARATION </button>
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
        setActiveButton(
            <div className='recipe-modal-buttons'>
                <button className='recipe-modal-button' onClick={showIngredientsClicked}> INGREDIENTS </button>
                <button className='recipe-modal-button' style={{color: "black", borderColor: "deeppink"}} onClick={showStepsClicked}> PREPARATION </button>
            </div>
        )

    }


    return (
        <div className='recipe-modal-overlay'>
            <div className='recipe-modal-container'>
                <img className="recipe-modal-image" src={goal.image_id.image} alt="Description of the image" />
                <div className='recipe-modal-info-container'>
                    <div className='recipe-modal-info-container-abs'>
                        {activeButton}
                        <divx> {contentToShow} </divx>
                        <button className='recipe-modal-close-button' onClick={onClose}> CLOSE</button>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default RecipeModal