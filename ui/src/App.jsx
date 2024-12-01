import React from 'react';
import ChatInterface from './components/ChatInterface.jsx';
import {StateProvider} from "./state/StateProvider.jsx";

function App() {
    console.log("Starting");
    return (
        <StateProvider>
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        Chat Interface
                    </h1>
                    <ChatInterface/>
                </div>
            </div>
        </StateProvider>
    );
}

export default App;