import { useState } from "react";
import { Send, MessageSquare, Megaphone, Sparkles } from "lucide-react";

const timestamp = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const GroupChat = ({ role, userName }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: "system", text: "🌱 Crop planning updated", time: timestamp() },
    { id: 2, type: "announcement", text: "Harvest begins Monday morning.", author: "Leader", time: timestamp() },
    { id: 3, type: "chat", text: "When should irrigation begin?", author: "Ravi", time: timestamp() },
  ]);
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "chat",
        text: draft.trim(),
        author: userName || "You",
        time: timestamp(),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[28px] p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-green-700">Group Chat</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Operational Conversation</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
          <MessageSquare size={16} /> Live
        </div>
      </div>

      <div className="mt-6 space-y-3 max-h-[340px] overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message.id} className={`rounded-3xl p-4 ${message.type === "system" ? "bg-slate-100 text-slate-700" : message.type === "announcement" ? "bg-green-50 border border-green-200 text-slate-900" : "bg-white border border-slate-200"}`}>
            <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
              <span>{message.type === "system" ? "System" : message.type === "announcement" ? "Announcement" : message.author}</span>
              <span>{message.time}</span>
            </div>
            <p className="mt-2 text-sm leading-6">{message.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Send an operational update..."
          className="w-full resize-none border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-500"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">Keep messages focused on farming operations.</span>
          <button onClick={sendMessage} className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;