import { Container, Row, Col } from 'react-bootstrap';
import { EnvelopeFill, Linkedin, Github } from 'react-bootstrap-icons';

function Footer() {
  return (
    <footer>
      <div className="p-3 my-1 bg-dark text-white">
        <Container>
          <Row>
            <Col>
              <a href="mailto: aodong99@gmail.com" target="_blank">
                <EnvelopeFill width="32" height="32" fill="white"/>
              </a>
            </Col>
            <Col>
              <a href="https://www.linkedin.com/in/aodong" target="_blank">
                <Linkedin width="32" height="32" fill="white"/>
              </a>
            </Col>
            <Col>
              <a href="https://github.com/Ao99/ourhome-serverless-app" target="_blank">
                <Github width="32" height="32" fill="white"/>
              </a>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;