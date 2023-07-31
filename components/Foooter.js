import { useEffect, useState } from "react";
import { GlobalStyles } from "./GlobalStyle";
import Link from "next/link";

const FooterNavList = ({ title, items }) => {
    function quitarEspacios(cadena) {
        // Utiliza una expresión regular para eliminar los espacios en blanco globalmente (g) de la cadena
        return cadena.toLowerCase().replace(/\s/g, '');
      }
  return (
    <ul className="footer-nav-list">
      <li className="footer-nav-item">
        <h2 className="nav-title">{title}</h2>
      </li>
      {items.map((item) => (
        <li className="footer-nav-item" key={item._id}>
          <Link href={`/categorias/${quitarEspacios(item.name)}`} passHref>
            <p className="footer-nav-link">{item.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const ContactInfo = () => {
  return (
    <ul className="footer-nav-list">
      <li className="footer-nav-item">
        <h2 className="nav-title">Contacto</h2>
      </li>
      <li className="footer-nav-item">
        <address className="footer-nav-link">Jr los Alamos Mz. D Lt.3</address>
      </li>
      <li className="footer-nav-item">
        <a href="tel:+607936-8058" className="footer-nav-link" rel="noopener">
          937540196
        </a>
      </li>
      <li className="footer-nav-item">
        <a href="mailto:Camuworld@gmail.com" className="footer-nav-link" rel="noopener">
          Camuworld@gmail.com
        </a>
      </li>
    </ul>
  );
};

export default function Footer({ categories }) {
  const [categoriesParent, setCategoriesParent] = useState([]);

  useEffect(() => {
    categoriesParents();
  }, []);

  function categoriesParents() {
    const categoriesParent = categories?.filter((category) => !category.parent).slice(0, 6);
    setCategoriesParent(categoriesParent);
  }

  return (
    <footer>
      <div className="footer-nav">
        <div className="container">
          <FooterNavList title="Categorias Populares" items={categoriesParent} />

          <ul className="footer-nav-list">
            <li className="footer-nav-item">
              <h2 className="nav-title">Productos</h2>
            </li>
            <li className="footer-nav-item">
              <Link href="/productos" passHref>
                <p className="footer-nav-link">Todos los productos</p>
              </Link>
            </li>
            <li className="footer-nav-item">
              <Link href="/ofertas" passHref>
                <p className="footer-nav-link">Ofertas</p>
              </Link>
            </li>
          </ul>

          <ContactInfo />
          <ul className="footer-nav-list">
            <li className="footer-nav-item">
                <h2 className="nav-title"></h2>
            </li>
            <li className="footer-nav-item">
                <address className="footer-nav-link"></address>
            </li>
            <li className="footer-nav-item">
                <a href="tel:+607936-8058" className="footer-nav-link" rel="noopener">
                
                </a>
            </li>
            <li className="footer-nav-item">
                <a href="mailto:Camuworld@gmail.com" className="footer-nav-link" rel="noopener">
            
                </a>
            </li>
        </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <img
            src="https://dante-ecommerce.s3.amazonaws.com/1689359990343.png"
            alt="payment method"
            className="payment-img"
          />

          <p className="copyright">
            Copyright &copy; <a href="#">Camu World</a> all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
