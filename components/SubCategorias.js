
import { useEffect, useState } from "react";
import { GlobalStyles } from "./GlobalStyle";
import Link from "next/link";
import Image from "next/image";


const img ={
    'height': '63px'
}
export default function SubCategorias({categories, name, products}){
    
    
     function buscarCategoriasHijas() {
      
     let categoriaPadre;
      categories.map((categoria) => {
        if (categoria.name === name) {
          categoriaPadre = categoria;
        }
      });
      //const arrHijas= [{name:'camu'}]
     const arrHijas = categories.filter((categoria) => categoria.parent === categoriaPadre._id);
      
      return arrHijas;
      return arrHijas
    }

    function buscarProducto(categoria) {
        const productoEncontrado = products.find((producto) => producto.category._id === categoria._id);
        return productoEncontrado ? productoEncontrado.images[0] : ''; // Devuelve la URL de la primera imagen o una cadena vacía si no se encontró ningún producto
      }
    return (
        
        <div className="category">

        <div className="container">
  
          <div className="category-item-container has-scrollbar">
            {buscarCategoriasHijas().length > 0 && buscarCategoriasHijas().map(categoria =>(
                    <div className="category-item" key={categoria._id}>
                    
                          <div className="category-img-box">
                              
                                  <img style={img} src={buscarProducto(categoria)} alt={categoria.name} width="70px"/>
                              
                          
                          </div>

                          <div className="category-content-box">

                              <div className="category-content-flex">
                                <h3 className="category-item-title">{categoria.name}</h3>

                              </div>

                              <Link href={`/categorias/frutas/${categoria._id}`} className="category-btn">Mostrar todos</Link>

                          </div>

                    </div>
            ))}
           
  
            
  
            
  
           
  
          </div>
  
        </div>
  
      </div>
        
    );
}