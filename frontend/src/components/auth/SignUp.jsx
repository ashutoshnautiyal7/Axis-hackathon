import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userCredentails = {
      username: username,
      password: password,
      email: email,
    };
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
        localStorage.setItem("access_token", data.token);
        setMessage(data.message);
        navigate("/home");
      } else {
        setMessage("Login failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // <div className="flex flex-col items-center justify-center h-screen bg-slate-950">
    //     <h1 className="text-white text-5xl text-bold mb-4 roboto">Register Form</h1>
    //     <div className="bg-slate-100/10 backdrop-blur-lg p-6 shadow-xl shadow-purple-900 hover:shadow-purple-700 duration-300 rounded-2xl w-96 min-h-fit ">
    //         <form onSubmit={handleSubmit} className="text-xl nunito">
    //
    //
    //
    //
    //             {message && <p className="text-red-500 mt-2">{message}</p>}
    //         </form>
    //         <div className="mt-4 text-white/90 text-bold text-center nunito text-lg">
    //             <Link className="hover:text-purple-700 duration-300" to="/login">Login</Link>
    //         </div>
    //     </div>
    // </div>

    <div>
      <section className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-2xl text-sky-500">SignUp</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                id="username"
                className="p-2 mt-8 rounded-xl border -mb-8"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
              />
              <input
                className="p-2 mt-8 rounded-xl border"
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@gmail.com"
              />
              <div className="relative">
                <input
                  className="p-2 rounded-xl border w-full"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>
              <button
                className="bg-sky-600 font-bold rounded-xl text-white py-2 hover:scale-105 duration-300"
                type="submit"
              >
                Register
              </button>
              {message && <p className="text-red-500 mt-2">{message}</p>}
            </form>

            <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
              <hr className="border-gray-400" />
              <p className="text-center text-sm">OR</p>
              <hr className="border-gray-400" />
            </div>
            <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-sky-500">
              <svg
                className="mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="25px"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Login with Google
            </button>
          </div>

          <div className="md:block hidden w-[388px]">
            <img className="rounded-2xl" src="/signup.svg" />
          </div>
        </div>
      </section>
    </div>
  );
}
export default Login;
