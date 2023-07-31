import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import { Category } from "@/models/Category";
import styled from "styled-components";
import React from "react";
import dynamic from "next/dynamic";
const StyledDiv = styled.div`
  max-width: 1350px;
  min-height: 350px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top:30px;
  margin-bottom: 40px;
`;
const LazyHeaderPrincipal =dynamic(() => import("@/components/HeaderPrincipal"));
const LazyFooter = dynamic(() => import("@/components/Foooter"));
const LazyFavoritos = dynamic(() => import("@/components/MainFavoritos"));
export default function HomePage({categorias,allProducts}) {
    
    return (
        <div>
            <LazyHeaderPrincipal categories={categorias} />
            <StyledDiv>
               <LazyFavoritos products={allProducts} categories={categorias}/>
            </StyledDiv>
            <LazyFooter categories={categorias} />
          
        </div>
      );

}

export async function getServerSideProps() {
    await mongooseConnect();
    const categoria = await Category.find({}, null);
    const allProducts = await Product.find({}, null).populate('category');
    
    return {
      props:{
        allProducts: JSON.parse(JSON.stringify(allProducts)),
        categorias:JSON.parse(JSON.stringify(categoria))
      }
    };
  }