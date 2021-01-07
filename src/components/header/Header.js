import { useState, useEffect } from 'react';
// import { Auth } from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';
import { getEnv } from '../../services/EnvService';
import { Alert, Button } from 'react-bootstrap';
import '@aws-amplify/ui/dist/style.css';

function Header(props) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    setUpEnvWarning();
  }, []);
  
  async function setUpEnvWarning() {
    try {
      const env = (await getEnv()).env;
      if(env === 'dev') setShow(true);
    } catch(err) {
    }
  }
  // // async function checkUser() {
  // //   Auth.currentAuthenticatedUser()
  // //     .then(user => console.log({ user }))
  // //     .catch(err => console.log(err));
  // //   console.log(await Auth.currentUserInfo());
  // // }

  function handleAuthStateChange(state) {
    if (state === 'signedIn') {
      props.setIsSignedin(true);
    } else {
      props.setIsSignedin(false);
    }
  }

  return (
    <div>
      {
        show ? <Alert variant="warning" onClose={() => setShow(false)} dismissible>
                    This is the dev page!
                  </Alert>
                : null
      }
      <Authenticator hideDefault={true} onStateChange={handleAuthStateChange} >
          <SignIn/>
          <SignUp/>
          <ConfirmSignUp/>
          <Greetings/>
      </Authenticator>
      <h5>Ourhome is a web app for sharing & recording household works.</h5>
      {
      // <Button variant="outline-info" onClick={checkUser}>Check User</Button>
      }
    </div>
  );
}

export default Header;