
import { FiSearch } from 'react-icons/fi';
function Searchbar() {
    return (
        <div className='w-full flex flex-row relative'>
            <FiSearch className='absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none w-11 h-11 p-3 dark:text-white/60 ' />
            <input
                type="text"
                className="bg-slate-200 dark:bg-neutral-800 border border-slate-800 outline-1  dark:outline-slate-800  focus:outline-sky-600 dark:focus:outline-sky-600 p-2 w-1/2 rounded-xl dark:text-white pl-8"
                placeholder="Search..."
            />
        </div>
    )
}

export default Searchbar
