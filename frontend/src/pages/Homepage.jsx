import {useSelector} from "react-redux";
import '../styles/homepage.css'
import { Link } from 'react-router-dom';

function Homepage() {
    const {user} = useSelector((state) => state.auth)

    return (
        <>
            <div className='homepage-welcome-text' style={{height: '100vh'}}>
                <h1>
                    Snap. Cook. Enjoy.
                </h1>
                <h2>
                    Elevate your cooking experience with your personalized culinary companion!
                    Capture and turn snapshots into tasty delights, save your favorite recipes to revisit later, and transform every meal into a delicious memory.
                </h2>
                <Link to={user? '/image' : '/login'}>
                    <button className='homepage-btn'> Get Started </button>
                </Link>
            </div>

        </>
    )
}

export default Homepage