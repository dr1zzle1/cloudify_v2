import './App.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Authorization/Login';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { auth } from './actions/user';
import Disk from './pages/Disk/Disk';
import Preloader from './components/Preloader/Preloader';
import Signup from './pages/Authorization/Signup';
function App() {
  const { isAuth, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(auth());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <div className="app">
        {isLoading ? (
          <Preloader />
        ) : !isAuth ? (
          <Routes>
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Disk />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
