import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"
import {logout, reset} from '../features/auth/authSlice'

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <header className='header'>
            <header className='header-contents'>
                <div className='logo'>
                    <Link to='/'> SNAPCHEF </Link>
                </div>
                {user ? (
                    <div>
                        <Link to='/dashboard'> Dashboard </Link>
                        <Link to='/recipes'> Recipes </Link>
                    </div>
                    )
                    : (<></>)}

                <ul>
                    {user ? (
                        <li>
                            <button className='btn' onClick={onLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to='/login'>
                                    <FaSignInAlt /> Login
                                </Link>
                            </li>
                            <li>
                                <Link to='/register'>
                                    <FaUser /> Register
                                </Link>
                            </li>
                        </>
                    )}

                </ul>
            </header>

        </header>
    )
}

export default Header