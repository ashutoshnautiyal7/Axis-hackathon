<div className="">
<Sidebar />
</div>
<div className="flex flex-col w-full ">
<div className=" ">
  <Navbar />
</div>
<div className="text-xl bg-white/90 dark:bg-neutral-900 duration-300 min-h-screen font-semibold p-4">
  <main className="mt-8 px-8">
    <div className="flex flex-row">
      {addJob === false ? (
        <div>
          <button
            onClick={addJobHandler}
            className="outline outline-2 dark:text-white outline-sky-600 hover:bg-sky-600 duration-300 shadow-lg hover:shadow-sky-500 py-2 px-4 rounded-md"
          >
            Add Job
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={addJobHandler}
            className="outline outline-2 dark:text-white outline-sky-600 hover:bg-sky-600 duration-300 shadow-lg hover:shadow-sky-500 py-2 px-4 rounded-md"
          >
            View Job
          </button>
        </div>
      )}
    </div>

    {addJob ? (
      <PostJD />
    ) : (
      <div className="mt-8">
        <div className="duration-300  rounded-xl  flex flex-col justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-normal dark:text-neutral-500 ">
              Job Descriptions
            </h2>

            {jobData.map((job) => {
              return (
                <div
                  key={job.jd_id}
                  className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md p-4 cursor-pointer"
                  onClick={() => handleToggle(job.jd_id)}
                >
                  {jdEditMode[job.jd_id] ? (
                    <div className="space-y-1">
                      {console.log(job)}
                      <div className="flex flex-col justify-between">
                        <label htmlFor="title" className="py-2">
                          Title
                        </label>
                        <input
                          type="text"
                          className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                          defaultValue={job.title}
                          onChange={(e) => setTitle(e.target.value)}
                        />

                        <label htmlFor="title" className="py-2">
                          Job Description
                        </label>
                        <input
                          type="text"
                          className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                          defaultValue={job.description}
                          onChange={(e) =>
                            setDescription(e.target.value)
                          }
                        />

                        {/* <label htmlFor="endDate" className="py-2">
                          End Date
                        </label>
                        <input
                          type="text"
                          className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                          defaultValue={job.end_date}
                          onChange={(e) => setEndDate(e.target.value)}
                        />

                        <label htmlFor="experience" className="py-2">
                          Experience
                        </label>
                        <input
                          type="text"
                          className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                          defaultValue={job.expereince}
                          onChange={(e) =>
                            setExperience(e.target.value)
                          }
                        />

                        <label htmlFor="salary" className="py-2">
                          Salary
                        </label>
                        <input
                          type="number"
                          className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                          defaultValue={job.salary}
                          onChange={(e) => setSalary(e.target.value)}
                        />

                        <label htmlFor="qualification" className="py-2">
                          Qualification
                        </label>
                        <input
                          type="text"
                          className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                          defaultValue={job.qualification}
                          onChange={(e) =>
                            setQualification(e.target.value)
                          }
                        />

                        <label htmlFor="location" className="py-2">
                          Location
                        </label>
                        <input
                          type="text"
                          className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2"
                          defaultValue={job.location}
                          onChange={(e) => setLocation(e.target.value)}
                        /> */}

                        <button
                          onClick={() =>
                            handleSave(
                              job.jd_id,
                              title,
                              description
                              //   endDate,
                              //   experience,
                              //   salary,
                              //   qualification,
                              //   location
                            )
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {job.title}
                          </h2>

                          {
                            <p className="text-gray-200 dark:text-gray-400 mt-2">
                              Click to view the full content and edit.
                            </p>
                          }
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(job.jd_id);
                            }}
                            className="text-white-500 bg-red-500 px-4  hover:text-red-700 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {isExpanded[job.jd_id] && (
                        <>
                          <hr className="my-4" />
                          <p className="text-gray-300">
                            Description:{job.description}
                          </p>
                          <p className="text-gray-300">
                            End Date: {job.end_date}
                          </p>
                          <p className="text-gray-300">
                            Experience: {job.expereince}
                          </p>
                          <p className="text-gray-300">
                            Salary: {job.salary} per annum
                          </p>
                          <p className="text-gray-300">
                            Qualification: {job.qualification}
                          </p>
                          <p className="text-gray-300">
                            Location: {job.location}
                          </p>
                          <p className="text-gray-300">
                            Skills: {job?.skills?.join(",")}
                          </p>
                          <button
                            onClick={() => toggleEditMode(job.jd_id)}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </main>
</div>
</div>