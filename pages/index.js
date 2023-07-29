
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import Footer from "@/components/Foooter";
import HeaderPrincipal from "@/components/HeaderPrincipal";
import Main from "@/components/Main";
import { Category } from "@/models/Category";
import ProductFutured from "@/components/ProductFutured";

import Minimal from "@/components/Minimal";
import Banner from "@/components/Banner";


export default function HomePage({featuredProduct,newProducts,categorias,allProducts}) {
  return (
    <div>
      
      <HeaderPrincipal categories={categorias}/>
      
      <Banner products={allProducts} categories={categorias}></Banner>
      <div className="product-container">

          <div className="container">
            <div className="product-box">
              <Minimal products={allProducts} categories={categorias}/>
              <ProductFutured products={allProducts}/>
              <Main products={allProducts} categories={categorias}/>
              
            </div>
          </div>
      </div>
      
      <Footer categories={categorias}/>
    </div>
  );
}

export async function getServerSideProps() {
  
  await mongooseConnect();
  //const featuredProduct = await Product.findById(featuredProductId);
  const allProducts = await Product.find({}, null).populate('category');
  allProducts.reverse();
  const featuredProduct= allProducts[0];
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:10});
  const categoria = await Category.find({}, null)
 
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      allProducts: JSON.parse(JSON.stringify(allProducts)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      categorias:JSON.parse(JSON.stringify(categoria))
    },
  };
}
