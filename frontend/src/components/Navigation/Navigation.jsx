import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <div className='nav-options'>
          <div className='create-new-link'>
            <NavLink className="navlink" to="/spots/new">Create a New Spot</NavLink>
          </div>
          <div className='profile-button'>
            <ProfileButton user={sessionUser} />
          </div>
        </div>
      </>
    );
  } else {
    sessionLinks = (
      <>
        <div className='no-user-options'>
          <div className='modal-container'>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </div>
          <div className='modal-container'>
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className='nav-container'>
      <div>
        {isLoaded && sessionLinks}
      </div>
    </div>
    
  );
}

export default Navigation;