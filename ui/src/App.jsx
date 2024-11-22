import React from 'react';
import ChatInterface from './components/ChatInterface.jsx';
import DeviceStateComponent from "./components/DeviceStateComponent.jsx";

function App() {
    console.log("Starting");
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto">
                {/*<DeviceStateComponent></DeviceStateComponent>*/}
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Chat Interface
                </h1>
                <ChatInterface/>
            </div>
        </div>
    );
}

export default App;