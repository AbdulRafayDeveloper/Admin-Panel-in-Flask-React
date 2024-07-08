"use client"
import React, { useState, useEffect } from 'react'
import axios from "axios"
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function page() {
    const router = useRouter();
    const [formdata, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const video = document.querySelector('.video-background');
        if (video) {
            video.play().catch(error => {
                console.error("Video play failed:", error);
            });
        }
    }, []);

    const handleRegister = async (e) => {
        try {
            e.preventDefault();
            console.log("1");

            const formData = {
                name: formdata.name,
                email: formdata.email,
                password: formdata.password
            };

            console.log("formData: ", formData);
            const response = await axios.post(`/api/auth/register`, formData);

            console.log("response: ", response);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                }).then(() => {
                    router.push("../../auth/login");
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
                text: error.response ? error.response.data.message : "Your Request has not been submitted. Try Again later!",
            });
        }
    }

    return (
        <div className="bg-gray-100 text-gray-900 flex items-center justify-center min-h-screen relative overflow-hidden">
            {/* Background Video */}
            <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover z-0 video-background">
                <source src="/assets/videos/Untitled design.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="relative z-10 max-w-lg mx-auto bg-gray-900 shadow-lg sm:rounded-lg p-4 sm:p-12 opacity-80">
                <div className="flex flex-col items-center">
                    <form onSubmit={handleRegister} className="opacity-100">
                        <h1 className="text-2xl xl:text-3xl font-extrabold text-center mb-1 text-white ">
                            Register
                        </h1>
                        <div className="w-full flex-1 mt-6">
                            <div className="mx-auto max-w-xs">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-5"
                                    placeholder="Enter your name" required />
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    placeholder="Enter your email" required />
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    placeholder="Enter your password" required />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    onChange={(e) => setFormData({ ...formdata, confirmPassword: e.target.value })}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    placeholder="Enter your confirm password" required />
                                <button
                                    type="submit"
                                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                    <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">
                                        Register
                                    </span>
                                </button>
                                <p className="mt-6 text-xs text-gray-300 text-center">
                                    Already have account? Please
                                    <Link href="../../auth/login" className="border-b border-gray-300 border-dotted text-white font-bold mx-2">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default page