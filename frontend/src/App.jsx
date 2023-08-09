import {BrowserRouter,Routes ,Route} from 'react-router-dom'
import Login from './components/auth/Login'
import SignUp from './components/auth/SignUp'
import ForgotPassword from './components/auth/ForgotPassword'
import Home from './components/Home'
import Dashboard from './components/user/Dashboard'
import QuestionandAnswer from './components/user/QuestionandAnswer'
import Profile from './components/user/Profile'
import HrDashboard from './components/hr/HrDashboard'
import ViewJD from './components/user/ViewJD'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminHr from './components/admin/AdminHr'
import AdminUser from './components/admin/AdminUser'
import HrProfile from './components/hr/HrProfile'
import PostJD from './components/hr/PostJD'
import Jobform from './components/hr/Jobform'
import Rank from './components/hr/Rank'
import Quiz from './components/QuizWindow/Quiz'
import ScheduleTest from './components/hr/ScheduleTest'
import Shortlisted from './components/hr/Shortlisted'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/recovery" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/viewjd" element={<ViewJD />} />
        <Route path="/hr/home" element={<HrDashboard />} />
        <Route path="/hr/profile" element={<HrProfile />} />
        <Route path="/hr/postjd" element={<PostJD />} />
        <Route path="/hr/rank" element={<Rank/>} />
        <Route path="/hr/shortlist" element={<Shortlisted/>} />
        <Route path="/hr/schedule" element={<ScheduleTest/>} />
        <Route path="/hr/editjd" element={<Jobform />} />
        <Route path="/admin/home" element={<AdminDashboard />} />
        <Route path="/admin/home/hr" element={<AdminHr />} />
        <Route path="/admin/home/user" element={<AdminUser />} />
        <Route path="/interview-question" element={<Quiz/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
