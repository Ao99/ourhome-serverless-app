import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';

function Header({ onStateChange }) {
  return (
      <Authenticator hideDefault={true} onStateChange={onStateChange}>
          <SignIn/>
          <SignUp/>
          <ConfirmSignUp/>
          <Greetings/>
      </Authenticator>
  );
}

export default Header;