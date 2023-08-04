import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function HrDashboard() {
    const navigateTo = useNavigate();
    const [data, setData] = useState({});
    const [addJob, setAddJob] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [jobData, setJobData] = useState([]);
    const [jdEditMode, setJdEditMode] = useState(false);
    const [addTitle, setAddTitle] = useState('');
    const [addDescription, setAddDescription] = useState('');
    const [jdCount, setJdCount] = useState(0);

    useEffect(() => {
        const hr_id = localStorage.getItem('hr_id');
        const token = localStorage.getItem('access_token');

        if (hr_id === null || token === null) {
            navigateTo('/login');
        } else {
            fetchHrData(hr_id);
            fetchJobData(hr_id)
        }
    }, []);

    const fetchHrData = async (hr_id) => {
        const response = await fetch(`/api/hr`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-Hr-ID': hr_id,
            },
        });
        const data = await response.json();
        setData(data); // Update state with the fetched data
    };

    const fetchJobData = async (hr_id) => {
        const response = await fetch('/api/posted_jd', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-Hr-ID': hr_id,
            },
        });
        const data = await response.json();
        setJobData(data); // Update state with the fetched data
        setJdCount(data.length)
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
        const hr_id = localStorage.getItem('hr_id');
        const response = await fetch('/api/posted_jd', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-Hr-ID': hr_id,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jd_id: jd_id,
                title: title,
                description: description,
            }),
        });
        if (response.ok) {
            toggleEditMode(jd_id);
            fetchJobData(hr_id);
            console.log('Job Edited Successfully');
        }
    };

    const postJD = async (title, description) => {
        const hr_id = localStorage.getItem('hr_id');
        const response = await fetch('/api/post_jd', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-Hr-ID': hr_id,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
            }),
        });
        if (response.ok) {
            fetchJobData(hr_id);
            setAddJob(false);
            console.log('Job Posted Successfully');
        }
    }

    return (
        <div className='bg-slate-100 dark:bg-slate-950 min-h-screen '>
            <Navbar />
            <div className='container mx-auto mt-8 flex flex-col   dark:text-white '>
                <h1 className='text-4xl mx-24'> Hello {data.name}</h1>
                <div className='flex flex-row justify-between mx-24 mt-8'>
                    <div className='flex flex-row'>
                        <div className='backdrop-blur-lg mx-4 shadow-md dark:shadow-none shadow-purple-400 duration-300 hover:shadow-purple-600  p-1 rounded-2xl w-96 '>
                            <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-900 duration-300 ">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Your Profile</h5>
                                <p className="font-normal text-lg dark:text-gray-200">Name : {data.name}</p>
                                <p className="font-normal text-lg dark:text-gray-200">Email : {data.email}</p>
                                <p className="font-normal text-lg dark:text-gray-200">Designation : {data.designation}</p>
                            </a>
                        </div>
                        <div className='backdrop-blur-lg  shadow-md dark:shadow-none shadow-purple-400 duration-300 hover:shadow-purple-600  p-1 rounded-2xl w-96 '>
                            <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-900 duration-300 ">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Stats</h5>
                                <p className="font-normal text-lg dark:text-gray-200">Total Job Posted : {jdCount}</p>
                            </a>
                        </div>
                    </div>
                    {
                        addJob === false ? (
                            <div>
                                <button onClick={addJobHandler} className="outline outline-2 hover:text-white outline-purple-600 hover:bg-purple-600 duration-300 hover:shadow hover:shadow-purple-500 py-2 px-4 rounded-md" >Add Job</button>
                            </div>
                        ) : (
                            <div>
                                <button onClick={addJobHandler} className="outline outline-2 hover:text-white outline-purple-600 hover:bg-purple-600 duration-300 hover:shadow hover:shadow-purple-500 py-2 px-4 rounded-md" >View Job</button>
                            </div>
                        )
                    }

                </div>
                <hr className='h-0.5 mx-24 min-w-fit my-8 bg-black/10' />

                {
                    addJob ? (
                        <div className='flex flex-col justify-center items-center transition-transform duration-500'>
                            <h1 className='text-2xl mb-4 font-bold'>Add Job</h1>
                            <div className='flex flex-row w-3/4'>
                                <label className='text-2xl font-semibold'>Job Title</label>
                                <input type='text' onChange={(e) => setAddTitle(e.target.value)} className='bg-transparent rounded-md mx-2 px-2 outline outline-1 outline-purple-500 w-3/4 h-8' placeholder='Software Engineer' />
                            </div>
                            <div className='flex flex-row w-3/4 my-3'>
                                <label className='text-2xl font-semibold'>Job Description</label>
                                <textarea type='text' onChange={(e) => setAddDescription(e.target.value)} className='bg-transparent rounded-md mx-2 px-2 outline outline-1 outline-purple-500 w-3/4 h-10' placeholder='Add Description Here' />
                            </div>
                            <button onClick={() => postJD(addTitle, addDescription)} className='outline outline-2 hover:text-white outline-purple-600 hover:bg-purple-600 duration-300 hover:shadow hover:shadow-purple-500 py-2 px-4 rounded-md' >Submit</button>
                        </div>
                    ) : (
                        <div className='flex flex-col justify-center items-center transition-transform duration-500'>
                            <h1 className='text-2xl mb-4 font-bold'>Posted Jobs</h1>
                            {
                                jobData.length === 0 ? (
                                    <h1 className='text-2xl font-bold mb-4'>No Jobs Posted</h1>
                                ) : (
                                    jobData.map((job) => (
                                        <div className='backdrop-blur-lg  dark:bg-white/20 my-2 shadow-md dark:shadow-none shadow-purple-400 duration-300 hover:shadow-purple-600  p-4 rounded-2xl w-3/4 ' key={job.jd_id}>
                                            {
                                                jdEditMode[job.jd_id] ? (
                                                    <div className='flex flex-row w-full justify-between '>
                                                        <div className='flex flex-col text-xl w-full mx-4'>
                                                            <div className='flex flex-col '>
                                                                <label className=' font-semibold'>Job Title</label>
                                                                <input type='text' onChange={(e) => setTitle(e.target.value)} className='bg-transparent rounded-md mx-2 px-2 outline outline-1 outline-purple-500' value={title || job.title} />
                                                            </div>
                                                            <div className='flex flex-col my-2.5 w-full'>
                                                                <label className='text-xl font-semibold'>Job Description</label>
                                                                <textarea type='text' onChange={(e) => setDescription(e.target.value)} className='bg-transparent scroll-m-0 outline outline-1 outline-purple-500 rounded-md px-2' value={description || job.description} />
                                                            </div>
                                                        </div>
                                                        <div className=''>
                                                            <button onClick={() => handleSave(job.jd_id, title, description)} className='outline outline-2 hover:text-white outline-purple-600 hover:bg-purple-600 duration-300 hover:shadow hover:shadow-purple-500 py-2 px-4 rounded-md' >Save</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-row w-full justify-between '>
                                                        <div className=' text-xl mx-4'>
                                                            <div className='flex flex-col'>
                                                                <label className=' font-semibold'>Job Title</label>
                                                                <p className='rounded-md  mx-2 px-2 w-96'>{job.title}</p>
                                                            </div>
                                                            <div className=' my-2.5 '>
                                                                <label className='text-xl font-semibold'>Job Description</label>
                                                                <p className=' rounded-md px-2 w-full'>{job.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className=''>
                                                            <button onClick={() => toggleEditMode(job.jd_id)} className='outline outline-2 hover:text-white outline-purple-600 hover:bg-purple-600 duration-300 hover:shadow hover:shadow-purple-500 py-2 px-4 rounded-md' >Edit</button>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    ))
                                )}
                        </div>
                    )}
            </div>
        </div>
    );
}

export default HrDashboard;
