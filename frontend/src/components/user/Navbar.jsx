import { Link, useLocation } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
function Navbar() {
  const [nextTheme, setTheme] = useTheme();
  const navigateTo = useLocation();

  const LogUserOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    window.location.href = '/login'
  };

  const isActiveRoute = (route) => {
    return navigateTo.pathname === route;
  };

  return (
    <nav className="border-scale-300 border-b backdrop-blur-md py-1.5 transition-opacity border-slate-400 dark:text-white text-semibold mx-24">
      <div className="flex  mx-4 justify-between">
        <div className="mt-4">
           <Link className={`px-4 ${isActiveRoute('/home') ? 'text-purple-500 font-semibold' : ''}`} to="/home">Home</Link>
          <Link className={`px-4 ${isActiveRoute('/profile') ? 'text-purple-500 font-semibold' : ''}`} to="/profile">Profile</Link>
        </div>
        <div className="flex flex-row">
          <div className='lg:p-3 p-2 mt-2   duration-100 mx-2 rounded-lg  flex '>

            <button onClick={nextTheme === 'light' ? () => setTheme(nextTheme) : null} className={`${nextTheme === 'dark' ? 'text-amber-500 animate-spin-slow' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 stroke-2 dark:stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </button>
            <div className="border border-r border-black dark:border-white mx-3 my-1" />
            <button onClick={nextTheme === 'dark' ? () => setTheme(nextTheme) : null} className={`${nextTheme === 'light' ? 'text-yellow-200 animate-move-up' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-2 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </button>
          </div>
          <button className="p-3 mt-2 rounded-xl " onClick={LogUserOut}>
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
