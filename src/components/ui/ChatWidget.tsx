import React, { useState, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  // Start with a welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hola 👋 Soy tu asistente. Pregúntame sobre nuestros productos o lo que necesites.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const suggestions = [
    "Recomiéndame un producto",
    "¿Qué ofertas tienen?",
    "¿Tienen camisetas?",
    "¿Cómo puedo hacer un pedido?",
    "Ayúdame a elegir ropa"
  ];

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  // ⭐ NEW: supports forced messages (from suggestion buttons)
  const send = async (forcedMessage?: string) => {
    const text = forcedMessage ?? input.trim();
    if (!text) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    if (!forcedMessage) setInput("");
    setLoading(true);

    let products: any[] = [];

    try {
      const resp = await fetch(
        "https://a2lum56xy0.execute-api.us-east-1.amazonaws.com/productos"
      );
      products = await resp.json();
    } catch {
      console.warn("❗ Product API failed — continuing without product data");
    }

    try {
      const backendResp = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          products,
        }),
      });

      const data = await backendResp.json();

      if (data.assistant) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.assistant.content },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Unexpected server response." },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong, but we can keep chatting.",
        },
      ]);
    }

    setLoading(false);
    setTimeout(scrollToBottom, 50);
  };

  return (
    <>
      {!open && (
        <div
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#0b5cff",
            width: 60,
            height: 60,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer",
            zIndex: 999,
          }}
        >
          💬
        </div>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 360,
            height: "60vh",
            background: "white",
            borderRadius: 12,
            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: 12,
              borderBottom: "1px solid #ddd",
              fontWeight: "bold",
            }}
          >
            Chatbot
            <button style={{ float: "right" }} onClick={() => setOpen(false)}>
              ✖
            </button>
          </div>

          <div
            ref={messagesRef}
            style={{ flex: 1, overflowY: "auto", padding: 12 }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.role === "user" ? "right" : "left",
                  margin: "8px 0",
                }}
              >
                <span
                  style={{
                    background: m.role === "user" ? "#0b5cff" : "#eee",
                    color: m.role === "user" ? "white" : "black",
                    padding: "8px 10px",
                    borderRadius: 8,
                    display: "inline-block",
                    maxWidth: "80%",
                  }}
                >
                  {m.content}
                </span>
              </div>
            ))}

            {/* ⭐ SUGGESTIONS SHOWN ONLY AT START */}
            {messages.length === 1 && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => send(s)}
                    style={{
                      padding: "6px 12px",
                      background: "#0b5cff22",
                      borderRadius: 20,
                      cursor: "pointer",
                      fontSize: 14,
                      border: "1px solid #0b5cff55",
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            {loading && <div style={{ color: "#777" }}>Typing...</div>}
          </div>

          <div style={{ padding: 10, borderTop: "1px solid #ddd" }}>
            <input
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message..."
            />
          </div>
        </div>
      )}
    </>
  );
}
