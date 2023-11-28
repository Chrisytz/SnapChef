import myImage from '../top-10-cutest-cat-photos-of-all-time.jpg'

function RecipePreview({goal}) {
    return (

    <div className="goal-container">
        <div className="goal-content">
            <h2 className='goal-recipe-name'>{goal.recipe_name}</h2>
            <p className='goal-given-ingredients'> {goal.given_ingredients}</p>
        </div>
        <img className="overlapping-image" src={myImage} alt="Description of the image" />
    </div>
    )
}

export default RecipePreview