
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import HeaderPrincipal from "@/components/HeaderPrincipal";
import { Category } from "@/models/Category";
import Footer from "@/components/Foooter";
import Main from "@/components/Main";



export default function ProductsPage({products, categorias, allProducts}) {
  return (
    <div>
      <HeaderPrincipal categories={categorias} />
      <div className="product-container">

          <div className="container">
            <div className="product-box">
              <Main products={allProducts} categories={categorias}/>
            </div>
          </div>
      </div>
      <Footer categories={categorias}> </Footer>
      
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await Product.find({}, null, {sort:{'_id':-1}});
  const categoria = await Category.find({}, null);
  const allProducts = await Product.find({}, null).populate('category');
  allProducts.reverse();
  return {
    props:{
      products: JSON.parse(JSON.stringify(products)),
      allProducts: JSON.parse(JSON.stringify(allProducts)),
      categorias:JSON.parse(JSON.stringify(categoria))
    }
  };
}