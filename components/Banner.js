import Link from "next/link";
import { useEffect, useState } from "react";

export default function Banner({ products, categories }) {
  const [nuevaCategoria, setNuevaCategoria] = useState(null);
  useEffect(() => {
    nuevasCategorias();
  }, []);

  function nuevasCategorias() {
    const catArr1 = categories.filter(cat => !cat.parent);
    catArr1.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setNuevaCategoria(catArr1[2]);
  }

  function buscarProducto(cat) {
    const categoria = categories.find(categoria => categoria.parent === cat._id);
    if (!categoria) return null;

    const productoCategoria = products.find(producto => producto.category._id === categoria._id);
    return productoCategoria;
  }

  return (
    <div className="banner">
      <div className="container">
        <div className="slider-container">
          {nuevaCategoria && (
            <div className="slider-item" key={nuevaCategoria._id}>
              {buscarProducto(nuevaCategoria) && (
                <img
                  src={buscarProducto(nuevaCategoria).images[0]}
                  alt={buscarProducto(nuevaCategoria).title}
                  className="banner-img"
                  width={800}
                  height={400}
                />
              )}
              <div className="banner-content">
                <h2 className="banner-title">{nuevaCategoria.name} sale</h2>
                {buscarProducto(nuevaCategoria) && (
                  <p className="banner-text">A partir de S/{buscarProducto(nuevaCategoria).price}</p>
                )}
                {buscarProducto(nuevaCategoria) && (
                  <Link href={`/producto/${buscarProducto(nuevaCategoria)._id}`} className="banner-btn">
                    Comprar Ahora
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
