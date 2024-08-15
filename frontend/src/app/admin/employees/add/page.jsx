"use client"
import React, { useState } from 'react'
import Sidebar from '@/app/admin/components/Sidebar';
import Header from '@/app/admin/components/Header';
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from 'next/navigation';

function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false); // State to handle loading
    const [formdata, setFormData] = useState({
        name: "",
        email: "",
        salary: "",
        jobType: "",
        gender: "",
        pic: "",
        cv: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when form is submitted

        if (!formdata.name || !formdata.email || !formdata.salary || !formdata.pic || !formdata.cv || !formdata.jobType || !formdata.gender) {
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
        formData.append('pic', formdata.pic);
        formData.append('cv', formdata.cv);

        console.log("FormData: ", formData);

        try {
            const response = await axios.post(`http://localhost:8000/api/employees`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("response.data: ", response.data)
            console.log("response.data: ", response.data.status);

            if (response.data.status == 200) {
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

    return (

        <div className="flex flex-col md:flex-row h-screen">
            <Sidebar overview="../../../../admin/overview" employeeList="../../../../admin"></Sidebar>
            <div className="flex-1 overflow-auto bg-gray-100">
                <Header></Header>
                <div className='p-1'>
                    <div className='mx-auto max-w-[1025px]'>
                        <form onSubmit={handleSubmit} name="employeeForm" id="employeeForm" className="bg-white shadow-md rounded px-12 pb-4 mb-4 py-2 mt-2"
                            method="post" encType="multipart/form-data">
                            <h1 className='text-2xl font-medium text-center pb-7 text-gray-800 '>Add New Employee</h1>
                            <div className='flex flex-row justify-between space-x-10 mb-4'>
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="name">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="name"
                                        id="name"
                                        onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
                                        placeholder="Enter Employee Name" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="email"
                                        id="email"
                                        onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                                        placeholder="Enter Employee Email" />
                                </div>
                            </div>
                            <div className='flex flex-row justify-between space-x-10 mb-4'>
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="salary">
                                        Salary
                                    </label>
                                    <input
                                        type="number"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="salary"
                                        id="salary"
                                        onChange={(e) => setFormData({ ...formdata, salary: e.target.value })}
                                        placeholder="Enter Employee Salary" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="jobType">
                                        Job Type
                                    </label>
                                    <select
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="jobType"
                                        id="jobType"
                                        onChange={(e) => setFormData({ ...formdata, jobType: e.target.value })}
                                    >
                                        <option disabled selected>Select Job Type</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Full Time">Full Time</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex flex-row justify-between space-x-10 mb-2'>
                                <div className="flex-1 flex-row">
                                    <label className="block text-gray-700 text-base font-semibold mb-2">
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
                                        /> <span className='text-black font-light'>Male</span>
                                        <input
                                            type="radio"
                                            className="shadow ml-12 mx-3"
                                            name="gender"
                                            value="Female"
                                            checked={formdata.gender === "Female"}
                                            onChange={(e) => setFormData({ ...formdata, gender: e.target.value })}
                                        /> <span className='text-black font-light'>Female</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="pic">
                                        Employee Pic
                                    </label>
                                    <input
                                        type="file"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="pic"
                                        id="pic"
                                        onChange={(e) => setFormData({ ...formdata, pic: e.target.files[0] })} />
                                </div>
                            </div>
                            <div className='flex flex-row justify-between space-x-10 mb-4'>
                                <div className="flex-1 flex-row">
                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="cv">
                                        Employee Cv
                                    </label>
                                    <input
                                        type="file"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="cv"
                                        id="cv"
                                        onChange={(e) => setFormData({ ...formdata, cv: e.target.files[0] })} />
                                </div>
                                <div className="flex-1">
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Add Employee'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page