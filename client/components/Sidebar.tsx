<<<<<<< HEAD
'use client';

import { Folder, Plus } from 'lucide-react';

const Sidebar = ({ projects, onSelectProject }: any) => {
    return (
        <div className="w-64 bg-gray-50 h-full border-r p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Projects</h2>
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <Plus size={20} />
                </button>
            </div>
            <ul className="space-y-2">
                {projects.map((p: any) => (
                    <li key={p.id}>
                        <button onClick={() => onSelectProject(p.id)} className="flex items-center space-x-3 w-full text-left p-3 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-700">
                            <Folder size={18} />
                            <span className="font-medium">{p.title}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
=======
'use client';

import { Folder, Plus } from 'lucide-react';

const Sidebar = ({ projects, onSelectProject }: any) => {
    return (
        <div className="w-64 bg-gray-50 h-full border-r p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Projects</h2>
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <Plus size={20} />
                </button>
            </div>
            <ul className="space-y-2">
                {projects.map((p: any) => (
                    <li key={p.id}>
                        <button onClick={() => onSelectProject(p.id)} className="flex items-center space-x-3 w-full text-left p-3 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-700">
                            <Folder size={18} />
                            <span className="font-medium">{p.title}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
