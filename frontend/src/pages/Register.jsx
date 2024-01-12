import {useState, useEffect} from 'react'
import {FaUser} from 'react-icons/fa'
import {useSelector, useDispatch} from "react-redux"
import {Link, useNavigate} from "react-router-dom"
import {toast} from "react-toastify";
import {register, reset} from '../features/auth/authSlice'
import Spinner from '../components/spinner'
import robotImage from "./assets/robot.png"
import '../styles/register.css'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const {name, email, password, password2} = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // getting const vars from global auth state
    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

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
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (password !== password2) {
            toast.error('Passwords do not match')
        } else {
            // all coming from the form
            const userData = {
                name,
                email,
                password
            }

            dispatch(register(userData))
        }
    }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div style={{backgroundColor: '#e6e6e6', height:'100vh'}}>

        <section className='register-page'>
            <div className='register-image'>
                <img src = {robotImage} alt = "myrobot" />
            </div>
            <section className='register-form'>
                <h2 className='register-form-header'>
                    Get started today.
                </h2>
                <form onSubmit={onSubmit}>
                    <div className='register-form-group'>
                        <input type='text'
                               className='register-form-control'
                               id='name'
                               name='name'
                               value={name}
                               placeholder='Enter your name'
                               onChange={onChange} />
                    </div>
                    <div className='register-form-group'>
                        <input type='email'
                               className='register-form-control'
                               id='email'
                               name='email'
                               value={email}
                               placeholder='Enter your email'
                               onChange={onChange} />
                    </div>
                    <div className='register-form-group'>
                        <input type='password'
                               className='register-form-control'
                               id='password'
                               name='password'
                               value={password}
                               placeholder='Enter your password'
                               onChange={onChange} />
                    </div>
                    <div className='register-form-group'>
                        <input type='password'
                               className='register-form-control'
                               id='password2'
                               name='password2'
                               value={password2}
                               placeholder='Confirm your password'
                               onChange={onChange} />
                    </div>
                    <div className='register-form-group'>
                        <button type='submit' className='btn  btn-block'> Submit </button>
                    </div>
                </form>
                <Link to='/login'>
                    Already have an account? Login here.
                </Link>
            </section>
        </section>
    </div>
    )
}

export default Register