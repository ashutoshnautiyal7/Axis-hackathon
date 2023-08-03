import { useState, useEffect } from "react"
function QuestionandAnswer() {
  const [data,setData] = useState([])
  useEffect(() => {
    fetch('/api/questionandanswer')
    .then(res => res.json())
    .then(data => setData(data))
  }, [])
  return (
    <div className='bg-slate-50 h-screen text-xl'>
            {data}
        </div>
  )
}

export default QuestionandAnswer
