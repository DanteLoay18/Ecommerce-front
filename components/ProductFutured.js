import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import Link from "next/link";
export default function ProductFutured({products}){

    const [open, setOpen] = useState(false);
    const [oferta, setOferta]= useState({})
    const [producto, setProducto]= useState('')
    const [dias, setDias] = useState('00');
    const [horas, setHoras] = useState('00');
    const [minutos, setMinutos] = useState('00');
    const [segundos, setSegundos] = useState('00');
    const [endDate,setEndDate] = useState('00');
    const {addProduct, cartProducts} = useContext(CartContext);
    const [error, setError] = useState('');

    useEffect(()=>{
      tieneOfertas();
    }, [])

    
    const handleClose = () => {
      setOpen(false);
    };
    function tieneOfertas(){
      let productoMayorDescuento = null;
      let mayorDescuento = 0;
      let fechaActual = new Date();

      products.forEach(product => {
        if(product.stock!==0){
          product.offer?.forEach(offer => {
            const fechaHoraFinObj = new Date(offer.endDate);
            const fechaHoraActual = new Date();
  
            if (fechaHoraFinObj > fechaHoraActual) {
              const porcentajeDescuento = offer.percentage;
  
              if (porcentajeDescuento > mayorDescuento || (porcentajeDescuento === mayorDescuento && product.price > productoMayorDescuento.price)) {
                mayorDescuento = porcentajeDescuento;
                productoMayorDescuento = product;
                setProducto(productoMayorDescuento);
                setOferta(offer);
                setEndDate(fechaHoraFinObj);
              }
            }
          });
        }
        
      });

      
    }
    function calcularDescuento(precio, oferta){
      const valorFinal= precio- precio*parseInt(oferta)/100;
      return valorFinal;
    }
    
    let interval = useRef();

    const startTime = (endDate) => {
      const countdownDate = new Date(endDate).getTime();
      //const countdownDate= new Date('May 30 2024 00:00:00').getTime();
        interval = setInterval(()=>{
        const now = new Date().getTime();
        const distance = countdownDate - now;
        const days= Math.floor(distance /(1000*60*60*24));
        const hours= Math.floor((distance % (1000*60*60*24)/(1000*60*60)));
        const minutes= Math.floor((distance % (1000*60*60))/(1000*60));
        const seconds= Math.floor((distance % (1000*60))/1000);
        
        

        if(distance < 0){
          clearInterval(interval.current);
        }else{
          setDias(days);
          setHoras(hours);
          setMinutos(minutes);
          setSegundos(seconds);
        }
      }, 1000)
    }

    useEffect(()=>{
      startTime(endDate);
      return ()=>{
        clearInterval(interval.current)
      }
    },[endDate] )

    function verificacion(product){

      const quantity = cartProducts.filter(id => id === product._id)?.length || 0;
      
      
      if(product.stock >= quantity+1){
        addProduct(product._id)
        
      }else{
        setOpen(true)
        setError('No hay mas Stock')
        return;
      }
      
    }
    return (
        <div className="product-featured">
            
            <h2 className="title">Oferta del dia</h2>

            <div className="showcase-wrapper has-scrollbar">

              <div className="showcase-container">
                {producto  && (
                    <div className="showcase" key={producto._id}>
                  
                    <div className="showcase-banner">
                      <img src={producto.images[0]} alt={producto.description} className="showcase-img" />
                    </div>
  
                    <div className="showcase-content">
                      
                      
  
                      <Link href={'/producto/'+producto._id}>
                        <h3 className="showcase-title">{producto.title}</h3>
                      </Link>
  
                      <p className="showcase-desc">
                        {producto.description}
                      </p>

                      <div className="price-box">
                        <p className="price">S/{calcularDescuento(producto.price,oferta.percentage)}</p>

                        <del>S/{producto.price}</del>
                      </div>
  
                      <button onClick={() =>{if(producto.stock===0 ){ setOpen(true)  }else{verificacion(producto)} }} className="add-cart-btn">Añadir al carrito</button>
  
                      <div className="showcase-status">
                        <div className="wrapper">
                          <p>
                            Vendidos: <b>{producto.trending}</b>
                          </p>
  
                          <p>
                            dispobibles: <b>{producto.stock}</b>
                          </p>
                        </div>
  
                        <LinearProgress variant="determinate" value={100*producto.trending/producto.stock}  />
                      </div>
  
                      <div className="countdown-box">
  
                        <p className="countdown-desc">
                          Apurate! La oferta termina en:
                        </p>
  
                        <div className="countdown">
  
                          <div className="countdown-content">
  
                            <p className="display-number">{dias}</p>
  
                            <p className="display-text">Dias</p>
  
                          </div>
  
                          <div className="countdown-content">
                            <p className="display-number">{horas}</p>
                            <p className="display-text">Horas</p>
                          </div>
  
                          <div className="countdown-content">
                            <p className="display-number">{minutos}</p>
                            <p className="display-text">Min</p>
                          </div>
  
                          <div className="countdown-content">
                            <p className="display-number">{segundos}</p>
                            <p className="display-text">Sec</p>
                          </div>
  
                        </div>
  
                      </div>
  
                    </div>
  
                  </div>
                )}
                
                 {!producto && (

                  <h4>No hay ofertas disponibles en este momento</h4>
                 )}
              </div>

              
              <Snackbar anchorOrigin={{ vertical:'top',horizontal:'center' }} open={open} autoHideDuration={6000} onClose={handleClose} key={'top' + 'center'}>
                    <Alert  onClose={handleClose} severity="error" sx={{ width: '100%' }}  >
                      {error}
                    </Alert>
             </Snackbar>
            </div>

          </div>
    )
}