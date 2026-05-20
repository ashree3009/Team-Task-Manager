import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [filter, setFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '', project: '', assignedTo: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(tasksRes.data.data);
      setProjects(projectsRes.data.data);
      
      if (user?.role === 'Admin') {
        const usersRes = await api.get('/auth/users');
        setUsers(usersRes.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Task status updated');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, taskForm);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', taskForm);
        toast.success('Task created');
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    }
  };

  const openEditModal = (task) => {
    setEditingId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate.split('T')[0], // format for date input
      project: task.project?._id || '',
      assignedTo: task.assignedTo?._id || ''
    });
    setIsModalOpen(true);
  };

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        {user?.role === 'Admin' && (
          <button onClick={() => {
            setEditingId(null);
            setTaskForm({ title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '', project: projects[0]?._id || '', assignedTo: '' });
            setIsModalOpen(true);
          }} className="btn-primary">
            <PlusIcon className="w-5 h-5 mr-2" /> New Task
          </button>
        )}
      </div>

      <div className="mb-6 flex space-x-2">
        {['All', 'Todo', 'In Progress', 'Completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {user?.role === 'Admin' && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map(task => {
              const isOverdue = task.status !== 'Completed' && new Date(task.dueDate) < new Date();
              return (
              <tr key={task._id} className={isOverdue ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  <div className={`text-sm ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    Due: {new Date(task.dueDate).toLocaleDateString()} {isOverdue && '(Overdue)'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.project?.title || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.assignedTo?.name || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user?.role === 'Admin' || (user?.role === 'Member' && task.assignedTo?._id === user?.id) ? (
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  )}
                </td>
                {user?.role === 'Admin' && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onClick={() => openEditModal(task)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                )}
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <h2 className="text-xl font-medium mb-4">{editingId ? 'Edit Task' : 'Create New Task'}</h2>
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" required value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="input-field" rows="3"></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="input-field">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select value={taskForm.status} onChange={e => setTaskForm({...taskForm, status: e.target.value})} className="input-field">
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input type="date" required value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <select required value={taskForm.project} onChange={e => setTaskForm({...taskForm, project: e.target.value})} className="input-field">
                  <option value="" disabled>Select Project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Assign To</label>
                <select value={taskForm.assignedTo} onChange={e => setTaskForm({...taskForm, assignedTo: e.target.value})} className="input-field">
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
