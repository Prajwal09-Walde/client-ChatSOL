import { useState, useEffect, useRef } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { fetchResponse } from '../api'
import { API_URL } from '../config'
import ChatInput from './ChatInput'
import Chatbody from './Chatbody'

function ChatUI() {
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [themeInput, setThemeInput] = useState('dark');
  const [theme, setTheme] = useState('dark');
  const [settingsMessage, setSettingsMessage] = useState('');
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
    } else if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setNameInput(parsed.name);
    }
    
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(storedTheme);
    setThemeInput(storedTheme);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mutation = useMutation({
    mutationFn: () => {
      return fetchResponse(chat);
    },
    onSuccess: (data) => {
      if(data.message) {
        setChat((prev) => [...prev, { sender: "ai", message: data.message.replace(/^\n\n/, "") }]);
      } else {
         console.error("No message in response", data);
         setChat((prev) => [...prev, { sender: "ai", message: "Too large for a task to generate" }]);
      }
    },
    onError: (error) => {
       console.error("Mutation error", error);
       setChat((prev) => [...prev, { sender: "ai", message: "hallucination error" }]);
    }
  });

  const sendMessage = async (message) => {
    await Promise.resolve(setChat((prev) => [...prev, message]))
    mutation.mutate();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage("");
    try {
      const res = await fetch(`${API_URL}/api/auth/update-settings`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name: nameInput, password: passwordInput || undefined })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("theme", themeInput);
        setUser(data.user);
        setTheme(themeInput);
        setSettingsMessage("Settings updated successfully!");
        setPasswordInput("");
        setTimeout(() => { setShowSettings(false); setSettingsMessage(""); }, 2000);
      } else {
        setSettingsMessage(data.message || "Failed to update settings");
      }
    } catch(err) {
      setSettingsMessage("Error updating settings");
    }
  };

  const themeClasses = {
    dark: 'bg-[#101035] text-white',
    light: 'bg-slate-100 text-slate-900',
    midnight: 'bg-black text-gray-100'
  };

  return (
    <div className={`${themeClasses[theme] || themeClasses.dark} h-[100dvh] py-4 sm:py-6 relative sm:px-16
     px-4 overflow-hidden flex flex-col justify-between align-middle transition-colors duration-300`}>

      {/* gradient */}
      <div className="gradient-01 z-0 absolute"></div>
      <div className="gradient-02 z-0 absolute"></div>
      <div className="gradient-03 z-0 absolute"></div>
      <div className="gradient-04 z-0 absolute"></div>

      {/* header */}
      <div className="relative z-50 flex justify-between items-center mb-4 p-3 -mt-2 -mx-2 sm:mx-0 sm:mt-0 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-sm">
        <div className="uppercase font-bold text-2xl head ml-2">
          ChatSOL
        </div>
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)} 
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
              <button 
                onClick={() => { setShowSettings(true); setShowDropdown(false); }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>


      {/* body */}
      <div className="h-[90%] overflow-auto w-full max-w-4xl py-8 px-2 sm:px-4 self-center z-10
      scrollbar-thumb-slate-400 scrollbar-thin scrollbar-track-gray-transparent scrollbar-thumb-border-rounded-md flex flex-col">
        {chat.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold opacity-80 text-center leading-relaxed">
              Hello {user?.name},<br/> how can I help you?
            </h1>
          </div>
        ) : (
          <Chatbody chat={chat} />
        )}
      </div>



      {/* input */}
      <div className="w-full max-w-4xl self-center z-10 px-2 sm:px-0">
        <ChatInput sendMessage={sendMessage} loading={mutation.isLoading} theme={theme}/>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm p-4">
          <div className="bg-[#101035] border border-white/20 p-6 rounded-xl w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            {settingsMessage && <div className="bg-blue-500/20 text-blue-200 p-2 rounded mb-4 text-center">{settingsMessage}</div>}
            <form onSubmit={handleUpdateSettings} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Name</label>
                <input 
                  type="text" 
                  value={nameInput} 
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2 rounded bg-black/30 border border-white/10 text-white focus:outline-none focus:border-white/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm opacity-70 mb-1">New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-2 rounded bg-black/30 border border-white/10 text-white focus:outline-none focus:border-white/50"
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm opacity-70 mb-1">Theme</label>
                <select 
                  value={themeInput} 
                  onChange={(e) => setThemeInput(e.target.value)}
                  className="w-full p-2 rounded bg-black/30 border border-white/10 text-white focus:outline-none focus:border-white/50"
                >
                  <option value="dark" className="text-black">Dark Theme</option>
                  <option value="light" className="text-black">Light Theme</option>
                  <option value="midnight" className="text-black">Midnight</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowSettings(false)} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default ChatUI
