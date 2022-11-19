import { Fragment, useContext } from "react";
import Home from "./Pages/Home/Home";
import { Routes, Route, Navigate } from 'react-router-dom';
import SignInSignUp from "./Pages/SignInSignUp/SignInSignUp";
import Context from "./Components/store/Context";
import Explore from "./Pages/Explore/Explore";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Edit profile/EditProfile";
import Members from "./Pages/Members/Members";
import PostDetails from "./Pages/Post Details/PostDetails";
import Notfound from "./Pages/NotFound/Notfound";


function App() {
  const ctx = useContext(Context);

  return (
    <Fragment>
      <Routes>
        <Route path="/" element={ctx.loginState ? <Home /> : <Navigate to={'/login'} />} /> 
        <Route path="/login" element={<SignInSignUp />} />
        <Route path="/signUp" element={<SignInSignUp /> } />
        <Route path="/profile/:user_id" element={ctx.loginState ? <Profile /> : <Navigate to={'/login'} />} />
        <Route path="/explore" element={ctx.loginState ? <Explore /> : <Navigate to={'/login'} />} />
        <Route path="/members" element={ctx.loginState ? <Members /> : <Navigate to={'/login'} />} />
        <Route path="/edit-profile" element={ctx.loginState ? <EditProfile /> : <Navigate to={'/login'} />} />
        <Route path="/post/:post_id" element={ctx.loginState ? <PostDetails /> : <Navigate to={'/login'} />} />
        <Route path="/404" element={ctx.loginState ? <Notfound /> : <Navigate to={'/login'} />} />
      </Routes>
    </Fragment>
  );
}

export default App;
