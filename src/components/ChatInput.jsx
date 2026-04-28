import React, { useState } from "react";

const ChatInput = ({ sendMessage, loading, theme }) => {

  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value === "") return;
    sendMessage({ sender: "user", message: value })
    setValue("");
  };

  const bgClass = theme === 'light' ? 'bg-black/10' : 'bg-white/10';
  const filterClass = theme === 'light' ? 'invert opacity-70' : '';

  return (
    <div className={`w-full max-h-40 rounded-lg px-4 py-4 overflow-auto relative ${bgClass}`}>

       {loading ? (
        <img src="./loader.gif" className={`w-8 m-auto ${filterClass}`}/>
       ) : (
         <>
          <textarea
          onKeyDown={(e) => {
          e.keyCode === 13 && e.shiftKey === false && handleSubmit();
          }}
          rows={1}
          className="border-0 bg-transparent outline-none w-11/12"
          value={value}
          type="text"
          onChange={(e) => setValue(e.target.value)} />
 
          <img src="./send.png"
          onClick={handleSubmit}
          width={20}
          alt="send button" className={`absolute top-4 right-3 hover:cursor-pointer ease-in duration-100 hover:scale-125 ${filterClass}`}/>
         </>
       )}
    </div>
  );
};

export default ChatInput