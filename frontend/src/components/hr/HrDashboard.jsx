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
  const [addJob, setAddJob] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [endDate, setEndDate] = useState("");

  const [jobData, setJobData] = useState([]);
  const [jdEditMode, setJdEditMode] = useState(false);

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

  const addJobHandler = () => {
    if (addJob === false) {
      setAddJob(true);
    } else {
      setAddJob(false);
    }
  };

  const toggleEditMode = (id) => {
    setJdEditMode((prevEditModes) => ({
      ...prevEditModes,
      [id]: !prevEditModes[id],
    }));
  };

  const handleSave = async (jd_id, title, description) => {
    const hr_id = localStorage.getItem("hr_id");
    const response = await fetch("/api/posted_jd", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "X-Hr-ID": hr_id,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jd_id: jd_id,
        title: title,
        description: description,
        // endDate: endDate,
        // experience: experience,
        // salary: salary,
        // qualification: qualification,
        // location: location,
      }),
    });
    if (response.ok) {
      toggleEditMode(jd_id);
      fetchJobData(hr_id);
      console.log("Job Edited Successfully");
    }
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

  // this is for the job description part :
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (id) => {
    setIsExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex dark:bg-neutral-900 ">
      <div className="fixed left-0">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full md:ml-[17rem]">
        <Navbar />
        <div className=" text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen  font-semibold p-4">
          <h1 className="text-3xl font-semibold dark:text-white/90 px-4 ">
            Dashboard
          </h1>
          <h2 className="text-4xl font-semibold px-4 dark:text-white/80 mt-2">
            Welcome {data.name}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-4 mt-12">
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
            <h1 className="text-3xl font-semibold dark:text-white/80 px-4">
              Posted Job Description
            </h1>
            <div className="mt-4 px-16">
              {jobData.map((job) => (
                <div
                  className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-col justify-between mb-4"
                  key={job.jd_id}
                >
                  <Link to={`/hr/home/${job.jd_id}`}>
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
                          <button
                            className="bg-sky-600 hover:bg-sky-700 duration-300 text-white rounded-lg px-4 py-2 mt-4"
                            onClick={() => handleToggle(job.jd_id)}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
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
