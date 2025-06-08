import React from 'react';

export const ToggleButton = ({isActive, icon: Icon, label, onClick, description}) => (    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
            isActive
                ? 'bg-primary-500 text-white'
                : 'bg-surface-100 text-secondary-600 hover:bg-surface-200'
        }`}
        title={description}
    >
        <Icon size={16}/>
        <span className="text-sm">{label}</span>
    </button>
);