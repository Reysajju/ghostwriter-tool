<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface ProfileMenuProps {
    onEditProfile: () => void;
}

export default function ProfileMenu({ onEditProfile }: ProfileMenuProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth');
    };

    const getInitials = () => {
        if (!user?.email) return 'U';
        return user.email.substring(0, 2).toUpperCase();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials()}
                </div>
                <ChevronDown size={16} className="text-gray-600" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                            <p className="text-xs text-gray-500 mt-1">User ID: {user?.id?.substring(0, 8)}...</p>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onEditProfile();
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                            <User size={16} />
                            <span>Edit Profile</span>
                        </button>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                            <Settings size={16} />
                            <span>Settings</span>
                        </button>

                        <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
=======
'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface ProfileMenuProps {
    onEditProfile: () => void;
}

export default function ProfileMenu({ onEditProfile }: ProfileMenuProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth');
    };

    const getInitials = () => {
        if (!user?.email) return 'U';
        return user.email.substring(0, 2).toUpperCase();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials()}
                </div>
                <ChevronDown size={16} className="text-gray-600" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                            <p className="text-xs text-gray-500 mt-1">User ID: {user?.id?.substring(0, 8)}...</p>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onEditProfile();
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                            <User size={16} />
                            <span>Edit Profile</span>
                        </button>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                            <Settings size={16} />
                            <span>Settings</span>
                        </button>

                        <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
