"use client"
import React, { useState, useEffect } from 'react'
import axios from "axios"
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function page() {
    const router = useRouter();
    const [formdata, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        const video = document.querySelector('.video-background');
        if (video) {
            video.play().catch(error => {
                console.error("Video play failed:", error);
            });
        }
    }, []);

    const handleLogin = async (e) => {
        try {
            e.preventDefault();

            const response = await axios.post(`/api/auth/login`, formdata);

            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                }).then(() => {
                    localStorage.setItem('token', response.data.data);
                    // const token = localStorage.getItem("token");

                    localStorage.setItem('tokenRole', response.data.role);
                    // const tokenRole = localStorage.getItem("tokenRole");

                    if (tokenRole == 1) {
                        router.push("../../../app/page.jsx");
                    } else {
                        router.push("../../admin/overview");
                    }
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

            <div className="relative z-10 max-w-lg mx-auto bg-gray-900 shadow-lg sm:rounded-lg p-6 sm:p-12 opacity-80">
                <div className="mt-12 flex flex-col items-center">
                    <form onSubmit={handleLogin} className="opacity-100">
                        <h1 className="text-2xl xl:text-3xl font-extrabold text-center mb-6 text-white ">
                            Log In
                        </h1>
                        <div className="w-full flex-1 mt-8">
                            <div className="mx-auto max-w-xs">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    placeholder="Enter your email" required />
                                <input type="password"
                                    name="password"
                                    id="password"
                                    onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    placeholder="Enter your password" required />
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
                                        Log In
                                    </span>
                                </button>
                                <p className="mt-6 text-xs text-gray-300 text-center">
                                    Don't have account? Please
                                    <Link href="../../auth/register" className="border-b border-gray-300 border-dotted text-white font-bold mx-2">
                                        Register
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