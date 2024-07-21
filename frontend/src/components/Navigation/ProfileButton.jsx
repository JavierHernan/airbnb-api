import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import { useNavigate } from 'react-router-dom';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    // if (!showMenu) setShowMenu(true);
    setShowMenu(!showMenu);
  };

  const manageHandler = () => {
    // e.preventDefault()
    console.log("TEST")
    navigate('/manage-spots')
}

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(() => {
      navigate('/'); // Navigate to home or login page after logout
    });
  };

  const listContainer = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
    <div className='profile-modal-container'>
      <button className='profile-button' onClick={toggleMenu}>
          <FaUserCircle />
        </button>
        <div className='profile-modal'>
          <ul id='first-3' className={listContainer} ref={ulRef}>
            <li className='profile-modal-li'>Hello {user.firstName} {user.lastName}</li>
            <li className='profile-modal-li'>{user.username}</li>
            <li className='profile-modal-li'>{user.email}</li>
            <li className='manage-container'>
              <button className='manage-modal-button' onClick={manageHandler}>Manage Spots</button>
            </li>
            <li className='logout-container'>
              <button className='logout-button' onClick={logout}>Log Out</button>
            </li>
          </ul>
        </div>
        
    </div>
      
    </>
  );
}

export default ProfileButton;