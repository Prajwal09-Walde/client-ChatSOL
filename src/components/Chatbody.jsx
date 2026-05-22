import React, { useEffect, useRef } from 'react'
import autoAnimate from '@formkit/auto-animate'

const Chatbody = ({ chat, isDark }) => {
  const parent    = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => { parent.current && autoAnimate(parent.current) }, [parent]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) });

  return (
    <div className="flex flex-col gap-3 sm:gap-4 py-2" ref={parent}>
      {chat.map((message, i) => {
        const isAI = message.sender === 'ai';
        return (
          <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'} w-full`}>

            {/* AI avatar */}
            {isAI && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600
                              flex items-center justify-center shrink-0 mr-2 mt-1 shadow-md self-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[85%] sm:max-w-[78%] min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm leading-relaxed
              ${isAI
                ? (isDark
                  ? 'bg-[#1e1b4b]/80 border border-violet-500/20 text-slate-200 rounded-tl-sm'
                  : 'bg-white border border-violet-200/60 text-slate-800 rounded-tl-sm shadow-sm')
                : 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-lg shadow-violet-500/20'
              }`}>
              
              {/* Attachments rendering */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-col gap-2 mb-2 w-full max-w-full overflow-hidden">
                  {/* Images row */}
                  {message.attachments.some(att => att.mimeType.startsWith('image/')) && (
                    <div className="flex flex-wrap gap-2">
                      {message.attachments
                        .filter(att => att.mimeType.startsWith('image/'))
                        .map((att, idx) => (
                          <div key={idx} className="relative group max-w-[200px] max-h-[150px] rounded-lg overflow-hidden border border-white/10 shadow-md">
                            <img 
                              src={`data:${att.mimeType};base64,${att.data}`} 
                              alt={att.name} 
                              className="w-auto h-auto max-w-full max-h-[150px] object-cover transition-transform duration-200 hover:scale-105" 
                            />
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Documents list */}
                  {message.attachments.some(att => !att.mimeType.startsWith('image/')) && (
                    <div className="flex flex-col gap-1.5">
                      {message.attachments
                        .filter(att => !att.mimeType.startsWith('image/'))
                        .map((att, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold w-full max-w-full sm:max-w-xs
                                        ${isAI 
                                          ? (isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800')
                                          : 'bg-white/10 border-white/10 text-white'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-bold" title={att.name}>{att.name}</p>
                              {att.size && (
                                <p className={`text-[10px] font-normal ${isAI ? 'text-slate-400' : 'text-violet-200'}`}>
                                  {(att.size / 1024).toFixed(1)} KB
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Use div+pre for proper word wrapping without horizontal scroll */}
              <div className="overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed min-w-0 w-full">
                  {message.message}
                </pre>
              </div>
              <p className={`text-[10px] mt-1.5 font-medium ${isAI ? (isDark ? 'text-violet-400' : 'text-violet-500') : 'text-violet-200'}`}>
                {isAI ? 'ChatSOL AI' : 'You'}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
};

export default Chatbody;