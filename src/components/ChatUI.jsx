import { useState, useEffect, useRef } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { fetchResponse } from '../api'
import { API_URL } from '../config'
import ChatInput from './ChatInput'
import Chatbody from './Chatbody'

const genId = () => Math.random().toString(36).slice(2, 10);

const dateGroup = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7)  return 'This Week';
  if (diff < 30) return 'This Month';
  return 'Older';
};

const GROUP_ORDER = ['Today','Yesterday','This Week','This Month','Older'];

function ChatUI() {
  const [chat, setChat]                   = useState([]);
  const [user, setUser]                   = useState(null);
  const [showSettings, setShowSettings]   = useState(false);
  const [nameInput, setNameInput]         = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [settingsMsg, setSettingsMsg]     = useState('');
  const [themeMode, setThemeMode]         = useState('system');
  const [isDark, setIsDark]               = useState(true);
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [history, setHistory]             = useState([]);
  const [currentId, setCurrentId]         = useState(null);
  const [isMobile, setIsMobile]           = useState(true);
  const navigate = useNavigate();

  /* ── Bootstrap ─────────────────────────────────────── */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) { const p = JSON.parse(u); setUser(p); setNameInput(p.name); }
    setHistory(JSON.parse(localStorage.getItem('chatHistory') || '[]'));
    setThemeMode(localStorage.getItem('themeMode') || 'system');
    // Open sidebar by default only on desktop
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setSidebarOpen(!mobile);
  }, [navigate]);

  /* ── Track mobile/desktop on resize ───────────────── */
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) setSidebarOpen(true);
      if (mobile && sidebarOpen)  setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen]);

  /* ── Theme ─────────────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    if (themeMode === 'dark')  { setIsDark(true);  return; }
    if (themeMode === 'light') { setIsDark(false); return; }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const h = (e) => setIsDark(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [themeMode]);

  /* ── History helpers ───────────────────────────────── */
  const persistHistory = (updated) => {
    localStorage.setItem('chatHistory', JSON.stringify(updated));
    setHistory(updated);
  };

  const saveChat = (msgs, id) => {
    if (!msgs.length) return;
    const title = msgs.find(m => m.sender === 'user')?.message?.slice(0, 45) || 'New Chat';
    const existing = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const idx = existing.findIndex(h => h.id === id);
    const entry = { id, title, messages: msgs, createdAt: idx >= 0 ? existing[idx].createdAt : new Date().toISOString() };
    if (idx >= 0) existing[idx] = entry; else existing.unshift(entry);
    persistHistory(existing.slice(0, 50));
  };

  const startNew = () => {
    if (chat.length && currentId) saveChat(chat, currentId);
    setChat([]); setCurrentId(null);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const loadChat = (item) => {
    if (chat.length && currentId) saveChat(chat, currentId);
    setChat(item.messages); setCurrentId(item.id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const deleteItem = (e, id) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    persistHistory(updated);
    if (currentId === id) { setChat([]); setCurrentId(null); }
  };

  /* ── Mutation ──────────────────────────────────────── */
  const mutation = useMutation({
    mutationFn: () => fetchResponse(chat),
    onSuccess: (data) => {
      setChat(prev => {
        const msg = data.message?.replace(/^\n\n/, '') || 'No response';
        const updated = [...prev, { sender: 'ai', message: msg }];
        if (currentId) saveChat(updated, currentId);
        return updated;
      });
    },
    onError: () => setChat(prev => [...prev, { sender: 'ai', message: 'Something went wrong. Please try again.' }]),
  });

  const sendMessage = async (message) => {
    let id = currentId;
    if (!id) { id = genId(); setCurrentId(id); }
    setChat(prev => { const updated = [...prev, message]; saveChat(updated, id); return updated; });
    await Promise.resolve();
    mutation.mutate();
  };

  /* ── Settings ──────────────────────────────────────── */
  const handleUpdateSettings = async (e) => {
    e.preventDefault(); setSettingsMsg('');
    try {
      const res  = await fetch(`${API_URL}/api/auth/update-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name: nameInput, password: passwordInput || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user); setSettingsMsg('Updated!'); setPasswordInput('');
        setTimeout(() => { setShowSettings(false); setSettingsMsg(''); }, 1800);
      } else setSettingsMsg(data.message || 'Failed');
    } catch { setSettingsMsg('Error updating settings'); }
  };

  /* ── Grouped history ───────────────────────────────── */
  const grouped = history.reduce((acc, item) => {
    const g = dateGroup(item.createdAt);
    (acc[g] = acc[g] || []).push(item);
    return acc;
  }, {});

  /* ── Theme tokens ──────────────────────────────────── */
  const D          = isDark;
  const bg         = D ? '#0f0f1a' : '#f5f3ff';
  const sbBg       = D ? '#0a0a18' : '#ffffff';
  const sbBorder   = D ? 'border-white/5'   : 'border-slate-200';
  const hdrBorder  = D ? 'border-white/5'   : 'border-slate-200';
  const hdrGlass   = D ? 'bg-white/5 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md';
  const txt        = D ? 'text-slate-100'   : 'text-slate-900';
  const muted      = D ? 'text-slate-400'   : 'text-slate-500';
  const inputCls   = D ? 'input-field'      : 'input-field-light';
  const modalBg    = D ? '#13132b'          : '#ffffff';
  const modalBorder = D ? 'border-violet-500/25' : 'border-slate-200';
  const labelCls   = D ? 'text-slate-400'   : 'text-slate-600';
  const hiItem     = (active) => active
    ? (D ? 'bg-violet-500/15 border border-violet-500/20' : 'bg-violet-100 border border-violet-200')
    : (D ? 'hover:bg-white/5' : 'hover:bg-violet-50');

  const suggestions = ['How does AI work?', 'Explain machine learning', 'Write a cover letter', 'Debug my React code'];

  const SIDEBAR_W = 256; // px

  return (
    /**
     * Layout strategy:
     *  - Outer shell: h-[100dvh] overflow-hidden (locked to viewport, no page scroll)
     *  - Sidebar: always `fixed`, uses translateX to slide in/out (zero layout reflow)
     *  - Main: always full width. On desktop when sidebar open, add margin-left = sidebar width
     *  - Chat body: flex-1 overflow-y-auto (only this area scrolls)
     *  - Input bar: shrink-0, always visible at bottom
     */
    <div className={`relative flex h-[100dvh] overflow-hidden ${txt}`} style={{ background: bg }}>

      {/* ── Gradient blobs (fixed so they don't scroll) ── */}
      {D && <>
        <div className="gradient-01 fixed z-0 pointer-events-none" />
        <div className="gradient-02 fixed z-0 pointer-events-none" />
        <div className="gradient-03 fixed z-0 pointer-events-none" />
        <div className="gradient-04 fixed z-0 pointer-events-none" />
      </>}

      {/* ── Mobile backdrop ──────────────────────────── */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 md:hidden
                    ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* ── Sidebar (always fixed, slides via translateX) ─ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r ${sbBorder}
                    transition-transform duration-300 ease-in-out`}
        style={{
          width: `${SIDEBAR_W}px`,
          background: sbBg,
          transform: sidebarOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_W}px)`,
        }}>

        {/* Top */}
        <div className={`flex items-center justify-between px-4 py-4 border-b ${sbBorder} shrink-0`}>
          <span className="font-extrabold text-base bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            ChatSOL
          </span>
          <button onClick={() => setSidebarOpen(false)}
            className={`p-1.5 rounded-lg transition-colors ${D ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          <button onClick={startNew}
            className="w-full flex items-center justify-center gap-2 btn-primary rounded-lg px-4 py-2.5 text-sm touch-manipulation">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {history.length === 0
            ? <p className={`text-xs ${muted} text-center mt-8`}>No history yet</p>
            : GROUP_ORDER.map(g => !grouped[g] ? null : (
              <div key={g} className="mb-3">
                <p className={`text-[10px] font-semibold uppercase tracking-widest ${muted} px-3 py-1.5`}>{g}</p>
                {grouped[g].map(item => (
                  <div key={item.id} onClick={() => loadChat(item)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors touch-manipulation
                                ${hiItem(currentId === item.id)} ${D ? 'text-slate-300' : 'text-slate-700'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 shrink-0 ${muted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span className="text-xs truncate">{item.title}</span>
                    </div>
                    <button onClick={(e) => deleteItem(e, item.id)}
                      className={`shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
                                  ${D ? 'hover:bg-white/10 text-slate-500 hover:text-rose-400' : 'text-slate-400 hover:text-rose-500'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ))
          }
        </div>

        {/* Footer */}
        <div className={`px-3 py-3 border-t ${sbBorder} shrink-0`}>
          <div onClick={() => setShowSettings(true)}
            className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors touch-manipulation ${D ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{user?.name || 'User'}</p>
              <p className={`text-[10px] ${muted} truncate`}>{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area (always full-width; desktop shifts via margin) ── */}
      <div
        className="flex flex-col w-full min-w-0 relative z-10 transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: sidebarOpen && !isMobile ? `${SIDEBAR_W}px` : '0px' }}>

        {/* Header */}
        <header className={`flex items-center justify-between px-3 sm:px-4 py-3 border-b ${hdrBorder} ${hdrGlass} shrink-0`}>
          <button onClick={() => setSidebarOpen(s => !s)} aria-label="Toggle sidebar"
            className={`p-2 rounded-lg transition-colors touch-manipulation ${D ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            ChatSOL
          </span>

          {/* Theme switcher */}
          <div className={`flex items-center p-1 rounded-lg ${D ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
            {[['light','☀️'],['system','⚙️'],['dark','🌙']].map(([m, icon]) => (
              <button key={m} title={m} onClick={() => setThemeMode(m)}
                className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 touch-manipulation
                  ${themeMode === m
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                    : (D ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}`}>
                {icon}
              </button>
            ))}
          </div>
        </header>

        {/* Chat body — only scrollable region */}
        <div className="flex-1 overflow-y-auto overscroll-contain h-full">
          {chat.length === 0 ? (
            // Welcome screen — vertically centered in available space
            <div className="flex flex-col items-center justify-center h-full gap-5 sm:gap-7 px-4 py-8">
              <div className="text-center">
                <h1 className={`text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${D ? 'text-white/90' : 'text-slate-800'}`}>
                  How can I help you
                  {user && <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">, {user.name}</span>}?
                </h1>
                <p className={`mt-2 sm:mt-3 text-sm ${muted}`}>Start a conversation — ask me anything.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 w-full max-w-sm sm:max-w-md">
                {suggestions.map(s => (
                  <button key={s} onClick={() => sendMessage({ sender: 'user', message: s })}
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm border transition-all duration-200 hover:scale-105 touch-manipulation
                                ${D ? 'border-violet-500/25 bg-violet-500/10 text-slate-300 hover:bg-violet-500/20 hover:border-violet-400/50'
                                    : 'border-violet-300/50 bg-violet-50 text-violet-800 hover:bg-violet-100 hover:border-violet-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
              <Chatbody chat={chat} isDark={isDark} />
            </div>
          )}
        </div>

        {/* Input bar — pinned to bottom, never scrolls away */}
        <div className={`shrink-0 px-3 sm:px-6 py-3 border-t ${hdrBorder} ${hdrGlass}`}>
          <div className="w-full max-w-3xl mx-auto">
            <ChatInput sendMessage={sendMessage} loading={mutation.isLoading} isDark={isDark} />
            <p className={`text-center text-[10px] mt-1.5 ${muted}`}>
              AI can make mistakes. Consider checking important info.
            </p>
          </div>
        </div>
      </div>

      {/* ── Settings Modal ─────────────────────────────── */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-end sm:items-center backdrop-blur-sm">
          <div className={`w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 border ${modalBorder}
                          shadow-2xl max-h-[90vh] overflow-y-auto`} style={{ background: modalBg }}>

            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${D ? 'text-white' : 'text-slate-900'}`}>Settings</h2>
              <button onClick={() => setShowSettings(false)}
                className={`p-1.5 rounded-lg touch-manipulation ${D ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-xl mb-5 ${D ? 'bg-white/5 border border-white/10' : 'bg-violet-50 border border-violet-100'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate ${D ? 'text-slate-100' : 'text-slate-800'}`}>{user?.name}</p>
                <p className={`text-xs truncate ${D ? 'text-slate-400' : 'text-slate-500'}`}>{user?.email}</p>
                <span className={`inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full
                  ${user?.role === 'admin' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                  {user?.role || 'user'}
                </span>
              </div>
            </div>

            {settingsMsg && (
              <div className="bg-violet-500/20 border border-violet-500/30 text-violet-300 p-3 rounded-lg mb-4 text-sm text-center">
                {settingsMsg}
              </div>
            )}

            <form onSubmit={handleUpdateSettings} className="flex flex-col gap-4">
              <div>
                <label className={`block text-xs mb-1.5 font-medium ${labelCls}`}>Display Name</label>
                <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className={`block text-xs mb-1.5 font-medium ${labelCls}`}>
                  New Password <span className="opacity-50">(blank = keep current)</span>
                </label>
                <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className={inputCls} minLength={6} placeholder="Min. 6 characters" />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setShowSettings(false)}
                  className={D ? 'btn-ghost text-sm' : 'px-4 py-2 rounded-lg text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors'}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2 text-sm">Save</button>
              </div>
            </form>

            <div className={`mt-5 pt-4 border-t ${D ? 'border-white/10' : 'border-slate-200'}`}>
              <p className={`text-xs mb-3 ${D ? 'text-slate-500' : 'text-slate-400'}`}>
                Signed in as <span className="font-medium">{user?.email}</span>
              </p>
              <button
                onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                           bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400
                           transition-all duration-200 touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatUI;
