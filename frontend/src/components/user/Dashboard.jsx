import Navbar from './Navbar'
import Upload from './Upload'
function Dashboard() {

    return (
        <div>
            <div className="bg-gray-200 min-h-screen dark:bg-gray-900">
                <Navbar />
                <div className="container">
                    <div className="flex justify-center items-center">
                        <Upload />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard
