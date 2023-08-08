import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Jobform = () => {
  // const { id } = useParams();
  // const jdCount = localStorage.getItem("jdCount");
  const jd_id = localStorage.getItem('jd_id');
  const hr_id = localStorage.getItem('hr_id')
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchJobData = async (hr_id) => {
    const response = await fetch("/api/posted_jd", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "X-Hr-ID": hr_id,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    const filteredData = responseData.filter(job => jd_id === job.jd_id);
    console.log(filteredData[0])
    setData(filteredData[0]);
  };

  const handleSave = async () => {
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
        end_date: endDate,
        expereince: experience,
        salary: salary,
        qualification: qualification,
        location: location,
      }),
    });

    setEditMode(false)
  }

  const handleDelete = (jd_id) => {
    return jd_id
  }

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  useEffect(() => {
    fetchJobData(hr_id)
  }, [])

  return (
    <div className="flex dark:bg-neutral-950 ">
      <div className="fixed left-0">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full md:ml-[17rem]">
        <Navbar />
        <div className=" text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen  font-semibold p-4 ">
          <h1 className="text-3xl font-semibold dark:text-white/90 px-8 ">Job Data</h1>
          <div className="flex flex-col  gap-4 mt-8 w-3/4 space-y-2 shadow-lg p-6 dark:bg-neutral-800/90 rounded-lg mx-8">
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="name">Name</label>
                <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.title} onChange={(e) => setTitle(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="name">Name</label>
                <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.title} disabled />
              </div>
            }
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="description">Description</label>
                <input type="text" name="description" id="description" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.description} onChange={(e) => setDescription(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="description">Description</label>
                <input type="text" name="description" id="description" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.description} disabled />
              </div>
            }
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="location">Location</label>
                <input type="text" name="location" id="location" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.location} onChange={(e) => setLocation(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="location">Location</label>
                <input type="text" name="location" id="location" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.location} disabled />
              </div>
            }
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="qualification">Qualification</label>
                <input type="text" name="qualification" id="qualification" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.location} onChange={(e) => setQualification(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="qualification">Qualification</label>
                <input type="text" name="qualification" id="qualification" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.location} disabled />
              </div>
            }

            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="expereince">Expereince</label>
                <input type="text" name="expereince" id="expereince" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.experience} onChange={(e) => setExperience(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="expereince">Expereince</label>
                <input type="text" name="expereince" id="expereince" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.experience} disabled />
              </div>
            }
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="skills">Skills</label>
                <input type="text" name="skills" id="skills" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.skills} onChange={(e) => setSkills(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="skills">Skills</label>
                <input type="text" name="skills" id="skills" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.skills} disabled />
              </div>
            }
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="salary">Salary</label>
                <input type="text" name="salary" id="salary" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.salary} onChange={(e) => setSalary(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="salary">Salary</label>
                <input type="text" name="salary" id="salary" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.salary} disabled />
              </div>
            }
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="endDate">End Date</label>
                <input type="date" name="endDate" id="endDate" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.salary} onChange={(e) => setEndDate(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="endDate">End Date</label>
                <input type="date" name="endDate" id="endDate" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.salary} disabled />
              </div>
            }
            {
              editMode ? (
                <div className="flex flex-row space-x-4 w-fit ">
                  <button className=" border border-sky-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-sky-500 hover:text-white duration-300 shadow-lg hover:shadow-sky-500" onClick={handleSave}>Save Changes</button>
                  <button className=" border border-red-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-red-500 hover:text-white duration-300 shadow-lg hover:shadow-red-500" onClick={handleEditMode}>Cancel</button>
                </div>
              ) : (
                <div className="flex flex-row space-x-4 w-fit ">
                  <button className="justify-start w-fit border border-sky-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-sky-500 hover:text-white duration-300 shadow-lg hover:shadow-sky-500" onClick={handleEditMode}>Edit Profile</button>
                  <button className="justify-start w-fit border border-red-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-red-500 hover:text-white duration-300 shadow-lg hover:shadow-red-500" onClick={() => handleDelete(job.jd_id)}>Delete Profile</button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobform;
