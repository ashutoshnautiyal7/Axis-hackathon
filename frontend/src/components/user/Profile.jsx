import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PdfPreviewer from '../utils/PdfPreviewer';
import Upload from './Upload';
import { Link } from 'react-router-dom';

function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [degree, setDegree] = useState('');
    const [college, setCollege] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [total, setTotal] = useState('');
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [city, setCity] = useState('');
    const [data, setData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const  [viewResume, setViewResume] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const user_id = localStorage.getItem('user_id')
        if (!token) {
            navigate('/login');
        }
        if (user_id === null) {
            navigate('/login')
        }
        fetchUserData();
    }, [navigate]);

    const fetchUserData = async () => {
        const user_id = localStorage.getItem('user_id');
        const response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-User-ID': user_id,
            },
        });
        const data = await response.json();
        setData(data);
        console.log(data)
    };

    const handleSave = async () => {
        const user_id = localStorage.getItem('user_id');
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-User-ID': user_id,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: name,
                email: email,
                phone: phone,
                degree: degree,
                college_name: college,
                skills: skills,
                experience: experience,
                total_experience: total,
                github: github,
                city: linkedin,
                location: city,
            }),
        });
        const data = await response.json();
        console.log(data);
        setEditMode(false);
        fetchUserData();
    };

    return (
        <div className='flex '>
            <Sidebar />
            <div className='flex flex-col w-full'>
                <Navbar />
                <div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen  font-semibold p-4">
                    <h1 className="text-3xl dark:text-white mx-8 mt-4 font-semibold">Profile</h1>
                    <div className="flex flex-col  gap-4 mt-8 w-3/4 space-y-2 mx-8 shadow-lg p-6 dark:bg-neutral-800/90 rounded-lg">
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.username} onChange={(e) => setName(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.username} disabled />
                            </div>
                        }
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Phone</label>
                                <input type="email" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.phone} onChange={(e) => setPhone(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">Phone</label>
                                <input type="text" name="email" id="email" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.phone} disabled />
                            </div>
                        }
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Email</label>
                                <input type="email" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.email} onChange={(e) => setEmail(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">Email</label>
                                <input type="text" name="email" id="email" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.email} disabled />
                            </div>
                        }
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Degree</label>
                                <input type="text" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.degree} onChange={(e) => setDegree(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">Degree</label>
                                <input type="text" name="email" id="email" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.degree} disabled />
                            </div>
                        }
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">College</label>
                                <input type="email" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.college_name?.replace(/[\\[\]""]/g, '')} onChange={(e) => setCollege(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">College</label>
                                <input type="text" name="email" id="email" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.college_name?.replace(/[\\[\]""]/g, '')} disabled />
                            </div>
                        }
                         {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Skills</label>
                                <input type="email" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.skills} onChange={(e) => setSkills(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">Skills</label>
                                <input type="text" name="email" id="email" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.skills} disabled />
                            </div>
                        }
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Expereince</label>
                                <input type="email" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.experience} onChange={(e) => setExperience(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">Expereince</label>
                                <input type="text" name="email" id="email" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.experience} disabled />
                            </div>
                        }
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Total Expereince</label>
                                <input type="email" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.total_experience} onChange={(e) => setTotal(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">Total Expereince</label>
                                <input type="text" name="email" id="email" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.total_experience} disabled />
                            </div>
                        }
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Location</label>
                                <input type="email" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.city} onChange={(e) => setCity(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">Location</label>
                                <input type="text" name="email" id="email" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.city} disabled />
                            </div>
                        }
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">Github</label>
                                <input type="email" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.github} onChange={(e) => setGithub(e.target.value)} />
                                </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">Github</label>
                                <Link className='border bg-transparent text-lg dark:text-white/90 h-12 border-gray-300 dark:border-neutral-700 rounded-md p-2' to = {data.github}>{data.github}</Link>
                            </div>
                        }
                        {
                            editMode ? <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="name">LinkedIn</label>
                                <input type="email" name="name" id="name" className="border bg-transparent dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2" defaultValue={data.linkedin} onChange={(e) => setGithub(e.target.value)} />
                            </div> : <div className="flex flex-col gap-2">
                                <label className="dark:text-white/80" htmlFor="email">LinkedIn</label>
                                <Link className='border bg-transparent text-lg dark:text-white/90 border-gray-300 dark:border-neutral-700 rounded-md p-2' to = {data.linkedin}>{data.linkedin}</Link>
                            </div>
                        }
                        {
                            editMode ? 
                                <div className="flex flex-col gap-2">
                                    <Upload/>
                                </div> 
                                : 
                                <div className="flex flex-col gap-2">
                                {
                                    viewResume ? <div className="flex flex-col gap-2">
                                        <button className="outline w-fit outline-sky-500 px-4 hover:bg-sky-600 duration-300 text-white rounded-md p-2" onClick={() => setViewResume(false)}>Hide</button>
                                        <PdfPreviewer pdfBase64={data.resume_base64} />
                                        
                                    </div> : <div className="flex flex-col gap-2">
                                        <button className="outline w-fit outline-sky-500 px-4 hover:bg-sky-600 duration-300 text-white rounded-md p-2" onClick={() => setViewResume(true)}> Resume</button>
                                    </div>
                                }
                                </div>
 

                        }
     
                        {
                            editMode ? <button className="outline w-fit outline-sky-500 px-4 hover:bg-sky-600 duration-300 text-white rounded-md p-2" onClick={handleSave}>Save</button> : <button className="outline w-fit px-4 outline-sky-500 hover:bg-sky-600 duration-300 text-white rounded-md p-2" onClick={() => setEditMode(true)}>Edit</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
