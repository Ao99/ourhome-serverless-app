import { useState, useEffect } from 'react';
// import { Auth } from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';
import { getEnv } from '../../services/EnvService';
import { Navbar, Alert } from 'react-bootstrap';
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
    <header>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Brand href="#">
          <img
            alt=""
            src="/favicon.ico"
            width="30"
            height="30"
            className="d-inline-block align-top mr-1"
          />
          Ourhome App
        </Navbar.Brand>
        <Navbar.Text>Sharing & recording household works.</Navbar.Text>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
          {
            props.isSignedin ? null
                            : <Navbar.Text>Test with username "test" and password "test1234".</Navbar.Text>
          }
          <Authenticator hideDefault={true} onStateChange={handleAuthStateChange} >
            <SignIn/>
            <SignUp/>
            <ConfirmSignUp/>
            <Greetings/>
          </Authenticator>
        </Navbar.Collapse>
      </Navbar>
      
      {
        show ? <Alert variant="warning" onClose={() => setShow(false)} dismissible>
                    This is the dev page!
                  </Alert>
                : null
      }
    </header>
  );
}

export default Header;