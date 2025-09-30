import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { API_BASE_URL } from '../App'
import { useAuth } from '../context/AuthContext'

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    username:'',
    email:'',
    password:''
  })
  const navigate = useNavigate()

  const {login} = useAuth()


  //handling input
  const handleChange=(e)=>{
    setForm({...form, [e.target.name]:e.target.value})
  }

  //handling api
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const endpoint = isLogin ? 'login':'register'
if (!form.email || !form.password || (!isLogin && !form.username)) {
return toast.error("Please fill require fields")
}
try {
  const res = await axios.post(`${API_BASE_URL}/auth/${endpoint}`, form)
  const {token, userId, username} = res.data
  login(token, userId, username);
  toast.success(isLogin ? "Login successfull !!" : "Signup successfull !!")
  navigate("/")
} catch (error) {
  console.error(error?.response?.data)
  toast.error(error.response?.data?.msg || "Authentication failed, try again")
}
  }

  return (
   <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium ml-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}
