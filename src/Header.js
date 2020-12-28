import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';

function Header() {
  const AlwaysOn = (props) => {
    return (
      <div>
        <div>I am always here to show current auth state: {props.authState}</div>
        <button onClick={() => props.onStateChange('signUp')}>Show Sign Up</button>
      </div>
    );
  };
  
  function handleAuthStateChange(state) {
    if (state === 'signedIn') {
      /* Do something when the user has signed-in */
    }
  }
  
  return (
      <Authenticator hideDefault={true} onStateChange={handleAuthStateChange}>
          <AlwaysOn/>
          <SignIn/>
          <SignUp/>
          <ConfirmSignUp/>
          <Greetings/>
      </Authenticator>
  );
}

export default Header;