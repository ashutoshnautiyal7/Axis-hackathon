import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function ViewJD() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const user_id = localStorage.getItem('user_id');

        if (!token || user_id === null) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchJD = async () => {
        const user_id = localStorage.getItem('user_id');

        const response = await fetch('/api/viewjd', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-User-ID': user_id,
            },
        });
        const data = await response.json();
        setData(data);
    };
    useEffect(() => {
        fetchJD();
    }, []);

    const handleApply = async (jd_id) => {
        const user_id = localStorage.getItem('user_id');
        const response = await fetch('/api/applyjd', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'X-User-ID': user_id,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jd_id: jd_id,
            }),
        });
        const data = await response.json();
        console.log(data)
    }

    return (
        <div className='bg-slate-200 dark:bg-gray-950 min-h-screen'>
            <Navbar />
            <div className="container mx-auto">
                <div className="mx-24 w-10/12">
                    {data.map((item) => (
                        <div key={item.jd_id} className="bg-white text-white dark:bg-gray-800 p-4 my-4 rounded-lg shadow flex flex-row justify-between items-stretch ">
                            <div>
                                <h2 className="text-xl font-semibold">{item.title}</h2>
                                <p className="mt-2">{item.description}</p>
                            </div>
                            <div>
                                <button onClick={() => handleApply(item.jd_id)} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Apply</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ViewJD;
