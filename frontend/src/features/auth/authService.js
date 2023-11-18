import axios from 'axios'

const API_URL = 'http://localhost:4000/api/users/'

// register user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData)

    if (response.data) {
        // local storage is a web storage API provided by web browsers
        // data stored in localStorage remains available even when the user closes the browser and reopens it later
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const logout = () => {
    localStorage.removeItem('user')
}

const authService = {
    register,
    login,
    logout
}

export default authService
