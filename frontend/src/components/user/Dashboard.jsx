import { useEffect, useState } from "react";
import Form from "../Form/Form";
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import Upload from "./Upload";


function Dashboard() {
  const [data, setData] = useState(null);

  const id = localStorage.getItem("user_id");

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");



    async function fetchuserData() {
      try {

        const response = await fetch("/api/userautofill", {
          headers: {
            "X-User-ID": user_id,
          },
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }



    fetchuserData();
  }, []);


    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const user_id = localStorage.getItem('user_id')
        if (!token) {
            navigate('/login');
        }
        if (user_id === null) {
            navigate('/login')
        }

    }, [navigate]);
  return (
    <>
      <div>
        <div className="bg-gray-200 dark:bg-gray-900">
          <Navbar />
          <div className="container">
            <div className="flex justify-center items-center">
              <Upload />
            </div>
          </div>
        </div>
      </div>
      {!data ? <div>Loading .. </div> : <Form data={data} user_id={id} />}
    </>
  );
}

export default Dashboard;
