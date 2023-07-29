import {createContext, useEffect, useState} from "react";

export const LikeContext = createContext({});

export function LikeContextProvider({children}) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [likeProducts,setLikeProducts] = useState([]);
  useEffect(() => {
    if (likeProducts?.length > 0) {
      ls?.setItem('like', JSON.stringify(likeProducts));
    }
  }, [likeProducts]);
  useEffect(() => {
    if (ls && ls.getItem('like')) {
        setLikeProducts(JSON.parse(ls.getItem('like')));
    }
  }, []);
  function addLikeProduct(productId) {
    setLikeProducts(prev => [...prev,productId]);
  }
  function removeLikeProduct(productId) {
    setLikeProducts(prev => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        const updatedCart = prev.filter((_, index) => index !== pos);
        if (updatedCart.length === 0) {
          // Llama a clearCart() si el carrito queda vacío después de eliminar el producto.
          clearLike();
        }
        return updatedCart;
      }
      return prev;
    });
  }
  function clearLike() {
    window.localStorage.setItem('like','[]')
    setLikeProducts([]);
  }
  return (
    <LikeContext.Provider value={{likeProducts,setLikeProducts,addLikeProduct,removeLikeProduct,clearLike}}>
      {children}
    </LikeContext.Provider>
  );
}