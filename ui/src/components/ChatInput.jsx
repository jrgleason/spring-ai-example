import React from 'react';
import {Loader2, Send} from 'lucide-react';

export const ChatInput = ({message, setMessage, isLoading, onSubmit, mode}) => (
    <form onSubmit={onSubmit} className="flex gap-2">
        <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={mode === 'openai-image'
                ? "Describe the image you want to generate..."
                : "Type your message..."}
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
        />
        <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    Processing...
                </>
            ) : (
                <>
                    <Send size={16}/>
                    Send
                </>
            )}
        </button>
    </form>
);