import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-white/20 p-4 rounded-2xl">
        <Link to="/login">
          <button className="bg-slate-700">Go to Login</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
