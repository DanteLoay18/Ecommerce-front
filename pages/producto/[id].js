import Center from "@/components/Center";
import Title from "@/components/Title";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";
import HeaderPrincipal from "@/components/HeaderPrincipal";
import { Category } from "@/models/Category";
import Footer from "@/components/Foooter";
import Comentarios from "@/components/Comentarios";
import { Box, Rating } from "@mui/material";
import { User } from "@/models/User";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1rem;
`;

export default function ProductPage({product, categorias, usuarios}) {
  const {addProduct} = useContext(CartContext);
  return (
    <>
      <HeaderPrincipal categories={categorias} />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <Box component="fieldset" mb={3} mt={3} borderColor="transparent">
                        <Rating
                        name="simple-controlled"
                        value={product.rated || 0}
                        readOnly
                        />
            </Box>
            <p>{product.description}</p>
            <PriceRow >
              <div>
                <Price>S/{product.price}</Price>
              </div>
              <div >
                <Button  primary onClick={() => addProduct(product._id)}>
                  <CartIcon />Añadir al carrito
                </Button>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
      
      <Comentarios product={product} usuarios={usuarios}></Comentarios>
     
      
      <Footer categories={categorias}/>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const {id} = context.query;
  const product = await Product.findById(id);
  const categoria = await Category.find({}, null);
  const p= await User.find({}, null);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      categorias:JSON.parse(JSON.stringify(categoria)),
      usuarios:JSON.parse(JSON.stringify(p))
    }
  }
}