import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function PreviewFrame({ srcDoc, previewInNewTab }) {
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <div className="bg-white ml-4 px-3 py-1 text-sm rounded border flex-1 truncate text-gray-600">
                    index.html
                </div>
                <button
                    onClick={previewInNewTab}
                    className="text-xs px-2 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                    <ExternalLink size={14} /> Open
                </button>
            </div>

            {/* Iframe Preview */}
            <iframe
                srcDoc={srcDoc}
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin allow-modals"
                frameBorder="0"
                width="100%"
                height="500px"
            />
        </div>
    );
}
