import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Banner({products, categories}){
    const [nuevaCategoria, setNuevaCategoria]= useState(null)
    const [producto, setProducto] = useState('')
    useEffect(()=>{
        nuevasCategorias();
    }, [])
    function nuevasCategorias(){
        
        const catArr1 = []
        categories.forEach(cat=> {
            if(!cat.parent){
                catArr1.push(cat)
            }
        })

        catArr1.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        
        setNuevaCategoria(catArr1[2]);
      }

    function buscarProducto(cat){
        const categoria= categories.find((categoria)=>{
            
            return categoria.parent === cat._id
        })
        //console.log('categoria',cat)
        //console.log(categoriasArr)
        const productoCategoria = products.find((producto) => {
            
            return producto.category._id == categoria._id;
          });
          
          return productoCategoria;
    }
    return (
        <div className="banner">

        <div className="container">

        <div className="slider-container">
          {nuevaCategoria  && (
           
           <div className="slider-item" key={nuevaCategoria._id}>
                {buscarProducto(nuevaCategoria) && (
                     <img src={buscarProducto(nuevaCategoria).images[0]} alt={buscarProducto(nuevaCategoria).title} className="banner-img"/>
                )}
                <div className="banner-content">

                <h2 className="banner-title">{nuevaCategoria.name} sale</h2>
                {buscarProducto(nuevaCategoria) && (
                   
                            
                    <p className="banner-text">
                        A partir de S/{buscarProducto(nuevaCategoria).price}
                    </p>
                   
                     
                )}
                

                <Link href={`/producto/${buscarProducto(nuevaCategoria)._id}`} className="banner-btn">Comprar Ahora</Link>

                </div>

            </div>
          )}
          

          

        </div>

      </div>

    </div>
    )
}