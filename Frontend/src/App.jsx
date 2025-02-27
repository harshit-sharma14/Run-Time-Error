import React from 'react'
import { Route,Routes } from 'react-router-dom'
import { UserContextProvider } from './UserContext'
import Register from './components/Register'
import axios from 'axios'
import Login from './components/Login'
axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true
const App = () => {
  return (
    <UserContextProvider>
      <Routes>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    
    </Routes>
    </UserContextProvider>

  )
}

export default App