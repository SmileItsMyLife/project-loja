import { observer } from 'mobx-react-lite';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const Admin = observer(() => {
  const products = [
    {
      code: 'P001',
      name: 'Product 1',
      category: 'Category 1',
      quantity: 10
    },
    {
      code: 'P002',
      name: 'Product 2',
      category: 'Category 2',
      quantity: 20
    },
    {
      code: 'P003',
      name: 'Product 3',
      category: 'Category 3',
      quantity: 30
    }
  ];

  return (
  <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
    <Column field="code" header="Code"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="category" header="Category"></Column>
    <Column field="quantity" header="Quantity"></Column>
  </DataTable>
  );
});