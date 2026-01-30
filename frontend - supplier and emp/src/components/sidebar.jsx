import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaShoppingCart, 
  FaBox, 
  FaTruck, 
  FaUsers, 
  FaFileInvoice, 
  FaChartBar, 
  FaCog, 
  FaUserTie, 
  FaUserFriends,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`fixed h-screen shadow-xl bg-gradient-to-b from-gray-900 to-black transition-all duration-300 ${
      isMinimized ? 'w-20' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="py-6 bg-gradient-to-r from-gray-900 to-black border-b border-gray-700">
          <div className={`flex items-center ${isMinimized ? 'justify-center' : 'justify-between'} px-4`}>
            {!isMinimized && (
              <h1 className="text-2xl text-white">Mandela</h1>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {isMinimized ? <FaBars size={20} /> : <FaTimes size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1 px-3 py-4">
            <li>
              <Link 
                to="/admin/dashboard" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/dashboard') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Dashboard"
              >
                <FaHome size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/orders') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Orders"
              >
                <FaShoppingCart size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Orders</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/products') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Products"
              >
                <FaBox size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Products</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/supplier-orders" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/supplier-orders') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Supplier Orders"
              >
                <FaTruck size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Supplier Orders</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/customer" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/customer') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Regular Customers"
              >
                <FaUsers size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Regular Customers</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/supplier-management" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/supplier-management') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Supplier Management"
              >
                <FaUserTie size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Supplier Management</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/employee-management" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/employee-management') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Employee Management"
              >
                <FaUserFriends size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Employee Management</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/invoice" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/invoice') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Invoice"
              >
                <FaFileInvoice size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Invoice</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/reports" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/reports') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Reports"
              >
                <FaChartBar size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Reports</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/settings" 
                className={`flex items-center ${isMinimized ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
                  isActive('/admin/settings') 
                    ? 'bg-gray-800 text-white border-l-4 border-gray-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title="Settings"
              >
                <FaCog size={20} className={!isMinimized && 'mr-3'} />
                {!isMinimized && <span className="font-medium">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;  /* Chrome, Safari and Opera */
          }
        `}</style>
      </div>
    </div>
  );
};

export default Sidebar;
