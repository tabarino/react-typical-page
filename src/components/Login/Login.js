import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/AuthContext';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT': {
      return { value: action.value, isValid: action.value.includes('@') };
    }
    case 'INPUT_BLUR': {
      return { value: state.value, isValid: state.value.includes('@') };
    }
    default: {
      return { value: '', isValid: null };
    }
  }
};

const passwordReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT': {
      return { value: action.value, isValid: (action.value.trim().length > 6) };
    }
    case 'INPUT_BLUR': {
      return { value: state.value, isValid: (state.value.trim().length > 6) };
    }
    default: {
      return { value: '', isValid: null };
    }
  }
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null
  });

  const ctx = useContext(AuthContext);
  
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // emailIsValid and passwordIsValid are alias to isValid in this Object Destructuring
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const setTimeoutIdentifier = setTimeout(() => {
      console.log('Check validity');
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    // Cleanup function - It ensures the setFormIsValid is called only 1s after the user stops typing
    // It won't be execute only in the first time the useEffect runs
    return () => {
      console.log('cleanup');
      clearTimeout(setTimeoutIdentifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({
      type: 'USER_INPUT',
      value: event.target.value
    });

    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({
      type: 'USER_INPUT',
      value: event.target.value
    });

    // setFormIsValid(
    //   event.target.value.trim().length > 6 && emailState.isValid
    // );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          label="Email"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
          ref={emailInputRef}>
        </Input>
        <Input
          id="password"
          label="Password"
          type="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
          ref={passwordInputRef}>
        </Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
