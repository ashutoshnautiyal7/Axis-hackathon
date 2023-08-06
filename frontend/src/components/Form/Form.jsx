import { useState } from "react";

const Form = ({ data, user_id }) => {
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.mobile_number);
  const [collegeName, setCollegeName] = useState(data.college_name);
  const [degree, setDegree] = useState(data.degree[0]);
  const [city, setCity] = useState(data.city);
  const [skills, setSkills] = useState(data.skills.join(", "));
  const [experience, setExperience] = useState(data.experience);
  const [totalExperience, setTotalExperience] = useState(data.total_experience);
  const [github, setGithubUrl] = useState(data.github_url);
  const [linkedin, setLinkedinUrl] = useState(data.linkedin_url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/userautofill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': user_id,
      },
      body: JSON.stringify({
        'username': name,
        'email': email,
        'degree': degree,
        'phone': phone,
        'college_name': collegeName,
        'city': city,
        'skills': [skills],
        'experience': experience,
        'total_experience': totalExperience,
        'github': github,
        'linkedin': linkedin,
        'profile': 'created'
      }),
    });
    const data = await response.json();

  };


  return (
    <div className=" container mx-auto flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="mt-8 ">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold ">
                Name
              </label>

              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={data.name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-md w-[90%] p-2 border-2 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="user_email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="user_email"
                  name="user_email"
                  type="email"
                  defaultValue={data.email}
                  onChange={(e) => setEmail(e.target.value)}
                  // disabled
                  autoComplete="email"
                  required
                  className="rounded-md  w-[90%] p-2 border-2 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1 flex w-[90%]">
                <span className="px-3 py-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500">
                  +91
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={data.mobile_number}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="flex-1 focus:ring-purple-500 focus:border-purple-500 block w-full border-2 bg-gray-50 sm:text-sm border-gray-300  rounded-r-md p-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="college_name"
                className="block text-sm font-semibold "
              >
                College-Name
              </label>

              <div className="mt-1">
                <textarea
                  id="college_name"
                  name="college_name"
                  onChange={(e) => setCollegeName(e.target.value)}
                  defaultValue={data.college_name}
                  required
                  className="rounded-md w-[90%] p-2 border-2 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="degree" className="block text-sm font-semibold ">
                Degree
              </label>

              <div className="mt-1">
                <input
                  id="degree"
                  name="degree"
                  type="text"
                  defaultValue={data.degree[0]}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                  className="rounded-md w-[90%] p-2 border-2 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-semibold ">
                City
              </label>

              <div className="mt-1">
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={data.city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-md w-[90%] p-2 border-2 bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="skills" className="block text-sm font-semibold ">
                Skills
              </label>

              <div className="mt-1">
                <textarea
                  id="skills"
                  name="skills"
                  defaultValue={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                  className="rounded-md w-[90%] h-32 p-2 border-2 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-semibold ">
                Experience
              </label>

              <div className="mt-1">
                <textarea
                  id="skills"
                  name="skills"
                  onChange={(e) => setExperience(e.target.value)}
                  defaultValue={data.experience}
                  className="rounded-md w-[90%] h-32 p-2 border-2 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="total_experience"
                className="block text-sm font-semibold "
              >
                Years of Experience
              </label>

              <div className="mt-1">
                <input
                  id="total_experience"
                  name="total_experience"
                  type="text"
                  defaultValue={data.total_experience}
                  onChange={(e) => setTotalExperience(e.target.value)}
                  className="rounded-md w-[90%] p-2 border-2 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="total_experience"
                className="block text-sm font-semibold "
              >
                Social Links
              </label>

              <div className="mt-1">
                <input
                  id="github_url"
                  name="github_url"
                  type="text"
                  onChange={(e) => setGithubUrl(e.target.value)}
                  value={data.github_url}
                  className="rounded-md w-[90%] p-2 border-2 bg-gray-50"
                />
              </div>
              <div className="mt-3">
                <input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="text"
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  value={data.linkedin_url}
                  className="rounded-md w-[90%] p-2 border-2 bg-gray-50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="outline outline-2 outline-purple-500 text-purple-800 font-bold py-2 px-4 rounded-md hover:bg-purple-600 hover:text-white hover:text-bold duration-300"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
