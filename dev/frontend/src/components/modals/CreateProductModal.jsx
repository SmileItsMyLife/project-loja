import { Modal, Form, Button } from 'react-bootstrap';
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const CreateProductModal = ({ show, onHide, newProduct, setNewProduct, saveProduct, types }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file) => {
    setNewProduct((prev) => ({ ...prev, img: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // eslint-disable-next-line react/prop-types
    const { name, info, price, typeId, img } = newProduct;

    if (!name || !info || !price || !typeId || !img) {
      alert('⚠️ Please fill out all fields and upload an image.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('info', info);
    formData.append('price', price);
    formData.append('typeId', typeId);
    formData.append('img', img);

    const res = await saveProduct(formData);

    if (res.success) {
      console.log('✅ Product created:', res.response);
      onHide();
      setNewProduct({ name: '', info: '', price: '', img: null, typeId: '' });
    } else {
      console.error('❌ Create error:', res.error);
      alert('Failed to create product');
    }

    setIsSubmitting(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>➕ Create Product</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newProduct.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </Form.Group>

          {/* Info */}
          <Form.Group className="mb-3">
            <Form.Label>Info</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newProduct.info}
              onChange={(e) => handleInputChange('info', e.target.value)}
              required
            />
          </Form.Group>

          {/* Price */}
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <div className="input-group">
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
              <span className="input-group-text">€</span>
            </div>
          </Form.Group>

          {/* Image */}
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              required
            />
          </Form.Group>

          {/* Type */}
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={newProduct.typeId}
              onChange={(e) => handleInputChange('typeId', e.target.value)}
              required
            >
              <option value="">Select a type</option>
              // eslint-disable-next-line react/prop-types
              {types?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={onHide}
              className="me-2"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProductModal;
