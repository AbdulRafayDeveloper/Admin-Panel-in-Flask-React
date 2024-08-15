"use client"
import React, { useState } from 'react'
import Sidebar from '@/app/admin/components/Sidebar';
import Header from '@/app/admin/components/Header';
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from 'next/navigation';

function page() {
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
    });

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
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar overview="../../../../admin/overview" employeeList="../../../../admin/" cvDetection="../../../admin/cvDetect/add></Sidebar>
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
                        <h1 className='text-2xl font-medium  text-gray-600 mb-6'>Add New Employee</h1>
                        <form
                            onSubmit={handleSubmit}
                            name="employeeForm"
                            id="employeeForm"
                            className="space-y-4"
                            method="post"
                            encType="multipart/form-data"
                        >
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="name"
                                        id="name"
                                        onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
                                        placeholder="Enter Employee Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="email"
                                        id="email"
                                        onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                                        placeholder="Enter Employee Email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="salary">Salary</label>
                                    <input
                                        type="number"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="salary"
                                        id="salary"
                                        onChange={(e) => setFormData({ ...formdata, salary: e.target.value })}
                                        placeholder="Enter Employee Salary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="jobType">Job Type</label>
                                    <select
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="jobType"
                                        id="jobType"
                                        onChange={(e) => setFormData({ ...formdata, jobType: e.target.value })}
                                    >
                                        <option disabled selected>Select Job Type</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Full Time">Full Time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-800 font-medium text-sm mb-2">Gender</label>
                                    <div className="flex items-center space-x-3">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-500"
                                                name="gender"
                                                value="Male"
                                                checked={formdata.gender === "Male"}
                                                onChange={(e) => setFormData({ ...formdata, gender: e.target.value })}
                                            />
                                            <span className="ml-2 text-gray-800">Male</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-500"
                                                name="gender"
                                                value="Female"
                                                checked={formdata.gender === "Female"}
                                                onChange={(e) => setFormData({ ...formdata, gender: e.target.value })}
                                            />
                                            <span className="ml-2 text-gray-800">Female</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="pic">Employee Pic</label>
                                    <input
                                        type="file"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="pic"
                                        id="pic"
                                        onChange={(e) => setFormData({ ...formdata, pic: e.target.files[0] })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="cv">Employee CV</label>
                                    <input
                                        type="file"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="cv"
                                        id="cv"
                                        onChange={(e) => setFormData({ ...formdata, cv: e.target.files[0] })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    className={`bg-transparent border border-gray-400 text-gray-600 py-2 px-4 rounded-sm hover:bg-gray-500 hover:text-white focus:outline-none focus:shadow-outline transition duration-300 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
                                    ) : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;
