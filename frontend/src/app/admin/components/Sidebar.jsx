import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { FaUsers } from 'react-icons/fa';

function Sidebar({ overview, employeeList, cvDetection }) {
    return (
        <div className='h-full'>
            <nav className="bg-white text-gray-800 w-full lg:w-64 md:w-64 h-full p-6 shadow-lg  mt-16 rounded-lg">
                <div className="flex items-center justify-center mb-10">
                    <div className="flex items-center justify-center bg-gray-300 rounded-full p-2 mt-2">
                        <Image src={`/next.svg`} alt="Logo" width={60} height={60} />
                    </div>
                </div>
                <ul className="space-y-4 pt-6 pl-8">
                    <li className="flex items-center space-x-3 ">
                        <p className='font-normal text-gray-800'>Main</p>
                    </li>
                    <li className="flex items-center space-x-3 ">
                        <FaUsers className="text-gray-400" size={20} />
                        <Link href={overview} className="hover:text-gray-400 text-lg font-medium transition duration-200 ease-in-out">Overview</Link>
                    </li>
                    <li className="flex items-center space-x-3 ">
                        <FaUsers className="text-gray-400" size={20} />
                        <Link href={employeeList} className="hover:text-gray-400 text-lg font-medium transition duration-200 ease-in-out">Employees</Link>
                    </li>
                    <li className="flex items-center space-x-3 ">
                        <FaUsers className="text-gray-400" size={20} />
                        <Link href={cvDetection} className="hover:text-gray-400 text-lg font-medium transition duration-200 ease-in-out">Cv Detection</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
