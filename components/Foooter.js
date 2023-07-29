
import { useEffect, useState } from "react";
import { GlobalStyles } from "./GlobalStyle";
import Link from "next/link";
import Image from "next/image";



export default function Footer({categories}){
    const [categoriesParent, setCategoriesParent]=useState([])
        useEffect(()=>{    
            categoriesParents();
            //fetchCategories();
        }, []);

        function categoriesParents(){
            const categoriesParent=[];
            categories.map( category =>
                {
                    if(!category.parent && categoriesParent.length<=6){
                        categoriesParent.push(category)
                    }
                }
            
            )
            setCategoriesParent(categoriesParent);
        }
        function quitarEspacios(cadena) {
           
            // Utiliza una expresión regular para eliminar los espacios en blanco globalmente (g) de la cadena
            return cadena.toLowerCase().replace(/\s/g, '');
          }
    return (
        
        <footer>

            <div className="footer-nav">

            <div className="container">

                <ul className="footer-nav-list">

                <li className="footer-nav-item">
                    <h2 className="nav-title">Categorias Populares</h2>
                </li>

                {categoriesParent.length > 0 && categoriesParent.map(cat => (
                    <li className="footer-nav-item" key={cat._id}>
                        <Link href={`/categorias/${quitarEspacios(cat.name)}`} className="footer-nav-link">{cat.name}</Link>
                    </li>
                ))}

                </ul>

                <ul className="footer-nav-list">
                
                <li className="footer-nav-item">
                    <h2 className="nav-title">Productos</h2>
                </li>
                
                <li className="footer-nav-item">
                    <Link href={'/productos'} className="footer-nav-link">Todos los products</Link>
                </li>
                
                <li className="footer-nav-item">
                    <Link href={'/ofertas'} className="footer-nav-link">Ofertas</Link>
                </li>
                
            
                </ul>

                <ul className="footer-nav-list">
                
                <li className="footer-nav-item">
                    <h2 className="nav-title">Contacto</h2>
                </li>
                
                <li className="footer-nav-item">
                    <address href={'/productos'} className="footer-nav-link">Jr los Alamos
                    Mz. D Lt.3 </address>
                </li>
                
                <li className="footer-nav-item">
                    <a href="tel:+607936-8058" className="footer-nav-link"> 937540196</a>
                </li>
                
                <li className="footer-nav-item">
                    <a href="Camuworld@gmail.com" className="footer-nav-link">Camuworld@gmail.com</a>
                </li>
            
                </ul>

                <ul className="footer-nav-list">

                <li className="footer-nav-item">
                    <h2 className=""></h2>
                </li>

                <li className="footer-nav-item flex">
                    <div className="icon-box">
                    <ion-icon name="location-outline"></ion-icon>
                    </div>

                </li>

                <li className="footer-nav-item flex">
                    <div className="icon-box">
                    <ion-icon name="call-outline"></ion-icon>
                    </div>

                </li>

                <li className="footer-nav-item flex">
                    <div className="icon-box">
                    <ion-icon name="mail-outline"></ion-icon>
                    </div>

                    
                </li>

                </ul>

                

            </div>

            </div>

            <div className="footer-bottom">

            <div className="container">

                <img src="https://dante-ecommerce.s3.amazonaws.com/1689359990343.png" alt="payment method" className="payment-img"/>

                <p className="copyright">
                Copyright &copy; <a href="#">Camu World</a> all rights reserved.
                </p>

            </div>

            </div>

        </footer>
        
    );
}