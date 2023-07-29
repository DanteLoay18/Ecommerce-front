

import Link from "next/link";



export default function Categorias({categories}){
    
        
    return (
        
        <div className="category">

        <div className="container">
  
          <div className="category-item-container has-scrollbar">
  
            <div className="category-item">
  
              <div className="category-img-box">
                <img src="https://dante-ecommerce.s3.amazonaws.com/1689476900330.jpg" alt="frutas de camu camu" width="100px"/>
              </div>
  
              <div className="category-content-box">
  
                <div className="category-content-flex">
                  <h3 className="category-item-title">Frutas</h3>
  
                </div>
  
                <Link href={'/categorias/frutas'} className="category-btn">Mostrar todos</Link>
  
              </div>
  
            </div>
  
            <div className="category-item">
  
              <div className="category-img-box">
                <img src="https://dante-ecommerce.s3.amazonaws.com/1689424549860.jpg" alt="bebidas y jugos de camu camu" width="70"/>
              </div>
  
              <div className="category-content-box">
  
                <div className="category-content-flex">
                  <h3 className="category-item-title">Bebidas y jugos</h3>
  
                  
                </div>
  
                <Link href={'/categorias/bebidasyjugos'}className="category-btn">Mostrar todos</Link>
  
              </div>
  
            </div>
  
            <div className="category-item">
  
              <div className="category-img-box">
                <img src="https://dante-ecommerce.s3.amazonaws.com/1689439701354.jpg" alt="otros productos relacionado de camu camu" width="70"/>
              </div>
  
              <div className="category-content-box">
  
                <div className="category-content-flex">
                  <h3 className="category-item-title">Otros productos relacionados</h3>
  
                  
                </div>
  
                <Link href={'/categorias/otrosproductosrelacionados'} className="category-btn">Mostrar todos</Link>
  
              </div>
  
            </div>
  
            <div className="category-item">
  
              <div className="category-img-box">
                <img src="https://dante-ecommerce.s3.amazonaws.com/1689439097251.jpg" alt="suplementos de camu camu" width="40"/>
              </div>
  
              <div className="category-content-box">
  
                <div className="category-content-flex">
                  <h3 className="category-item-title">Suplementos</h3>
  
                  
                </div>
  
                <Link href="/categorias/suplementos" className="category-btn">Mostrar todos</Link>
  
              </div>
  
            </div>
  
            
  
           
  
          </div>
  
        </div>
  
      </div>
        
    );
}