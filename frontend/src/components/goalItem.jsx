import {useDispatch} from "react-redux";
import {deleteGoal} from '../features/goals/goalSlice'

function GoalItem({goal}) {
    const dispatch = useDispatch()

    const ingredientsMap = JSON.parse(goal.ingredients)
    return (
        <div className='goal'>
            <div>
                {new Date(goal.createdAt).toLocaleString('en-US')}
            </div>
            <h2>{goal.recipe_name}</h2>
            <h3> Ingredients </h3>
            <ul>
                {Object.entries(ingredientsMap).map(([key, value]) => (
                    <div key={key}>{`${key}: ${value}`}</div>
                ))}
            </ul>
            <h3> Steps </h3>
            <p>{goal.steps.map((ingredient, index) => (
                <div key={index}>{ingredient}</div>
            ))}</p>
            <button onClick={() => dispatch(deleteGoal(goal._id))} className='close'>X</button>
        </div>
    )
}

export default GoalItem