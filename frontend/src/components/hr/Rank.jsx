import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { CiLinkedin } from "react-icons/ci";

function Rank() {
    const navigateTo = useNavigate();
    const [data, setData] = useState([]);
    const [ranked, setRanked] = useState([]);
    const [email, setEmail] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [numProfiles, setNumProfiles] = useState(0);
    const [message, setMessage] = useState('');
    const [confirm, setConfirm] = useState(false);

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

    const rankResume = async (jd_id, title, description, salary) => {
        const hr_id = localStorage.getItem("hr_id");
        localStorage.setItem("jd_id", jd_id);
        const content = title + " " + description;
        setName(title);
        setDescription(description);
        setSalary(salary);
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
        setNumProfiles(data.length);
        setRanked(data);
        const email = data.map((item) => item.email);
        setEmail(email);
    };

    const sendEmail = async (email) => {
        const hr_id = localStorage.getItem("hr_id");
        const today = new Date();
        today.setDate(today.getDate() + 2);

        const twoDaysLater = today.toISOString().split('T')[0];
        const response = await fetch('/api/hr/send_email', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "X-Hr-ID": hr_id,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                subject: 'Congratulations! You have been shortlisted for the job',
                body: `Congratulations! You have been shortlisted for the job. Your first round of interview will be scheduled on ${twoDaysLater} at 10:00 AM. Click the link on your dashboard to attend the test.`
            }),
        });
        const data = await response.json();

        setMessage("Email sent successfully!");
        setTimeout(() => {
            setMessage('');
        }, 5000);
    };

    const handleRankedData = async () => {
        const shortlisted = ranked.slice(0, numProfiles);
        const hr_id = localStorage.getItem("hr_id");
        const jd_id = localStorage.getItem("jd_id");
        console.log(shortlisted);
        const response = await fetch('/api/hr/shortlist', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "X-Hr-ID": hr_id,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                jd_id: jd_id,
                shortlisted: shortlisted
            }),
        });
        const data = await response.json();
        setMessage("Shortlisted candidates added to the database!");
        setConfirm(true);
    }


    return (
        <div className='flex '>
            <div className="fixed left-0">
                <Sidebar />
            </div>
            <div className='flex flex-col w-full md:ml-[18rem]'>
                <Navbar />
                <div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen pt-12 font-semibold p-4 px-8">
                    <h1 className="text-4xl font-bold dark:text-neutral-100 px-8">Ranking</h1>
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
                                        <button className="outline outline-sky-500 hover:bg-sky-700 duration-300 dark:text-white px-2 py-2 rounded-lg font-normal" onClick={() => rankResume(item.jd_id, item.title, item.description, item.salary)}>Rank Resume</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {
                        ranked.length === 0 ?
                            <div></div> :
                            (
                                <div className="mt-12 px-8">
                                    <div className="flex justify-between">
                                        <h1 className="text-4xl font-bold dark:text-neutral-100">Ranked Profiles</h1>
                                        <div>

                                            <button className="outline outline-sky-500 hover:bg-sky-700 duration-300 dark:text-white px-2 py-2 rounded-lg font-normal mt-4" onClick={() => sendEmail(email)}>Send Mail</button>
                                            <Link to="/hr/schedule">
                                                <button className="outline outline-sky-500 hover:bg-sky-700 duration-300 dark:text-white px-2 py-2 rounded-lg font-normal mt-4 ml-4" >Schedule Test</button>
                                            </Link>
                                        </div>

                                    </div>

                                    <div className=" mt-6  mb-12">
                                        <h1 className="text-3xl mt-2 font-semibold dark:text-neutral-300 px-4">Role : {name}</h1>
                                        <p className="text-xl mt-2 font-normal dark:text-neutral-400 px-4">Description : {description}</p>
                                        <p className="text-xl mt-2 font-normal dark:text-neutral-400 px-4">Salary : {salary}</p>
                                    </div>

                                    <div className="overflow-x-auto mt-6 ">
                                        <div className="mt-6 mb-6 flex flex-row justify-between">
                                            <div className="flex flex-row">
                                                <label className="text-lg font-semibold dark:text-neutral-100">Number of Profiles: {numProfiles}</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={ranked.length}
                                                    step="1"
                                                    value={numProfiles}
                                                    onChange={(e) => setNumProfiles(parseInt(e.target.value))}
                                                    className="ml-4 w-56 bg-neutral-200 text-sky-600 appearance-none rounded-lg h-3 outline-none duration-300 transition-colors"
                                                />
                                            </div>
                                            <div className="ml-4 flex flex-row">
                                                <span className="text-xl font-semibold dark:text-green-500">{message} </span>
                                            </div>
                                        </div>
                                        <table className="table-auto border-collapse w-full">
                                            <thead>
                                                <tr className="rounded-lg text-sm font-medium text-neutral-900 dark:text-neutral-100 text-left">
                                                    <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">SNO</th>
                                                    <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Name</th>
                                                    <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Email</th>
                                                    <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Phone</th>
                                                    <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">Score</th>
                                                    <th className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 uppercase">LinkedIn</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm font-normal text-neutral-900 dark:text-neutral-100">
                                                {
                                                    ranked.slice(0, numProfiles).map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-200 dark:hover:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-800 py-10">
                                                            <td className="px-4 py-4">{index + 1}</td>
                                                            <td className="px-4 py-4">{item.username}</td>
                                                            <td className="px-4 py-4">{item.email}</td>
                                                            <td className="px-4 py-4">{item.phone === null ? <p className="text-gray-400">-</p> : item.phone}</td>
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
                                    <button className="outline outline-sky-500 hover:bg-sky-700 duration-300 dark:text-white px-2 py-2 rounded-lg font-normal mt-16" onClick={handleRankedData} >Confirm Candidate</button>
                                    {
                                        confirm === true ?
                                            <Link to="/hr/shortlist">
                                                <button className="outline outline-sky-500 hover:bg-sky-700 duration-300 dark:text-white px-2 py-2 rounded-lg font-normal mt-16 ml-4" >View Detials</button>
                                            </Link> : <div></div>
                                    }
                                </div>
                            )}
                </div>
            </div>
        </div>
    );
}

export default Rank;
