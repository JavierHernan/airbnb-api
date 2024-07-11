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
      <header>
        <img src={logo} alt="Airbnb Logo" />
      </header>
      <Navigation isLoaded={isLoaded} />
      {/* {isLoaded && <Outlet />} */}
      <Outlet />
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