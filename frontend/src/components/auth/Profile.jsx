import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import Navbar from "../user/Navbar";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import PdfPreviewer from "../utils/PdfPreviewer";

function Profile() {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    const [user, setUser] = useState({});
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [degree, setDegree] = useState("");
    const [email, setEmail] = useState("");
    const [resume, setResume] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const getUser = async () => {
        try {
            const response = await fetch("/api/user/profile", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "X-User-ID": localStorage.getItem("user_id"), // Include your JWT token
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
            const data = await response.json();
            setUser(data);
            setFullName(data.username);
            setPhoneNumber(data.phone);
            setDegree(data.degree);
            setEmail(data.email);
            setResume(data.resume_url);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleEditClick = () => {
        setEditMode(true);
    }
    const handleSaveChanges = async () => {
        
        if (!fullName || !phoneNumber || !degree || !email) {
            setMessage('Please fill all the required fields.');
            return;
          }
        
        try {
            // Send updated user details to the backend API for saving
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "X-User-ID": localStorage.getItem("user_id"), // Include your JWT token
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: fullName,
                    phone: phoneNumber,
                    degree,
                    email,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to update user details");
            }
            setEditMode(false);
            setMessage("Profile Updated Successfully!");
            setTimeout(() => {
                setMessage("");
            }, 3000);
            getUser()
        } catch (error) {
            console.error(error);
            setTimeout(() => {
                setMessage("Error Updating the Profile!");
            }, 3000);
        }

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
            } else {
                // Handle error if needed
                setMessage('Failed to upload file.');
            }
        } catch (error) {
            setMessage('Error uploading file.');
        }
    };

    return (
        <>
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
                <Navbar />
                <div className="dark:text-white container px-24 mt-16">
                    <div className="flex justify-between px-6 my-8">
                        <span className="text-4xl text-bold nunito">Welcome, {fullName.charAt(0).toUpperCase() + fullName.slice(1)}</span>
                    </div>
                    <div className="flex flex-row justify-between ">
                        <div className=" px-6  flex flex-col w-fit">
                            <span className="text-xl text-bold nunito my-3  rounded-lg ">Full Name:
                                {editMode ? (
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-md bg-transparent px-2" />
                                ) : (
                                    <span className="text-xl text-bold nunito my-2 px-2 py-1">{fullName}</span>
                                )}
                            </span>
                            <span className="text-xl text-bold nunito my-3">Email:
                                {editMode ? (
                                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent rounded-md px-2" />
                                ) : (
                                    <span className="text-xl text-bold nunito my-2 px-2 py-2">{email}</span>
                                )}
                            </span>
                            <span className="text-xl text-bold nunito my-3">Degree:
                                {editMode ? (
                                    <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} className="bg-transparent rounded-md px-2" />
                                ) : (
                                    <span className="text-xl text-bold nunito my-2 px-2 py-1">{degree}</span>
                                )}
                            </span>
                            <span className="text-xl text-bold nunito my-3">Phone Number:
                                {editMode ? (
                                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-transparent rounded-md  px-2"
                                    />
                                ) : (
                                    <span className="text-xl px-2 py-1 text-bold nunito ">{phoneNumber}</span>
                                )}
                            </span>
                            <span className="text-xl text-bold nunito my-2.5 inline-block ">Resume:
                                {editMode ? (
                                    <label htmlFor="resumeFile" className="flex flex-col items-center justify-center w-full h-36 border-2 mt-4 border-gray-300 border-dashed rounded-lg cursor-pointer ">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="resumeFile" type="file" className="hidden" />
                                    </label>
                                ) : (
                                    <span className="text-xl px-2 py-1 text-bold nunito ">✅</span>
                                )}
                            </span>
                            {/* <PdfPreviewer pdfBase64={resume} /> */}

                        </div>

                        <div className="dark:text-white text-black my-4">
                            {editMode ? (
                                <>
                                    <button onClick={handleSaveChanges} className="outline outline-2 outline-green-500 hover:bg-green-500 duration-300 hover:shadow-lg hover:shadow-green-500  py-2 px-4 rounded-md mr-4">Save Changes</button>
                                    <button onClick={() => setEditMode(false)} className="outline outline-2 outline-red-500 hover:bg-red-500 duration-300 hover:shadow-lg hover:shadow-red-500 py-2 px-4 rounded-md" > Cancel </button>
                                </>
                            ) : (
                                < button onClick={handleEditClick} className="outline outline-2 outline-purple-600 hover:bg-purple-600 duration-300 hover:shadow hover:shadow-purple-500 py-2 px-4 rounded-md" > Edit Profile </button>
                            )}
                        </div>

                    </div>
                    {message && (
                        <div className="flex justify-start px-6 my-4">
                            <span className="text-xl text-bold nunito">{message}</span>
                        </div>
                    )}


                </div>
            </div>
        </>
    );
}

export default Profile;
