"use client"
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import axios from "axios"
import Swal from 'sweetalert2';

function Home() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("1");
      await axios.get(`http://localhost:8000/api/employees`)
        .then((result) => {
          console.log("2");
          if (Array.isArray(result.data.data)) {
            setEmployees(result.data.data);
          } else {
            console.error("API response is not an array:", result.data.data);
          }
        })
        .catch((error) => {
          console.error("API error:", error);
        })
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
          if (response.data.status == 200) {
            console.log("response:",response.data.status);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: response.data.message,
          })
            // // Update the employees state with the updated data from the server
            // const updatedData = await axios.get(`/api/employees`);
            // if (Array.isArray(updatedData.data.data)) {
            //   setEmployees(updatedData.data.data);
            //   // setFilteredEmployees(updatedData.data.data);
            // } else {
            //   console.error("API response is not an array:", updatedData.data.data);
            // }
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

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className='p-4'>
          <div>
            <div className='flex justify-end'>
              <Link href="../../../admin/employees/add" className='text-sm w-24 h-7 flex items-center justify-center border border-1 border-blue-600 bg-white  hover:bg-blue-600 hover:text-white mx-3' passHref>
                Add New
              </Link>
            </div>
            <div className='flex justify-between mt-2'>
              <h2 className="text-2xl font-bold mb-4">Employees List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-gray-300 sticky top-0 z-10">
                  <tr>
                    <th className="p-1 border border-gray-200">Sr#</th>
                    <th className="p-1 border border-gray-200">Name</th>
                    <th className="p-1 border border-gray-200">Email</th>
                    <th className="p-1 border border-gray-200">Action</th>
                  </tr>
                </thead>
                <tbody id="userRequestTableBody">
                  {employees && employees.map((element, index) => (
                    <tr className="odd:bg-gray-100 even:bg-gray-50 hover:bg-gray-200">
                      <td className="text-center border border-gray-200">{index + 1}</td>
                      <td className="text-center border border-gray-200">{element.name}</td>
                      <td className="text-center border border-gray-200">{element.email}</td>
                      <td className="text-center border border-gray-200">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;