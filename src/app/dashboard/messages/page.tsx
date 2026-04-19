"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface Conversation {
  conversationId: string;
  lastMessage: { content: string; createdAt: string; sender: string };
  unreadCount: number;
  otherUser: { _id: string; name: string; role: string; trustScore: number } | null;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Right side form state
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { 
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const handleSend = async () => {
    if (!message.trim() || !receiverId) return;
    setSending(true);
    try {
      await fetch("/api/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, content: message }),
      });
      setMessage("");
      await fetchConversations();
    } catch {} finally { setSending(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in-up w-full">
      {/* Dark Hero */}
      <div className="bg-[#1D2424] rounded-[32px] p-10 lg:p-14 w-full shadow-md">
        <p className="text-[#A1A1AA] text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">INTERACTION / MESSAGING</p>
        <h1 className="text-[3rem] md:text-[3.5rem] font-bold text-white leading-[1.05] mb-5 tracking-tight max-w-4xl">
          Keep support moving through direct communication.
        </h1>
        <p className="text-[#A1A1AA] text-[15px] max-w-2xl leading-relaxed">
          Basic messaging gives helpers and requesters a clear follow-up path once a match happens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Left Column: Recent messages */}
        <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col min-h-[500px]">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">CONVERSATION STREAM</p>
          <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight mb-8">
            Recent messages
          </h2>

          <div className="space-y-4">
            {conversations.length > 0 ? conversations.map((conv) => {
              const isMine = conv.lastMessage.sender === user?.id;
              const senderName = isMine ? (user?.name || "Me") : (conv.otherUser?.name || "Unknown");
              const receiverName = isMine ? (conv.otherUser?.name || "Unknown") : (user?.name || "Me");
              
              const date = new Date(conv.lastMessage.createdAt);
              let hours = date.getHours();
              const minutes = date.getMinutes().toString().padStart(2, "0");
              const ampm = hours >= 12 ? "PM" : "AM";
              hours = hours % 12;
              hours = hours ? hours : 12; 
              const timeStr = `${hours.toString().padStart(2, "0")}:${minutes}`;

              return (
                <div key={conv.conversationId} className="bg-white border border-gray-100 rounded-[24px] p-6 flex gap-4 items-center shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-[#1A202C] mb-2 truncate">
                      {senderName} → {receiverName}
                    </p>
                    <p className="text-[14px] text-gray-500 line-clamp-2 leading-relaxed">
                      {conv.lastMessage.content}
                    </p>
                  </div>
                  <div className="bg-[#E6F7F5] text-[#0D9488] rounded-full w-14 h-14 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[13px] font-bold leading-tight">{timeStr}</span>
                    <span className="text-[10px] font-bold leading-tight mt-0.5">{ampm}</span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-[15px] text-gray-500 py-4">No recent messages.</p>
            )}
          </div>
        </div>

        {/* Right Column: Send message */}
        <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col min-h-[500px]">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">SEND MESSAGE</p>
          <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight mb-8">
            Start a<br />conversation
          </h2>

          <div className="space-y-6 flex-1">
            <div>
              <label className="block text-[13px] font-bold text-[#1A202C] mb-2">To</label>
              <div className="relative">
                <select 
                  value={receiverId} onChange={(e) => setReceiverId(e.target.value)}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-[20px] text-[#1A202C] text-[14px] appearance-none focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none transition-all shadow-sm cursor-pointer"
                >
                  <option value="" disabled>Select a user</option>
                  {conversations.map(c => c.otherUser && (
                    <option key={c.otherUser._id} value={c.otherUser._id}>{c.otherUser.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Message</label>
              <textarea 
                value={message} onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Share support details, ask for files, or suggest next steps."
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-[20px] text-[#1A202C] text-[14px] focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none transition-all shadow-sm resize-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <button 
              onClick={handleSend} disabled={sending || !message.trim() || !receiverId} 
              className="w-full py-4 bg-[#0D9488] text-white font-semibold rounded-full hover:bg-teal-600 transition-all shadow-sm disabled:opacity-50 text-[15px] cursor-pointer flex items-center justify-center"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
