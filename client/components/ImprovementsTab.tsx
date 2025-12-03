<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { RefreshCw, Check, X } from 'lucide-react';
import { marked } from 'marked';
import api from '@/lib/api';

interface Improvement {
    id: string;
    type: 'grammar' | 'clarity' | 'style' | 'conciseness';
    original: string;
    improved: string;
    reason: string;
}

interface ImprovementsTabProps {
    editor?: any;
}

export default function ImprovementsTab({ editor }: ImprovementsTabProps) {
    const { user } = useAuth();
    const params = useParams();
    const projectId = params.projectId as string;
    const [improvements, setImprovements] = useState<Improvement[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>('all');

    const generateImprovements = async () => {
        if (!editor || !user) return;

        // Get selected text or current paragraph
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);

        if (!selectedText || selectedText.trim().length === 0) {
            alert('Please select some text to improve');
            return;
        }

        setLoading(true);
        try {
            // Get context before and after
            const contextBefore = editor.state.doc.textBetween(Math.max(0, from - 200), from);
            const contextAfter = editor.state.doc.textBetween(to, Math.min(editor.state.doc.content.size, to + 200));

            const res = await api.post('/ai/improvements', {
                selectedText,
                contextBefore,
                contextAfter,
                projectId,
                maxSuggestions: 10
            }, {
                headers: { 'user-id': user.id }
            });

            setImprovements(res.data.improvements || []);
        } catch (error) {
            console.error('Failed to generate improvements:', error);
            alert('Failed to generate improvements');
        } finally {
            setLoading(false);
        }
    };



    const applyImprovement = async (improvement: Improvement) => {
        if (!editor) return;

        // Parse Markdown to HTML
        const htmlContent = await marked.parse(improvement.improved);

        // Find and replace the selected text
        const { from, to } = editor.state.selection;
        editor.chain()
            .focus()
            .setTextSelection({ from, to })
            .insertContent(htmlContent)
            .run();

        // Remove this improvement from the list
        setImprovements(prev => prev.filter(imp => imp.id !== improvement.id));
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'grammar': return 'bg-red-50 text-red-600 border-red-200';
            case 'clarity': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'style': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'conciseness': return 'bg-green-50 text-green-600 border-green-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const filteredImprovements = filter === 'all'
        ? improvements
        : improvements.filter(imp => imp.type === filter);

    return (
        <div className="h-full flex flex-col">
            {/* Controls */}
            <div className="p-4 bg-white border-b border-gray-200">
                <button
                    onClick={generateImprovements}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Analyzing...' : 'Analyze Selected Text'}
                </button>

                {improvements.length > 0 && (
                    <div className="mt-3 flex gap-2 text-xs">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                        >
                            All ({improvements.length})
                        </button>
                        {['grammar', 'clarity', 'style', 'conciseness'].map(type => {
                            const count = improvements.filter(imp => imp.type === type).length;
                            if (count === 0) return null;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-2 py-1 rounded capitalize ${filter === type ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                                >
                                    {type} ({count})
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Improvements List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredImprovements.length === 0 && !loading && (
                    <div className="text-center text-gray-500 mt-10 px-4">
                        <p className="text-sm">Select text in the editor and click "Analyze Selected Text" to get improvement suggestions.</p>
                    </div>
                )}

                {filteredImprovements.map((improvement) => (
                    <div
                        key={improvement.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded border capitalize ${getTypeColor(improvement.type)}`}>
                                {improvement.type}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <X size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700 line-through">{improvement.original}</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-900 font-medium">{improvement.improved}</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-600 mt-2 italic">{improvement.reason}</p>

                        <button
                            onClick={() => applyImprovement(improvement)}
                            className="mt-3 w-full bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                        >
                            Apply This Improvement
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
=======
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { RefreshCw, Check, X } from 'lucide-react';
import { marked } from 'marked';
import api from '@/lib/api';

interface Improvement {
    id: string;
    type: 'grammar' | 'clarity' | 'style' | 'conciseness';
    original: string;
    improved: string;
    reason: string;
}

interface ImprovementsTabProps {
    editor?: any;
}

export default function ImprovementsTab({ editor }: ImprovementsTabProps) {
    const { user } = useAuth();
    const params = useParams();
    const projectId = params.projectId as string;
    const [improvements, setImprovements] = useState<Improvement[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>('all');

    const generateImprovements = async () => {
        if (!editor || !user) return;

        // Get selected text or current paragraph
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);

        if (!selectedText || selectedText.trim().length === 0) {
            alert('Please select some text to improve');
            return;
        }

        setLoading(true);
        try {
            // Get context before and after
            const contextBefore = editor.state.doc.textBetween(Math.max(0, from - 200), from);
            const contextAfter = editor.state.doc.textBetween(to, Math.min(editor.state.doc.content.size, to + 200));

            const res = await api.post('/ai/improvements', {
                selectedText,
                contextBefore,
                contextAfter,
                projectId,
                maxSuggestions: 10
            }, {
                headers: { 'user-id': user.id }
            });

            setImprovements(res.data.improvements || []);
        } catch (error) {
            console.error('Failed to generate improvements:', error);
            alert('Failed to generate improvements');
        } finally {
            setLoading(false);
        }
    };



    const applyImprovement = async (improvement: Improvement) => {
        if (!editor) return;

        // Parse Markdown to HTML
        const htmlContent = await marked.parse(improvement.improved);

        // Find and replace the selected text
        const { from, to } = editor.state.selection;
        editor.chain()
            .focus()
            .setTextSelection({ from, to })
            .insertContent(htmlContent)
            .run();

        // Remove this improvement from the list
        setImprovements(prev => prev.filter(imp => imp.id !== improvement.id));
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'grammar': return 'bg-red-50 text-red-600 border-red-200';
            case 'clarity': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'style': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'conciseness': return 'bg-green-50 text-green-600 border-green-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const filteredImprovements = filter === 'all'
        ? improvements
        : improvements.filter(imp => imp.type === filter);

    return (
        <div className="h-full flex flex-col">
            {/* Controls */}
            <div className="p-4 bg-white border-b border-gray-200">
                <button
                    onClick={generateImprovements}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Analyzing...' : 'Analyze Selected Text'}
                </button>

                {improvements.length > 0 && (
                    <div className="mt-3 flex gap-2 text-xs">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                        >
                            All ({improvements.length})
                        </button>
                        {['grammar', 'clarity', 'style', 'conciseness'].map(type => {
                            const count = improvements.filter(imp => imp.type === type).length;
                            if (count === 0) return null;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-2 py-1 rounded capitalize ${filter === type ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                                >
                                    {type} ({count})
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Improvements List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredImprovements.length === 0 && !loading && (
                    <div className="text-center text-gray-500 mt-10 px-4">
                        <p className="text-sm">Select text in the editor and click "Analyze Selected Text" to get improvement suggestions.</p>
                    </div>
                )}

                {filteredImprovements.map((improvement) => (
                    <div
                        key={improvement.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded border capitalize ${getTypeColor(improvement.type)}`}>
                                {improvement.type}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <X size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700 line-through">{improvement.original}</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-900 font-medium">{improvement.improved}</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-600 mt-2 italic">{improvement.reason}</p>

                        <button
                            onClick={() => applyImprovement(improvement)}
                            className="mt-3 w-full bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                        >
                            Apply This Improvement
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
