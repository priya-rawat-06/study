import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, User } from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, StudyPlan } from '../types';

interface AITutorChatProps {
  plan: StudyPlan;
  topicContext?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({
  plan,
  topicContext,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello! I'm your AI Study Coach for **${plan.subject}**. How can I help you? Ask me to explain a concept in simpler terms, solve a problem step-by-step, or generate additional practice questions!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/study-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: plan.subject,
          topicContext: topicContext || plan.notesMarkdown.slice(0, 1000),
          message: currentInput,
          history: messages
        })
      });

      if (!res.ok) {
        throw new Error('Chat failed');
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || 'I am ready to help you with your next question!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'ai',
          text: '⚠️ Sorry, I ran into an error generating a response. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-stone-200 shadow-xl flex flex-col animate-slide-left">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50 text-stone-900 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E07A5F] flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm">AI Study Coach</h3>
            <p className="text-[11px] text-stone-500 font-medium truncate max-w-[200px]">{plan.subject}</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1.5 rounded-lg bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200/70 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF6F0]/50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 text-xs ${
              msg.sender === 'user' ? 'bg-[#E07A5F] border-[#E07A5F] text-white' : 'bg-amber-100 border-amber-200 text-amber-900'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[82%] p-3 rounded-2xl border text-xs space-y-1 ${
              msg.sender === 'user'
                ? 'bg-[#E07A5F] border-[#E07A5F] text-white rounded-tr-none'
                : 'bg-white border-stone-200 text-stone-800 rounded-tl-none shadow-xs'
            }`}>
              <div className="markdown-body">
                <Markdown>{msg.text}</Markdown>
              </div>
              <span className={`text-[9px] block text-right mt-1 ${msg.sender === 'user' ? 'text-amber-100' : 'text-stone-400'}`}>{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-100/80 border border-amber-200 p-2.5 rounded-xl w-max animate-pulse">
            <Sparkles className="w-4 h-4 text-[#E07A5F]" />
            <span>Tutor is generating explanation...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-t border-stone-200 bg-stone-50 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
        {[
          'Explain ELI5',
          'Give 1 practice problem',
          'Summarize key formulas',
          'How to remember this?'
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setInput(prompt)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 transition-all whitespace-nowrap shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSend} className="p-3 border-t border-stone-200 bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask tutor any question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#E07A5F] shadow-2xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#d0694e] text-white disabled:opacity-50 transition-all shadow-xs"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
};


