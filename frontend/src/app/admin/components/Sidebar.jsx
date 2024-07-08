import React from 'react'
import Link from "next/link";
import Image from "next/image"
import { FaUsers } from 'react-icons/fa';

function Sidebar({overview,employeeList}) {
    return (
        <div className='my-1'>
            <nav className="bg-white text-black w-full lg:w-full md:w-full h-full p-6 rounded-lg ">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-lg font-bold px-3 text-blue-500">Dashboard</div>
                    <Image src={`../../../../public/next.svg`} alt="Logo" className="w-10 h-10 rounded-full bg-gray-300 px-3 py-2" style= {{"margin-right":-14}} width={20} height={20} />
                </div>
                <ul className="space-y-4 md:space-y-5 lg:space-y-6 mt-16">
                    <li className="flex items-center space-x-2">
                        <FaUsers className="text-yellow-200" />
                        <Link href={overview} className="hover:text-blue-300 font-bold">Overview</Link>
                    </li>
                    <li className="flex items-center space-x-2">
                        <FaUsers className="text-red-400" />
                        <Link href={employeeList} className="hover:text-blue-300 font-bold">Employees</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar