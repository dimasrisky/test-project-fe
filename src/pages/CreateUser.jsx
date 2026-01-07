import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function CreateUser() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return false
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.PREFIX_BACKEND_URL}/user`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          password: formData.password
        })
      })

      const result = await response.json()
      if (response.ok) {
        alert('User created successfully!')
        navigate('/users')
      } else {
        alert('Failed to create user: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Create user failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create New User</h2>
          <p className="text-gray-500 mt-1">Add a new user to the system</p>
          <Link
            to="/users"
            className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to User List
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Enter address"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </button>

            <Link
              to="/users"
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          <p>• All fields are required</p>
          <p>• Email must be unique</p>
          <p>• Password must be at least 6 characters</p>
        </div>
      </div>
    </div>
  )
}
