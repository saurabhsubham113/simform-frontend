import './App.scss';
import { Routes, Route } from "react-router-dom";
import SignIn from './components/signIn/SignIn';
import SignUp from './components/signUpAndUpdate/SignUpAndUpdate';
import DashBoard from './components/dashBoard/DashBoard';
import UpdatePassword from './components/updatePassword/UpdatePassword';
import ProtectedRoutes from './auth/ProtectedRoutes';
import SignOut from './components/signOut/SignOut';

function App() {
  return (
    <div className="container">
      <SignOut />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* protected routes */}
        <Route element={<ProtectedRoutes />} >
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/update/user" element={<SignUp />} />
          <Route path="/update/password" element={<UpdatePassword />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
