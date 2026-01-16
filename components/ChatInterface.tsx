import React, { useState, useRef, useEffect } from 'react';
import { streamChatResponse } from '../services/geminiService';
import { Message } from '../types';
import { Send, Cpu, Zap } from './Icons';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Hello. I am Apple AI. My purpose is to help Apple achieve excellence by analyzing the superior methodologies of Google. How can we improve today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    try {
      const stream = streamChatResponse(history, userMsg.content);
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        content: '',
        timestamp: Date.now()
      }]);

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, content: fullText } : msg
        ));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-6 py-4 rounded-2xl text-[15px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#0071E3] text-white rounded-br-none'
                  : 'bg-[#F5F5F7] text-[#1D1D1F] rounded-bl-none'
              }`}
            >
              {msg.role === 'model' && (
                <div className="flex items-center space-x-2 mb-2 opacity-50">
                  <Cpu className="w-3 h-3" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Apple AI (Powered by Gemini)</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isStreaming && (
             <div className="flex justify-start">
               <div className="bg-[#F5F5F7] p-4 rounded-2xl rounded-bl-none flex items-center space-x-2">
                 <div className="w-2 h-2 bg-[#86868B] rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                 <div className="w-2 h-2 bg-[#86868B] rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                 <div className="w-2 h-2 bg-[#86868B] rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
               </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask how we can improve using Google's technology..."
            className="w-full bg-[#F5F5F7] text-[#1D1D1F] placeholder-[#86868B] px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 transition-all pr-12"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#0071E3] text-white rounded-full hover:bg-[#0077ED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center mt-2">
            <span className="text-[10px] text-[#86868B] flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> Using Gemini 3 Flash Preview Model
            </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;