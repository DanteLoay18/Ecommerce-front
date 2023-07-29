
import styled from "styled-components";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import HeaderPrincipal from "@/components/HeaderPrincipal";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import Footer from "@/components/Foooter";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import { AuthContext } from "@/components/AuthContext";
import { useRouter } from "next/router";
import emailjs from '@emailjs/browser';


const StyledDiv = styled.div`
  max-width: 1350px;
  min-height: 400px;
  margin: 0 auto;
  padding: 0 20px;
  margin-bottom: 40px;
`;
const ColumnsWrapper = styled.div`
  display: grid ;
  grid-template-columns: 1fr ;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr ;
  }
  gap: 40px ;
  margin-top: 40px ;
`;

const Box = styled.div`
  background-color: #fff !!important;
  border-radius: 10px !!important;
  padding: 30px !!important;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0 !!important;
`;

const ProductImageBox = styled.div`
  width: 70px ;
  height: 100px;
  padding: 2px;
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;


export default function CartPage({categorias}) {
  const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
  const [products,setProducts] = useState([]);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [city,setCity] = useState('');
  const [postalCode,setPostalCode] = useState('');
  const [streetAddress,setStreetAddress] = useState('');
  const [country,setCountry] = useState('');
  const [isSuccess,setIsSuccess] = useState(false);
  const countMap = new Map();
  const [open, setOpen] = useState(false);
  const {isLoggedIn,user, logout} = useContext(AuthContext);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', {ids:cartProducts})
        .then(response => {
          setProducts(response.data);
        })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      updateOrder();
      enviarRecibo();
      clearCart();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
   function enviarRecibo(){
    if (!isEmailSent) {
      const fechaActual = new Date();
      const name = window.localStorage.getItem('nombre');
      const email = window.localStorage.getItem('email');
      fechaActual.setDate(fechaActual.getDate() + 3);
  
      const dia = fechaActual.getDate();
      const mes = fechaActual.getMonth() + 1;
      const anio = fechaActual.getFullYear();
  
      const totalOrden = window.localStorage.getItem('total');
      const fechaEntrega = `${dia}/${mes}/${anio}`;
  
      const envio = { name: name, fechaEntrega: fechaEntrega, total: totalOrden, from: email }
  
      emailjs.send("service_gqirp4f", "template_dy5tcla", envio, "nEQuq5QUJ8p7uvjng")
        .then((result) => {
          console.log("Correo electrónico enviado exitosamente");
          setIsEmailSent(true); // Actualiza el estado después de enviar el correo
        })
        .catch((error) => {
          console.log("Error al enviar el correo electrónico:", error.text);
        });
    }
    

    
  }
   function moreOfThisProduct(product) {
    const productos =JSON.parse(window.localStorage.getItem('cart'));
    const uniqueIds = [...new Set(products)];
    uniqueIds.map(producto=>{
      if(product._id===producto._id){
        const quantity = productos.filter(id => id === producto._id)?.length || 0;
        
        if(product.stock >= quantity+1){
          addProduct(producto._id);
        }else{
          setError('No hay mas Stock !')
          setOpen(true);
          
        }
      }
    })
    
    
    
  }
  function lessOfThisProduct(id) {
    removeProduct(id);
  }
  async function goToPayment() {
    const esValido= validarInformacion();
    if(isLoggedIn){
      
      if(esValido){
        const response = await axios.post('/api/checkout', {
          name,email,city,postalCode,streetAddress,country,
          cartProducts,
        });
        window.localStorage.setItem('orderId',response.data.orderId)
        window.localStorage.setItem('productsIds',response.data.productsIds)
        window.localStorage.setItem('total',total)
        window.localStorage.setItem('nombre',user.user.name)
        window.localStorage.setItem('email',user.user.email)
        if (response.data.url) {
          window.location = response.data.url;
        }
      }else{
        setOpen(true)
      }
      
    }else{
      router.push('/auth/login');
    }
    
  }
   function validarInformacion(){
    if(name.length<10){
      setError('Nombre Ingresado no es valido')
      return false;
    }
    else if(!isValidEmail(email)){
      setError('Email ingresado no es valido')
      return false;
    }
    else if(streetAddress.length<5){
      setError('Ciudad ingresado no es valido')
      return false;
    }
    else if(postalCode.length<2){
      setError('Codigo postal ingresado no es valido')
      return false;
    }else if(country.length===0){
      setError('Pais ingresado no es valido')
      return false;
    }
    return true;
  }

  const isValidEmail = (email) => {
  
    const match = String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
  
      return !!match;
  };

  async function updateOrder(){
    const orderId = window.localStorage.getItem('orderId');
    const productsIds = window.localStorage.getItem('productsIds').split(',');

    productsIds.forEach((item) => {
      countMap.set(item, countMap.has(item) ? countMap.get(item) + 1 : 1);
    });
    //const countArray = Array.from(countMap, ([elemento, conteo]) => ({ elemento, conteo }));
    
    const response = await axios.put('/api/checkout', {
      _id:orderId, products:productsIds
    });
  }

  let total = 0;
  for (const productId of cartProducts) {
    let price;
    const producto= products.find(p => p._id === productId);
    //price = products.find(p => p._id === productId)?.price || 0;
    if(tieneOfertas(producto)){
      price= calcularDescuento(producto.price, calcularOferta(producto));
    }else{
      price= producto?.price || 0;
    }
    total += price;
  }

  function tieneOfertas(product){
      
    const tieneOfertasValidas = product?.offer?.some((offer) => {
      const fechaHoraFinObj = new Date(offer.endDate);
      const fechaHoraActual = new Date();
      return fechaHoraFinObj > fechaHoraActual;
    });
    return tieneOfertasValidas || false;
    
  }

  function calcularOferta(product){
   
    const ofertaEnCurso = product.offer?.filter(offer => {
      const fechaHoraFinObj = new Date(offer.endDate);
      const fechaHoraActual = new Date();
      
      return fechaHoraFinObj > fechaHoraActual;
      
    });
    if (ofertaEnCurso) {
      return ofertaEnCurso[0]?.percentage;
    } else {
      return 0;
    }
  }

  function calcularDescuento(precio, oferta){
    
    const valorFinal= precio- precio*parseInt(oferta)/100;
   
    return valorFinal;
  }

  if (isSuccess) {
    
    return (
      <>
        <HeaderPrincipal categories={categorias}/>
        <StyledDiv>
          <ColumnsWrapper>
            <Box>
              <h2>Gracias por tu compra!</h2>
              <p>Te enviaremos un mensaje a tu correo.</p>
            </Box>
          </ColumnsWrapper>
        </StyledDiv>
        <Footer categories={categorias} ></Footer>
      </>
    );
  }
  return (
      < >
      <HeaderPrincipal categories={categorias}/>
      
          <StyledDiv>
            <ColumnsWrapper>
              <Box>
                  <h2>Carrito de compras</h2>
                  {!cartProducts?.length && (
                    <div>Tu carrito esta vacio</div>
                  )}
                  {cartProducts?.length > 0 && (
                    <Table>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio c/u</th>
                          <th>Precio Total Producto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product._id}>
                            <ProductInfoCell>
                              <ProductImageBox>
                                <img src={product.images[0]} alt={product.name}/>
                              </ProductImageBox>
                              {product.title}
                            </ProductInfoCell>
                            <td>
                              <Button
                                onClick={() => lessOfThisProduct(product._id)}>-</Button>
                              <QuantityLabel>
                                {cartProducts.filter(id => id === product._id).length}
                              </QuantityLabel>
                              <Button
                                onClick={() => moreOfThisProduct(product)}>+</Button>
                                <Snackbar anchorOrigin={{ vertical:'top',horizontal:'center' }} open={open} autoHideDuration={6000} onClose={handleClose} key={'top' + 'center'}>
                                      <Alert  onClose={handleClose} severity="error" sx={{ width: '100%' }}  >
                                        {error}
                                      </Alert>
                              </Snackbar>
                            </td>

                           
                            {tieneOfertas(product) && (
                                 <td>
                                    S/{calcularDescuento(product.price,calcularOferta(product))}
                                 </td>
                                )}

                            {!tieneOfertas(product) && (
                                  <td>
                                      S/{product.price}
                                  </td>
                                  )}
                            
                            <td>
                            {tieneOfertas(product) && (
                                 <td>
                                    S/{cartProducts.filter(id => id === product._id).length *calcularDescuento(product.price,calcularOferta(product))}
                                 </td>
                                )}
                            {!tieneOfertas(product) && (
                                  <td>
                                      S/{cartProducts.filter(id => id === product._id).length *product.price}
                                  </td>
                                  )}
                             
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>S/{total}</td>
                        </tr>
                      </tbody>
                    </Table>
                  )}
                </Box>
                {!!cartProducts?.length && (
                  <Box>
                    <h2>Informacion de la orden</h2>
                    <Input type="text"
                          placeholder="Nombre"
                          value={name}
                          name="name"
                          onChange={ev => setName(ev.target.value)} />
                    <Input type="text"
                          placeholder="Email"
                          value={email}
                          name="email"
                          onChange={ev => setEmail(ev.target.value)}/>
                    <CityHolder>
                      <Input type="text"
                            placeholder="Ciudad"
                            value={city}
                            name="city"
                            onChange={ev => setCity(ev.target.value)}/>
                      <Input type="text"
                            placeholder="Codigo Postal"
                            value={postalCode}
                            name="postalCode"
                            onChange={ev => setPostalCode(ev.target.value)}/>
                    </CityHolder>
                    <Input type="text"
                          placeholder="Direccion"
                          value={streetAddress}
                          name="streetAddress"
                          onChange={ev => setStreetAddress(ev.target.value)}/>
                    <Input type="text"
                          placeholder="Pais"
                          value={country}
                          name="country"
                          onChange={ev => setCountry(ev.target.value)}/>
                    <Button black block
                            onClick={goToPayment}>
                      Continuar con el pago
                    </Button>
                  </Box>
                )}
              </ColumnsWrapper>
          </StyledDiv>
            
          
       
      <Footer categories={categorias} ></Footer>
    </>
    
  );
}


export async function getServerSideProps() {
  await mongooseConnect();
  const categoria = await Category.find({}, null)
 
  return {
    props: {
      categorias:JSON.parse(JSON.stringify(categoria))
    },
  };
}