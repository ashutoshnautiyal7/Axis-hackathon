import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

function CreateProfile() {
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

export default CreateProfile
