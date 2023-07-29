import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import HeaderPrincipal from "@/components/HeaderPrincipal";
import { Category } from "@/models/Category";
import Footer from "@/components/Foooter";
import MainOfertas from "@/components/MainOfertas";
import styled from "styled-components";
import SubCategorias from "@/components/SubCategorias";
const StyledDiv = styled.div`
  max-width: 1350px;
  min-height: 400px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top:30px;
  margin-bottom: 40px;
`;
export default function FrutasPage({categorias,allProducts}) {
    
    return (
        <div>
          <HeaderPrincipal categories={categorias} />

                  <StyledDiv>
                      <SubCategorias categories={categorias} name={'Frutas'} products={allProducts}></SubCategorias>
                  </StyledDiv>
                  
                
          <Footer categories={categorias}> </Footer>
          
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