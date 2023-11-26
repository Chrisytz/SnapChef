import {FaSignInAlt, FaSignOutAlt, FaUser} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

function Homepage() {
    const {user} = useSelector((state) => state.auth)

    return (
        <>
            <h1>
                Welcome to SnapChef :D
            </h1>
            {user ? (
                <>
                    <h3>
                        Click on Dashboard to start generating recipes :D
                    </h3>
                </>
            ) : (
                <>
                    <h3>
                        Login or create an account to start cooking up some recipes uwu
                    </h3>
                    <div>
                        <Link to='/login'>
                            <FaSignInAlt /> Login
                        </Link>
                    </div>
                    <div>
                        <Link to='/register'>
                            <FaUser /> Register
                        </Link>
                    </div>
                </>
            )}
        </>
    )
}

export default Homepage