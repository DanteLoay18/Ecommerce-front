
import Link from "next/link";
import { useEffect, useState } from "react"

export default function Minimal({products, categories}){
    const [productoNuevo, setProductoNuevo]= useState([]);
    const [productoMasVendido,setProductoMasVendido] = useState([])
    const [productoMejorValorado,setProductoMejorValorado] = useState([]);

    useEffect(()=>{
      nuevosProductos();
      masVendidos();
      masValorados();
    }, [])

    function nuevosProductos(){
      const productArr = [];
      products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .forEach(product => {
          productArr.push(product);
        });
      setProductoNuevo(productArr);
    }

    function masVendidos(){
      
      const productArr = [];
      let foundProduct = false;

      const productosMasVendidos= products.filter((producto) => producto.trending > 4);

      if (productosMasVendidos.length > 1) {
        productosMasVendidos
        .sort((a, b) => b.trending - a.trending)
        ;
      }

      setProductoMasVendido(productosMasVendidos.slice(0, 5));
      
    }
    function masValorados(){
      const productosMejoresValoraciones= products.filter((producto) => producto.rated > 3);
      
      if (productosMejoresValoraciones.length > 1) {
        productosMejoresValoraciones.sort((a, b) => b.rating - a.rating);
      }
      setProductoMejorValorado(productosMejoresValoraciones.slice(0, 5));
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

    function buscarCategoriaPadre(product){
        
      //console.log(product)
      const categoriaPadreId = product.category.parent;

      const categoriaEncontrada = categories.find(categoria => categoria._id === categoriaPadreId);
  
      if (categoriaEncontrada) {
          return categoriaEncontrada.name;
      }
      return "";
    }

    function quitarEspacios(cadena) {
         
      // Utiliza una expresión regular para eliminar los espacios en blanco globalmente (g) de la cadena
      return cadena.toLowerCase().replace(/\s/g, '');
    }
    return (
        <div>
          <div className="product-minimal">

            <div className="product-showcase">

              <h2 className="title">Nuevos Productos</h2>

              <div className="showcase-wrapper has-scrollbar">

                <div className="showcase-container">
                  {productoNuevo.length>0 && productoNuevo.map(product => (
                    <div className="showcase" key={product._id}>

                        <Link href={'/producto/'+product._id}  className="showcase-img-box">
                          <img src={product.images[0]} alt={product.description} width="70" className="showcase-img"/>
                        </Link>

                        <div className="showcase-content">

                          <Link href={'/producto/'+product._id} >
                            <h4 className="showcase-title">{product.title}</h4>
                          </Link>

                          <Link href={`/categorias/${quitarEspacios(buscarCategoriaPadre(product))}/${product.category._id}`} className="showcase-category">{product.category.name}</Link>
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

</div>

<div className="product-showcase">

  <h2 className="title">Mas vendido</h2>

  <div className="showcase-wrapper  has-scrollbar">
    
    <div className="showcase-container">
      {productoMasVendido.length>0 && productoMasVendido.map(product=>( 
        <div className="showcase" key={product._id}>

          <Link href={'/producto/'+product._id}  className="showcase-img-box">
            <img src={product.images[0]} alt={product.title} className="showcase-img"
              width="70"/>
          </Link>

          <div className="showcase-content">

            <Link href={'/producto/'+product._id} >
              <h4 className="showcase-title">{product.title}</h4>
            </Link>

            <Link href={`/categorias/${quitarEspacios(buscarCategoriaPadre(product))}/${product.category._id}`} className="showcase-category">{product.category.name}</Link>

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

</div>

<div className="product-showcase">

  <h2 className="title">Top Rated</h2>

  <div className="showcase-wrapper  has-scrollbar">

    <div className="showcase-container">

    {productoMejorValorado.length>0 && productoMejorValorado.map(product=>( 
        <div className="showcase" key={product._id}>

          <Link href={'/producto/'+product._id} className="showcase-img-box">
            <img src={product.images[0]} alt={product.title} className="showcase-img"
              width="70"/>
          </Link>

          <div className="showcase-content">

            <Link href={'/producto/'+product._id} >
              <h4 className="showcase-title">{product.title}</h4>
            </Link>

            <Link href={`/categorias/${quitarEspacios(buscarCategoriaPadre(product))}/${product.category._id}`} className="showcase-category">{product.category.name}</Link>

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

</div>

</div>
        </div>


    )

}