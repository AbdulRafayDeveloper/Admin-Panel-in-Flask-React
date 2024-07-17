'use client'
import React, { useState, useEffect } from 'react';
import { FaUsers, FaComments, FaDollarSign } from 'react-icons/fa';
import { Line, Pie, Bar } from 'react-chartjs-2';
import Header from '../components/Header';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Sidebar from '../components/Sidebar';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement
);

const DashboardOverview = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const lineData = {
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

  const pieData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        data: [300, 50, 100, 40, 120, 80],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [1200, 1900, 3000, 5000, 2400, 3100, 4000],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
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
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += context.raw;
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Sidebar overview="../../admin/overview" employeeList="../../admin/employees/list" />
      <div className="flex-1 overflow-auto bg-gray-100">
        <Header />
        <div className="p-6 h-full mt-14">
          <div className="p-4">
            <h2 className="text-2xl font-medium text-gray-600 mb-2">Dashboard Overview</h2>
            <p className='font-light mt-1 mb-8'>Main / Overview</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col items-center">
                <FaUsers className="text-3xl text-blue-400 mb-2" />
                <h3 className="text-lg font-semibold mt-2 text-blue-400">Total Customers</h3>
                <p className="text-gray-600 text-base">1000</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col items-center">
                <FaComments className="text-3xl text-blue-400 mb-2" />
                <h3 className="text-lg font-semibold mt-2 text-blue-400">Total Comments</h3>
                <p className="text-gray-600 text-base">1200</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col items-center">
                <FaDollarSign className="text-3xl text-blue-400 mb-2" />
                <h3 className="text-lg font-semibold mt-2 text-blue-400">Total Revenue</h3>
                <p className="text-gray-600 text-base">$1400</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col items-center">
                <FaUsers className="text-3xl text-blue-400 mb-2" />
                <h3 className="text-lg font-semibold mt-2 text-blue-400">Active Users</h3>
                <p className="text-gray-600 text-base">1600</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Monthly Earnings</h3>
                <div className="h-80">
                  <Line data={lineData} options={options} height={400} width={500} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Sales Distribution</h3>
                <div className="h-80">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Monthly Sales</h3>
                <div className="h-80">
                  <Bar data={barData} options={options} height={500} width={800} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Calendar</h3>
                <div className="h-80">
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="react-calendar"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
