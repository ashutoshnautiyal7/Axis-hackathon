import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const Jobform = () => {
  const { id } = useParams();
  //   const jdCount = localStorage.getItem("jdCount");
  const [editMode, setEditMode] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [jdCount, setJdCount] = useState(0);

  const [data, setData] = useState([]);
  const [specificData, setSpecificData] = useState([]);

  //  the new states :
  const [description, setDescription] = useState(" ");
  const [endDate, setEndDate] = useState("");
  const [experience, setExperience] = useState("");

  const [location, setLocation] = useState("");
  const [qualification, setQualification] = useState("");
  const [salary, setSalary] = useState();
  const [skills, setSkills] = useState({});
  const [title, setTitle] = useState("");

  useEffect(() => {
    const hr_id = localStorage.getItem("hr_id");
    const token = localStorage.getItem("access_token");

    fetchJobData(hr_id);
  }, []);

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

    const specificJob = jobData.find((job) => job.jd_id === id);
    setSpecificData(specificJob);

    setDescription(specificJob.description || "");
    setEndDate(specificJob.end_date || "");
    setExperience(specificJob.experience || "");
    setLocation(specificJob.location || "");
    setQualification(specificJob.qualification || "");
    setSalary(specificJob.salary || "");
    setSkills(specificJob.skills || {});
    setTitle(specificJob.title || "");

    console.log("the specific job now is ", specificJob);
  };

  console.log("the specific job data ", specificData);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    const hr_id = localStorage.getItem("hr_id");
    const response = await fetch(`/api/posted_jd`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "X-Hr-ID": hr_id,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jd_id: id,
        description: description,
        end_date: endDate,
        experience: experience,
        location: location,
        qualification: qualification,
        salary: salary,
        skills: skills,
        title: title,
      }),
    });
    const data = await response.json();
    setSpecificData(data); // Update state with the fetched data
    setEditMode(false);
  };

  console.log("inside the job form ", jobData);

  return (
    <>
      <Navbar />
      <div className="flex flex-col  gap-4 mt-8 w-3/4 space-y-2 shadow-lg p-6 dark:bg-neutral-800/90 rounded-lg">
        {editMode ? (
          <div className="flex flex-col gap-2">
            <label className="dark:text-white/80" htmlFor="name">
              description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2"
              defaultValue={specificData.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="dark:text-white/80" htmlFor="name">
              Description
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2"
              defaultValue={specificData.description}
              disabled
            />
          </div>
        )}
        {editMode ? (
          <div className="flex flex-col gap-2">
            <label className="dark:text-white/80" htmlFor="end_date">
              End Date
            </label>
            <input
              type="text"
              name="end_date"
              id="end_date"
              className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2"
              defaultValue={specificData.end_date}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="dark:text-white/80" htmlFor="email">
              End Date
            </label>
            <input
              type="text"
              name="end_date"
              id="end_date"
              className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2"
              defaultValue={specificData.end_date}
              disabled
            />
          </div>
        )}
        {/* {/* {editMode ? ( */}
        <div className="flex flex-col gap-2">
          <label className="dark:text-white/80" htmlFor="designation">
            Designation
          </label>
          <input
            type="text"
            name="designation"
            id="designation"
            className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2"
            defaultValue={data.designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </div>
        ) : (
        <div className="flex flex-col gap-2">
          <label className="dark:text-white/80" htmlFor="designation">
            Designation
          </label>
          <input
            type="text"
            name="designation"
            id="designation"
            className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2"
            defaultValue={data.designation}
            disabled
          />
        </div>
        )}
        {editMode ? (
          <div className="flex flex-col gap-2">
            <label className="dark:text-white/80" htmlFor="companyname">
              Company Name
            </label>
            <input
              type="text"
              name="companyname"
              id="companyname"
              className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2"
              defaultValue={data.company_name}
              onChange={(e) => setCompany_name(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="dark:text-white/80" htmlFor="companyname">
              Company Name
            </label>
            <input
              type="text"
              name="companyname"
              id="companyname"
              className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2"
              defaultValue={data.company_name}
              disabled
            />
          </div>
        )}{" "}
        */}
        {editMode ? (
          <div className="flex flex-row space-x-4 w-fit ">
            <button
              className=" border border-sky-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-sky-500 hover:text-white duration-300 shadow-lg hover:shadow-sky-500"
              onClick={() => handleSave()}
            >
              Save Changes
            </button>
            <button
              className=" border border-red-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-red-500 hover:text-white duration-300 shadow-lg hover:shadow-red-500"
              onClick={handleEditMode}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="justify-start w-fit border border-sky-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-sky-500 hover:text-white duration-300 shadow-lg hover:shadow-sky-500"
            onClick={handleEditMode}
          >
            Edit Profile
          </button>
        )}
      </div>
    </>
  );
};

export default Jobform;
