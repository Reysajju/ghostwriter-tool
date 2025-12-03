<<<<<<< HEAD
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResourcePanel from '@/components/ResourcePanel';
import Editor from '@/components/Editor';
import SuggestionPanel from '@/components/SuggestionPanel';
import ProfileMenu from '@/components/ProfileMenu';
import ProfileModal from '@/components/ProfileModal';
import api from '@/lib/api';
import { Share2, Download, ChevronLeft, Menu, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function EditorPage() {
    const params = useParams();
    const projectId = params.projectId;
    const [project, setProject] = useState<any>(null);
    const [content, setContent] = useState('');
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Mobile sidebar states
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    // Auto-save effect
    useEffect(() => {
        if (!content || !projectId) return;

        setSaveStatus('unsaved');

        const timeoutId = setTimeout(async () => {
            setSaveStatus('saving');
            try {
                await api.put(`/projects/${projectId}`, { content });
                setSaveStatus('saved');
                setLastSaved(new Date());
            } catch (error) {
                console.error('Failed to save:', error);
                setSaveStatus('unsaved');
            }
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [content, projectId]);

    const fetchProject = async () => {
        try {
            const res = await api.get(`/projects/${projectId}`);
            setProject(res.data);

            const savedContent = res.data.content || res.data.settings?.content || '';
            if (savedContent) {
                setContent(savedContent);
            }
        } catch (error) {
            console.error(error);
            setProject({ id: projectId, title: 'Untitled Project', description: 'Draft' });
        }
    };

    const getSaveStatusText = () => {
        if (saveStatus === 'saving') return 'Saving...';
        if (saveStatus === 'unsaved') return 'Unsaved changes';
        if (lastSaved) return `Last saved ${lastSaved.toLocaleTimeString()}`;
        return 'All changes saved';
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Left Sidebar - Responsive */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30 w-80
                transform transition-transform duration-300 ease-in-out
                lg:transform-none
                ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <ResourcePanel
                    isOpen={leftSidebarOpen}
                    onClose={() => setLeftSidebarOpen(false)}
                />
            </aside>

            {/* Overlay for mobile */}
            {leftSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setLeftSidebarOpen(false)}
                />
            )}

            {/* Main Content - Editor */}
            <main className="flex-1 flex flex-col h-full relative min-w-0 bg-gray-50">
                <header className="bg-white border-b px-4 lg:px-6 py-3 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        {/* Mobile hamburger for left sidebar */}
                        <button
                            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                            <Menu size={20} />
                        </button>

                        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                            <ChevronLeft size={20} />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-base lg:text-lg font-bold text-gray-800 leading-tight truncate">
                                {project?.title || 'Loading...'}
                            </h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                {saveStatus === 'saving' && <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />}
                                {saveStatus === 'saved' && <span className="w-2 h-2 rounded-full bg-green-400" />}
                                {saveStatus === 'unsaved' && <span className="w-2 h-2 rounded-full bg-gray-400" />}
                                <span className="hidden sm:inline">{getSaveStatusText()}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 lg:space-x-3">
                        <button className="flex items-center space-x-2 px-2 lg:px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                            <Download size={16} />
                            <span className="hidden md:inline">Export</span>
                        </button>
                        <button className="flex items-center space-x-2 px-2 lg:px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm">
                            <Share2 size={16} />
                            <span className="hidden md:inline">Share</span>
                        </button>

                        {/* Mobile hamburger for right sidebar */}
                        <button
                            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-purple-100 rounded transition-colors text-purple-600"
                        >
                            <Sparkles size={20} />
                        </button>

                        <div className="h-6 w-px bg-gray-200 mx-2 hidden lg:block" />
                        <div className="hidden lg:block">
                            <ProfileMenu onEditProfile={() => setIsProfileModalOpen(true)} />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden p-4 lg:p-8 flex justify-center">
                    <div className="w-full max-w-4xl h-full flex flex-col">
                        <Editor
                            content={content}
                            onChange={setContent}
                            onEditorReady={setEditorInstance}
                        />
                    </div>
                </div>
            </main>

            {/* Right Sidebar - Responsive */}
            <aside className={`
                fixed lg:static inset-y-0 right-0 z-30 w-80 lg:w-96
                transform transition-transform duration-300 ease-in-out
                lg:transform-none
                ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                <SuggestionPanel
                    editor={editorInstance}
                    isOpen={rightSidebarOpen}
                    onClose={() => setRightSidebarOpen(false)}
                />
            </aside>

            {/* Overlay for mobile right sidebar */}
            {rightSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setRightSidebarOpen(false)}
                />
            )}

            {/* Modals */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
}
=======
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResourcePanel from '@/components/ResourcePanel';
import Editor from '@/components/Editor';
import SuggestionPanel from '@/components/SuggestionPanel';
import ProfileMenu from '@/components/ProfileMenu';
import ProfileModal from '@/components/ProfileModal';
import api from '@/lib/api';
import { Share2, Download, ChevronLeft, Menu, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function EditorPage() {
    const params = useParams();
    const projectId = params.projectId;
    const [project, setProject] = useState<any>(null);
    const [content, setContent] = useState('');
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Mobile sidebar states
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    // Auto-save effect
    useEffect(() => {
        if (!content || !projectId) return;

        setSaveStatus('unsaved');

        const timeoutId = setTimeout(async () => {
            setSaveStatus('saving');
            try {
                await api.put(`/projects/${projectId}`, { content });
                setSaveStatus('saved');
                setLastSaved(new Date());
            } catch (error) {
                console.error('Failed to save:', error);
                setSaveStatus('unsaved');
            }
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [content, projectId]);

    const fetchProject = async () => {
        try {
            const res = await api.get(`/projects/${projectId}`);
            setProject(res.data);

            const savedContent = res.data.content || res.data.settings?.content || '';
            if (savedContent) {
                setContent(savedContent);
            }
        } catch (error) {
            console.error(error);
            setProject({ id: projectId, title: 'Untitled Project', description: 'Draft' });
        }
    };

    const getSaveStatusText = () => {
        if (saveStatus === 'saving') return 'Saving...';
        if (saveStatus === 'unsaved') return 'Unsaved changes';
        if (lastSaved) return `Last saved ${lastSaved.toLocaleTimeString()}`;
        return 'All changes saved';
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Left Sidebar - Responsive */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30 w-80
                transform transition-transform duration-300 ease-in-out
                lg:transform-none
                ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <ResourcePanel
                    isOpen={leftSidebarOpen}
                    onClose={() => setLeftSidebarOpen(false)}
                />
            </aside>

            {/* Overlay for mobile */}
            {leftSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setLeftSidebarOpen(false)}
                />
            )}

            {/* Main Content - Editor */}
            <main className="flex-1 flex flex-col h-full relative min-w-0 bg-gray-50">
                <header className="bg-white border-b px-4 lg:px-6 py-3 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        {/* Mobile hamburger for left sidebar */}
                        <button
                            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                            <Menu size={20} />
                        </button>

                        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                            <ChevronLeft size={20} />
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-base lg:text-lg font-bold text-gray-800 leading-tight truncate">
                                {project?.title || 'Loading...'}
                            </h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                {saveStatus === 'saving' && <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />}
                                {saveStatus === 'saved' && <span className="w-2 h-2 rounded-full bg-green-400" />}
                                {saveStatus === 'unsaved' && <span className="w-2 h-2 rounded-full bg-gray-400" />}
                                <span className="hidden sm:inline">{getSaveStatusText()}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 lg:space-x-3">
                        <button className="flex items-center space-x-2 px-2 lg:px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                            <Download size={16} />
                            <span className="hidden md:inline">Export</span>
                        </button>
                        <button className="flex items-center space-x-2 px-2 lg:px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm">
                            <Share2 size={16} />
                            <span className="hidden md:inline">Share</span>
                        </button>

                        {/* Mobile hamburger for right sidebar */}
                        <button
                            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-purple-100 rounded transition-colors text-purple-600"
                        >
                            <Sparkles size={20} />
                        </button>

                        <div className="h-6 w-px bg-gray-200 mx-2 hidden lg:block" />
                        <div className="hidden lg:block">
                            <ProfileMenu onEditProfile={() => setIsProfileModalOpen(true)} />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden p-4 lg:p-8 flex justify-center">
                    <div className="w-full max-w-4xl h-full flex flex-col">
                        <Editor
                            content={content}
                            onChange={setContent}
                            onEditorReady={setEditorInstance}
                        />
                    </div>
                </div>
            </main>

            {/* Right Sidebar - Responsive */}
            <aside className={`
                fixed lg:static inset-y-0 right-0 z-30 w-80 lg:w-96
                transform transition-transform duration-300 ease-in-out
                lg:transform-none
                ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                <SuggestionPanel
                    editor={editorInstance}
                    isOpen={rightSidebarOpen}
                    onClose={() => setRightSidebarOpen(false)}
                />
            </aside>

            {/* Overlay for mobile right sidebar */}
            {rightSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setRightSidebarOpen(false)}
                />
            )}

            {/* Modals */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
