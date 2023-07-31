import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import { Category } from "@/models/Category";
import styled from "styled-components";
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
const LazySubCategorias = dynamic(() => import("@/components/SubCategorias"));
export default function BebidasYJugosPage({categorias,allProducts}) {
    
    return (
        <div>
          <LazyHeaderPrincipal categories={categorias} />

                  <StyledDiv>
                      <LazySubCategorias categories={categorias} name={'Bebidas y jugos'} products={allProducts}></LazySubCategorias>
                  </StyledDiv>
                  
                
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