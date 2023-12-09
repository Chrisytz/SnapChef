import {useSelector} from "react-redux";
import '../styles/homepage.css'

function Homepage() {
    const {user} = useSelector((state) => state.auth)

    return (
        <>
            <div className='homepage-welcome-text'>
                <h1>
                    Snap. Cook. Enjoy.
                </h1>
                <h2>
                    Elevate your cooking experience with your personalized culinary companion!
                    Capture and turn snapshots into tasty delights, save your favorite recipes to revisit later, and transform every meal into a delicious memory.
                </h2>
            </div>
            <button className='btn'> Get Started </button>
        </>
    )
}

export default Homepage