import { useState } from "react"

function AdminHrForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [designation, setDesignation] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showForm, setShowForm] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    const data = {
      'name':name,
      'email':email,
      'designation':designation,
      'company_name':company,
      'password':password,
    }
    const res = await fetch('/api/admin/home/hr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    )
    if (res.ok) {
      alert('HR added successfully')
      setShowForm(false)
      setName('')
      setEmail('')
      setDesignation('')
      setPassword('')
      setConfirmPassword('')
      setCompany('')
    }
  }

  return (
    <div className="">
      {showForm ?
        null : <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 duration-300 w-fit mb-8 hover:bg-blue-600 font-normal text-white py-2 px-4 rounded-md">  Add Hr </button>
      }
      {showForm ?
        <form className="flex flex-col space-y-8 transistion-opacity duration-500 " onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <h3 className="text-3xl font-semibold dark:text-white">Add New HR</h3>
            <div className="flex flex-col space-y-6 dark:text-white/80 ">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold "> Name </label>
                <input id="name" name="name" type="text" defaultValue={name} onChange={(e) => setName(e.target.value)} required className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2" />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold "> Designation </label>
                <input id="name" name="name" type="text" defaultValue={designation} onChange={(e) => setDesignation(e.target.value)} required className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2" />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold "> Company Name </label>
                <input id="name" name="name" type="text" defaultValue={company} onChange={(e) => setCompany(e.target.value)} required className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2" />
              </div>
              <div className="">
                <label htmlFor="name" className="block text-sm font-semibold "> Email </label>
                <input id="name" name="name" type="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2" />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold "> Password </label>
                <input id="name" name="name" type="password" defaultValue={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2" />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold "> Confirm Password </label>
                <input id="name" name="name" type="password" defaultValue={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="rounded-md p-2 border-2 dark:bg-neutral-800 dark:border-neutral-700 w-1/2" />
              </div>
              <div className="">
                <button type="submit" className="bg-blue-500 duration-300 w-fit mb-8  hover:bg-blue-600 text-white font-normal py-2 px-4 rounded-md">Add HR</button>
              </div>
            </div>
          </div>
        </form>
        : null}
    </div>
  )
}

export default AdminHrForm
