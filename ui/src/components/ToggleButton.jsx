import React from 'react';

export const ToggleButton = ({ isActive, icon: Icon, label, onClick, description }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
            isActive
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title={description}
    >
        <Icon size={16} />
        <span className="text-sm">{label}</span>
    </button>
);