import React, { useState, useEffect, useRef } from "react";
import { askAIStream } from "../services/api";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Voice typing not supported");
      return;
    }

    recognizer = new SpeechRecognition();
    recognizer.lang = "en-US";
    recognizer.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
    recognizer.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const userInput = input;
    setInput("");
    setIsTyping(true);

    let botText = "";

    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    for await (const chunk of askAIStream(userInput)) {
      botText += chunk;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = botText;
        return updated;
      });
    }

    setIsTyping(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Mene Bot</div>

      <div className="messages-area">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "msg user" : "msg bot"}>
            {msg.text}
          </div>
        ))}

        {isTyping && <div className="typing">Typing...</div>}

        <div ref={messageEndRef} />
      </div>

      <div className="input-area">
        <button className="voice-btn" onClick={startListening}>🎤</button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
