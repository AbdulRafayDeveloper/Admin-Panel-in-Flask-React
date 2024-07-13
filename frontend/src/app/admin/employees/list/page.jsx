"use client"
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ReactPaginate from 'react-paginate';
import axios from "axios"
import Swal from 'sweetalert2';
import Image from 'next/image';
import { FaFileExport, FaPlus, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
    const startIndex = currentPage * perPage;
    const endIndex = startIndex + perPage;
    const displayedEmployee = filteredEmployees.slice(startIndex, endIndex);

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
        <div className="flex flex-col md:flex-row h-screen">
            <Sidebar overview="../../admin/overview" employeeList="../../admin/employees/list"></Sidebar>
            <div className="flex-1 overflow-auto bg-gray-100">
                <Header></Header>
                <div className='p-4 bg-white mx-5 mt-3 rounded-lg shadow-lg'>
            <div>
                <h2 className="text-3xl font-medium mb-3 text-black">Employees List</h2>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex'>
                        <Link href="../../../admin/employees/add" className='text-sm w-28 h-8 flex items-center justify-center border border-blue-600 bg-white mr-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-sm' passHref>
                            <span className='text-blue-600 font-medium'>Add New</span>
                            <FaPlus className="text-blue-600 ml-2 mb-0" />
                        </Link>
                        <button onClick={handleExportToCsv} className='text-sm flex items-center justify-center border border-blue-600 bg-white w-36 h-8 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-sm'>
                            <span className='text-blue-600 font-medium'>Export to CSV</span>
                            <FaFileExport className="text-blue-600 ml-2 mb-0" />
                        </button>
                    </div>
                    <div className='flex'>
                        <input
                            type="text"
                            placeholder="Search Results"
                            onChange={handleFilter}
                            className="bg-white px-3 py-1 rounded-full w-52 border border-blue-600 text-gray-700"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                        <thead className="bg-blue-400">
                            <tr>
                                <th className="p-2 border border-gray-300">Sr#</th>
                                <th className="p-2 border border-gray-300">Name</th>
                                <th className="p-2 border border-gray-300">Email</th>
                                <th className="p-2 border border-gray-300">Salary</th>
                                <th className="p-2 border border-gray-300">Job Type</th>
                                <th className="p-2 border border-gray-300">Gender</th>
                                <th className="p-2 border border-gray-300">Pic</th>
                                <th className="p-2 border border-gray-300">CV</th>
                                <th className="p-2 border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedEmployee && displayedEmployee.map((element, index) => (
                                <tr className="hover:bg-gray-100">
                                    <td className="text-center border border-gray-300 text-gray-900 p-1">{index + 1}</td>
                                    <td className="text-center border border-gray-300 text-gray-900 p-1">{element.name}</td>
                                    <td className="text-center border border-gray-300 text-gray-900 p-1">{element.email}</td>
                                    <td className="text-center border border-gray-300 text-gray-900 p-1">{element.salary}</td>
                                    <td className="text-center border border-gray-300 text-gray-900 p-1">{element.jobType}</td>
                                    <td className="text-center border border-gray-300 text-gray-900 p-1">{element.gender}</td>
                                    <td className="text-center border border-gray-300 p-1 text-gray-900">
                                        <Image src={`http://localhost:8000/assets/images/${element.pic}`} alt="employee pic" width={50} height={40} className='mx-auto' />
                                    </td>
                                    <td className="text-center border border-gray-300 p-1 ">
                                        <Link
                                            href={`/assets/files/${element.cv}`}
                                            className="bg-none mx-auto text-blue-400 border border-blue-400 text-sm p-1 w-32 text-center rounded-md flex items-center justify-center hover:bg-blue-400 hover:text-white"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.open(`http://localhost:8000/assets/files/${element.cv}`, '_blank');
                                                const link = document.createElement('a');
                                                link.setAttribute('download', element.cv);
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                        >
                                            Download CV
                                            <FaDownload className="text-blue-400 ml-2 mb-0 hover:text-white" />
                                        </Link>
                                    </td>
                                    <td className="text-center border border-gray-300 p-1">
                                        <div className='flex flex-row space-x-3 justify-center'>
                                            <Link href={`../../../admin/employees/update/${element.id}`}>
                                                <FaEdit className="text-blue-500 hover:text-green-800 cursor-pointer" />
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
                <div className="flex justify-center mt-4">
                    <ReactPaginate
                        previousLabel={<FaChevronLeft className="text-blue-400 ml-2 mb-0" />}
                        nextLabel={<FaChevronRight className="text-blue-400 ml-2 mb-0" />}
                        breakLabel={<span className="text-white">...</span>}
                        pageCount={Math.ceil(employees.length / perPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={10}
                        onPageChange={handlePageChange}
                        containerClassName="pagination flex"
                        activeClassName="bg-blue-600 rounded-full text-white"
                        pageClassName="relative mx-1"
                        pageLinkClassName="block w-9 h-9 bg-blue-500 rounded-sm text-center text-white hover:bg-gray-200 focus:outline-none flex items-center justify-center"
                        previousClassName="relative mx-1"
                        nextClassName="relative mx-1"
                        previousLinkClassName="block p-2 mt-1 bg-blue-500 rounded-md text-white hover:bg-gray-200 focus:outline-none"
                        nextLinkClassName="block p-2 mt-1 bg-blue-500 rounded-md text-white hover:bg-gray-200 focus:outline-none"
                        breakClassName="relative mx-1"
                        breakLinkClassName="block py-2 px-3 bg-white rounded-full text-gray-700 hover:bg-gray-200 focus:outline-none"
                    />
                </div>
            </div>
        </div>
            </div>
        </div>
    );
}

export default Page;