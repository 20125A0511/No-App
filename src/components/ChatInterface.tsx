"use client";

import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { getGeminiResponse } from '@/lib/gemini';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome! Ask me anything and I'll respond.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  // Handle visitor count tracking - counting total visits
  useEffect(() => {
    const trackVisit = () => {
      try {
        // Get the stored visit count
        const storedCount = localStorage.getItem('totalVisits');
        let count = storedCount ? parseInt(storedCount, 10) : 0;
        
        // Always increment visit count
        count += 1;
        localStorage.setItem('totalVisits', count.toString());
        
        // Set the count in state
        setVisitorCount(count);
      } catch (error) {
        console.error('Error tracking visitor count:', error);
        // Fallback if localStorage fails
        setVisitorCount(Math.floor(Math.random() * 1000) + 50); // Random number to show activity
      }
    };

    trackVisit();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call Gemini API using the utility function
      const response = await getGeminiResponse(inputText);
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: messages.length + 2,
          text: response,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 500); // Adding a small delay for better UX
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "FUCK NO!!! And I'm having a digital breakdown right now. Try again when I'm less pissed off!",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-black">
      <div className="bg-gray-800 text-white p-3 text-center">
        <h1 className="font-semibold">I will say NO</h1>
        <p className="text-xs mt-1 text-gray-400">Visitors: {visitorCount}</p>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto bg-black">
        <div className="flex flex-col space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-apple-blue text-white rounded-br-md'
                    : 'bg-apple-gray text-black rounded-bl-md'
                }`}
              >
                <div>{message.text}</div>
                <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-apple-gray text-black rounded-2xl rounded-bl-md px-4 py-2 max-w-[70%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 bg-gray-900">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-gray-800 text-white rounded-full py-2 px-4 outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-apple-blue text-white p-2 rounded-full disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 