import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import { Category } from "@/models/Category";
import styled from "styled-components";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const StyledDiv = styled.div`
  max-width: 1350px;
  min-height: 400px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top:30px;
  margin-bottom: 40px;
`;
const LazyHeaderPrincipal = dynamic(() => import("@/components/HeaderPrincipal"));
const LazyFooter = dynamic(() => import("@/components/Foooter"));
const LazyMain = dynamic(() => import("@/components/Main"));
export default function SubBebidasYJugosPage({categorias,allProducts}) {
    const router = useRouter();
    const { query } = router.query;
    
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const filtrarProductos = () => {
      const filtroNormalizado = query.toLowerCase();
      const productosFiltrados = allProducts.filter((producto) =>
        producto.title.toLowerCase().includes(filtroNormalizado)
      );
      return productosFiltrados;
    };
  
    useEffect(() => {
        setLoading(false)
        filtrarProductos(query);
    }, [filtrarProductos, query]);
    
    if (loading) {
        return <div>Cargando...</div>;
    }
  return (
    <div>
          <LazyHeaderPrincipal categories={categorias} />
          <div className="product-container">
            <div className="container">
              <div className="product-box">
                <LazyMain products={filtrarProductos()} categories={categorias}/>
              </div>
            </div>
          </div>
          <LazyFooter categories={categorias}> </LazyFooter>
    </div>
  );
}




export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}, null, {sort:{'_id':-1}});
    const categoria = await Category.find({}, null);
    const allProducts = await Product.find({}, null).populate('category');
    
    
    return {
      props:{
        products: JSON.parse(JSON.stringify(products)),
        allProducts: JSON.parse(JSON.stringify(allProducts)),
        categorias:JSON.parse(JSON.stringify(categoria))
      }
    };
  }