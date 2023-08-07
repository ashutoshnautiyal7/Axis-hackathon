import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const HrProfile = () => {
  const jdCount = localStorage.getItem("jdCount");
  const [editMode, setEditMode] = useState(false)

  const [name, setName] = useState("")
  const [designation, setDesignation] = useState("")
  const [company_name, setCompany_name] = useState("")
  const [email, setEmail] = useState("")
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchHrData = async () => {
      const hr_id = localStorage.getItem("hr_id");
      const response = await fetch(`/api/hr`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "X-Hr-ID": hr_id,
        },
      });
      const data = await response.json();
      setName(data.name)
      setDesignation(data.designation)
      setCompany_name(data.company_name)
      setEmail(data.email)
      setData(data); // Update state with the fetched data
    };
    fetchHrData()
  }, [])

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleSave = async () => {
    const hr_id = localStorage.getItem("hr_id");
    const response = await fetch(`/api/hr`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "X-Hr-ID": hr_id,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        designation: designation,
        company_name: company_name,
        email: email,
      }),
    });
    const data = await response.json();
    setData(data); // Update state with the fetched data
    setEditMode(false)
  }

  return (
    <div className='flex '>
      <Sidebar />
      <div className='flex flex-col w-full'>
        <Navbar />
        <div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen pt-12 font-semibold p-4 px-8">
          <h1 className="text-3xl font-semibold dark:text-white/90 pb-4">User Profile</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-4 ">
              <img className="rounded-full w-48" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8DkpTp_KtuG2YOISTvi3NRKqVv8RRYM8f4A&usqp=CAU" />
            </div>
            <div className="justify-start items-start mt-12 ">
              <h1 className="text-2xl font-semibold dark:text-white/90">{data.name}</h1>
              <h1 className="text-xl font-normal dark:text-white/70">{data.designation}</h1>
            </div>
          </div>
          <div className="flex flex-col  gap-4 mt-8 w-3/4 space-y-2 shadow-lg p-6 dark:bg-neutral-800/90 rounded-lg">
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="name">Name</label>
                <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.name} onChange={(e) => setName(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="name">Name</label>
                <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.name} disabled />
              </div>
            }
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="name">Email</label>
                <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.email} onChange={(e) => setEmail(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="email">Email</label>
                <input type="text" name="email" id="email" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.email} disabled />
              </div>
            }
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="designation">Designation</label>
                <input type="text" name="designation" id="designation" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.designation} onChange={(e) => setDesignation(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="designation">Designation</label>
                <input type="text" name="designation" id="designation" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.designation} disabled />
              </div>
            }
            {
              editMode ? <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="companyname">Company Name</label>
                <input type="text" name="companyname" id="companyname" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.company_name} onChange={(e) => setCompany_name(e.target.value)} />
              </div> : <div className="flex flex-col gap-2">
                <label className="dark:text-white/80" htmlFor="companyname">Company Name</label>
                <input type="text" name="companyname" id="companyname" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.company_name} disabled />
              </div>
            }
            {
              editMode ? (
                <div className="flex flex-row space-x-4 w-fit ">
                  <button className=" border border-sky-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-sky-500 hover:text-white duration-300 shadow-lg hover:shadow-sky-500" onClick={() => handleSave()}>Save Changes</button>
                  <button className=" border border-red-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-red-500 hover:text-white duration-300 shadow-lg hover:shadow-red-500" onClick={handleEditMode}>Cancel</button>
                </div>
              ) : (
                <button className="justify-start w-fit border border-sky-500  dark:text-white/80 rounded-md px-4 py-2 hover:bg-sky-500 hover:text-white duration-300 shadow-lg hover:shadow-sky-500" onClick={handleEditMode}>Edit Profile</button>
              )
            }
          </div>


        </div>
      </div>
    </div>
  );
};

export default HrProfile;
