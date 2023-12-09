import {useState, useEffect} from 'react'
import {FaSignInAlt} from 'react-icons/fa'
import {useSelector, useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify";
import {login, reset} from '../features/auth/authSlice'
import Spinner from '../components/spinner'
import '../styles/login.css'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const {email, password} = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // getting const vars from global auth state
    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

    // runs on initial render and when state changes
    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        else if (isSuccess || user) {
            navigate('/')
        }

        dispatch(reset())

    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            // The spread operator (...) is used to create a shallow copy of the previous state (prevState).
            // This is a common pattern in React when updating state to avoid mutating the original state.
            ...prevState,
            // update the right key with the right value ("email" with {email} and "password" with {password})
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password
        }

        dispatch(login(userData))
    }

    if (isLoading) {
        return <Spinner/>
    }

    return <>
        <section className='login-page'>
            <div className='login-image'>
                INSERT IMAGE HERE
            </div>
            <section className='login-form'>
                <h2 className='login-form-header'>
                    Welcome back.
                </h2>
                <form onSubmit={onSubmit}>
                    <div className='login-form-group'>
                        <input type='email'
                               className='login-form-control'
                               id='email'
                               name='email'
                               value={email}
                               placeholder='Enter your email'
                               onChange={onChange} />
                    </div>
                    <div className='login-form-group'>
                        <input type='password'
                               className='login-form-control'
                               id='password'
                               name='password'
                               value={password}
                               placeholder='Enter your password'
                               onChange={onChange} />
                    </div>
                    <div className='login-form-group'>
                        <button type='submit' className='btn  btn-block'> Submit </button>
                    </div>
                </form>
            </section>
        </section>
    </>
}

export default Login