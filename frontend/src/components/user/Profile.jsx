import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useState } from 'react';
function Profile() {
    const [user,setUser] = useState('');
    const [email,setEmail] = useState('');
    const [phone,setPhone] = useState('');
    const [degree,setDegree] = useState('');
    const [college,setCollege] = useState('');
    const [skills,setSkills] = useState('');
    const [experience,setExperience] = useState('');
    const [total,setTotal] = useState('');
    const [github,setGithub] = useState('');
    const [linkedin,setLinkedin] = useState('');
    const [city,setCity] = useState('');
    return (
        <div className='flex '>
            <Sidebar />
            <div className='flex flex-col w-full'>
                <Navbar />
                <div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen  font-semibold p-4">
                </div>
            </div>
        </div>
    )
}

export default Profile
