import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Menu, X, BarChart, Box, List, Settings } from "lucide-react";
import { AuthContext } from "../provider/AuthProvider";

const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const {user, logOut, loading} = useContext(AuthContext);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg w-64 p-5 flex flex-col transition-transform ${isOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0 fixed lg:relative h-full z-10`}>
                <button className="lg:hidden mb-4" onClick={() => setIsOpen(false)}>
                    <X size={24} />
                </button>
                <h2 className="text-xl font-bold mb-6">Inventory Dashboard</h2>
                <nav className="space-y-4">
                    <NavLink to="/dashboard/analytics" className={({ isActive }) => `flex items-center gap-2 ${isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600"}`} onClick={() => setIsOpen(false)}>
                        <BarChart size={20} /> Analytics
                    </NavLink>
                    <NavLink to="/dashboard/inventory" className={({ isActive }) => `flex items-center gap-2 ${isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600"}`} onClick={() => setIsOpen(false)}>
                        <Box size={20} /> Inventory
                    </NavLink>
                    <NavLink to="/dashboard/categories" className={({ isActive }) => `flex items-center gap-2 ${isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600"}`} onClick={() => setIsOpen(false)}>
                        <List size={20} /> Categories
                    </NavLink>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <div className="bg-white shadow p-4 flex justify-between items-center lg:px-6">
                    <button className="lg:hidden" onClick={() => setIsOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                    <div className="flex items-center gap-2">
                        {user ? (
                            <div className="flex items-center gap-2">
                                <img src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"} alt="User Avatar" className="rounded-full w-8 h-8" />
                                {/* tooltip */}
                                <div className="tooltip tooltip-bottom" data-tip={user.email}>
                                    <span className="text-sm font-semibold">{user.displayName || "User"}</span>
                                </div>
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                                    onClick={logOut}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
                                    onClick={() => navigate("/signup")}
                                >
                                    Register
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Outlet for dynamic content */}
                <div className="p-6 overflow-auto flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
