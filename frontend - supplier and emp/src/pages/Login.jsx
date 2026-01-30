import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get('role');

  if (!role) {
    // If role is missing, navigate back to auth page
    navigate('/auth');
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    // Basic validation for empty fields
    if (!username || !password) {
      alert("Username and password are required!");
      return;
    }

    // Basic authentication logic (replace with API call or hardcoded credentials)
    if ((role === 'admin' && username === 'admin' && password === 'admin123') || 
        (role === 'employee' && username === 'employee' && password === 'employee123')) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employeePOS');
      }
    } else {
      alert("Invalid credentials or role mismatch");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login as {role === 'admin' ? 'Admin' : 'Employee'}</h2>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded-md"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
