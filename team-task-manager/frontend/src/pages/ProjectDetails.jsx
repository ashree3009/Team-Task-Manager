import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`)
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
        <p className="mt-2 text-gray-600">{project.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-medium mb-4">Tasks</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks assigned to this project yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {tasks.map(task => (
                  <li key={task._id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-medium mb-4">Team Members</h2>
            <ul className="space-y-3">
              {project.teamMembers.map(member => (
                <li key={member._id} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </li>
              ))}
              {project.teamMembers.length === 0 && (
                <p className="text-sm text-gray-500">No members assigned.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
