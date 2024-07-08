import React from 'react'
import Link from "next/link"
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

function Header() {
    const router = useRouter();

    const handleLogout = () => {
        Swal.fire({
            icon: "success",
            title: "Logout",
            text: "Your account has been logged out.",
            confirmButtonText: "OK", // Button text to confirm
        }).then(() => {
            localStorage.removeItem('token');
            router.push("../../auth/login");
        });
    }

    return (
        <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 mx-5 rounded-lg my-1">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                    <div className="hidden lg:flex lg:space-x-8">
                        <ul className="flex flex-col lg:flex-row font-medium">
                            <li>
                                <Link href="#" className="font-extrabold text-blue-500">Digital Solutions:
                                    <span className="font-semibold"> Helps in growing the businesses</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <Link href="#" onClick={handleLogout} className="text-blue-500 border border-blue-500 font-semibold bg-white py-1 px-2 rounded-md" id="logoutButton">Log Out</Link>
                </div>
            </nav>
        </header>
    )
}

export default Header