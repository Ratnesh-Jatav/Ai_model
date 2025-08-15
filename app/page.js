"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState("");
  const [streaming, setStreaming] = useState("false");
  const [streamResponse, setStreamResponse] = useState("");

  const handlechat = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      })

      const data = await res.json()
      setResponse(data.response)

    } catch (error) {
      setResponse("An error occurred while processing your request." + error.message)

    }

    setLoading(false);
  };

  const handleStreamChat = async () => {
    setStreaming(true);
    setStreamResponse("");
    try {
      const res = await fetch("/api/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message})
      });
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines= chunk.split("\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setStreamResponse((prev) => prev + data.content);
          }
        }
      }

    } catch (error) {
      setStreamResponse("Error: " + error.message);

    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <h1>AI Project </h1>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }} />
      </div>
      <div>
        <button style={{ padding: "10px 20px", backgroundColor: "green", margin : "10px" }}
          onClick={handlechat} disabled={loading}>
          {loading ? "Loading..." : "Send Message"}
        </button>
         <button style={{ padding: "10px 20px", backgroundColor: "Yellow " }}
          onClick={handleStreamChat} disabled={loading}>
          {loading ? "Loading..." : "Stream Message"}
        </button>
      </div>
      <div style={{
        border: "1px solid #ccc",
        padding: "10px",
        whiteSpace: "pre-wrap",
        fontSize: "28px",
      }}
      >
        {response || "Response will appear here..."}
      </div>
       <div style={{
        border: "1px solid #ccc",
        padding: "10px",
        whiteSpace: "pre-wrap",
        fontSize: "28px",
      }}
      >
        {streamResponse || "streamResponse will appear here..."}
      </div>
    </div>
  );
}
