
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Header from './Header'
import { Chart } from 'chart.js/auto'
import { Doughnut, Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

function AdminDashboard() {
  const userCount = localStorage.getItem('userCount');
  const hrCount = localStorage.getItem('hrCount');
  const [jdDataArray, setJdDataArray] = useState([]);



  const userHrData = {
    labels: ['Users', 'HRs'],
    datasets: [
      {
        data: [userCount, hrCount],
        backgroundColor: ['#11b980', '#3b83f7'],
      },
    ],
  };

  const fetchJdData = async () => {
    try {
      const response = await fetch('/api/admin/home/jd', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJdDataArray(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchJdData();
  }, []);

  const colors = ['#11b980','#3b83f7','#ff8b4c','#8b5cf6','#f65064','#00b8d9','#f66d9b','#f6b93b','#6eeb83',]

  const jdChartData = jdDataArray.map(item => {
    const jdName = item.jd_id.substring(0, 8);
    const appliedCount = item.applied ? item.applied.length : 0;
    const color = colors[Math.floor(Math.random() * colors.length)]; 
    return {
      jdName,
      appliedCount,
      color,
    };
  });

  const jdLabels = jdChartData.map(data => data.jdName);
  const appliedCounts = jdChartData.map(data => data.appliedCount);
  const backgroundColors = jdChartData.map(data => data.color);

  const data = {
    labels: jdLabels,
    datasets: [
      {
        label: 'Number of Users Applied',
        data: appliedCounts,
        backgroundColor: backgroundColors,
      },
    ],
  };

  return (
    <div className='flex '>
      <Sidebar />
      <div className='flex flex-col w-full'>
        <Navbar />
        <div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen  font-semibold p-4">
          <h2 className="text-xl font-medium text-slate-400 dark:text-gray-500 px-8">Overview</h2>
          <h3 className="text-3xl font-semibold dark:text-white px-8">Dashboard</h3>
          <Header />
          <main className='px-8 mt-8  '>
            <h3 className="text-3xl font-semibold dark:text-white">Stats</h3>
            <div className="flex flex-row gap-8  ">
              <div className="w-1/3 h-1/5 bg-white/90 dark:bg-neutral-800 dark:text-white shadow-lg  rounded-lg hover:shadow-sky-500 duration-300 flex flex-col items-center justify-center mt-8 p-4">
                <Doughnut options={{ maintainAspectRatio: true }} data={userHrData} />
                <h1 className="text-lg my-2 dark:text-white/70">User/HR Ratio</h1>
              </div>
              <div className="w-2/3 h-1/5 bg-white/90 dark:bg-neutral-800 dark:text-white shadow-lg  rounded-lg hover:shadow-sky-500 duration-300 flex flex-col items-center justify-center mt-8 p-4">
                <Bar options={{ maintainAspectRatio: true }} data={data} />
                <h1 className="text-lg my-2 dark:text-white/70">Job Description Posting (/day)</h1>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
