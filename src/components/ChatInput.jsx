import React, { useState, useRef } from 'react'

const ChatInput = ({ sendMessage, loading, isDark }) => {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleSubmit = () => {
    if (!value.trim() && attachments.length === 0) return;
    
    sendMessage({ 
      sender: 'user', 
      message: value.trim(),
      attachments: attachments 
    });
    
    setValue('');
    setAttachments([]);
    setShowOptions(false);
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        setAttachments(prev => [
          ...prev,
          {
            name: file.name,
            mimeType: file.type || (type === 'image' ? 'image/jpeg' : 'application/octet-stream'),
            size: file.size,
            data: base64Data
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const D = isDark;

  return (
    <div className="relative">
      {/* Options popup */}
      {showOptions && (
        <div 
          className={`absolute bottom-full left-0 mb-2 z-50 rounded-xl border p-2 flex flex-col gap-1 shadow-2xl backdrop-blur-md transition-all duration-200
                      ${D 
                        ? 'bg-[#13132b]/95 border-violet-500/30 text-slate-200' 
                        : 'bg-white/95 border-slate-200 text-slate-800'}`}
          style={{ width: '170px' }}
        >
          <button
            type="button"
            onClick={() => { imageInputRef.current?.click(); setShowOptions(false); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left w-full
                        ${D ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => { fileInputRef.current?.click(); setShowOptions(false); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left w-full
                        ${D ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Upload Document
          </button>
        </div>
      )}

      {/* Main input box wrapper */}
      <div className={`flex flex-col rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 border transition-colors duration-200
                      ${D
                        ? 'bg-white/5 border-violet-500/20 backdrop-blur-md focus-within:border-violet-500/50'
                        : 'bg-white border-violet-300/40 shadow-sm focus-within:border-violet-500'}`}>
        
        {/* Hidden File Inputs */}
        <input 
          type="file" 
          ref={imageInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          multiple
          onChange={(e) => handleFileChange(e, 'image')}
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".pdf,.txt,.doc,.docx,.csv,.json"
          multiple
          onChange={(e) => handleFileChange(e, 'file')}
        />

        {/* Selected Attachment Chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2 mb-2 border-b border-violet-500/10 max-h-28 overflow-y-auto">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold max-w-[190px] shrink-0
                            ${D ? 'bg-white/5 border-violet-500/25 text-slate-200' : 'bg-violet-50/50 border-violet-100 text-slate-700'}`}
              >
                {att.mimeType.startsWith('image/') ? (
                  <img 
                    src={`data:${att.mimeType};base64,${att.data}`} 
                    alt={att.name} 
                    className="w-5.5 h-5.5 object-cover rounded-md border border-violet-500/10 shrink-0" 
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <span className="truncate flex-1" title={att.name}>{att.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(idx)}
                  className={`p-0.5 rounded-full transition-colors ${D ? 'hover:bg-white/10 text-slate-400 hover:text-rose-400' : 'hover:bg-slate-200 text-slate-500 hover:text-rose-500'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-end gap-2 w-full">
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
              {/* Plus Button */}
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                aria-label="Attachment options"
                className={`w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 mb-0.5 transition-all duration-200 hover:scale-115 active:scale-90
                           ${D ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`w-5.5 h-5.5 transition-transform duration-200 ${showOptions ? 'rotate-45 text-rose-500' : 'text-violet-400'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {/* Textarea */}
              <textarea
                rows={1}
                value={value}
                onChange={e => {
                  setValue(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSubmit(); 
                  }
                }}
                placeholder="Type your message…"
                style={{ height: 'auto', minHeight: '24px' }}
                className={`flex-1 bg-transparent text-sm resize-none focus:outline-none leading-relaxed
                            overflow-y-auto min-w-0 w-full mb-0.5
                            ${D ? 'text-slate-100 placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'}`}
              />

              {/* Send Button */}
              <button
                onClick={handleSubmit}
                disabled={!value.trim() && attachments.length === 0}
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
      </div>
    </div>
  );
};

export default ChatInput;