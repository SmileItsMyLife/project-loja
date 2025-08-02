import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useProduct } from '../hooks/useProducts';
import { Button, Form, Table, Image, Modal } from 'react-bootstrap';
import { useType } from '../hooks/useTypes';

export const Admin = observer(() => {

  const { product, updateProductById, deleteProductById, saveProduct } = useProduct();
  const { type } = useType();

  console.log('Admin Page', type.types);

  const [editingRows, setEditingRows] = useState({});
  const [images, setImages] = useState({});

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    info: '',
    price: '',
    img: null,
    typeId: ''
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({
    success: null,
    message: '',
    statusCode: null,
  });

  const handleCreateInputChange = (field, value) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateFileChange = (file) => {
    setNewProduct(prev => ({ ...prev, img: file }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    // Simple validation for required fields
    const { name, info, price, typeId, img } = newProduct;

    if (!name || !info || !price || !typeId || !img) {
      alert('Please fill out all fields and upload an image.');
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
      setShowCreateModal(false);
      setNewProduct({ name: '', info: '', price: '', img: null, typeId: '' });
    } else {
      console.error('❌ Create error:', res.error);
      alert('Failed to create product');
    }
  };

  // Handle text inputs (name/info)
  const handleInputChange = (id, field, value) => {
    setEditingRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // Handle image input
  const handleFileChange = (id, file) => {
    setImages(prev => ({
      ...prev,
      [id]: file,
    }));
  };

  // Update product handler
  const handleUpdate = async (e, rowData) => {
    e.preventDefault();
    const updates = editingRows[rowData.id] || {};

    const formData = new FormData();
    formData.append('id', rowData.id);
    formData.append('name', updates.name ?? rowData.name);
    formData.append('info', updates.info ?? rowData.info);
    formData.append('price', updates.price ?? rowData.price);
    formData.append('typeId', updates.typeId ?? rowData.typeId);

    if (images[rowData.id]) {
      formData.append('img', images[rowData.id]);
    }

    const res = await updateProductById(formData);

    if (res.success) {
      setUpdateStatus({
        success: true,
        message: 'Produto atualizado com sucesso!',
        statusCode: 200,
      });
      setShowStatusModal(true); // ✅ ADD THIS LINE
    } else {
      setUpdateStatus({
        success: false,
        message: 'Erro ao atualizar o produto: ' + res.error,
        statusCode: res.statusCode || 500,
      });
      setShowStatusModal(true);
    }
  };

  // Delete product handler
  const handleDelete = async (e, id) => {
    e.preventDefault();
    const res = await deleteProductById(id);
    if (res.success) {
      console.log('Product deleted');
    } else {
      console.error('Delete error:', res.error);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="p-4">
      <h2>🛠️ Product Admin</h2>

      <Button className="mb-3" onClick={() => setShowCreateModal(true)}>
        ➕ Create New Product
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Upload</th>
            <th>Info</th>
            <th>Type</th>
            <th>Price</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {product.products.rows?.map((row) => (
            <tr key={row.id}>
              <td className="text-center align-middle">{row.id}</td>

              <td className="text-center align-middle">
                <div className="d-flex justify-content-center align-items-center">
                  <Form.Control
                    type="text"
                    value={editingRows[row.id]?.name ?? row.name}
                    onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                    style={{ width: '150px' }}
                  />
                </div>
              </td>

              <td className="text-center align-middle">
                <Image
                  src={`http://127.0.0.1:4245/${row.img}`}
                  alt={row.name}
                  thumbnail
                  style={{ width: 100, height: 100 }}
                />
              </td>

              <td className="text-center align-middle">
                <div className="d-flex justify-content-center align-items-center">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(row.id, e.target.files[0])}
                    style={{ width: '150px' }}
                  />
                </div>
              </td>

              <td className="text-center align-middle">
                <div className="d-flex justify-content-center align-items-center">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={editingRows[row.id]?.info ?? row.info}
                    onChange={(e) => handleInputChange(row.id, 'info', e.target.value)}
                    style={{ width: '200px' }}
                  />
                </div>
              </td>

              <td className="text-center align-middle">
                <Form.Select
                  value={editingRows[row.id]?.typeId ?? row.typeId}
                  onChange={(e) => handleInputChange(row.id, 'typeId', e.target.value)}
                  style={{ width: '150px' }}
                >
                  {type.types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Form.Select>
              </td>

              <td className="text-center align-middle">
                <div className="d-flex justify-content-center align-items-center">
                  <div className="input-group" style={{ width: '120px' }}>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingRows[row.id]?.price ?? row.price}
                      onChange={(e) => handleInputChange(row.id, 'price', parseFloat(e.target.value))}
                    />
                    <span className="input-group-text">€</span>
                  </div>
                </div>
              </td>

              <td className="text-center align-middle">
                <Button variant="primary" onClick={(e) => handleUpdate(e, row)}>
                  Update
                </Button>
              </td>

              <td className="text-center align-middle">
                <Button variant="danger" onClick={(e) => handleDelete(e, row.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.name}
                onChange={(e) => handleCreateInputChange('name', e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Info</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProduct.info}
                onChange={(e) => handleCreateInputChange('info', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => handleCreateInputChange('price', e.target.value)}
                  required
                />
                <span className="input-group-text">€</span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => handleCreateFileChange(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={newProduct.typeId}
                onChange={(e) => handleCreateInputChange('typeId', e.target.value)}
                required
              >
                <option value="">Select a type</option>
                {type.types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Create
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {updateStatus.success ? '✅ Atualização Bem-Sucedida' : '❌ Falha na Atualização'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Status:</strong> {updateStatus.statusCode}</p>
          <p>{updateStatus.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
})