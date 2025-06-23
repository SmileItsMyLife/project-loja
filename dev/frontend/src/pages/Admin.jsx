import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { observer } from 'mobx-react-lite';

import { CreateProduct } from '../components/modals/CreateProduct';
import { CreateType } from '../components/modals/CreateType';

import Container from 'react-bootstrap/Container';

import { useStore } from '../main';

import { deleteType, fetchTypes } from '../services/typeAPI';
import { deleteProduct, fetchProducts, updateProduct } from '../services/productAPI';

export const Admin = observer(() => {
  const { product } = useStore();

  const [data, setData] = useState({
    typeId: 0,
    page: 1,
    limit: 24,
  });
  const fetchData = async () => {
    await fetchTypes().then((data) => {
      product.setTypes(data);
    });

    await fetchProducts(data.typeId, data.page, data.limit).then((data) => {
      product.setProducts(data.products);
      console.log("Produtos: " + product.products.row)
      product.setTotalPages(data.totalPages);
    });
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  console.log(product.products)

  const handleUpdateProduct = async (object) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', object.id);
      formDataToSend.append('name', document.getElementsByName('name')[0].value);
      formDataToSend.append('price', document.getElementsByName('price')[0].value);
      formDataToSend.append('info', document.getElementsByName('info')[0].value);
      formDataToSend.append('typeId', document.getElementsByName('typeId')[0].value);
      const imgInput = document.getElementsByName('img')[0];

      // Check if an image file is selected
      if (imgInput.files.length > 0) {
        // Append the selected image file to the FormData
        formDataToSend.append('img', imgInput.files[0]);
      }

      const response = await updateProduct(formDataToSend);

      console.log('Produto atualizado com sucesso:', response);
      fetchData();
      // Perform any other actions needed after successful update
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      // Perform any error handling or display error messages
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await deleteProduct(id);
      console.log('Produto apagado com sucesso:', response);
      fetchData();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      // Perform any error handling or display error messages
    }
  };

  const handleDeleteType = async (id) => {
    try {
      const response = await deleteType(id);
      console.log('Produto apagado com sucesso:', response);
      fetchData();
    } catch (error) {
      console.error('Erro ao apagar tipo:', error);
      // Perform any error handling or display error messages
    }
  };

  return (
    <>
      <Container className='m-5'>
        <CreateType fetchData={fetchData} />
        <Table striped bordered hover size="sm" className='my-5'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
            </tr>
          </thead>
          {product.types && product.types.map((object) => (
            <tbody key={object.id}>
              <tr>
                <td><Form.Control name="formId" type="number" defaultValue={object.id} disabled /></td>
                <td><Form.Control name="name" type="text" defaultValue={object.name} disabled /></td>
                <td><Form.Control type="button" onClick={() => handleDeleteType(object.id)} defaultValue={"Apagar"} /></td>
              </tr>
            </tbody>
          ))}
        </Table>
      </Container>

      <Container className='m-5'>
        <CreateProduct fetchData={fetchData} />
        <Table striped bordered hover size="sm" className='my-5'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Imagem</th>
            </tr>
          </thead>
          {product.products.rows && product.products.rows.map((object) => (
            <tbody key={object.id}>
              <tr>
                <td><Form.Control name="formId" type="number" defaultValue={object.id} disabled /></td>
                <td><Form.Control name="name" type="text" defaultValue={object.name} /></td>
                <td><Form.Control name="price" type="number" defaultValue={object.price} /></td>
                <td><Form.Control name="info" type="text" defaultValue={object.info} /></td>
                <td><Form.Control name="typeId" type="number" defaultValue={object.typeId} /></td>
                <td><Form.Control name="img" type="file" /></td>
                <td><Form.Control type="button" onClick={() => handleUpdateProduct(object)} defaultValue={"Atualizar"} /></td>
                <td><Form.Control type="button" onClick={() => handleDeleteProduct(object.id)} defaultValue={"Apagar"} /></td>
              </tr>
            </tbody>
          ))}
        </Table>
      </Container>
    </>
  );
});
