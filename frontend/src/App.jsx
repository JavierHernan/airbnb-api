import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import logo from './images/image.png';
import SpotList from './components/SpotList/SpotList';
import SpotDetail from './components/SpotDetail/SpotDetail';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpotForm from './components/UpdateSpotForm/UpdateSpotForm';
import { NavLink } from 'react-router-dom';

import './index.css';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <div className='whole-display'>
        <div className='top-container'>
          <header>
            <div className='airbnb-logo-container'>
              <NavLink to="/"><img className='airbnb-logo' src={logo} alt="Airbnb Logo" /></NavLink>
              <div className='clone-text'>Clone</div>
            </div>
          </header>
          <div className='navigation'>
            <Navigation isLoaded={isLoaded} />

          </div>

        </div>

        {/* {isLoaded && <Outlet />} */}
        <div className='content-container'>
          <Outlet />
        </div>
      </div>

    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotList />
      },
      {
        path: '/spots/:id',
        element: <SpotDetail />
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />
      },
      {
        path: '/manage-spots',
        element: <ManageSpots />
      },
      {
        path: '/spots/:id/edit',
        element: <UpdateSpotForm />
      }
    ]
  }
]);

function App() {
  return (
    <>
      
      <RouterProvider router={router} />
    </>
  )
}

export default App;