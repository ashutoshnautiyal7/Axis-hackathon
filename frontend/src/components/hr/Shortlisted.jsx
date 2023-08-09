import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"

function Shortlisted() {
    const [data, setData] = useState([])
    const [applied, setApplied] = useState(0)
    const navigateTo = useNavigate();

    useEffect(() => {
        const hr_id = localStorage.getItem("hr_id");
        localStorage.removeItem("user_id")
        const token = localStorage.getItem("access_token");
        if (hr_id === null || token === null) {
            navigateTo("/login");
        }
        fetchJobData(hr_id);
    }, [navigateTo]);

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
        setData(filterData)
    }

    useEffect(() => {
        getShortlisted()
    }, [])

    return (
        <div className='flex '>
            <div className="fixed left-0">
                <Sidebar />
            </div>
            <div className='flex flex-col w-full md:ml-[18rem]'>
                <Navbar />
                <div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen pt-12 font-semibold p-4 px-8">
                    <h1 className="text-4xl px-8 mt-4  dark:text-neutral-200">Performance</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-8 mt-12">
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
                    </div>
                    <h1 className="text-3xl px-8 mt-12 dark:text-neutral-200">Shortlisted Candidates</h1>
                    {
                        data.length === 0 ? <h1 className="text-2xl text-center dark:text-neutral-200">No Shortlisted Candidates</h1> : (
                            // Table
                            <div className="overflow-x-auto mt-6 px-8">
                                <table className="table-auto border-collapse w-full">
                                    <thead>
                                        <tr className="rounded-lg text-sm font-medium text-neutral-900 dark:text-neutral-100 text-left">
                                            <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">SNO</th>
                                            <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Name</th>
                                            <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Email</th>
                                            <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Phone</th>
                                            <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-normal text-neutral-900 dark:text-neutral-100">
                                        {
                                            data.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-200 dark:hover:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-800 py-10">
                                                    <td className="px-4 py-4">{index + 1}</td>
                                                    <td className="px-4 py-4">{item.name}</td>
                                                    <td className="px-4 py-4">{item.email}</td>
                                                    <td className="px-4 py-4">{item.phone === null ? <p className="text-gray-400">-</p> : item.phone}</td>
                                                    <td className="px-4 py-4">{item.score.toFixed(2)}
                                                    </td>

                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }

                    <button onClick={() => navigateTo("/hr/schedule")} className="bg-sky-500 hover:bg-sky-600 duration-300 text-white font-semibold rounded-lg px-4 py-2 mt-8">Schedule Interview</button>
                </div>
            </div>
        </div>
    )
}

export default Shortlisted
