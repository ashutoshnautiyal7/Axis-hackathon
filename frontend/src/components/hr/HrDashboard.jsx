import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { IoDocumentOutline } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa";
import PostJD from "./PostJD";

function HrDashboard() {
  const navigateTo = useNavigate();
  const [data, setData] = useState({});
  const [jobData, setJobData] = useState([]);
  const [jdCount, setJdCount] = useState(0);

  useEffect(() => {
    const hr_id = localStorage.getItem("hr_id");
    const token = localStorage.getItem("access_token");

    if (hr_id === null || token === null) {
      navigateTo("/login");
    } else {
      fetchHrData(hr_id);
      fetchJobData(hr_id);
    }
  }, [navigateTo]);

  const fetchHrData = async (hr_id) => {
    const response = await fetch(`/api/hr`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "X-Hr-ID": hr_id,
      },
    });
    const data = await response.json();
    setData(data); // Update state with the fetched data
  };

  const fetchJobData = async (hr_id) => {
    const response = await fetch("/api/posted_jd", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "X-Hr-ID": hr_id,
      },
    });
    const data = await response.json();
    setJobData(data); // Update state with the fetched data
    setJdCount(data.length);
  };

  // to delete the particular job
  //   const handleDelete = async (jd_id) => {
  //     const hr_id = localStorage.getItem("hr_id");
  //     const response = await fetch(`/api/posted_jd/${jd_id}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         "X-Hr-ID": hr_id,
  //       },
  //     });
  //     if (response.ok) {
  //       fetchJobData(hr_id);
  //       console.log("Job Deleted Successfully");
  //     }
  //   };


  const handleToggle = (id) => {
    localStorage.setItem('jd_id', id)
    navigateTo('/hr/editjd')
  };

  return (
    <div className="flex dark:bg-neutral-950 ">
      <div className="fixed left-0">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full md:ml-[17rem]">
        <Navbar />
        <div className=" text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen  font-semibold p-4">
          <h1 className="text-3xl font-semibold dark:text-white/90 px-8 ">
            Dashboard
          </h1>
          <h2 className="text-4xl font-semibold px-8 dark:text-white/80 mt-8">
            Welcome {data.name}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-8 mt-12">
            <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
              <div className="">
                <h2 className="text-xl font-normal dark:text-neutral-500 ">
                  Total JD Posted
                </h2>
                <h1 className="text-3xl font-semibold dark:text-white">
                  {jdCount}
                </h1>
              </div>
              <div>
                <IoDocumentOutline className="text-6xl text-gray-400 dark:text-neutral-300" />
              </div>
            </div>
            <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
              <div className="">
                <h2 className="text-xl font-normal dark:text-neutral-500 ">
                  Candidates Applied
                </h2>
                <h1 className="text-3xl font-semibold dark:text-white">{4}</h1>
              </div>
              <div>
                <FaUserGraduate className="text-6xl text-gray-400 dark:text-neutral-300" />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h1 className="text-3xl font-semibold dark:text-white/80 px-8">
              Posted Job Description
            </h1>
            <div className="mt-6 px-16">
              {jobData.map((job) => (
                <div
                  className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-col justify-between mb-4"
                  key={job.jd_id}
                >

                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <div className="flex flex-col">
                        <h2 className="text-xl font-normal dark:text-neutral-500 ">
                          Role
                        </h2>
                        <h1 className="text-3xl font-semibold dark:text-white">
                          {job.title}
                        </h1>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-xl font-normal dark:text-neutral-500 ">
                          Description
                        </h2>
                        <h1 className="text-3xl font-semibold dark:text-white">
                          {job.description}
                        </h1>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-col">
                        <h2 className="text-xl font-normal dark:text-neutral-500 ">
                          Applied
                        </h2>
                        <h1 className="text-3xl font-semibold text-center dark:text-white">
                          {job.applied}
                        </h1>
                      </div>
                      <div className="flex flex-col">
                        <Link to="/hr/editjd"
                          className="bg-sky-600 hover:bg-sky-700 duration-300 text-white rounded-lg px-4 py-2 mt-4" onClick={() => handleToggle(job.jd_id)}>
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HrDashboard;
