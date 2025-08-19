import { Form, Image, Button } from 'react-bootstrap';

const ProductRow = ({
  key,
  row,
  types,
  editingRows,
  setEditingRows,
  images,
  setImages,
  updateProductById,
  deleteProductById,
  setUpdateStatus,
  setShowStatusModal,
}) => {
  const handleInputChange = (field, value) => {
    setEditingRows((prev) => ({
      ...prev,
      [row.id]: { ...prev[row.id], [field]: value },
    }));
  };

  const handleFileChange = (file) => {
    setImages((prev) => ({ ...prev, [row.id]: file }));
  };

  const handleUpdate = async () => {
    const updates = editingRows[row.id] || {};
    const formData = new FormData();

    formData.append('id', row.id);
    formData.append('name', updates.name ?? row.name);
    formData.append('info', updates.info ?? row.info);
    formData.append('price', updates.price ?? row.price);
    formData.append('typeId', updates.typeId ?? row.typeId);

    if (images[row.id]) formData.append('img', images[row.id]);

    const res = await updateProductById(formData);
    if (res.success) {
      setUpdateStatus({ success: true, message: 'Product updated successfully!', statusCode: 200 });
    } else {
      setUpdateStatus({ success: false, message: `Error: ${res.error}`, statusCode: res.statusCode || 500 });
    }
    setShowStatusModal(true);
  };

  const handleDelete = async () => {
    const res = await deleteProductById(row.id);
    if (!res.success) alert('Delete failed');
  };

  return (
    <tr>
      <td>{row.id}</td>
      <td>
        <Form.Control
          type="text"
          value={editingRows[row.id]?.name ?? row.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </td>
      <td>
        <Image src={`http://127.0.0.1:4245/${row.img}`} alt={row.name} thumbnail width={100} height={100} />
      </td>
      <td>
        <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} />
      </td>
      <td>
        <Form.Control
          as="textarea"
          rows={2}
          value={editingRows[row.id]?.info ?? row.info}
          onChange={(e) => handleInputChange('info', e.target.value)}
        />
      </td>
      <td>
        <Form.Select
          value={editingRows[row.id]?.typeId ?? row.typeId}
          onChange={(e) => handleInputChange('typeId', e.target.value)}
        >
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Form.Control
          type="number"
          value={editingRows[row.id]?.price ?? row.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
        />
      </td>
      <td>
        <Button variant="primary" onClick={handleUpdate}>Update</Button>
      </td>
      <td>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      </td>
    </tr>
  );
};

export default ProductRow;
