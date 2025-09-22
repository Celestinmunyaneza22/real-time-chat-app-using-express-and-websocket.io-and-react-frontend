import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // backend

function App() {
  const [userId, setUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const register = () => {
    socket.emit("register", userId);
  };

  const sendMessage = () => {
    socket.emit("private_message", { toUserId, message });
    setMessages((prev) => [...prev, `You to ${toUserId}: ${message}`]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("private_message", (msg) => {
      setMessages((prev) => [...prev, `From someone: ${msg}`]);
    });

    return () => {
      socket.off("private_message");
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Real-time Chat</h2>

      <input
        placeholder="Your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={register}>Register</button>

      <hr />

      <input
        placeholder="Send To User ID"
        value={toUserId}
        onChange={(e) => setToUserId(e.target.value)}
      />
      <input
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <div style={{ marginTop: 20 }}>
        <h4>Messages:</h4>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
