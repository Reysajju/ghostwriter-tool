<<<<<<< HEAD
'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Music, Video, Plus, X, File, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Resource {
    id: string;
    name: string;
    type: 'text' | 'audio' | 'video' | 'pdf';
    status: 'analyzing' | 'ready' | 'error';
    url?: string;
}

interface ResourcePanelProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function ResourcePanel({ isOpen, onClose }: ResourcePanelProps = {}) {
    const params = useParams();
    const projectId = params.projectId as string;
    const [resources, setResources] = useState<Resource[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Mock upload handling
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = (files: File[]) => {
        const newResources = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: getFileType(file.type),
            status: 'analyzing' as const,
        }));
        setResources([...resources, ...newResources]);

        // Simulate analysis completion
        setTimeout(() => {
            setResources(prev => prev.map(r =>
                newResources.find(nr => nr.id === r.id) ? { ...r, status: 'ready' } : r
            ));
        }, 2000);
    };

    const getFileType = (mimeType: string): Resource['type'] => {
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType === 'application/pdf') return 'pdf';
        return 'text';
    };

    const getIcon = (type: Resource['type']) => {
        switch (type) {
            case 'audio': return <Music size={18} className="text-purple-500" />;
            case 'video': return <Video size={18} className="text-blue-500" />;
            case 'pdf': return <FileText size={18} className="text-red-500" />;
            default: return <File size={18} className="text-gray-500" />;
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200 w-80">
            <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="font-semibold text-gray-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        Resources
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                            {resources.length}
                        </span>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Upload Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isDragging
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="file"
                        multiple
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Plus size={20} />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Upload Files</p>
                        <p className="text-xs text-gray-500 mt-1">Drag & drop or click</p>
                    </label>
                </div>

                {/* Resource List */}
                <div className="space-y-2">
                    {resources.map((resource) => (
                        <div
                            key={resource.id}
                            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        {getIcon(resource.type)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                                            {resource.name}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                                            {resource.status === 'analyzing' && (
                                                <span className="text-xs text-amber-600 flex items-center">
                                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1 animate-pulse" />
                                                    Analyzing...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setResources(resources.filter(r => r.id !== resource.id))}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
=======
'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Music, Video, Plus, X, File, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Resource {
    id: string;
    name: string;
    type: 'text' | 'audio' | 'video' | 'pdf';
    status: 'analyzing' | 'ready' | 'error';
    url?: string;
}

interface ResourcePanelProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function ResourcePanel({ isOpen, onClose }: ResourcePanelProps = {}) {
    const params = useParams();
    const projectId = params.projectId as string;
    const [resources, setResources] = useState<Resource[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Mock upload handling
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = (files: File[]) => {
        const newResources = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: getFileType(file.type),
            status: 'analyzing' as const,
        }));
        setResources([...resources, ...newResources]);

        // Simulate analysis completion
        setTimeout(() => {
            setResources(prev => prev.map(r =>
                newResources.find(nr => nr.id === r.id) ? { ...r, status: 'ready' } : r
            ));
        }, 2000);
    };

    const getFileType = (mimeType: string): Resource['type'] => {
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType === 'application/pdf') return 'pdf';
        return 'text';
    };

    const getIcon = (type: Resource['type']) => {
        switch (type) {
            case 'audio': return <Music size={18} className="text-purple-500" />;
            case 'video': return <Video size={18} className="text-blue-500" />;
            case 'pdf': return <FileText size={18} className="text-red-500" />;
            default: return <File size={18} className="text-gray-500" />;
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200 w-80">
            <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="font-semibold text-gray-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        Resources
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                            {resources.length}
                        </span>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Upload Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isDragging
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="file"
                        multiple
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Plus size={20} />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Upload Files</p>
                        <p className="text-xs text-gray-500 mt-1">Drag & drop or click</p>
                    </label>
                </div>

                {/* Resource List */}
                <div className="space-y-2">
                    {resources.map((resource) => (
                        <div
                            key={resource.id}
                            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        {getIcon(resource.type)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                                            {resource.name}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                                            {resource.status === 'analyzing' && (
                                                <span className="text-xs text-amber-600 flex items-center">
                                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1 animate-pulse" />
                                                    Analyzing...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setResources(resources.filter(r => r.id !== resource.id))}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
