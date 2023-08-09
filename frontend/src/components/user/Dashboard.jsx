import { useEffect, useState } from "react";
import Form from "../Form/Form";
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import Upload from "./Upload";
import Sidebar from "./Sidebar";


function Dashboard() {
  const [data, setData] = useState(null);

  const id = localStorage.getItem("user_id");

  // useEffect(() => {
  //   const user_id = localStorage.getItem("user_id");



  //   async function fetchuserData() {
  //     try {

  //       const response = await fetch("/api/userautofill", {
  //         headers: {
  //           "X-User-ID": user_id,
  //         },
  //       });
  //       const data = await response.json();
  //       setData(data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }



  //   fetchuserData();
  // }, []);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user_id = localStorage.getItem('user_id')
    if (!token) {
      navigate('/login');
    }
    if (user_id === null) {
      navigate('/login')
    }

  }, [navigate]);

  return (
    <div className='flex '>
      <Sidebar />
      <div className='flex flex-col w-full'>
        <Navbar />
        <div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen  font-semibold p-4">
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
