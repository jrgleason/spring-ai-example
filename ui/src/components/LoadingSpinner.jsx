import React from 'react';
import {Loader2} from 'lucide-react';

export const LoadingSpinner = () => (
    <div className="flex justify-start mb-4">
        <div className="bg-gray-100 rounded-lg px-4 py-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500"/>
        </div>
    </div>
);