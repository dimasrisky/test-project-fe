export async function refreshToken(sessionId, refreshToken){
    const response = await fetch(`${import.meta.env.VITE_PREFIX_BACKEND_URL}/auth/refresh-token`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ sessionId, refreshToken })
    })
}