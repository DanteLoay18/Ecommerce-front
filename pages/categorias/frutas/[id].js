import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import { Category } from "@/models/Category";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const LazyHeaderPrincipal = dynamic(() => import("@/components/HeaderPrincipal"));
const LazyFooter = dynamic(() => import("@/components/Foooter"));
const LazyMain = dynamic(() => import("@/components/Main"));
export default function SubFrutasPage({categorias,allProducts}) {
    const router = useRouter();
    const {id} = router.query;
    const [categoria, setCategoria]=useState({ name: '' });
    const [loading, setLoading] = useState(true);

    function findProdcutsById(){
        let arrPro=[];
        allProducts.map(producto =>{
            if(producto.category._id === id){
                arrPro.push(producto);
            }
        })
        return arrPro;
    }
    useEffect(() => {
        const foundCategory = categorias.find(cat => cat._id === id);
        if (foundCategory) {
            setCategoria(foundCategory);
            setLoading(false); // Marcar que la carga ha finalizado
        }
    }, [categorias, id]);

    // Mostrar indicador de carga mientras se obtienen los datos
    if (loading) {
        return <div>Cargando...</div>;
    }
    return (
        <div>
          <LazyHeaderPrincipal categories={categorias} />
           <div className="product-container">

                <div className="container">
                    <div className="product-box">
                        <LazyMain products={findProdcutsById()} categories={categorias} name={categoria.name}/>
                        
                    </div>
                </div>
           </div>
                  
                
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