import {BrowserRouter,Routes ,Route} from 'react-router-dom'
import Login from './components/auth/Login'
import SignUp from './components/auth/SignUp'
import ForgotPassword from './components/auth/ForgotPassword'
import Home from './components/Home'
import Dashboard from './components/user/Dashboard'
import QuestionandAnswer from './components/user/QuestionandAnswer'
import Profile from './components/auth/Profile'
import HrDashboard from './components/hr/HrDashboard'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/recovery" element={<ForgotPassword/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/home" element={<Dashboard/>} />
            <Route path="/hr/home" element={<HrDashboard/>} />
            <Route path="/admin/home" element={<AdminDashboard/>} />
            <Route path="/interview-question" element={<QuestionandAnswer/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
