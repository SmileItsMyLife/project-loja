import { Table } from 'react-bootstrap';
import ProductRow from '../UI/ProductRow';

const ProductTable = ({
  products,
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
  return (
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
        {products?.map((row) => (
          <ProductRow
            key={row.id}
            row={row}
            types={types}
            editingRows={editingRows}
            setEditingRows={setEditingRows}
            images={images}
            setImages={setImages}
            updateProductById={updateProductById}
            deleteProductById={deleteProductById}
            setUpdateStatus={setUpdateStatus}
            setShowStatusModal={setShowStatusModal}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default ProductTable;
