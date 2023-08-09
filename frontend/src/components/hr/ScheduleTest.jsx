import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useState } from 'react'

function ScheduleTest() {
    const [editMode, setEditMode] = useState(false)
    const [data, setData] = useState([])
    const [applied, setApplied] = useState(0)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [endDate, setEndDate] = useState('')
    const [questions, setQuestions] = useState(0)
    const [duration, setDuration] = useState(0)

    const handleEditMode = () => {
        setEditMode(!editMode)
    }

    const fetchJobData = async (hr_id) => {
        const response = await fetch("/api/posted_jd", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "X-Hr-ID": hr_id,
            },
        });
        const data = await response.json();
        const filteredData = data.filter((item) => item.jd_id === localStorage.getItem("jd_id"));
        setApplied(filteredData[0]['applied']);
        setTitle(filteredData[0]['title'])
        setDescription(filteredData[0]['description'])
    };

    const getShortlisted = async () => {
        const hr_id = localStorage.getItem("hr_id");
        const token = localStorage.getItem("access_token");
        const response = await fetch('/api/hr/shortlist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'access_token': token,
                'X-Hr-ID': hr_id
            }
        })
        const res = await response.json()
        const filterData = res.candidate_data.filter((item) => item.jd_id === localStorage.getItem("jd_id"));
        console.log(filterData)
        // setData(filterData)
    }

    useEffect(() => {
        fetchJobData(localStorage.getItem("hr_id"));
        getShortlisted()
    }, [])

    return (
        <div className="flex dark:bg-neutral-950 ">
            <div className="fixed left-0">
                <Sidebar />
            </div>
            <div className="flex flex-col w-full md:ml-[17rem]">
                <Navbar />
                <div className=" text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen  font-semibold p-4">
                    <h1 className="text-3xl font-semibold dark:text-white/90 px-8 mt-6 ">Schedule Interview</h1>
                    <div className="mt-8 px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-8 mt-12">
                            <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
                                <div className="">
                                    <h2 className="text-xl font-normal dark:text-neutral-500 ">
                                        Total Applied Candidates
                                    </h2>
                                    <h1 className="text-3xl font-semibold dark:text-white">
                                        {applied}
                                    </h1>
                                </div>
                            </div>
                            <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
                                <div className="">
                                    <h2 className="text-xl font-normal dark:text-neutral-500 ">
                                        Total Selected Candidates
                                    </h2>
                                    <h1 className="text-3xl font-semibold dark:text-white">
                                        {data.length}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="bg-zinc-100 shadow-lg w-3/4 mt-8 mx-8 duration-300 space-y-4 dark:bg-neutral-800 rounded-xl p-4 flex flex-col justify-between">
                            {
                                editMode ? <div className="flex flex-col gap-2">
                                    <label className="dark:text-white/80" htmlFor="name">Job Title</label>
                                    <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
                                </div> : <div className="flex flex-col gap-2">
                                    <label className="dark:text-white/80" htmlFor="name">Job Title</label>
                                    <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={title} disabled />
                                </div>
                            }
                            {
                                editMode ? <div className="flex flex-col gap-2">
                                    <label className="dark:text-white/80" htmlFor="name">Job Title</label>
                                    <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={description} onChange={(e) => setTitle(e.target.value)} />
                                </div> : <div className="flex flex-col gap-2">
                                    <label className="dark:text-white/80" htmlFor="name">Job description</label>
                                    <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={description} disabled />
                                </div>
                            }
                            {
                                editMode ? <div className="flex flex-col gap-2">
                                    <label className="dark:text-white/80" htmlFor="name">End Date</label>
                                    <input type="date" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </div> : <div className="flex flex-col gap-2">
                                    <label className="dark:text-white/80" htmlFor="name">End Date</label>
                                    <input type="date" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={endDate} disabled />
                                </div>
                            }
                            {
                                editMode ? <div className="flex flex-col gap-2">
                                    <label className="dark:text-white/80" htmlFor="name">Number of Questions</label>
                                    <input type="date" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={questions} onChange={(e) => setQuestions(e.target.value)} />
                                </div> : <div className="flex flex-col gap-2">
                                    <label className="dark:text-white/80" htmlFor="name">End Date</label>
                                    <input type="date" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={questions} disabled />
                                </div>
                            }
                            
                            <button className="bg-zinc-900 w-fit dark:bg-neutral-700 text-white/90 dark:text-white/80 rounded-md py-2 px-4 mt-4" onClick={handleEditMode}>{editMode ? "Save" : "Edit"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleTest
