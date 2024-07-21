import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { closeModal } = useModal();

  console.log("ERRORS", errors)

  useEffect(() => {
    // Check if any field is empty
    if (
      email &&
      username.length >= 4 &&
      firstName &&
      lastName &&
      password.length >= 6 &&
      confirmPassword
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          console.log("data SIGNUP", data)
          if (data?.errors) {
            console.log("DATA.ERRORS", data.errors)
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <div className='signup-container'>
        <h1 className='signup-title'>Sign Up</h1>
        {/* {errors.email && <p>{errors.email}</p>}
        {errors.username && <p>{errors.username}</p>}
        {errors.firstName && <p>{errors.firstName}</p>}
        {errors.lastName && <p>{errors.lastName}</p>}
        {errors.password && <p>{errors.password}</p>} */}
        {/* {errors.confirmPassword && (
            <p>{errors.confirmPassword}</p>
          )} */}
          {Object.values(errors).map((error, index) => (
          <p key={index} className='error-message'>{error}</p>
        ))}

        <form className='form' onSubmit={handleSubmit}>
          
          <label className='signup-label'>
            <h3 className='signup-h3'>
            First Name
            </h3>
            <input
            className='signup-input'
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            // required
            />
          </label>
          <label className='signup-label'>
            <h3 className='signup-h3'>
            Last Name
            </h3>
            <input
            className='signup-input'
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            // required
            />
          </label>
          

          <label className='label-spacing signup-label'>
            <h3 className='signup-h3'>
              Email
            </h3>
            <input
            className='signup-input'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            // required
            />
          </label>
          <label className='signup-label'>
            <h3 className='signup-h3'>
            Username
            </h3>
            <input
            className='signup-input'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            // required
            />
          </label>


          <label className='label-spacing signup-label'>
            <h3 className='signup-h3'>
            Password
            </h3>
            <input
            className='signup-input'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            // required
            />
          </label>
          <label className='signup-label'>
            <h3 className='signup-h3'>
            Confirm Password
            </h3>
            <input
              className='signup-input'
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            // required
            />
          </label>
          
          <button className='sign-up-modal-button' type="submit" disabled={isButtonDisabled}>Sign Up</button>
        </form>
      </div>

    </>
  );
}

export default SignupFormModal;