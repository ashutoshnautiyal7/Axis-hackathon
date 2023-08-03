import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userCredentails = {
            username: username,
            password: password,
            email: email,
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
        <div className="flex flex-col items-center justify-center h-screen bg-slate-950">
            <h1 className="text-white text-5xl text-bold mb-4 roboto">Register Form</h1>
            <div className="bg-slate-100/10 backdrop-blur-lg p-6 shadow-xl shadow-purple-900 hover:shadow-purple-700 duration-300 rounded-2xl w-96 min-h-fit ">
                <form onSubmit={handleSubmit} className="text-xl nunito">
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-1 text-white">
                            Username
                        </label>
                        <input type="text" id="username" className="w-full p-2 border rounded-md" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="user" />
                    </div>
                    <div className="mb-4 ">
                        <label htmlFor="email" className="block mb-1 text-white">
                            Email
                        </label>
                        <input type="text" id="email" className="w-full p-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@email.com" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 text-white">
                            Password
                        </label>
                        <input type="password" id="password" className="w-full p-2 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="userpass" />
                    </div>
                    <button type="submit" className="w-full border border-purple-700 text-white py-2 rounded-md hover:bg-purple-700 hover:text-white duration-300">
                        Register
                    </button>
                    {message && <p className="text-red-500 mt-2">{message}</p>}
                </form>
                <div className="mt-4 text-white/90 text-bold text-center nunito text-lg">
                    <Link className="hover:text-purple-700 duration-300" to="/login">Login</Link>
                </div>
            </div>
        </div>
    )
}
export default Login
