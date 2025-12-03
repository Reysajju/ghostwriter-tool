<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Sparkles, ArrowRight } from 'lucide-react';
import { marked } from 'marked';
import api from '@/lib/api';

interface StyleTabProps {
    editor?: any;
}

interface StyleOption {
    name: string;
    description: string;
}

export default function StyleTab({ editor }: StyleTabProps) {
    const { user } = useAuth();
    const params = useParams();
    const projectId = params.projectId as string;
    const [analyzing, setAnalyzing] = useState(false);
    const [rewriting, setRewriting] = useState(false);
    const [currentStyle, setCurrentStyle] = useState('');
    const [suggestedStyles, setSuggestedStyles] = useState<StyleOption[]>([]);
    const [customStyle, setCustomStyle] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [rewrittenText, setRewrittenText] = useState('');

    const commonPresets = [
        { name: 'Formal', description: 'Professional and structured' },
        { name: 'Casual', description: 'Friendly and conversational' },
        { name: 'Academic', description: 'Scholarly and analytical' },
        { name: 'Creative', description: 'Artistic and imaginative' },
        { name: 'Poetic', description: 'Lyrical and expressive' },
        { name: 'Journalistic', description: 'Objective and factual' }
    ];

    const analyzeStyle = async () => {
        if (!editor || !user) return;

        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);

        if (!text || text.trim().length === 0) {
            alert('Please select some text to analyze');
            return;
        }

        setSelectedText(text);
        setAnalyzing(true);
        try {
            const res = await api.post('/ai/analyze-style', {
                text
            }, {
                headers: { 'user-id': user.id }
            });

            setCurrentStyle(res.data.currentStyle || 'Unknown');
            setSuggestedStyles(res.data.suggestedStyles || []);
        } catch (error) {
            console.error('Failed to analyze style:', error);
            alert('Failed to analyze style');
        } finally {
            setAnalyzing(false);
        }
    };

    const rewriteInStyle = async (targetStyle: string) => {
        if (!selectedText || !user) return;

        setRewriting(true);
        setRewrittenText('');
        try {
            const res = await api.post('/ai/rewrite-style', {
                text: selectedText,
                targetStyle,
                projectId
            }, {
                headers: { 'user-id': user.id }
            });

            setRewrittenText(res.data.rewrittenText || '');
        } catch (error) {
            console.error('Failed to rewrite style:', error);
            alert('Failed to rewrite in new style');
        } finally {
            setRewriting(false);
        }
    };





    const applyRewrite = async () => {
        if (!editor || !rewrittenText) return;

        // Parse Markdown to HTML
        const htmlContent = await marked.parse(rewrittenText);

        const { from, to } = editor.state.selection;
        editor.chain()
            .focus()
            .setTextSelection({ from, to })
            .insertContent(htmlContent)
            .run();

        setRewrittenText('');
        setSelectedText('');
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Analyze Button */}
            <div className="p-4 bg-white border-b border-gray-200">
                <button
                    onClick={analyzeStyle}
                    disabled={analyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    <Sparkles size={16} className={analyzing ? 'animate-spin' : ''} />
                    {analyzing ? 'Analyzing...' : 'Analyze Selected Text'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Current Style */}
                {currentStyle && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-purple-700 mb-1">Current Style</p>
                        <p className="text-sm text-purple-900">{currentStyle}</p>
                    </div>
                )}

                {/* AI Suggested Styles */}
                {suggestedStyles.length > 0 && (
                    <div>
                        <h3 className="text-xs font-medium text-gray-700 mb-2">AI Suggested Styles</h3>
                        <div className="space-y-2">
                            {suggestedStyles.map((style, index) => (
                                <button
                                    key={index}
                                    onClick={() => rewriteInStyle(style.name)}
                                    disabled={rewriting}
                                    className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:border-purple-400 hover:shadow-sm transition-all disabled:opacity-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">{style.name}</p>
                                            <p className="text-xs text-gray-600">{style.description}</p>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-400" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Common Presets */}
                <div>
                    <h3 className="text-xs font-medium text-gray-700 mb-2">Common Styles</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {commonPresets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => rewriteInStyle(preset.name)}
                                disabled={!selectedText || rewriting}
                                className="text-left bg-white border border-gray-200 rounded-lg p-2 hover:border-purple-400 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <p className="font-medium text-sm text-gray-900">{preset.name}</p>
                                <p className="text-xs text-gray-600">{preset.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Style Input */}
                <div>
                    <h3 className="text-xs font-medium text-gray-700 mb-2">Custom Style</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customStyle}
                            onChange={(e) => setCustomStyle(e.target.value)}
                            placeholder="e.g., Shakespearean, Scientific, Humorous"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={() => {
                                if (customStyle.trim()) {
                                    rewriteInStyle(customStyle);
                                }
                            }}
                            disabled={!selectedText || !customStyle.trim() || rewriting}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                {/* Preview & Apply */}
                {rewrittenText && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-2">Original</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{selectedText}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-2">Rewritten</p>
                            <p className="text-sm text-gray-900 bg-purple-50 p-2 rounded">{rewrittenText}</p>
                        </div>
                        <button
                            onClick={applyRewrite}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Apply to Editor
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!currentStyle && !selectedText && (
                    <div className="text-center text-gray-500 mt-10 px-4">
                        <p className="text-sm">
                            Select text and click "Analyze" to discover its style and explore rewrite options.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
=======
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Sparkles, ArrowRight } from 'lucide-react';
import { marked } from 'marked';
import api from '@/lib/api';

interface StyleTabProps {
    editor?: any;
}

interface StyleOption {
    name: string;
    description: string;
}

export default function StyleTab({ editor }: StyleTabProps) {
    const { user } = useAuth();
    const params = useParams();
    const projectId = params.projectId as string;
    const [analyzing, setAnalyzing] = useState(false);
    const [rewriting, setRewriting] = useState(false);
    const [currentStyle, setCurrentStyle] = useState('');
    const [suggestedStyles, setSuggestedStyles] = useState<StyleOption[]>([]);
    const [customStyle, setCustomStyle] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [rewrittenText, setRewrittenText] = useState('');

    const commonPresets = [
        { name: 'Formal', description: 'Professional and structured' },
        { name: 'Casual', description: 'Friendly and conversational' },
        { name: 'Academic', description: 'Scholarly and analytical' },
        { name: 'Creative', description: 'Artistic and imaginative' },
        { name: 'Poetic', description: 'Lyrical and expressive' },
        { name: 'Journalistic', description: 'Objective and factual' }
    ];

    const analyzeStyle = async () => {
        if (!editor || !user) return;

        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);

        if (!text || text.trim().length === 0) {
            alert('Please select some text to analyze');
            return;
        }

        setSelectedText(text);
        setAnalyzing(true);
        try {
            const res = await api.post('/ai/analyze-style', {
                text
            }, {
                headers: { 'user-id': user.id }
            });

            setCurrentStyle(res.data.currentStyle || 'Unknown');
            setSuggestedStyles(res.data.suggestedStyles || []);
        } catch (error) {
            console.error('Failed to analyze style:', error);
            alert('Failed to analyze style');
        } finally {
            setAnalyzing(false);
        }
    };

    const rewriteInStyle = async (targetStyle: string) => {
        if (!selectedText || !user) return;

        setRewriting(true);
        setRewrittenText('');
        try {
            const res = await api.post('/ai/rewrite-style', {
                text: selectedText,
                targetStyle,
                projectId
            }, {
                headers: { 'user-id': user.id }
            });

            setRewrittenText(res.data.rewrittenText || '');
        } catch (error) {
            console.error('Failed to rewrite style:', error);
            alert('Failed to rewrite in new style');
        } finally {
            setRewriting(false);
        }
    };





    const applyRewrite = async () => {
        if (!editor || !rewrittenText) return;

        // Parse Markdown to HTML
        const htmlContent = await marked.parse(rewrittenText);

        const { from, to } = editor.state.selection;
        editor.chain()
            .focus()
            .setTextSelection({ from, to })
            .insertContent(htmlContent)
            .run();

        setRewrittenText('');
        setSelectedText('');
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Analyze Button */}
            <div className="p-4 bg-white border-b border-gray-200">
                <button
                    onClick={analyzeStyle}
                    disabled={analyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    <Sparkles size={16} className={analyzing ? 'animate-spin' : ''} />
                    {analyzing ? 'Analyzing...' : 'Analyze Selected Text'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Current Style */}
                {currentStyle && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-purple-700 mb-1">Current Style</p>
                        <p className="text-sm text-purple-900">{currentStyle}</p>
                    </div>
                )}

                {/* AI Suggested Styles */}
                {suggestedStyles.length > 0 && (
                    <div>
                        <h3 className="text-xs font-medium text-gray-700 mb-2">AI Suggested Styles</h3>
                        <div className="space-y-2">
                            {suggestedStyles.map((style, index) => (
                                <button
                                    key={index}
                                    onClick={() => rewriteInStyle(style.name)}
                                    disabled={rewriting}
                                    className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:border-purple-400 hover:shadow-sm transition-all disabled:opacity-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">{style.name}</p>
                                            <p className="text-xs text-gray-600">{style.description}</p>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-400" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Common Presets */}
                <div>
                    <h3 className="text-xs font-medium text-gray-700 mb-2">Common Styles</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {commonPresets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => rewriteInStyle(preset.name)}
                                disabled={!selectedText || rewriting}
                                className="text-left bg-white border border-gray-200 rounded-lg p-2 hover:border-purple-400 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <p className="font-medium text-sm text-gray-900">{preset.name}</p>
                                <p className="text-xs text-gray-600">{preset.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Style Input */}
                <div>
                    <h3 className="text-xs font-medium text-gray-700 mb-2">Custom Style</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customStyle}
                            onChange={(e) => setCustomStyle(e.target.value)}
                            placeholder="e.g., Shakespearean, Scientific, Humorous"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={() => {
                                if (customStyle.trim()) {
                                    rewriteInStyle(customStyle);
                                }
                            }}
                            disabled={!selectedText || !customStyle.trim() || rewriting}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                {/* Preview & Apply */}
                {rewrittenText && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-2">Original</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{selectedText}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-2">Rewritten</p>
                            <p className="text-sm text-gray-900 bg-purple-50 p-2 rounded">{rewrittenText}</p>
                        </div>
                        <button
                            onClick={applyRewrite}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Apply to Editor
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!currentStyle && !selectedText && (
                    <div className="text-center text-gray-500 mt-10 px-4">
                        <p className="text-sm">
                            Select text and click "Analyze" to discover its style and explore rewrite options.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
