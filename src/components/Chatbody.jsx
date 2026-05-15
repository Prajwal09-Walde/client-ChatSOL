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