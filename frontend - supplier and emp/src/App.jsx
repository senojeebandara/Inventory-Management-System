import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";  
import Login from "./pages/Login";
import AuthPage from "./pages/Auth";
import EmployeePOS from "./pages/EmployeePOS";



function App() {

  return (
    <Router>  

      <Routes>
        {/* First, show the authentication page */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<Login />} />
        {/* After authentication, load pages with Sidebar */}
        <Route path="/admin/*" element={<AdminLayout />} />

        <Route path="/employeePOS" element={<EmployeePOS />} /> 
        

      </Routes>
    </Router>
  );
}

export default App
