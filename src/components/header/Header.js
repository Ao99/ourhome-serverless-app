// import { Auth } from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';
import { Navbar } from 'react-bootstrap';
import './Header.css';

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
                            : <Navbar.Text>
                                Test with <span style={{color: 'white'}}><b>test</b></span> and <span style={{color: 'white'}}><b>pass1234</b></span>
                              </Navbar.Text>
          }
          <Authenticator hideDefault={true} onStateChange={handleAuthStateChange}>
            <SignIn/>
            <Greetings/>
          </Authenticator>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default Header;