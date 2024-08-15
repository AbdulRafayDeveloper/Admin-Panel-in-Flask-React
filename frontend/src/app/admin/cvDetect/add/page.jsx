"use client"
import React, { useState } from 'react'
import Sidebar from '@/app/admin/components/Sidebar';
import Header from '@/app/admin/components/Header';
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from 'next/navigation';

function page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formdata, setFormData] = useState({
        requirements: "",
        cv: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formdata.requirements || !formdata.cv) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fill the required fields",
            });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('requirements', formdata.requirements);
        formData.append('cv', formdata.cv);

        // console.log("FormData: ", formData);

        try {
            const response = await axios.post(`http://localhost:8000/api/cvDetection`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("response: ", response)

            if (response.data.status == 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                }).then(() => {
                    // router.push("./../../../../admin/employees/list");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Cv is not matched with Requirements",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Cv is not matched with Requirements",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar overview="../../../admin/overview" employeeList="../../../admin/employees/list" cvDetection="../../../admin/cvDetect/add"></Sidebar>
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
                        <h1 className='text-2xl font-medium  text-gray-600 mb-6'>CV Detection</h1>
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
                                    <label className="block text-gray-800 font-medium text-sm mb-2" htmlFor="requirements">Requirements</label>
                                    <input
                                        type="text"
                                        className="block w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300"
                                        name="requirements"
                                        id="requirements"
                                        onChange={(e) => setFormData({ ...formdata, requirements: e.target.value })}
                                        placeholder="Enter requirements"
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
                                    ) : 'Check CV'}
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
