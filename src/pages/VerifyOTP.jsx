import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VerifyOTP() {
  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle input change untuk format 6 digit
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Hanya angka
    if (value.length <= 6) {
      setVerificationCode(value)
      setError('')
    }
  }

  // Handle paste untuk auto-format
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '')
    if (pastedData.length <= 6) {
      setVerificationCode(pastedData)
      setError('')
    }
  }

  // Verify OTP code
  const handleVerify = async (e) => {
    e.preventDefault()

    if (verificationCode.length !== 6) {
      setError('Kode verifikasi harus 6 digit')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const email = localStorage.getItem('loginEmail')

      let endpoint = `${process.env.PREFIX_BACKEND_URL}/user/verify-tfa`

      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          token: verificationCode,
          email: email
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Clear session storage
        localStorage.removeItem('pendingLogin')
        localStorage.removeItem('loginEmail')

        // Update token jika ada token baru
        if (result.accessToken) {
          localStorage.setItem('accessToken', result.accessToken)
        }

        alert('Verifikasi berhasil!')
        navigate('/users')
      } else {
        setError(result.message || 'Kode verifikasi salah. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back to login
  const handleBackToLogin = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('pendingLogin')
    localStorage.removeItem('loginEmail')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Logo atau icon */}
          <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            Verifikasi Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan kode 6 digit dari aplikasi Google Authenticator Anda
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Kode Verifikasi
              </label>
              <div className="relative">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  autoFocus
                />

                {/* Loading indicator */}
                {isLoading && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>

              {/* Hint */}
              <p className="mt-2 text-xs text-gray-500 text-center">
                Buka Google Authenticator dan masukkan kode yang ditampilkan
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Verify Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Kembali ke Login
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Butuh bantuan?</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Pastikan waktu di smartphone Anda tepat</li>
              <li>• Kode berubah setiap 30 detik</li>
              <li>• Gunakan kode terbaru yang ditampilkan</li>
              <li>• Jika masih bermasalah, coba kirim ulang kode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}