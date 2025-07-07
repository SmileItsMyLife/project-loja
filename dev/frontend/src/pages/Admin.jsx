import { observer } from 'mobx-react-lite';

import Container from 'react-bootstrap/Container';

import { useStore } from '../hooks/useStore';


export const Admin = observer(() => {
  const { product } = useStore();

  return (
    <>
      <Container className='m-5'>
        
      </Container>

      <Container className='m-5'>

      </Container>
    </>
  );
});
