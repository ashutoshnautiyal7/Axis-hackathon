import { useState, useEffect } from 'react'
import {  BiServer } from 'react-icons/bi'
import { FaUserGraduate, FaUserTie } from 'react-icons/fa'
import { FiUsers, } from 'react-icons/fi'
function Header() {
    const [userCount, setUserCount] = useState(0)
    const [hrCount, setHrCount] = useState(0)
    const [activeJDCount, setActiveJDCount] = useState(0)
    const [dbStatus, setDbStatus] = useState('')
    const [totalUsers, setTotalUsers] = useState(0)

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/admin/home', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
  
          if (response.ok) {
            const data = await response.json();
            setUserCount(data.user);
            setHrCount(data.hrdb);
            setDbStatus(data.status);
            setTotalUsers(data.totaluser);
            localStorage.setItem('userCount', data.user);
            localStorage.setItem('hrCount', data.hrdb);
          } else {
            console.error('Failed to fetch data');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  return (
    <header className='px-8'>
    
    <h1 className="text-3xl font-semibold dark:text-white my-8">Hello, Admin</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  mt-8">

      <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
        <div>
          <h2 className="text-xl font-normal dark:text-neutral-500 ">Total Users</h2>
          <h1 className="text-3xl font-semibold dark:text-white">{totalUsers}</h1>
        </div>
        <div>
          <FiUsers className="text-6xl text-gray-400 dark:text-sky-500" />
        </div>
      </div>

      <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
        <div>
          <h2 className="text-xl font-normal dark:text-neutral-500 ">Active Users</h2>
          <h1 className="text-3xl font-semibold dark:text-white">{userCount}</h1>
        </div>
        <div>
          <FaUserGraduate className="text-6xl text-gray-400 dark:text-green-500/80" />
        </div>
      </div>
      <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
        <div>
          <h2 className="text-xl font-normal dark:text-neutral-500 ">Active HR</h2>
          <h1 className="text-3xl font-semibold dark:text-white">{hrCount}</h1>
        </div>
        <div>
          <FaUserTie className="text-6xl text-gray-400 dark:text-sky-500" />
        </div>
      </div>
      <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
        <div>
          <h2 className="text-xl font-normal dark:text-neutral-500 ">DB Status</h2>
          <h1 className="text-3xl font-semibold dark:text-white">
            {
              dbStatus === 200 ? 'Connected' : 'Not Connected'
            }
          </h1>
        </div>
        <div>
          {
            dbStatus === 200 ? <BiServer className="text-6xl text-gray-400 dark:text-green-400" /> : <BiServer className="text-6xl text-gray-400 dark:text-red-400" />
          }
        </div>
      </div>
    </div>
  </header>
  )
}

export default Header
