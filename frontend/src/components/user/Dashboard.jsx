import { useEffect, useState } from "react";
import Form from "../Form/Form";
import Navbar from "./Navbar";
import Upload from "./Upload";
import React from "react";
function Dashboard() {
  const [data, setData] = useState(null);

  const id = localStorage.getItem("user_id");

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    console.log(user_id);

    async function fetchuserData() {
      try {
        // Fetch API request with the user_id as a custom header
        const response = await fetch("http://localhost:5000/api/userautofill", {
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

    console.log("the user data is ", data);

    fetchuserData();
  }, []);

  console.log("the data is ", data);

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
