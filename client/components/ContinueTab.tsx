<<<<<<< HEAD
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Play, Pause, Square, Loader } from 'lucide-react';
import { marked } from 'marked';
import api from '@/lib/api';

interface ContinueTabProps {
    editor?: any;
}

export default function ContinueTab({ editor }: ContinueTabProps) {
    const { user } = useAuth();
    const params = useParams();
    const projectId = params.projectId as string;
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
    const [generating, setGenerating] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [continuationText, setContinuationText] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [animationSpeed, setAnimationSpeed] = useState(50); // ms per character
    const animationRef = useRef<NodeJS.Timeout | null>(null);
    const indexRef = useRef(0);

    // Typing animation effect
    useEffect(() => {
        if (animating && displayedText.length < continuationText.length) {
            animationRef.current = setTimeout(() => {
                setDisplayedText(continuationText.substring(0, indexRef.current + 1));
                indexRef.current++;
            }, animationSpeed);
        } else if (displayedText.length >= continuationText.length) {
            setAnimating(false);
        }

        return () => {
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, [displayedText, continuationText, animating, animationSpeed]);

    const generateContinuation = async () => {
        if (!editor || !user) return;

        setGenerating(true);
        try {
            const currentText = editor.getText();
            const cursorPosition = editor.state.selection.from;

            const res = await api.post('/ai/continue', {
                currentText,
                cursorPosition,
                projectId,
                length
            }, {
                headers: { 'user-id': user.id }
            });

            setContinuationText(res.data.continuation || '');
            setDisplayedText('');
            indexRef.current = 0;
            setAnimating(true);
        } catch (error) {
            console.error('Failed to generate continuation:', error);
            alert('Failed to generate continuation');
        } finally {
            setGenerating(false);
        }
    };

    const pauseAnimation = () => {
        setAnimating(false);
        if (animationRef.current) clearTimeout(animationRef.current);
    };

    const resumeAnimation = () => {
        if (displayedText.length < continuationText.length) {
            setAnimating(true);
        }
    };

    const stopAnimation = () => {
        setAnimating(false);
        setContinuationText('');
        setDisplayedText('');
        indexRef.current = 0;
        if (animationRef.current) clearTimeout(animationRef.current);
    };



    const insertText = async () => {
        if (!editor || !displayedText) return;

        // Parse Markdown to HTML
        const htmlContent = await marked.parse(displayedText);

        editor.chain()
            .focus()
            .insertContent(htmlContent + ' ')
            .run();

        setContinuationText('');
        setDisplayedText('');
        indexRef.current = 0;
    };

    return (
        <div className="h-full flex flex-col">
            {/* Controls */}
            <div className="p-4 bg-white border-b border-gray-200 space-y-3">
                {/* Length Selector */}
                <div>
                    <label className="text-xs font-medium text-gray-700 block mb-2">Length</label>
                    <div className="flex gap-2">
                        {(['short', 'medium', 'long'] as const).map((len) => (
                            <button
                                key={len}
                                onClick={() => setLength(len)}
                                className={`flex-1 px-3 py-1.5 text-sm rounded capitalize transition-colors ${length === len
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {len}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {length === 'short' && '~50 words'}
                        {length === 'medium' && '~150 words'}
                        {length === 'long' && '~300 words'}
                    </p>
                </div>

                {/* Speed Slider */}
                {continuationText && (
                    <div>
                        <label className="text-xs font-medium text-gray-700 block mb-2">
                            Animation Speed: {Math.round(1000 / animationSpeed)} chars/sec
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="200"
                            value={animationSpeed}
                            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {!continuationText ? (
                        <button
                            onClick={generateContinuation}
                            disabled={generating}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Play size={16} />
                                    Continue Writing
                                </>
                            )}
                        </button>
                    ) : (
                        <>
                            {animating ? (
                                <button
                                    onClick={pauseAnimation}
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Pause size={16} />
                                    Pause
                                </button>
                            ) : (
                                <button
                                    onClick={resumeAnimation}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Play size={16} />
                                    Resume
                                </button>
                            )}
                            <button
                                onClick={stopAnimation}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                <Square size={16} />
                            </button>
                        </>
                    )}
                </div>

                {/* Insert Button */}
                {displayedText && !animating && (
                    <button
                        onClick={insertText}
                        className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Insert Into Editor
                    </button>
                )}
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {displayedText ? (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                            {displayedText}
                            {animating && <span className="inline-block w-0.5 h-4 bg-purple-600 ml-0.5 animate-pulse" />}
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-10 px-4">
                        <p className="text-sm">
                            Click "Continue Writing" to have AI continue your text with matching style and tone.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
=======
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Play, Pause, Square, Loader } from 'lucide-react';
import { marked } from 'marked';
import api from '@/lib/api';

interface ContinueTabProps {
    editor?: any;
}

export default function ContinueTab({ editor }: ContinueTabProps) {
    const { user } = useAuth();
    const params = useParams();
    const projectId = params.projectId as string;
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
    const [generating, setGenerating] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [continuationText, setContinuationText] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [animationSpeed, setAnimationSpeed] = useState(50); // ms per character
    const animationRef = useRef<NodeJS.Timeout | null>(null);
    const indexRef = useRef(0);

    // Typing animation effect
    useEffect(() => {
        if (animating && displayedText.length < continuationText.length) {
            animationRef.current = setTimeout(() => {
                setDisplayedText(continuationText.substring(0, indexRef.current + 1));
                indexRef.current++;
            }, animationSpeed);
        } else if (displayedText.length >= continuationText.length) {
            setAnimating(false);
        }

        return () => {
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, [displayedText, continuationText, animating, animationSpeed]);

    const generateContinuation = async () => {
        if (!editor || !user) return;

        setGenerating(true);
        try {
            const currentText = editor.getText();
            const cursorPosition = editor.state.selection.from;

            const res = await api.post('/ai/continue', {
                currentText,
                cursorPosition,
                projectId,
                length
            }, {
                headers: { 'user-id': user.id }
            });

            setContinuationText(res.data.continuation || '');
            setDisplayedText('');
            indexRef.current = 0;
            setAnimating(true);
        } catch (error) {
            console.error('Failed to generate continuation:', error);
            alert('Failed to generate continuation');
        } finally {
            setGenerating(false);
        }
    };

    const pauseAnimation = () => {
        setAnimating(false);
        if (animationRef.current) clearTimeout(animationRef.current);
    };

    const resumeAnimation = () => {
        if (displayedText.length < continuationText.length) {
            setAnimating(true);
        }
    };

    const stopAnimation = () => {
        setAnimating(false);
        setContinuationText('');
        setDisplayedText('');
        indexRef.current = 0;
        if (animationRef.current) clearTimeout(animationRef.current);
    };



    const insertText = async () => {
        if (!editor || !displayedText) return;

        // Parse Markdown to HTML
        const htmlContent = await marked.parse(displayedText);

        editor.chain()
            .focus()
            .insertContent(htmlContent + ' ')
            .run();

        setContinuationText('');
        setDisplayedText('');
        indexRef.current = 0;
    };

    return (
        <div className="h-full flex flex-col">
            {/* Controls */}
            <div className="p-4 bg-white border-b border-gray-200 space-y-3">
                {/* Length Selector */}
                <div>
                    <label className="text-xs font-medium text-gray-700 block mb-2">Length</label>
                    <div className="flex gap-2">
                        {(['short', 'medium', 'long'] as const).map((len) => (
                            <button
                                key={len}
                                onClick={() => setLength(len)}
                                className={`flex-1 px-3 py-1.5 text-sm rounded capitalize transition-colors ${length === len
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {len}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {length === 'short' && '~50 words'}
                        {length === 'medium' && '~150 words'}
                        {length === 'long' && '~300 words'}
                    </p>
                </div>

                {/* Speed Slider */}
                {continuationText && (
                    <div>
                        <label className="text-xs font-medium text-gray-700 block mb-2">
                            Animation Speed: {Math.round(1000 / animationSpeed)} chars/sec
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="200"
                            value={animationSpeed}
                            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {!continuationText ? (
                        <button
                            onClick={generateContinuation}
                            disabled={generating}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Play size={16} />
                                    Continue Writing
                                </>
                            )}
                        </button>
                    ) : (
                        <>
                            {animating ? (
                                <button
                                    onClick={pauseAnimation}
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Pause size={16} />
                                    Pause
                                </button>
                            ) : (
                                <button
                                    onClick={resumeAnimation}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Play size={16} />
                                    Resume
                                </button>
                            )}
                            <button
                                onClick={stopAnimation}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                <Square size={16} />
                            </button>
                        </>
                    )}
                </div>

                {/* Insert Button */}
                {displayedText && !animating && (
                    <button
                        onClick={insertText}
                        className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Insert Into Editor
                    </button>
                )}
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {displayedText ? (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                            {displayedText}
                            {animating && <span className="inline-block w-0.5 h-4 bg-purple-600 ml-0.5 animate-pulse" />}
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-10 px-4">
                        <p className="text-sm">
                            Click "Continue Writing" to have AI continue your text with matching style and tone.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
