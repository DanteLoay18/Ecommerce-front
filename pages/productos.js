
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import { Category } from "@/models/Category";
import React from "react";
import dynamic from "next/dynamic";

const LazyHeaderPrincipal = dynamic(() => import("@/components/HeaderPrincipal"));
const LazyFooter = dynamic(() => import("@/components/Foooter"));
const LazyMain = dynamic(() => import("@/components/Main"));
export default function ProductsPage({categorias, allProducts}) {
  return (
    <div>
          <LazyHeaderPrincipal categories={categorias} />

                <div className="product-container">

                    <div className="container">
                      <div className="product-box">
                        <LazyMain products={allProducts} categories={categorias}/>
                      </div>
                    </div>
                </div>
           <LazyFooter categories={categorias}> </LazyFooter>
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const categoria = await Category.find({}, null);
  const allProducts = await Product.find({}, null).populate('category');
  allProducts.reverse();
  return {
    props:{
      allProducts: JSON.parse(JSON.stringify(allProducts)),
      categorias:JSON.parse(JSON.stringify(categoria))
    }
  };
}