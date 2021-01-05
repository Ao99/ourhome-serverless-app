// import { Auth } from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';
// import { Button } from 'react-bootstrap';


function Header(props) {
  // async function checkUser() {
  //   Auth.currentAuthenticatedUser()
  //     .then(user => console.log({ user }))
  //     .catch(err => console.log(err));
  //   console.log(await Auth.currentUserInfo());
  // }

  function handleAuthStateChange(state) {
    if (state === 'signedIn') {
      props.setIsSignedin(true);
    } else {
      props.setIsSignedin(false);
    }
  }

  return (
    <div>
      <Authenticator hideDefault={true} onStateChange={handleAuthStateChange} >
          <SignIn/>
          <SignUp/>
          <ConfirmSignUp/>
          <Greetings/>
      </Authenticator>
      {
      // <Button variant="outline-info" onClick={checkUser}>Check User</Button>
      }
    </div>
  );
}

export default Header;