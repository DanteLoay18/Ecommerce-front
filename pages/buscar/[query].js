import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import HeaderPrincipal from "@/components/HeaderPrincipal";
import { Category } from "@/models/Category";
import Footer from "@/components/Foooter";
import styled from "styled-components";
import Main from "@/components/Main";
import SubCategorias from "@/components/SubCategorias";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const StyledDiv = styled.div`
  max-width: 1350px;
  min-height: 400px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top:30px;
  margin-bottom: 40px;
`;
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
      
      
    }, []);
    
    if (loading) {
        return <div>Cargando...</div>;
    }
  return (
    <div>
      <HeaderPrincipal categories={categorias} />
      <div className="product-container">
        <div className="container">
          <div className="product-box">
            <Main products={filtrarProductos()} categories={categorias}/>
          </div>
        </div>
      </div>
      <Footer categories={categorias} />
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