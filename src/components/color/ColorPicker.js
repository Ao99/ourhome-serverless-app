import { useState, useEffect } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import { getAllColors, updateOneColor } from '../../services/ColorService.js';
import { SwatchesPicker } from 'react-color';

function ColorPicker(props) {
  const [show, setShow] = useState(false);
  const [color, setColor] = useState('');
  
  useEffect(() => {
    fetchColors(props.setColors);
  }, [props.setColors]);
  
  async function fetchColors(setColors) {
    var allColors = await getAllColors();
    setColors(allColors);
  }
  
  async function updateColor() {
    await updateOneColor(color);
    setShow(false);
    fetchColors();
  }

  return (
    <div>
      <Button size="lg" block variant="secondary" onClick={() => setShow(true)}>Color</Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set my color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SwatchesPicker onChangeComplete={color => setColor(color.hex)}/>
          <input
            onChange={e => setColor(e.target.value)}
            placeholder="My color"
            value={color}
            className="mt-3 ml-3"
            readOnly="readonly"
          />
          {
            props.isSignedin
              ? null
              : <p className="mt-3 ml-3">Please login to change your color.</p>
          }
        </Modal.Body>
        <Modal.Footer>
          <Container fluid>
            <Row>
              <Col>
                <Button size="lg" block variant="secondary" onClick={() => setShow(false)}>Close</Button>
              </Col>
              <Col>
                {
                  props.isSignedin
                    ? <Button size="lg" block variant="primary" onClick={updateColor}>Confirm</Button>
                    : <Button size="lg" block variant="primary" disabled>Confirm</Button>
                }
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ColorPicker;