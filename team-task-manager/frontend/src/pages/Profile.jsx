import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>
      
      <div className="card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{user?.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{user?.role}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.role}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
