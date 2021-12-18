import './App.scss';
import { Routes, Route } from "react-router-dom";
import SignIn from './components/signIn/SignIn';
import SignUp from './components/signUp/SignUp';
import DashBoard from './components/dashBoard/DashBoard';


function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </div>
  );
}

export default App;
