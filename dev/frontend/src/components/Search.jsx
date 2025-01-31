import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function Search({ onChangeSearch }) {
    return (
        <InputGroup className="mt-3 shadow">
            <Button className="custom-button" variant="outline-primary" id="button-addon1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
            </Button>
            <Form.Control
                className="custom-input"
                aria-label="Search"
                aria-describedby="basic-addon1"
                onChange={(e) => onChangeSearch(e)} // Capture input changes
            />
        </InputGroup>
    );
}
