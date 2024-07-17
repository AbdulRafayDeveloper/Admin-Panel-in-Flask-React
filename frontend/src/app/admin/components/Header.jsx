import React from 'react';
import Link from "next/link";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

function Header() {
    const router = useRouter();

    const handleLogout = () => {
        Swal.fire({
            icon: "success",
            title: "Logout",
            text: "Your account has been logged out.",
            confirmButtonText: "OK",
        }).then(() => {
            localStorage.removeItem('token');
            router.push("../../auth/login");
        });
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <nav className="container mx-auto p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <div className="flex items-center space-x-2">
                            <div className="text-xl font-medium text-gray-600">Digital Solutions</div>
                            <div className="text-sm font-light text-gray-700">Helps in growing businesses</div>
                        </div>
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-transparent border border-gray-400 text-gray-600 font- py-2 px-4 rounded-sm hover:bg-gray-500 hover:text-white focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    id="logoutButton"
                >
                    Log Out
                </button>
            </nav>
        </header>
    );
}

export default Header;
