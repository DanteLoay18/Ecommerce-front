import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Product } from '@/models/Product';
import { mongooseConnect } from '@/lib/mongoose';
import Footer from '@/components/Foooter';
import HeaderPrincipal from '@/components/HeaderPrincipal';
import { Category } from '@/models/Category';

// Dynamic imports with lazy loading
const Main = dynamic(() => import('@/components/Main'));
const ProductFutured = dynamic(() => import('@/components/ProductFutured'));
const Minimal = dynamic(() => import('@/components/Minimal'));
const Banner = dynamic(() => import('@/components/Banner'));

export default function HomePage({ featuredProduct, newProducts, categorias, allProducts }) {
  useEffect(() => {
    // Your initialization or side effect code here (if needed)
  }, []);

  return (
    <div>
      <HeaderPrincipal categories={categorias} />
      
      <Banner products={allProducts} categories={categorias} />

      <div className="product-container">
        <div className="container">
          <div className="product-box">
            <Minimal products={allProducts} categories={categorias} />
            <ProductFutured products={allProducts} />
            <Main products={allProducts} categories={categorias} />
          </div>
        </div>
      </div>

      <Footer categories={categorias} />
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  const allProducts = await Product.find({}, null).populate('category');
  allProducts.reverse();

  const featuredProduct = allProducts[0];
  const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 10 });
  const categoria = await Category.find({}, null);

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      allProducts: JSON.parse(JSON.stringify(allProducts)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      categorias: JSON.parse(JSON.stringify(categoria))
    },
  };
}
