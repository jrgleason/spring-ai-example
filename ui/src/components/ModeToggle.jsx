import React from 'react';
import { Sparkles, ImageIcon, Bot } from 'lucide-react';
import { ToggleButton } from './ToggleButton';

export const ModeToggle = ({ mode, setMode }) => (
    <div className="flex justify-center gap-4 mb-4">
        <ToggleButton
            isActive={mode === 'openai-chat'}
            icon={Sparkles}
            label="OpenAI Chat"
            onClick={() => setMode('openai-chat')}
            description="Chat with OpenAI's GPT"
        />
        <ToggleButton
            isActive={mode === 'openai-image'}
            icon={ImageIcon}
            label="DALL·E"
            onClick={() => setMode('openai-image')}
            description="Generate images with DALL·E"
        />
        <ToggleButton
            isActive={mode === 'anthropic'}
            icon={Bot}
            label="Claude"
            onClick={() => setMode('anthropic')}
            description="Chat with Anthropic's Claude"
        />
    </div>
);
