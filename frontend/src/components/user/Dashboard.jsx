import { useEffect, useState } from "react";
import Form from "../Form/Form";
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import Upload from "./Upload";
import Sidebar from "./Sidebar";
import {HiOutlineDocumentText} from 'react-icons/hi'
import {BsReverseLayoutTextWindowReverse} from 'react-icons/bs'

function Dashboard() {
  const [data, setData] = useState(null);
  const [jdData, setJdData] = useState(null);
  const [shortlisted, setShortlisted] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    async function fetchuserData() {
      try {

        const response = await fetch("/api/userautofill", {
          headers: {
            "X-User-ID": user_id,
          },
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async function fetchAppliedJD() {
      try {
        const response = await fetch("/api/user/applied", {
          headers: {
            "X-User-ID": user_id,
          },
        });
        const data = await response.json();
        setJdData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async function fetchShortJD() {
      try {
        const response = await fetch("/api/user/shortlisted", {
          headers: {
            "X-User-ID": user_id,
          },
        });
        const data = await response.json();
        setShortlisted(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchShortJD()
    fetchAppliedJD();
    fetchuserData();
  }, []);

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
          <h1 className="text-3xl dark:text-white mx-8 mt-4 font-semibold">Dashboard</h1>
          <h2 className="text-2xl dark:text-white mx-8 mt-4 font-semibold">Welcome {data?.name}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-8 mt-12">
            <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
              <div className="">
                <h2 className="text-xl font-normal dark:text-neutral-500 ">
                  Total Jobs Applied
                </h2>
                <h1 className="text-3xl font-semibold dark:text-white">
                  {
                    jdData?.length
                  }
                </h1>
              </div>
              <div>
                <HiOutlineDocumentText className="text-6xl text-sky-500" />
              </div>
            </div>
            <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
              <div className="">
                <h2 className="text-xl font-normal dark:text-neutral-500 ">
                  Shortlisted Jobs
                </h2>
                <h1 className="text-3xl font-semibold dark:text-white">
                  {
                    shortlisted?.length
                  }
                </h1>
              </div>
              <div>
                <BsReverseLayoutTextWindowReverse className="text-6xl text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
