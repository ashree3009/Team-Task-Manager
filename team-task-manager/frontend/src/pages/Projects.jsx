import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { PlusIcon, TrashIcon, EditIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', teamMembers: [] });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsRes = await api.get('/projects');
      setProjects(projectsRes.data.data);
      
      if (user?.role === 'Admin') {
        const usersRes = await api.get('/auth/users');
        setUsers(usersRes.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, projectForm);
        toast.success('Project updated');
      } else {
        await api.post('/projects', projectForm);
        toast.success('Project created');
      }
      setIsModalOpen(false);
      setProjectForm({ title: '', description: '', teamMembers: [] });
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const openEditModal = (project, e) => {
    e.preventDefault();
    setEditingId(project._id);
    setProjectForm({
      title: project.title,
      description: project.description,
      teamMembers: project.teamMembers.map(m => m._id || m)
    });
    setIsModalOpen(true);
  };

  const handleMemberChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setProjectForm({ ...projectForm, teamMembers: selectedOptions });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        {user?.role === 'Admin' && (
          <button onClick={() => {
            setEditingId(null);
            setProjectForm({ title: '', description: '', teamMembers: [] });
            setIsModalOpen(true);
          }} className="btn-primary">
            <PlusIcon className="w-5 h-5 mr-2" /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link to={`/projects/${project._id}`} key={project._id} className="card p-6 hover:shadow-md transition-shadow relative group">
            <h3 className="text-lg font-medium text-gray-900 pr-16">{project.title}</h3>
            <p className="mt-2 text-sm text-gray-500 line-clamp-3">{project.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {project.teamMembers.length} members
              </span>
              <span className="text-xs text-indigo-600 font-medium">View Details &rarr;</span>
            </div>
            
            {user?.role === 'Admin' && (
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => openEditModal(project, e)} className="text-gray-400 hover:text-indigo-600">
                  <EditIcon className="w-5 h-5" />
                </button>
                <button onClick={(e) => handleDelete(project._id, e)} className="text-gray-400 hover:text-red-600">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </Link>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-medium mb-4">{editingId ? 'Edit Project' : 'Create New Project'}</h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  value={projectForm.description}
                  onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                  className="input-field"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Members (Hold Ctrl/Cmd to select multiple)</label>
                <select
                  multiple
                  value={projectForm.teamMembers}
                  onChange={handleMemberChange}
                  className="input-field min-h-[100px]"
                >
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
