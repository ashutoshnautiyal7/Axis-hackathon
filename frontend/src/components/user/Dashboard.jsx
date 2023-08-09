import { useEffect, useState } from "react";
import Form from "../Form/Form";
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import Upload from "./Upload";
import Sidebar from "./Sidebar";
import { HiOutlineDocumentText } from 'react-icons/hi'
import { BsReverseLayoutTextWindowReverse } from 'react-icons/bs'
import { PiTimerBold } from 'react-icons/pi'
import { SlCalender } from 'react-icons/sl'
function Dashboard() {
  const [data, setData] = useState(null);
  const [jdData, setJdData] = useState(null);
  const [shortlisted, setShortlisted] = useState(null);
  const [interview, setInterview] = useState(null)
  const [domain, setDomain] = useState(null)
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

    async function fetchInterview() {
      try {
        const response = await fetch("/api/user/interview", {
          headers: {
            "X-User-ID": user_id,
          },
        });
        const data = await response.json();
        setInterview(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async function suggestDomain () {
      try {
        const response = await fetch("/api/user/domain/suggest", {
          headers: {
            "X-User-ID": user_id,
          },
        });
        const data = await response.json();
        setDomain(data);
      }
      catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    suggestDomain()
    fetchInterview()
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
            <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
              <div className="">
                <h2 className="text-xl font-normal dark:text-neutral-500 ">
                  Scheduled Interviews
                </h2>
                <h1 className="text-3xl font-semibold dark:text-white">
                  {
                    // interview['selected_id'] ? interview['selected_id']?.length : 0
                  }
                </h1>
              </div>
              <div>
                <PiTimerBold className="text-6xl text-yellow-500" />
              </div>
            </div>
            <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
              <div className="">
                <h2 className="text-xl font-normal dark:text-neutral-500 ">
                  Interview On
                </h2>
                
              
              </div>
              <div>
                <SlCalender className="text-6xl text-red-500" />
              </div>
            </div>
          </div>

          <div className="mt-12 shadow-lg bg-zinc-100 dark:bg-neutral-800 rounded-lg mx-8 py-1 w-fit">
            <h1 className="text-3xl dark:text-white/40 mx-8 mt-4 font-semibold">Job Suggestion</h1>
            <p className="text-xl text-neutral-800  dark:text-white/75 mx-8 my-4 font-semibold">Your Resume matches <span className="font-bold dark:text-white ">{domain}</span>  Role.</p>
          </div>


          <div className="mt-12 ">
            <h1 className="text-3xl dark:text-white mx-8 mt-4 font-semibold">Jobs Applied</h1>
            {/* Table */}
            <div className="flex flex-col mt-4 mx-12">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2  sm:px-6 lg:px-8">
                  <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-neutral-200 dark:border-neutral-700">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-left text-xs leading-4 font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            Job Title
                          </th>
                          <th className="px-6 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-left text-xs leading-4 font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            Job Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800">
                        {
                          jdData?.map((item) => (
                            <tr key={item.jd_id}>
                              <td className="px-6 py-4 whitespace-no-wrap">
                                <div className="flex items-center">
                                  <div className="ml-4">
                                    <div className="text-sm leading-5 font-medium text-neutral-900 dark:text-neutral-200">
                                      {item.title}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap">
                                <div className="text-sm leading-5 text-neutral-900 dark:text-neutral-200">
                                  {item.description}
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
