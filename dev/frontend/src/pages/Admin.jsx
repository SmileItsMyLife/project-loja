import {CreateProduct} from '../components/modals/CreateProduct';
import Container from 'react-bootstrap/Container';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';
import Table from 'react-bootstrap/Table';
import { deleteProduct, fetchProducts, fetchTypes, updateProduct } from '../http/productAPI';
import { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';


export const Admin = observer(() => {
  const { product } = useContext(Context);

  const [data, setData] = useState({
    typeId: 0,
    page: 1,
    limit: 24,
  });

  const fetchData = async () => {
    await fetchProducts(data.typeId, data.page, data.limit).then((data) => {
      product.setProducts(data);
    });

    await fetchTypes().then((data) => {
      product.setTypes(data);
    });
  };

  useEffect(() => {
    fetchData();
  }, [data]);

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

  return (
    <>
      <Container>
        <CreateProduct fetchData={fetchData}/>
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

      <Container>
        <CreateProduct fetchData={fetchData}/>
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
