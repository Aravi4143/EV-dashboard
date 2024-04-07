'use client'

import React, { useState, useEffect, Suspense } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchFilteredVehicles } from './lib/data';
import RenderChart from './charts';

export default function ReportsDashboard() {
  const [reportType, setReportType] = useState('total-miles-driven');
  const [frequency, setFrequency] = useState('weekly');
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 90))); // Set default to last three months
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchFilteredVehicles(reportType, frequency, startDate?.toISOString(), endDate?.toISOString());
      setData(data);
    } catch (error) {
      console.error(error);
      setError('Error fetching report data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reportType, frequency, startDate, endDate]);

  const handleReportTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setReportType(event.target.value);
  };

  const handleFrequencyChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setFrequency(event.target.value);
  };

  const handleStartDateChange = (date: React.SetStateAction<Date | null>) => {
    if (date) {
      setStartDate(date);
    } else {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 90)));
    }
  };

  const handleEndDateChange = (date: React.SetStateAction<Date | null>) => {
    if (date) {
      setEndDate(date);
    } else {
      setEndDate(new Date());
    }
  };

  return (
    <div className="reports-dashboard flex flex-row mb-8">
      <div className='flex flex-col justify-start gap-6 mt-8 bg-gray-200 shadow shadow-gray-300 mr-8 ml-3 p-2 rounded-xl'>
        <div className='mt-4'>
          <label htmlFor="reportType" className='block text-l font-medium text-gray-700 mb-0 ml-2'>Report Type</label>
          <select id="reportType" value={reportType} onChange={handleReportTypeChange} className='space-x-2 border-[3px] border-purple-400 rounded-xl text-gray-700 p-2'>
            <option value="total-miles-driven">Total Miles Driven</option>
            <option value="average-miles-driven">Average Miles Driven</option>
            <option value="most-driven-vehicles">Most Driven Vehicles</option>
            <option value="least-driven-vehicles">Least Driven Vehicles</option>
            <option value="miles-driven-by-type">Miles Driven By Vehicle Type</option>
          </select>
        </div>
        <div className='flex flex-col gap-2 mt-6'>
          <label htmlFor="startDate" className='block text-l font-medium text-gray-700 mb-0 ml-2'>Date Range</label>
          <DatePicker showIcon selected={startDate} onChange={(date) => { handleStartDateChange(date) }} dateFormat="yyyy-MM-dd" className='space-x-2 border-[3px] border-purple-400 rounded-xl text-gray-700 p-0'/>
          <label htmlFor="endDate" className='block text-m font-medium text-gray-700 mb-0 ml-2'>To</label>
          <DatePicker showIcon selected={endDate} onChange={handleEndDateChange} dateFormat="yyyy-MM-dd"  className='space-x-2 border-[3px] border-purple-400 rounded-xl text-gray-700 p-0'/>
        </div>
      </div>
      <div className='flex flex-col pt-8 justify-end bg-gray-200 shadow shadow-gray-300 mt-8 rounded-xl p-2'>
        <div className="frequency-options place-self-end pr-4 flex space-x-2 border-[3px] border-purple-400 rounded-xl select-none">
          <label className='radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer'>
            <input type="radio" id="weekly" name="frequency" value="weekly" checked={frequency === 'weekly'} onChange={handleFrequencyChange} className='peer hidden' />
            <span className='tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[blueviolet] peer-checked:to-[violet] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out'>Weekly</span>
          </label>
          <label className='radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer'>
            <input type="radio" id="monthly" name="frequency" value="monthly" checked={frequency === 'monthly'} onChange={handleFrequencyChange}  className='peer hidden' />
            <span className='tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[blueviolet] peer-checked:to-[violet] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out'>Monthly</span>
          </label>
          <label className='radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer'>
            <input type="radio" id="yearly" name="frequency" value="yearly" checked={frequency === 'yearly'} onChange={handleFrequencyChange} className='peer hidden' />
            <span className='tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[blueviolet] peer-checked:to-[violet] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out'>Yearly</span>
          </label>
        </div>
        <div className="report-content pt-0">
          {data ? <RenderChart data={data} /> : null}
          {error ? <p className="error-message">{error}</p> : null}
          {isLoading ? <p>Loading data...</p> : null}
        </div>
      </div>
    </div>
  );
};
