'use client'

import React, { useState } from 'react';
import { MessageSquare, ChevronDown, Send } from 'lucide-react';
interface Props {
    name: string
}
const ChatInterface = ({ name }: Props) => {
    console.log(name);

    const [selectedNotebook, setSelectedNotebook] = useState('My First Notebook');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const notebooks = [
        'My First Notebook',
        'Work Notes',
        'Project Ideas',
        'Learning Journal'
    ];

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { type: 'user', content: input }]);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]"> {/* Adjust 64px based on your header height */}
            {/* Notebook Selector - Made more compact */}
            <div className="bg-white border-b border-gray-200 py-2 px-4 flex-shrink-0">
                <div className="max-w-2xl mx-auto relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-center space-x-2 mx-auto text-gray-700 hover:text-gray-900 font-medium text-sm"
                    >
                        <span>{selectedNotebook}</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            {notebooks.map((notebook) => (
                                <button
                                    key={notebook}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                                    onClick={() => {
                                        setSelectedNotebook(notebook);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {notebook}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Messages Area - Flexible height */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
                <div className="max-w-2xl mx-auto">
                    {messages.length === 0 ? (
                        <div className="text-center space-y-4"> {/* Reduced spacing */}
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto"> {/* Smaller icon */}
                                <MessageSquare className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-gray-900">Chat with your notes</h3>
                                <div className="space-y-1 text-sm text-gray-500">
                                    <p className='m-2'>"What are the key points from my latest entry?"</p>
                                    <p className='m-2'> "Summarize the content about React components"</p>
                                    <p className='m-2'>"Find all notes related to API development"</p>
                                    <p>"What did I write about database optimization?"</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3"> {/* Reduced message spacing */}
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.type === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="border-t border-gray-200 bg-white p-3 flex-shrink-0">
                <div className="max-w-2xl mx-auto flex items-end space-x-3">
                    <div className="flex-1">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask anything about your notes..."
                            className="w-full resize-none rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-32 text-sm"
                            rows={1}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        className="flex-shrink-0 rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 
                        mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;