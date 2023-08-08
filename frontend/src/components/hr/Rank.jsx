import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { CiLinkedin } from "react-icons/ci";

function Rank() {
    const navigateTo = useNavigate();
    const [data, setData] = useState([]);
    const [ranked, setRanked] = useState([]);

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

        // Filter data based on end_date
        const today = new Date();
        const date = today.toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
        const filteredData = data.filter((item) => item.end_date <= date);
        setData(filteredData);
    };

    const rankResume = async (jd_id,title, description) => {
        const hr_id = localStorage.getItem("hr_id");
        const content = title + " " + description;
        const response = await fetch('/api/hr/rank', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "X-Hr-ID": hr_id,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                jd_id: jd_id,
                content: content
            }),
        });
        const data = await response.json();
        data.sort((a, b) => b.score - a.score);
        setRanked(data);
    };

    return (
        <div className='flex '>
            <div className="fixed left-0">
                <Sidebar />
            </div>
            <div className='flex flex-col w-full md:ml-[18rem]'>
                <Navbar />
                <div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen pt-12 font-semibold p-4 px-8">
                    <h1 className="text-4xl font-bold dark:text-neutral-100 px-8">Expired JD</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-8 mt-12">
                        {data.map((item) => (
                            <div className="" key={item.jd_id}>
                                <div className="bg-zinc-100 shadow-lg hover:shadow-sky-600 duration-300 dark:bg-neutral-800 rounded-xl p-4 flex flex-row justify-between">
                                    <div className="">
                                        <h2 className="text-xl font-normal dark:text-neutral-500">
                                            {item.applied} Applicants
                                        </h2>
                                        <h1 className="text-3xl mt-2 font-semibold dark:text-white">
                                            {item.title}
                                        </h1>
                                        <p className="text-lg mt-2 font-normal dark:text-neutral-400">
                                            {item.end_date}
                                        </p>
                                    </div>
                                    <div>
                                        <button className="outline outline-sky-500 hover:bg-sky-700 duration-300 text-white px-2 py-2 rounded-lg font-normal" onClick={() => rankResume(item.jd_id,item.title, item.description)}>Rank Resume</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 px-8">
                        <h1 className="text-4xl font-bold dark:text-neutral-100">Ranked Resumes</h1>
                        <div className="overflow-x-auto mt-6">
                            <table className="table-auto border-collapse w-full">
                                <thead>
                                    <tr className="rounded-lg text-sm font-medium text-neutral-900 dark:text-neutral-100 text-left">
                                        <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">SNO</th>
                                        <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Name</th>
                                        <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Email</th>
                                        <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Phone</th>
                                        <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Rank</th>
                                        <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">LinkedIn</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-normal text-neutral-900 dark:text-neutral-100">
                                    {ranked.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-200 dark:hover:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-800 py-10">
                                            <td className="px-4 py-4">{index + 1}</td>
                                            <td className="px-4 py-4">{item.username}</td>
                                            <td className="px-4 py-4">{item.email}</td>
                                            <td className="px-4 py-4">{ item.phone === null ? <p className="text-gray-400">-</p> : item.phone }</td>
                                            <td className="px-4 py-4">{item.score.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-4">
                                                {
                                                    item.linkedin === null ? <p className="text-gray-400">-</p> : <Link to={item.linkedin} className="text-3xl text-sky-500" target="_blank" rel="noreferrer">
                                                        <CiLinkedin />
                                                    </Link>
                                                }

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Rank;
