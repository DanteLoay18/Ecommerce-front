import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import Link from "next/link";

function calculateTimeRemaining(endDate) {
  const countdownDate = new Date(endDate).getTime();
  const now = new Date().getTime();
  const distance = countdownDate - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
}

export default function ProductFutured({ products }) {
  const { addProduct, cartProducts } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [oferta, setOferta] = useState({});
  const [producto, setProducto] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const intervalRef = useRef();

  useEffect(() => {
    tieneOfertas();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  function tieneOfertas() {
    let productoMayorDescuento = null;
    let mayorDescuento = 0;
    let fechaActual = new Date();

    products.forEach(product => {
      if (product.stock !== 0) {
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
              startTime(fechaHoraFinObj);
            }
          }
        });
      }
    });
  }

  function startTime(endDate) {
    clearInterval(intervalRef.current);
    const { days, hours, minutes, seconds } = calculateTimeRemaining(endDate);
    setTimeRemaining({ days, hours, minutes, seconds });
    intervalRef.current = setInterval(() => {
      const { days, hours, minutes, seconds } = calculateTimeRemaining(endDate);
      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);
  }

  function addToCart(product) {
    const quantity = cartProducts.filter(id => id === product._id).length || 0;
    if (product.stock >= quantity + 1) {
      addProduct(product._id);
    } else {
      setOpen(true);
      setError('No hay más stock disponible');
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="product-featured">
      <h2 className="title">Oferta del día</h2>
      <div className="showcase-wrapper has-scrollbar">
        <div className="showcase-container">
          {producto ? (
            <div className="showcase" key={producto._id}>
              <div className="showcase-banner">
                <img src={producto.images[0]} alt={producto.description} className="showcase-img" />
              </div>
              <div className="showcase-content">
                <Link href={'/producto/' + producto._id}>
                  <h3 className="showcase-title">{producto.title}</h3>
                </Link>
                <p className="showcase-desc">{producto.description}</p>
                <div className="price-box">
                  <p className="price">S/{calcularDescuento(producto.price, oferta.percentage)}</p>
                  <del>S/{producto.price}</del>
                </div>
                <button onClick={() => addToCart(producto)} className="add-cart-btn">Añadir al carrito</button>
                <div className="showcase-status">
                  <div className="wrapper">
                    <p>Vendidos: <b>{producto.trending}</b></p>
                    <p>Disponibles: <b>{producto.stock}</b></p>
                  </div>
                  <LinearProgress variant="determinate" value={100 * producto.trending / producto.stock} />
                </div>
                <div className="countdown-box">
                  <p className="countdown-desc">¡Apúrate! La oferta termina en:</p>
                  <div className="countdown">
                    <div className="countdown-content">
                      <p className="display-number">{timeRemaining.days}</p>
                      <p className="display-text">Dias</p>
                    </div>
                    <div className="countdown-content">
                      <p className="display-number">{timeRemaining.hours}</p>
                      <p className="display-text">Horas</p>
                    </div>
                    <div className="countdown-content">
                      <p className="display-number">{timeRemaining.minutes}</p>
                      <p className="display-text">Min</p>
                    </div>
                    <div className="countdown-content">
                      <p className="display-number">{timeRemaining.seconds}</p>
                      <p className="display-text">Sec</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h4>No hay ofertas disponibles en este momento</h4>
          )}
        </div>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={6000} onClose={handleClose} key={'top' + 'center'}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
