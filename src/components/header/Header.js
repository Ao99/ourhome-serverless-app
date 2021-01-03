import { Auth } from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';
import { Button } from 'react-bootstrap';

async function checkUser() {
  Auth.currentAuthenticatedUser()
    .then(user => console.log({ user }))
    .catch(err => console.log(err));
  console.log(await Auth.currentUserInfo());
}

function Header(props) {
  return (
    <div>
      <Authenticator hideDefault={true} onStateChange={props.onStateChange}>
          <SignIn/>
          <SignUp/>
          <ConfirmSignUp/>
          <Greetings/>
      </Authenticator>
      <Button variant="outline-info" onClick={checkUser}>Check User</Button>
    </div>
  );
}

export default Header;