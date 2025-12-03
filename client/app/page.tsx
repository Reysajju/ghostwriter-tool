'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Plus, BookOpen } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects', { headers: { 'user-id': user.id } });
      setProjects(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !user) return;

    setCreating(true);
    try {
      await api.post('/projects', { title: newProjectTitle, description: '', userId: user.id });
      setNewProjectTitle('');
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert('Failed to create project. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-500 mt-1">Manage your books and writing projects</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <Link key={project.id} href={`/editor/${project.id}`}>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer h-52 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <BookOpen size={24} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{project.description || 'No description'}</p>
                  </div>
                  <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-50 flex justify-between">
                    <span>Last edited: {new Date(project.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}

            {projects.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No projects yet</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first book project.</p>
                <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-800 font-medium">Create Project</button>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-bold mb-4">Create New Project</h2>
              <form onSubmit={createProject}>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
