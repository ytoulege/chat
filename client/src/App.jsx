import { useState } from "react";
import meow from './assets/meow.png';
import ArrowIcon from "./assets/arrow-up.svg?react";
import { useEffect, useRef } from "react";


export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // Auto-resize textarea function
  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'; // max-height: 128px
  };

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Error talking to server" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    //main container 
    <div className="flex flex-col h-screen p-4 max-w-2xl mx-auto w-full">
        {/* title */}
        <div className="flex justify-center mt-4 flex-col items-center">
            <div className="flex justo-center items-center gap-2">
                <img src={meow} alt="meow" className="w-24 h-24 mb-2"/>
                <h1 className="font-sixtyfour-title text-6xl mb-2">Potcho</h1>
            </div>
            <h2 className="roboto-mono-body text-xl mb-4">Talk to Potcho about UX Design!</h2>
        </div>
        {/* chat container */}
        <div className="flex rounded-lg p-4 flex-1 overflow-hidden mb-4 border border-gray-200 flex-col">
            {/* chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center text-center text-gray-500"></div>
                )}
                {messages.map((msg, index) => (
                    <div 
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div 
                            className={`roboto-mono-text text-sm p-3 rounded-lg max-w-[70%] ${
                                msg.role === "user" 
                                ? "bg-[#213547] text-[#FFFBF2]" 
                                : "bg-gray-200 text-gray-800"
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="roboto-mono-text text-sm p-3 rounded-lg max-w-[70%] bg-gray-200 text-gray-800 animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>
            
            {/* input box */}
            <div className="pl-3">
                <div className="flex items-center gap-2">
                    <textarea
                        className="roboto-mono-text text-sm flex-1 px-3 py-3 border border-gray-200 rounded-lg focus:outline-none resize-none min-h-[48px] max-h-32 overflow-y-auto"
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                        }}
                        placeholder="Type your message..."
                        rows={1}
                    />
                    {/* send button */} 
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className={`p-2 rounded-full transition-colors ${
                            input.trim()
                            ? "bg-[#9099A2]" //active when input
                            : "bg-[#B1B7BD]" //inactive when no input
                        }`}
                    >
                        <ArrowIcon className={`w-6 h-6 transition-colors ${
                            input.trim() ? "text-white" : "text-gray-300"
                        }`}
                        />
                    </button>
                </div>
            </div>
            
        </div>
        {/* footer */}
        <div className="text-center text-gray-500 text-sm mb-2 roboto-mono-footer">
            Potcho can be stupid. She is just a cute cat after all! 🐾
        </div>
        
    </div>
    
  );
}
