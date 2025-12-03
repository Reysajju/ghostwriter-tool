<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { error } = await supabase
                .from('user_settings')
                .upsert({ user_id: user.id, gemini_api_key: apiKey });

            if (error) throw error;
            router.push('/');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Setup AI</h2>
                <p className="text-center text-gray-500 mb-6">Enter your Gemini API Key to continue.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gemini API Key</label>
                        <input
                            type="text"
                            required
                            placeholder="AIzaSy..."
                            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Your key is stored securely and used only for your requests.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Get Started'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Skip for Now
                    </button>
                </form>
            </div>
        </div>
    );
}
=======
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { error } = await supabase
                .from('user_settings')
                .upsert({ user_id: user.id, gemini_api_key: apiKey });

            if (error) throw error;
            router.push('/');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Setup AI</h2>
                <p className="text-center text-gray-500 mb-6">Enter your Gemini API Key to continue.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gemini API Key</label>
                        <input
                            type="text"
                            required
                            placeholder="AIzaSy..."
                            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Your key is stored securely and used only for your requests.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Get Started'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Skip for Now
                    </button>
                </form>
            </div>
        </div>
    );
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
