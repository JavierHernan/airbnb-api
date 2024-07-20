import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
    const loginButton = document.querySelector('.login-button');
  if (errors.credential) {
    loginButton.classList.add('error');
  } else {
    loginButton.classList.remove('error');
  }
  }, [credential, password, errors.credential]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log("DATA LOGIN", data)
        if (data && data.message) {
          setErrors({credential: data.message});
        }
      });
  };

  const handleDemoUserLogin = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({ credential: data.message });
        }
      });
  };

  return (
    <>
      <div className="login-modal">
        <h1>Log In</h1>
        {errors.credential && (
            <p className="error-message">{errors.credential}</p>
          )}
        <form onSubmit={handleSubmit}>
        
          <label >
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder='Username or Email'
              required
            />
          </label>
          <label className='password-label'>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
          </label>
          
          <button className='login-button' type="submit" disabled={isButtonDisabled}>Log In</button>
          <button className='demo-button' type="button" onClick={handleDemoUserLogin}>Demo User</button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;