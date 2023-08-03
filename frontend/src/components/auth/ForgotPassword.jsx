import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email,setEmail] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userCredentails = {
            username: username,
            password: password,
            email:email,
        }
        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userCredentails),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('access_token', data.token);
                setMessage(data.message);
                navigate("/home")
            }
            else {
                setMessage("Login failed")
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 ">
             <h1 className="text-white text-3xl text-bold mb-4">Reset Password</h1>
            <div className="bg-white/20 p-6 rounded-2xl ">

            </div>
        </div>
    )
}

export default Login
