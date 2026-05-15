import React, { useState } from 'react'

const ChatInput = ({ sendMessage, loading, isDark }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) return;
    sendMessage({ sender: 'user', message: value.trim() });
    setValue('');
  };

  const D = isDark;

  return (
    <div className={`flex items-end gap-2 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border transition-colors duration-200
                    ${D
                      ? 'bg-white/5 border-violet-500/20 backdrop-blur-md focus-within:border-violet-500/50'
                      : 'bg-white border-violet-300/40 shadow-sm focus-within:border-violet-500'}`}>
      {loading ? (
        <div className="w-full flex items-center justify-center py-2">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
          </div>
        </div>
      ) : (
        <>
          <textarea
            rows={1}
            value={value}
            onChange={e => {
              setValue(e.target.value);
              // Auto-grow textarea
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
            }}
            placeholder="Type your message…"
            style={{ height: 'auto', minHeight: '24px' }}
            className={`flex-1 bg-transparent text-sm resize-none focus:outline-none leading-relaxed
                        overflow-y-auto min-w-0 w-full
                        ${D ? 'text-slate-100 placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'}`}
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            aria-label="Send message"
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center
                       shrink-0 mb-0.5 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200
                       disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95 shadow-md
                       touch-manipulation">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ChatInput;