import { Container, Row, Col } from 'react-bootstrap';
import { EnvelopeFill, Linkedin, Github } from 'react-bootstrap-icons';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer p-2 mt-1 bg-dark text-white">
      <Container>
        <Row>
          <Col>
            <a href="mailto: aodong99@gmail.com" rel="noreferrer" target="_blank">
              <EnvelopeFill width="32" height="32" fill="white"/>
            </a>
          </Col>
          <Col>
            <a href="https://www.linkedin.com/in/aodong" rel="noreferrer" target="_blank">
              <Linkedin width="32" height="32" fill="white"/>
            </a>
          </Col>
          <Col>
            <a href="https://github.com/Ao99/ourhome-serverless-app" rel="noreferrer" target="_blank">
              <Github width="32" height="32" fill="white"/>
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;