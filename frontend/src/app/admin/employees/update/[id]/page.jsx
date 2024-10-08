"use client"
import React, { useState, useEffect } from 'react'
import Sidebar from '@/app/admin/components/Sidebar';
import Header from '@/app/admin/components/Header';
import axios from "axios";
import Swal from "sweetalert2";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaDownload } from 'react-icons/fa';

function page({ params }) {
    const router = useRouter();
    const id = params.id;
    console.log("Id: ", id);
    const [loading, setLoading] = useState(false); // State to handle loading
    const [formdata, setFormData] = useState({
        name: "",
        email: "",
        salary: "",
        jobType: "",
        gender: "",
        prePic: null,
        currentPic: null,
        preCv: null,
        currentCv: null,
    })

    useEffect(() => {
        console.log("id:", id);
        const getUserRecord = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/employees/${id}`);
                const employeeData = response.data.data;
                setFormData({
                    name: employeeData.name,
                    email: employeeData.email,
                    salary: employeeData.salary,
                    jobType: employeeData.jobType,
                    gender: employeeData.gender,
                    prePic: employeeData.pic,
                    preCv: employeeData.cv,
                });
                console.log("response.data.name: ", employeeData);
            } catch (error) {
                console.log("error", error);
            }
        }

        getUserRecord();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when form is submitted

        if (!formdata.name || !formdata.email || !formdata.salary || !formdata.jobType || !formdata.gender) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fill the required fields",
            });
            setLoading(false); // Reset loading if validation fails
            return;
        }

        const formData = new FormData();
        formData.append('name', formdata.name);
        formData.append('email', formdata.email);
        formData.append('salary', formdata.salary);
        formData.append('jobType', formdata.jobType);
        formData.append('gender', formdata.gender);
        formData.append('prePic', formdata.prePic);
        formData.append('pic', formdata.pic);
        formData.append('preCv', formdata.preCv);
        formData.append('cv', formdata.cv);

        console.log("FormData: ", formData);

        try {
            const response = await axios.put(`http://localhost:8000/api/employees/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("response.data: ", response.data)
            console.log("response.data: ", response.data.status);

            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                }).then(() => {
                    router.push("./../../../../admin/employees/list");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response ? error.response.data.message : "An error occurred",
            });
        } finally {
            setLoading(false); // Reset loading when API call completes
        }
    }

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8000/assets/files/${formdata.preCv}`, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', formdata.preCv);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar overview="../../../../admin/overview" employeeList="../../../../admin/"></Sidebar>
            <div className="flex-1 overflow-auto relative">
                <Header></Header>
                <div className='absolute inset-0'>
                    <img
                        src="/assets/images/background.jpg"
                        className=' object-cover w-full h-52'
                        alt="Background"
                    />
                </div>
                <div className='relative z-20 p-4 overflow-y-auto h-full '>
                    <div className='bg-white shadow-md rounded-lg mx-auto max-w-3xl p-8 mt-20'>
                        <h1 className='text-2xl font-medium text-gray-600 mb-2'>Update Employee</h1>
                        <p className='font-light mt-1'>Main / <span><Link href="../../../../admin/employees/list">Employees</Link></span> / Update</p>
                        <form onSubmit={handleUpdate} name="employeeForm" id="employeeForm" className="bg-white px-12 pb-4 mb-4 py-2 mt-2"
                            method="post" encType="multipart/form-data">
                        
                            <div className='flex flex-row justify-between space-x-10 mb-6'>
                                <div className="flex-1">
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="name">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="name"
                                        id="name"
                                        value={formdata.name}
                                        onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
                                        placeholder="Enter Employee Name" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="email"
                                        id="email"
                                        value={formdata.email}
                                        onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                                        placeholder="Enter Employee Email" />
                                </div>
                            </div>
                            <div className='flex flex-row justify-between space-x-10 mb-6'>
                                <div className="flex-1">
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="salary">
                                        Salary
                                    </label>
                                    <input
                                        type="number"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="salary"
                                        id="salary"
                                        value={formdata.salary}
                                        onChange={(e) => setFormData({ ...formdata, salary: e.target.value })}
                                        placeholder="Enter Employee Salary" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="jobType">
                                        Job Type
                                    </label>
                                    <select
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                                        name="jobType"
                                        id="jobType"
                                        value={formdata.jobType}
                                        onChange={(e) => setFormData({ ...formdata, jobType: e.target.value })}
                                    >
                                        <option disabled selected>Select Job Type</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Full Time">Full Time</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex flex-row justify-between space-x-10 mb-6'>
                                <div className="flex-1 flex-row">
                                    <label className="block text-gray-800 font-medium text-sm mb-2">
                                        Gender
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            className="shadow mx-3"
                                            name="gender"
                                            value="Male"
                                            checked={formdata.gender === "Male"}
                                            onChange={(e) => setFormData({ ...formdata, gender: e.target.value })}
                                        /> <span className='font-light text-black'>Male</span>
                                        <input
                                            type="radio"
                                            className="shadow ml-12 mx-3"
                                            name="gender"
                                            value="Female"
                                            checked={formdata.gender === "Female"}
                                            onChange={(e) => setFormData({ ...formdata, gender: e.target.value })}
                                        /> <span className='font-light text-black'>Female</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row justify-between space-x-10 mb-6'>
                                <div className="flex-1">
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="pic">
                                        Employee Pic
                                    </label>
                                    <input
                                        type="file"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="pic"
                                        id="pic"
                                        files={formdata.pic}
                                        onChange={(e) => setFormData({ ...formdata, pic: e.target.files[0] })} />
                                    <label className="block text-gray-800 font-medium text-sm mb-2 mt-6" htmlFor="prePic">
                                        Employee Profile
                                    </label>
                                    <Image src={`http://localhost:8000/assets/images/${formdata.prePic}`} alt="employee pic" width={200} height={200} className='mt-4' />
                                </div>
                                <div className="flex-1">
                                    <div className="flex mb-3">
                                        <div className="flex-1">
                                            <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="cv">
                                                Employee CV
                                            </label>
                                        </div>
                                        <div className="flex-1 flex justify-end my-1">
                                            <button
                                                onClick={handleDownload}
                                                className="bg-blue-500 text-white w-8 py-1 text-center rounded-md flex items-center"
                                            >
                                                <FaDownload className="text-white ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="cv"
                                        id="cv"
                                        onChange={(e) => setFormData({ ...formdata, cv: e.target.files[0] })} />
                                </div>
                            </div>
                            <div className="text-right">
                                <button
                                    className={`bg-transparent border border-gray-400 text-gray-600 font- py-2 px-4 rounded-sm hover:bg-gray-500 hover:text-white focus:outline-none focus:shadow-outline transition duration-300 ease-in-out${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Update Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page