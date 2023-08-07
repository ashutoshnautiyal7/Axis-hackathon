import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import PostJD from "../Form/PostJD";

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
  }, []);

  console.log(jobData);

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

  console.log("the data is ", data);

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
    <div className="flex dark:bg-neutral-950 ">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full sm:pl-80">
        <div className=" ">
          <Navbar />
        </div>
        <div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen font-semibold p-4">
          <header className="">
            <h1 className="text-3xl font-semibold dark:text-white my-8 px-8">
              Hello, {data.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 px-8">
              <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-normal dark:text-neutral-500 ">
                    Your Profile
                  </h2>
                  <h1 className="text-2xl font-semibold dark:text-white/90">
                    Name : {data.name}
                  </h1>
                  <h1 className="text-2xl font-semibold dark:text-white/90">
                    Designation : {data.designation}
                  </h1>
                  <h1 className="text-2xl font-semibold dark:text-white/90">
                    Company : {data.company_name}
                  </h1>
                </div>
              </div>
              <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-normal dark:text-neutral-500 ">
                    Job Descriptions
                  </h2>
                  <h1 className="text-2xl font-semibold dark:text-white/90">
                    Total Posted : {jdCount}
                  </h1>
                  <h1 className="text-2xl font-semibold dark:text-white/90">
                    Active : {jdCount}
                  </h1>
                  <h1 className="text-2xl font-semibold dark:text-white/90">
                    Inactive : 0
                  </h1>
                </div>
              </div>
              <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-normal dark:text-neutral-500 ">
                    Users Applied
                  </h2>
                </div>
              </div>
            </div>
          </header>
          <main className="mt-8 px-8">
            <div className="flex flex-row">
              {addJob === false ? (
                <div>
                  <button
                    onClick={addJobHandler}
                    className="outline outline-2 dark:text-white outline-sky-600 hover:bg-sky-600 duration-300 shadow-lg hover:shadow-sky-500 py-2 px-4 rounded-md"
                  >
                    Add Job
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={addJobHandler}
                    className="outline outline-2 dark:text-white outline-sky-600 hover:bg-sky-600 duration-300 shadow-lg hover:shadow-sky-500 py-2 px-4 rounded-md"
                  >
                    View Job
                  </button>
                </div>
              )}
            </div>

            {addJob ? (
              <PostJD />
            ) : (
              <div className="mt-8">
                <div className="duration-300  rounded-xl  flex flex-col justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-normal dark:text-neutral-500 ">
                      Job Descriptions
                    </h2>

                    {jobData.map((job) => {
                      return (
                        <div
                          key={job.jd_id}
                          className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md p-4 cursor-pointer"
                          onClick={() => handleToggle(job.jd_id)}
                        >
                          {jdEditMode[job.jd_id] ? (
                            <div className="space-y-1">
                              {console.log(job)}
                              <div className="flex flex-col justify-between">
                                <label htmlFor="title" className="py-2">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                                  defaultValue={job.title}
                                  onChange={(e) => setTitle(e.target.value)}
                                />

                                <label htmlFor="title" className="py-2">
                                  Job Description
                                </label>
                                <input
                                  type="text"
                                  className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                                  defaultValue={job.description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                />

                                {/* <label htmlFor="endDate" className="py-2">
                                  End Date
                                </label>
                                <input
                                  type="text"
                                  className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                                  defaultValue={job.end_date}
                                  onChange={(e) => setEndDate(e.target.value)}
                                />

                                <label htmlFor="experience" className="py-2">
                                  Experience
                                </label>
                                <input
                                  type="text"
                                  className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                                  defaultValue={job.expereince}
                                  onChange={(e) =>
                                    setExperience(e.target.value)
                                  }
                                />

                                <label htmlFor="salary" className="py-2">
                                  Salary
                                </label>
                                <input
                                  type="number"
                                  className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                                  defaultValue={job.salary}
                                  onChange={(e) => setSalary(e.target.value)}
                                />

                                <label htmlFor="qualification" className="py-2">
                                  Qualification
                                </label>
                                <input
                                  type="text"
                                  className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                                  defaultValue={job.qualification}
                                  onChange={(e) =>
                                    setQualification(e.target.value)
                                  }
                                />

                                <label htmlFor="location" className="py-2">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                                  defaultValue={job.location}
                                  onChange={(e) => setLocation(e.target.value)}
                                /> */}

                                <button
                                  onClick={() =>
                                    handleSave(
                                      job.jd_id,
                                      title,
                                      description
                                      //   endDate,
                                      //   experience,
                                      //   salary,
                                      //   qualification,
                                      //   location
                                    )
                                  }
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between">
                                <div>
                                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {job.title}
                                  </h2>

                                  {
                                    <p className="text-gray-200 dark:text-gray-400 mt-2">
                                      Click to view the full content and edit.
                                    </p>
                                  }
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(job.jd_id);
                                    }}
                                    className="text-white-500 bg-red-500 px-4  hover:text-red-700 hover:bg-gray-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>

                              {isExpanded[job.jd_id] && (
                                <>
                                  <hr className="my-4" />
                                  <p className="text-gray-300">
                                    Description:{job.description}
                                  </p>
                                  <p className="text-gray-300">
                                    End Date: {job.end_date}
                                  </p>
                                  <p className="text-gray-300">
                                    Experience: {job.expereince}
                                  </p>
                                  <p className="text-gray-300">
                                    Salary: {job.salary} per annum
                                  </p>
                                  <p className="text-gray-300">
                                    Qualification: {job.qualification}
                                  </p>
                                  <p className="text-gray-300">
                                    Location: {job.location}
                                  </p>
                                  <p className="text-gray-300">
                                    Skills: {job?.skills?.join(",")}
                                  </p>
                                  <button
                                    onClick={() => toggleEditMode(job.jd_id)}
                                    className="text-blue-500 hover:underline"
                                  >
                                    Edit
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default HrDashboard;
