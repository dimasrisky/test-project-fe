import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code';

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [twoFALoading, setTwoFALoading] = useState(false)
  const [otpAuthUrl, setOtpAuthUrl] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:3000/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          address: userData.address || ''
        })
        setTwoFAEnabled(userData.isTfa)
        setOtpAuthUrl(userData.otpAuthUrl || '')
      } else {
        console.error('Failed to fetch profile')
        navigate('/login')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3000/user/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: 'PUT',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setIsEditing(false)
        alert('Profile updated successfully!')
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || ''
      })
    }
    setIsEditing(false)
  }

  const handleToggle2FA = async () => {
    if(!twoFAEnabled){
      setTwoFALoading(true)
      try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('http://localhost:3000/user/enable-tfa', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          method: 'GET',
        })

        if (response.ok) {
          const result = await response.json()
          setTwoFAEnabled(result.isTfa)
          setOtpAuthUrl(result.otpauthUrl || '')
        } else {
          alert('Failed to update 2FA settings')
        }
      } catch (error) {
        console.error('Error toggling 2FA:', error)
        alert('Error updating 2FA settings')
      } finally {
        setTwoFALoading(false)
      }
    }else{
      setTwoFALoading(true)
      try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('http://localhost:3000/user/disable-tfa', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          method: 'GET',
        })

        if (response.ok) {
          const result = await response.json()
          setTwoFAEnabled(result.isTfa)
          setOtpAuthUrl('')
        } else {
          alert('Failed to update 2FA settings')
        }
      } catch (error) {
        console.error('Error toggling 2FA:', error)
        alert('Error updating 2FA settings')
      } finally {
        setTwoFALoading(false)
      }
    }
  }

  console.log(otpAuthUrl);

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <div className="flex items-center space-x-4">
                <Link
                  to="/users"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View All Users
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-6 mb-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-gray-600">User ID: #{user?.id}</p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        !isEditing ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        !isEditing ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      !isEditing ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder="Enter your address"
                  />
                </div>
              </form>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Two-Factor Authentication (2FA)</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button
                    onClick={handleToggle2FA}
                    disabled={twoFALoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      twoFAEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    } ${twoFALoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        twoFAEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    {twoFALoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                      </div>
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      twoFAEnabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {twoFAEnabled ? '2FA Enabled' : '2FA Disabled'}
                  </span>
                </div>

                {twoFAEnabled && otpAuthUrl && (
                  <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                    <h5 className="text-base font-semibold text-gray-900 mb-4">
                      Scan this QR Code with your Authenticator App
                    </h5>

                    <div className="flex justify-center">
                      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                        <QRCode value={otpAuthUrl || ''} size={200} />
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-600">
                      Open <span className="font-medium text-gray-800">Google Authenticator</span> or{' '}
                      <span className="font-medium text-gray-800">Authy</span> to scan this code.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}