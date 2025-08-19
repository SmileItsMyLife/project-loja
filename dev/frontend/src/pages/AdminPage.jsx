import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useProduct } from '../hooks/useProducts';
import { useType } from '../hooks/useTypes';
import { Button } from 'react-bootstrap';
import TypeTable from '../components/tables/TypeTable';

import ProductTable from '../components/tables/ProductTable';
import CreateProductModal from '../components/modals/CreateProductModal';
import StatusModal from '../components/modals/StatusModal';

const AdminPage = observer(() => {
  const { product, updateProductById, deleteProductById, saveProduct } = useProduct();
  const { type, createAndRefreshType, removeAndRefreshType } = useType();

  const [editingRows, setEditingRows] = useState({});
  const [images, setImages] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', info: '', price: '', img: null, typeId: '' });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({ success: null, message: '', statusCode: null });

  return (
    <div className="p-4">
      <h2>🛠️ Product Admin</h2>

      <Button className="mb-3" onClick={() => setShowCreateModal(true)}>
        ➕ Create New Product
      </Button>

      <ProductTable
        products={product.products.rows}
        types={type.types}
        editingRows={editingRows}
        setEditingRows={setEditingRows}
        images={images}
        setImages={setImages}
        updateProductById={updateProductById}
        deleteProductById={deleteProductById}
        setUpdateStatus={setUpdateStatus}
        setShowStatusModal={setShowStatusModal}
      />

      <TypeTable
        types={type.types}
        deleteTypeById={removeAndRefreshType}
        createType={createAndRefreshType}
      />
        
      <CreateProductModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        saveProduct={saveProduct}
        types={type.types}
      />

      <StatusModal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        status={updateStatus}
      />
    </div>
  );
});

export default AdminPage;
