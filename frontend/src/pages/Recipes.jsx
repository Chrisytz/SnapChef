import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"

import {getGoals, reset} from '../features/goals/goalSlice'
import RecipePreview from "../components/recipePreview";
import RecipeModal from "../components/recipeModal";

import '../styles/recipes.css'
function Recipes() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // extracts the user object from the auth slice of the Redux store
    const {user} = useSelector((state) => state.auth)
    // extracts relevant data from the goals slice of the Redux store
    const {goals, isLoading, isError, message} = useSelector((state) => state.goals)

    const [selectedGoal, setSelectedGoal] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (goal) => {
        setSelectedGoal(goal);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedGoal(null);
        setModalVisible(false);
    };

    // this is run after the initial render, when the component updates (state or props change) and when component is unmounted
    // state includes the 'text' variable in GoalForm (const [text, setText] = useState(''))
    // state also includes the redux state which consists of the user (line 15) and the goals, isLoading, isError, Message (line 17)
    useEffect(() => {
        if (isError) {
            console.log(message)
        }
        if (!user) {
            navigate('/login')
        }
        console.log("getting goals")
        dispatch(getGoals())

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isError, message, dispatch]);


    return (
        <>
            <section className='recipes-content'>
                {goals.length > 0 ? (
                    <div className='recipes-recipes'>
                        {[...goals]
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((goal) => (
                                <RecipePreview key={goal._id} goal={goal} onSeeMore={() => openModal(goal)}/>
                            ))}
                    </div>
                ) : (<h3>You have not generated any recipes</h3>)}

                {modalVisible && (
                    <RecipeModal goal={selectedGoal} onClose={closeModal} />
                )}
            </section>
        </>
    )
}

export default Recipes