'use client'
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaFileExport, FaPlus, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ReactPaginate from 'react-paginate';
import axios from "axios"
import Swal from 'sweetalert2';
import Image from 'next/image';
import Loading from './loading'; // Import the Loading component

function Page() {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Current page number
    const [filteredEmployees, setFilteredEmployees] = useState([]); // Initialize with an empty array
    const perPage = 12 // Number of items per page

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:8000/api/employees`)
                .then((result) => {
                    if (Array.isArray(result.data.data)) {
                        console.log("result.data.data: ", result.data.data);
                        setEmployees(result.data.data);
                        setFilteredEmployees(result.data.data);
                    } else {
                        console.error("API response is not an array:", result.data.data);
                    }
                })
                .catch((error) => {
                    console.error("API error:", error);
                }).finally(() => {
                    setLoading(false); // Set loading to false after data is fetched
                });
        };
        fetchData();
    }, []);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this employee permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            console.log("Id in delete function: " + id);
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://localhost:8000/api/employees/${id}`);
                    if (response.data.status === 200) {
                        // Update the employees state with the updated data from the server
                        const updatedData = await axios.get(`http://localhost:8000/api/employees`);
                        if (Array.isArray(updatedData.data.data)) {
                            setEmployees(updatedData.data.data);
                            setFilteredEmployees(updatedData.data.data);
                        } else {
                            console.error("API response is not an array:", updatedData.data.data);
                        }
                    } else {
                        Swal.fire('Error!', 'Employee deletion failed.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Employee deletion failed.', 'error');
                }
            }
        });
    };

    // Function to handle page change
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    // Calculate the start and end index for the current page
    const startIndex = currentPage * perPage + 1;
    const endIndex = Math.min((currentPage + 1) * perPage, filteredEmployees.length);
    const totalEntries = filteredEmployees.length;

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setFilteredEmployees(employees); // Reset filtered data to all data
        } else {
            const filteredData = employees.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setFilteredEmployees(filteredData);
        }

        setCurrentPage(0);
    };

    const handleExportToCsv = () => {
        // Extract only the required fields for CSV export
        const csvData = employees.map((employee, index) => ({
            Sr: index + 1,
            Name: employee.name,
            Email: employee.email,
            Salary: employee.salary,
            'Job Type': employee.jobType,
            Gender: employee.gender,
            PicName: employee.pic,
            CvFileName: employee.cv,
        }));

        // Convert the data to CSV format
        const csvContent = [
            Object.keys(csvData[0]).join(','), // CSV header row
            ...csvData.map((row) => Object.values(row).join(',')), // Data rows
        ].join('\n');

        // Create a Blob object containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'employees.csv';

        // Simulate a click to trigger the download
        link.click();
    };

    if (loading) {
        return <Loading />; // Render the Loading component if data is still being fetched
    }

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">

            <Sidebar overview="../../admin/overview" employeeList="../../admin/employees/list" />
            <div className="flex-1 overflow-auto bg-gray-100">
                <Header />
                <div className='p-4 mx-5 mt-24  md:mx-2 sm:mx-1'>
                    <div className='mb-6'>
                        <h2 className="text-2xl font-medium text-gray-600  mt-2">Employees List</h2>
                        <p className='font-light mt-1'>Main / Employees</p>
                    </div>
                    <div className='flex justify-between items-center mb-4'>
                        <div className='flex space-x-3'>
                            <Link href="../../../admin/employees/add" passHref>
                                <button className='text-sm flex items-center justify-center border text-gray-600 bg-transparent border-gray-400 hover:bg-gray-100 hover:text-gray-600 px-3 py-1 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-white'>
                                    <FaPlus className="mr-2 mb-0" />
                                    <span className='font-medium'>Add New</span>
                                </button>
                            </Link>
                            <button onClick={handleExportToCsv} className='text-sm flex items-center justify-center border text-gray-600 bg-transparent border-gray-400 hover:bg-gray-100 hover:text-gray-600 px-3 py-1 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-white'>
                                <FaFileExport className="mr-2 mb-0" />
                                <span className='font-medium'>Export to CSV</span>
                            </button>
                        </div>
                        <div className='flex'>
                            <input
                                type="text"
                                placeholder="Search Employees"
                                onChange={handleFilter}
                                className="bg-white px-3 py-1 rounded-full w-52 border border-gray-400 text-gray-700 focus:outline-none focus:border-blue-600 shadow-lg"
                            />
                        </div>
                    </div>
        
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                            <thead className="text-xs uppercase bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-2 py-4 border">Sr#</th>
                                    <th className="p-2 py-4 border">Name</th>
                                    <th className="p-2 py-4 border">Email</th>
                                    <th className="p-2 py-4 border">Salary</th>
                                    <th className="p-2 py-4 border">Job Type</th>
                                    <th className="p-2 py-4 border">Gender</th>
                                    <th className="p-2 py-4 border">Pic</th>
                                    <th className="p-2 py-4 border">CV</th>
                                    <th className="p-2 py-4 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.slice(startIndex - 1, endIndex).map((element, index) => (
                                    <tr key={element.id} className="hover:bg-gray-100 border border-gray-200">
                                        <td className="text-center text-gray-900 p-2">{startIndex + index}</td>
                                        <td className="text-center text-gray-900 p-2">{element.name}</td>
                                        <td className="text-center text-gray-900 p-2">{element.email}</td>
                                        <td className="text-center text-gray-900 p-2">{element.salary}</td>
                                        <td className="text-center text-gray-900 p-2">{element.jobType}</td>
                                        <td className="text-center text-gray-900 p-2">{element.gender}</td>
                                        <td className="text-center p-2">
                                            <Image src={`http://localhost:8000/assets/images/${element.pic}`} alt="employee pic" width={50} height={40} className='mx-auto' />
                                        </td>
                                        <td className="text-center p-2 flex justify-center items-center">
                                            <Link
                                                href={`/assets/files/${element.cv}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.open(`http://localhost:8000/assets/files/${element.cv}`, '_blank').focus();
                                                }}
                                            >
                                                <FaDownload className="mr-2 mb-0 text-blue-500 hover:text-blue-400" /> 
                                            </Link>
                                        </td>
                                        <td className="text-center p-2">
                                            <div className='flex space-x-3 justify-center'>
                                                <Link href={`../../../admin/employees/update/${element.id}`}>
                                                    <FaEdit className="text-green-500 hover:text-green-800 cursor-pointer" />
                                                </Link>
                                                <button onClick={() => handleDelete(element.id)} className="text-red-600 hover:text-red-800">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
        
                    <div className="flex flex-col items-center mt-8">
                        <p className="text-sm text-gray-600 text-center mb-2">
                            Showing {startIndex} to {endIndex} of {totalEntries} entries
                        </p>
                        <ReactPaginate
                            previousLabel={<FaChevronLeft className="text-gray-600 ml-2 mb-0" />}
                            nextLabel={<FaChevronRight className="text-gray-600 ml-2 mb-0" />}
                            breakLabel={<span className="text-gray-600">...</span>}
                            pageCount={Math.ceil(filteredEmployees.length / perPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageChange}
                            containerClassName="pagination flex"
                            activeClassName="bg-none rounded-full text-white"
                            pageClassName="relative mx-1"
                            pageLinkClassName="block w-9 h-9 bg-none rounded-sm text-center text-gray-600 hover:bg-gray-200 focus:outline-none flex items-center justify-center border border-gray-400"
                            previousClassName="relative mx-1"
                            nextClassName="relative mx-1"
                            previousLinkClassName="block p-2 mt-1 bg-none rounded-md text-white hover:bg-gray-200 focus:outline-none"
                            nextLinkClassName="block p-2 mt-1 bg-none rounded-md text-white hover:bg-gray-200 focus:outline-none"
                            breakClassName="relative mx-1"
                            breakLinkClassName="block py-2 px-3 bg-white rounded-full text-gray-700 hover:bg-gray-200 focus:outline-none"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Page;
