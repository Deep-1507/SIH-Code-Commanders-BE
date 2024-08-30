import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import ShopCreate from './components/ShopCreate';
import ShopLogin from './components/ShopLogin';
import CreateProduct from './components/CreateProduct';

export default function App() {
  return (
    <BrowserRouter>
      {/* header */}
      <Header />
      <Routes>
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
          <Route path='/shop-create' element={<ShopCreate />} />
          <Route path='/shop-login' element={<ShopLogin />} />

        <Route element={<PrivateRoute />}>
        <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-product' element={<CreateProduct />} />
        </Route>
        <Route element={<PrivateRoute />}>
        <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-product' element={<CreateProduct />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
