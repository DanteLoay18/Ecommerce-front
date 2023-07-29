import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import HeaderPrincipal from "@/components/HeaderPrincipal";
import { Category } from "@/models/Category";
import Footer from "@/components/Foooter";
import styled from "styled-components";
import Main from "@/components/Main";
import SubCategorias from "@/components/SubCategorias";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const StyledDiv = styled.div`
  max-width: 1350px;
  min-height: 400px;
  margin: 0 auto;
  padding: 0 20px;
  margin-top:30px;
  margin-bottom: 40px;
`;
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
          <HeaderPrincipal categories={categorias} />
           <div className="product-container">

                <div className="container">
                    <div className="product-box">
                        <Main products={findProdcutsById()} categories={categorias} name={categoria.name}/>
                        
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
    
    
    return {
      props:{
        products: JSON.parse(JSON.stringify(products)),
        allProducts: JSON.parse(JSON.stringify(allProducts)),
        categorias:JSON.parse(JSON.stringify(categoria))
      }
    };
  }