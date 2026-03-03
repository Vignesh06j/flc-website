'use client'

import { useState, useEffect, useCallback } from 'react'

type View = 'loading' | 'login' | 'dashboard'

export default function AdminPage() {
  const [view, setView] = useState<View>('loading')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [playlistId, setPlaylistId] = useState('')
  const [draftPlaylistId, setDraftPlaylistId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const fetchPlaylistId = useCallback(async () => {
    const res = await fetch('/api/admin/channel')
    if (res.ok) {
      const data = (await res.json()) as { playlistId: string }
      setPlaylistId(data.playlistId)
      setDraftPlaylistId(data.playlistId)
      setView('dashboard')
    } else {
      setView('login')
    }
  }, [])

  useEffect(() => {
    fetchPlaylistId()
  }, [fetchPlaylistId])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      setPassword('')
      await fetchPlaylistId()
    } else {
      setLoginError('Incorrect password.')
      setPassword('')
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setView('login')
    setPlaylistId('')
    setDraftPlaylistId('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMessage('')

    const res = await fetch('/api/admin/channel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlistId: draftPlaylistId }),
    })

    if (res.ok) {
      setPlaylistId(draftPlaylistId)
      setSaveMessage('Saved!')
    } else {
      setSaveMessage('Failed to save. Please try again.')
    }

    setSaving(false)
  }

  if (view === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm animate-pulse">Loading…</p>
      </div>
    )
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-1 text-gray-900">Admin</h1>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to manage site settings.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
          >
            Sign out
          </button>
        </div>

        {/* YouTube Playlist ID card */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            YouTube Playlist ID
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Used to fetch videos on the Sermons page.
          </p>

          {playlistId && (
            <p className="text-xs text-gray-400 mb-4">
              Current:{' '}
              <span className="font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                {playlistId}
              </span>
            </p>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label
                htmlFor="playlistId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Playlist ID
              </label>
              <input
                id="playlistId"
                type="text"
                value={draftPlaylistId}
                onChange={(e) => {
                  setDraftPlaylistId(e.target.value)
                  setSaveMessage('')
                }}
                placeholder="PLxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                spellCheck={false}
              />
            </div>

            {saveMessage && (
              <p
                className={`text-sm ${
                  saveMessage === 'Saved!'
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                {saveMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || draftPlaylistId === playlistId}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
