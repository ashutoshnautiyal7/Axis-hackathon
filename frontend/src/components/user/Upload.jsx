import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [fileStatus, setFileStatus] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const user_id = localStorage.getItem('user_id')
        if (!token) {
            navigate('/login');
        }
        if(user_id === null){
            navigate('/login')
        }

    }, [navigate]);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('resumeFile');
        const file = fileInput.files[0];
        if (!file) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/user/resume', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    'X-User-ID': localStorage.getItem('user_id'), // Include your JWT token
                },
                body: formData,
            });

            if (response.ok) {
                // File uploaded successfully
                setMessage('File uploaded successfully!');
                setFileStatus(true)
            } else {
                // Handle error if needed
                setMessage('Failed to upload file.');
            }
        } catch (error) {
            setMessage('Error uploading file.');
        }
    };
    return (
        <div className='bg-transparent h-fit w-fit my-8 '>
            <form className='flex flex-col justify-center items-center text-white'>
                <h2 className='text-2xl font-bold mb-4'>Upload Your Resume</h2>

                <div className="flex items-center justify-center w-96 my-4">
                    <label htmlFor="resumeFile" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${fileStatus ? 'border-green-500' :'border-gray-300'}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="resumeFile" type="file" className="hidden" />
                    </label>
                </div>

                <button type='submit' onClick={handleFileUpload} className='outline outline-2 outline-purple-500 text-black dark:text-white py-2 px-4 rounded-md hover:bg-purple-600 hover:text-bold duration-300'>
                    Submit
                </button>
                {message && <p className={message === 'File uploaded successfully!' ? 'text-green-500' : 'text-red-500'}>{message}</p>}
            </form>

            
        </div>
    );
}

export default Upload;
