import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Homepage from './pages/Homepage'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/header'
import Recipes from './pages/Recipes'
function App() {
    return (
        <>
            <Router>
                <div className='container'>
                    <Header />
                    <Routes>
                        <Route path='/' element={<Homepage/>}></Route>
                        <Route path='/dashboard' element={<Dashboard/>}></Route>
                        <Route path='/login' element={<Login/>}></Route>
                        <Route path='/register' element={<Register/>}></Route>
                        <Route path='/recipes' element={<Recipes/>}></Route>
                    </Routes>
                </div>
            </Router>
            <ToastContainer/>
        </>
    );
}

export default App;
