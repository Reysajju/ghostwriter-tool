<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { Sparkles, Lightbulb, PenTool, Palette, X } from 'lucide-react';
import ImprovementsTab from './ImprovementsTab';
import ContinueTab from './ContinueTab';
import StyleTab from './StyleTab';

interface SuggestionPanelProps {
    editor?: any;
    isOpen?: boolean;
    onClose?: () => void;
}

type TabType = 'improvements' | 'continue' | 'style';

export default function SuggestionPanel({ editor, isOpen, onClose }: SuggestionPanelProps) {
    const [activeTab, setActiveTab] = useState<TabType>('improvements');

    const tabs = [
        { id: 'improvements' as TabType, label: 'Improvements', icon: Lightbulb },
        { id: 'continue' as TabType, label: 'Continue', icon: PenTool },
        { id: 'style' as TabType, label: 'Style', icon: Palette }
    ];

    return (
        <div className="h-full w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="font-semibold text-gray-800 flex items-center justify-between">
                    <span className="flex items-center">
                        <Sparkles size={18} className="text-purple-500 mr-2" />
                        AI Assistant
                    </span>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    )}
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${isActive
                                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'improvements' && <ImprovementsTab editor={editor} />}
                {activeTab === 'continue' && <ContinueTab editor={editor} />}
                {activeTab === 'style' && <StyleTab editor={editor} />}
            </div>
        </div>
    );
}
=======
'use client';

import { useState } from 'react';
import { Sparkles, Lightbulb, PenTool, Palette, X } from 'lucide-react';
import ImprovementsTab from './ImprovementsTab';
import ContinueTab from './ContinueTab';
import StyleTab from './StyleTab';

interface SuggestionPanelProps {
    editor?: any;
    isOpen?: boolean;
    onClose?: () => void;
}

type TabType = 'improvements' | 'continue' | 'style';

export default function SuggestionPanel({ editor, isOpen, onClose }: SuggestionPanelProps) {
    const [activeTab, setActiveTab] = useState<TabType>('improvements');

    const tabs = [
        { id: 'improvements' as TabType, label: 'Improvements', icon: Lightbulb },
        { id: 'continue' as TabType, label: 'Continue', icon: PenTool },
        { id: 'style' as TabType, label: 'Style', icon: Palette }
    ];

    return (
        <div className="h-full w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="font-semibold text-gray-800 flex items-center justify-between">
                    <span className="flex items-center">
                        <Sparkles size={18} className="text-purple-500 mr-2" />
                        AI Assistant
                    </span>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    )}
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${isActive
                                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'improvements' && <ImprovementsTab editor={editor} />}
                {activeTab === 'continue' && <ContinueTab editor={editor} />}
                {activeTab === 'style' && <StyleTab editor={editor} />}
            </div>
        </div>
    );
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
