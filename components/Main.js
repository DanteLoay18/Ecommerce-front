import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { CartContext } from './CartContext';
import { LikeContext } from './likeContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import { useRouter } from 'next/router';
export default function Main({products , name, categories}){
    const [productosNuevos,setProductosNuevos] = useState([]);
    const [open, setOpen] = useState(false);
    const [titulo, setTitulo] = useState('');
    const router = useRouter();
    const [error, setError] = useState('')
    useEffect(()=>{
        newProducts();
        if(router.pathname==='/productos'){
          setTitulo('Todos los productos')
        }else if(router.pathname.includes('/frutas')){
            setTitulo(`Categoria ${name}`)
        }
        else if(router.pathname.includes('/suplementos')){
          setTitulo(`Categoria ${name}`)
        }else if(router.pathname.includes('/bebidasyjugos')){
          setTitulo(`Categoria ${name}`)
         }else if(router.pathname.includes('/otrosproductosrelacionados')){
          setTitulo(`Categoria ${name}`)
         }else if(router.pathname.includes('/buscar')){
          setTitulo(`Productos Encontrados`)
        }
         
        else{
          setTitulo('Nuevos productos')
        }
    }, [])
    const {addProduct, cartProducts} = useContext(CartContext);
    const {addLikeProduct, removeLikeProduct, likeProducts} = useContext(LikeContext);

    const handleClose = () => {
      setOpen(false);
    };

    function newProducts(){
        const productArr = [];
        products
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 12)
          .forEach(product => {
            productArr.push(product);
          });
        setProductosNuevos(productArr);
    }
    function calcularFechas(fechaCreacion){
        const fechaActual = new Date();
        const fechaBD = new Date(fechaCreacion);
        const diferenciaEnMilisegundos = fechaActual - fechaBD;
        const diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / 86400000);
        return diferenciaEnDias;

    }

    function tieneOfertas(product){
      
      const tieneOfertasValidas = product.offer?.some((offer) => {
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
        return ofertaEnCurso[0].percentage;
      } else {
        return 0;
      }
    }

    function calcularDescuento(precio, oferta){
      
      const valorFinal= precio- precio*parseInt(oferta)/100;
     
      return valorFinal;
    }


    const handleToggleFavorito = (productId) => {
        if (likeProducts.includes(productId)) {
          removeLikeProduct(productId);
        } else {
          addLikeProduct(productId);


        }
      };
    
      const isFavorito = (productId) => {
        return likeProducts.includes(productId);
      };

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

      function buscarCategoriaPadre(product){
        
        //console.log(product)
        const categoriaPadreId = product.category.parent;

        const categoriaEncontrada = categories.find(categoria => categoria._id === categoriaPadreId);
    
        if (categoriaEncontrada) {
            return categoriaEncontrada.name;
        }
        return "ni";
      }

      function quitarEspacios(cadena) {
           
        // Utiliza una expresión regular para eliminar los espacios en blanco globalmente (g) de la cadena
        return cadena.toLowerCase().replace(/\s/g, '');
      }
    return (
    <div>
        <div className="product-main">

        <h2 className="title">{titulo}</h2>

        <div className="product-grid">
        {productosNuevos.length >0 && productosNuevos.map(product => (
            <div className="showcase" key={product._id}>

            <div className="showcase-banner">

            <img src={product.images[0]} alt={product.title} width="200" className="product-img default"/>
            <img src={product.images[1]} alt={product.title} width="200" className="product-img hover"/>
           
            {calcularFechas(product.createdAt)<4 && !product.stock<=0 &&
                <p className="showcase-badge angle pink">new</p>

            }
            {tieneOfertas(product) && 
                <p className="showcase-badge">{calcularOferta(product)}%</p>
            }
            {product.stock<=0 &&
             <p className="showcase-badge angle black">Agotado</p>

            }
            {/*
                En caso de que el producto este agotado 
                <p className="showcase-badge angle black">sale</p>

                En caso de que tenga descuento
                <p className="showcase-badge">15%</p>
            */}
            
            <div className="showcase-actions">

                <Link href={'/producto/'+product._id} className="btn-action">
                    <RemoveRedEyeOutlinedIcon></RemoveRedEyeOutlinedIcon>
                </Link>

                <button className="btn-action" onClick={() => handleToggleFavorito(product._id)}>
                    {isFavorito(product._id) ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                </button>

                <button onClick={() =>{if(product.stock===0 ){ setOpen(true); setError('Stock agotado') }else{verificacion(product)} }} className="btn-action">
                    <AddOutlinedIcon></AddOutlinedIcon>
                </button>

                

            </div>

            </div>

            <div className="showcase-content">

            <Link href={`/categorias/${quitarEspacios(buscarCategoriaPadre(product))}/${product.category._id}`} className="showcase-category">{product.category.name}</Link>

            <Link href={`/producto/${product._id}`}>
                <h3 className="showcase-title">{product.title}</h3>
            </Link>
            {/* 
            <div className="showcase-rating">
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star-outline"></ion-icon>
                <ion-icon name="star-outline"></ion-icon>
            </div>
             */}
           

            {tieneOfertas(product) && (
                            <div key={product._id}>
                                <div className="price-box">
                                  <p className="price">S/{calcularDescuento(product.price, calcularOferta(product))}</p>
                                  <del>S/{product.price}</del>
                                </div>
                            </div>
                          )}
            {!tieneOfertas(product) && (
            <div key={product._id}>
                <div className="price-box">
                    <p className="price">S/{product.price}</p>
                </div>
            </div>
            )}

            </div>

        </div>
        ))}
        

        

        </div>

        </div>
        
          <Snackbar anchorOrigin={{ vertical:'top',horizontal:'center' }} open={open} autoHideDuration={6000} onClose={handleClose} key={'top' + 'center'}>
                    <Alert  onClose={handleClose} severity="error" sx={{ width: '100%' }}  >
                      {error}
                    </Alert>
          </Snackbar>
        
      </div>
    

   )
}