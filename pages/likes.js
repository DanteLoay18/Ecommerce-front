import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import HeaderPrincipal from "@/components/HeaderPrincipal";
import { Category } from "@/models/Category";
import Footer from "@/components/Foooter";
import MainFavoritos from "@/components/MainFavoritos";
import styled from "styled-components";
const StyledDiv = styled.div`
  max-width: 1350px;
  min-height: 350px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top:30px;
  margin-bottom: 40px;
`;

export default function HomePage({categorias,allProducts}) {
    
    return (
        <div>
          <HeaderPrincipal categories={categorias} />
          <StyledDiv>
               <MainFavoritos products={allProducts} categories={categorias}/>
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
    
    function validarEstaConLike(){

    }
    return {
      props:{
        products: JSON.parse(JSON.stringify(products)),
        allProducts: JSON.parse(JSON.stringify(allProducts)),
        categorias:JSON.parse(JSON.stringify(categoria))
      }
    };
  }