import { Modal, Button } from 'react-bootstrap';

const StatusModal = ({ show, onHide, status }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>
        {status.success ? '✅ Success' : '❌ Error'}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p><strong>Status:</strong> {status.statusCode}</p>
      <p>{status.message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        OK
      </Button>
    </Modal.Footer>
  </Modal>
);

export default StatusModal;
