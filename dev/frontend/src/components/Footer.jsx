import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
      <section style={{ backgroundColor: '#E1005A' }} className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom shadow'>
        <div className='me-5 d-none d-lg-block'>
          <span></span>
        </div>

        <div>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="twitter" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="google" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="linkedin" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon icon="gem" className="me-3" />
                Tricô Shop
              </h6>
              <p>
                Cria, Inspira-se, Imagina
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Produtos</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Roupa
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Material
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Instrumentos
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Brinhquedas
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Links úteis</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Amazon
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Trico Wiki
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Pedidos
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Ajuda
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contactos</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                Portimão, 8500-511 LT 8A esq 3
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                anickijandrij@gmail.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> +351 920 409 069
              </p>
              <p>
                <MDBIcon icon="print" className="me-3" /> +351 920 377 885
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2024 Copyright:
      </div>
    </MDBFooter>
  );
}