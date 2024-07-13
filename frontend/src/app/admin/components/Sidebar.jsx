import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { FaUsers } from 'react-icons/fa';

function Sidebar({overview,employeeList}) {
    return (
        <div className='my-1'>
            <nav className="bg-white text-black w-full lg:w-full md:w-full h-full p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-xl font-semibold px-3 text-blue-600">Dashboard</div>
                    <Image src={`/next.svg`} alt="Logo" className="w-10 h-10 rounded-full bg-gray-300" width={40} height={40} />
                </div>
                <ul className="space-y-6 mt-16">
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={overview} className="hover:text-blue-500 text-lg font-light">Overview</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={employeeList} className="hover:text-blue-500 text-lg font-light">Employees</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
