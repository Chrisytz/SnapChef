import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"
import GoalItem from '../components/goalItem'
import Spinner from '../components/spinner'
import {getGoals, reset} from '../features/goals/goalSlice'

function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // extracts the user object from the auth slice of the Redux store
    const {user} = useSelector((state) => state.auth)
    // extracts relevant data from the goals slice of the Redux store
    const {goals, isLoading, isError, message} = useSelector((state) => state.goals)

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
        dispatch(getGoals())

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isError, message, dispatch]);

    if (isLoading) {
        return <Spinner />
    }

    return (
        <>
        </>
    )
}

export default Dashboard