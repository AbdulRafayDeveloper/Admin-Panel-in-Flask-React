"use client";

import React from 'react';
import { FaUsers, FaComments, FaDollarSign } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import Header from '../components/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Sidebar from '../components/Sidebar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Earnings',
        data: [1200, 1900, 3000, 5000, 2400, 3100, 4000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Earnings',
      },
    },
  };

  return (

    <div>
      <div className="flex flex-col md:flex-row h-screen">
      <Sidebar overview="../../admin/overview" employeeList="../../admin/employees/list"></Sidebar>
        <div className="flex-1 overflow-auto bg-gray-100">
          <Header></Header>
          <div className='p-6'>
            <div className="">
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center flex flex-col items-center">
                  <FaUsers className="text-4xl text-blue-500 mb-2" />
                  <h3 className="text-lg font-bold mt-2">Total Customers</h3>
                  <p className="text-gray-600 text-md">1000</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center flex flex-col items-center">
                  <FaComments className="text-4xl text-blue-500 mb-2" />
                  <h3 className="text-lg font-bold mt-2">Total Customers</h3>
                  <p className="text-gray-600 text-md">1200</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center flex flex-col items-center">
                  <FaDollarSign className="text-4xl text-blue-500 mb-2" />
                  <h3 className="text-lg font-bold mt-2">Total Customers</h3>
                  <p className="text-gray-600 text-md">1400</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center flex flex-col items-center">
                  <FaUsers className="text-4xl text-blue-500 mb-2" />
                  <h3 className="text-lg font-bold mt-2">Total Customers</h3>
                  <p className="text-gray-600 text-md">1600</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <Line data={data} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;