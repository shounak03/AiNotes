'use client'

import React, { useEffect, useState } from 'react';
import { MessageSquare, ChevronDown, Send } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Props {
    name: string
}

interface NotebookData {
    id: number
    name: string
}

interface Message {
    content: string
    type: 'user' | 'assistant'
}

const ChatInterface = ({ name }: Props) => {
    const [selectedNotebook, setSelectedNotebook] = useState('Select Notebook');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [input, setInput] = useState('');
    const [data, setData] = useState<NotebookData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getNotebooks = async () => {
        try {
            const response = await fetch('/api/notebook');
            if (!response.ok) {
                throw new Error('Failed to fetch notebooks');
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            toast.error('Failed to load notebooks');
            console.error('Error fetching notebooks:', error);
        }
    }

    useEffect(() => {
        getNotebooks();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        if (selectedNotebook === 'Select Notebook') {
            toast.error('Please select a notebook first');
            return;
        }
    
        const selectedNotebookId = data.find((notebook) => notebook.name === selectedNotebook)?.id;
        if (!selectedNotebookId) {
            toast.error('Invalid notebook selection');
            return;
        }
    
        setIsLoading(true);
        const userMessage = { content: input, type: 'user' as const };
        setMessages(prev => [...prev, userMessage]);
        setInput(''); // Clear input immediately after sending
        
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage], // Send full conversation history
                    notebookId: selectedNotebookId
                })
            });
    
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
    
            const data = await res.json();
            
            setMessages(prev => [...prev, {
                content: data.response,
                type: 'assistant'
            }]);
        } catch (error) {
            toast.error('Failed to get response');
            console.error('Error in chat:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-86px)]">
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
                            {data?.map((notebook) => (
                                <button
                                    key={notebook?.id}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                                    onClick={() => {
                                        setSelectedNotebook(notebook?.name);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {notebook?.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
                <div className="max-w-2xl mx-auto">
                    {messages.length === 0 ? (
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquare className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-gray-900">Chat with your notes</h3>
                                <div className="space-y-1 text-sm text-gray-500">
                                    <p className="m-2">"What are the key points from my latest entry?"</p>
                                    <p className="m-2">"Summarize the content about React components"</p>
                                    <p className="m-2">"Find all notes related to API development"</p>
                                    <p className="m-2">"What did I write about database optimization?"</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                            message.type === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white shadow-sm border border-gray-100'
                                        }`}
                                    >
                                        {message.type === 'user' ? (
                                            <p className="text-sm">{message.content}</p>
                                        ) : (
                                            <div className="prose prose-sm max-w-none text-gray-700">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                                                        h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                                                        h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                                                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                                        code: ({ inline, children }) => 
                                                            inline ? (
                                                                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-gray-800">{children}</code>
                                                            ) : (
                                                                <code className="block bg-gray-100 p-2 rounded-md text-sm text-gray-800 whitespace-pre-wrap">{children}</code>
                                                            ),
                                                        blockquote: ({ children }) => (
                                                            <blockquote className="border-l-4 border-gray-200 pl-4 italic my-2">{children}</blockquote>
                                                        ),
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white shadow-sm border border-gray-100">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

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
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim() || selectedNotebook === 'Select Notebook'}
                        className="flex-shrink-0 rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 
                        disabled:bg-blue-300 disabled:cursor-not-allowed
                        mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;