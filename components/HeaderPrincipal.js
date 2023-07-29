import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { CartContext } from './CartContext';
import { LikeContext } from './likeContext';
import { AuthContext } from './AuthContext';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { LoginOutlined, VpnKeyOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
const h1Stilo = {
  fontSize: '16px',
};

// Dynamic imports with lazy loading
const ShoppingCartOutlinedIcon= dynamic(() => import('@mui/icons-material/ShoppingCartOutlined'));
const FavoriteBorderOutlinedIcon= dynamic(() => import('@mui/icons-material/FavoriteBorderOutlined'));
const SearchOutlinedIcon = dynamic(() => import('@mui/icons-material/SearchOutlined'));
const MenuIcon = dynamic(() => import('@mui/icons-material/Menu'));
const HomeIcon = dynamic(() => import('@mui/icons-material/Home'));
const Close = dynamic(() => import('@mui/icons-material/Close'));

export default function HeaderPrincipal({ categories: existingCategories }) {
  const { cartProducts } = useContext(CartContext);
  const { likeProducts } = useContext(LikeContext);
  const [isActive, setIsActive] = useState(false);
  const [valorBuscar, setValorBuscar] = useState('');
  const [categoriesParent,setCategoriesParent]= useState([])
  const { isLoggedIn, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleMobileMenuOpen = () => {
    setIsActive(true);
  };

  const handleMobileMenuClose = () => {
    setIsActive(false);
  };

  const handleOverlayClick = () => {
    setIsActive(false);
  };

  useEffect(() => {
    categoriesParents();
  }, []);

  function categoriesParents() {
    const categoriesParent = existingCategories.filter((category) => !category.parent);
    setCategoriesParent(categoriesParent);
  }

  function categoriasHijas(categoriesALL, categoriesPadre) {
    const hijas = categoriesALL.filter((categoria) => categoria.parent === categoriesPadre._id);
    return hijas;
  }

  const navigateTo = (url) => {
    router.push(url);
  };

  function buscar() {
    router.replace(`/buscar/${valorBuscar}`);
  }

  function quitarEspacios(cadena) {
    return cadena.toLowerCase().replace(/\s/g, '');
  }
    return (
        
    
        <header>

        <div className="header-main">

        <div className="container">

            <Link href={"/" }className="header-logo">
            <img src="https://dante-ecommerce.s3.amazonaws.com/1689372123223.jpg" alt="Camu World logo" width="40" height="36" />
            <h1 style={h1Stilo}>Camu world</h1>
            </Link>

            <div className="header-search-container">

            <input type="search" name="search" className="search-field" value={valorBuscar} onChange={(ev=>{setValorBuscar(ev.target.value);})}  placeholder="Ingresa el nombre del producto..." />

            <button className="search-btn " onClick={buscar} >
                <SearchOutlinedIcon fontSize="small" />
            </button>

            </div>

            <div className="header-user-actions">

            
            
            <Link href={'/auth/login'} className="action-btn">
                
            {
                    isLoggedIn 
                    ? (
                        <ListItem button onClick={ logout }>
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItem>
                    )
                    : (
                        <ListItem 
                            button
                            onClick={ () => navigateTo(`/auth/login`) }
                        >
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>
                    )
                }

                
            </Link>

            <Link href={'/likes'} className="action-btn">
                <FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon>
                <span className="count">{likeProducts.length}</span>
            </Link>

            <Link href={'/carrito'} className="action-btn">
                <ShoppingCartOutlinedIcon></ShoppingCartOutlinedIcon>
                <span className="count">{cartProducts.length}</span>
            </Link>

            </div>

        </div>

        </div>

        <nav className="desktop-navigation-menu">

        <div className="container">

            <ul className="desktop-menu-category-list">

            <li className="menu-category">
                <Link href={'/'} className="menu-title">Home</Link>
            </li>
           
            <li className="menu-category">
                <Link href={'/categorias'} className="menu-title">Categorias</Link>

                <div className="dropdown-panel">

                
                    {categoriesParent.length > 0 && categoriesParent.map(category => (
                        <ul className="dropdown-panel-list" key={category._id}>
                            <li className="menu-title">
                            <Link href={'/categorias/'+quitarEspacios(category.name)}>{category.name}</Link>
                            </li>
                            {categoriasHijas(existingCategories, category).length > 0 && categoriasHijas(existingCategories, category).map(cat=>
                                (
                                    <li className="panel-list-item" key={cat._id}>
                                    <Link href={"/categorias/"+quitarEspacios(category.name)+'/'+cat._id}>{cat.name}</Link>
                                    </li>
                                ))}
                        </ul>
                    ))}

                </div>
            </li>
            <li className="menu-category">
                 <Link href={'/productos'} className="menu-title">Todos los Productos</Link>
            </li>
            
                    {categoriesParent.length >0 && categoriesParent.map(cat=>(
                        <li className="menu-category" key={cat._id}>
                            <Link href={'/categorias/'+quitarEspacios(cat.name)} className="menu-title">{cat.name}</Link>
                            <ul className="dropdown-list">
                                {categoriasHijas(existingCategories,cat).length>0 && categoriasHijas(existingCategories,cat).map(hija=>(
                                         <li className="dropdown-item" key={hija._id}>
                                            <Link href={"/categorias/"+quitarEspacios(cat.name)+'/'+hija._id}>{hija.name}</Link>
                                        </li>
                                ))}
                               

                            </ul>
                        </li>
                        
                    ))}
        


            <li className="menu-category">
                <Link href={"/ofertas"} className="menu-title">Ofertas</Link>
            </li>

            </ul>

        </div>

        </nav>

        <div className="mobile-bottom-navigation">

                <button className="action-btn" data-mobile-menu-open-btn onClick={handleMobileMenuOpen}>
                    <MenuIcon></MenuIcon>
                </button>

                <Link href={'/likes'} className="action-btn">
                    <FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon>

                    <span className="count">{likeProducts.length}</span>
                </Link>

                <button className="action-btn">
                    <HomeIcon></HomeIcon>
                </button>

                <Link href={'/carrito'} className="action-btn">
                    <ShoppingCartOutlinedIcon></ShoppingCartOutlinedIcon>

                    <span className="count">{cartProducts.length}</span>
                </Link>

        

        </div>
        {isActive && (
            <nav className="mobile-navigation-menu  has-scrollbar active" data-mobile-menu>

            <div className="menu-top">
                <h2 className="menu-title">Menu</h2>
    
                <button className="menu-close-btn" data-mobile-menu-close-btn onClick={handleMobileMenuClose}>
                <Close></Close>
                </button>
            </div>
    
            <ul className="mobile-menu-category-list">
    
                <li className="menu-category">
                <Link href={'/'} className="menu-title">Home</Link>
                </li>
    
                <li className="menu-category">
    
                <button className="accordion-menu" data-accordion-btn>
                    <Link href={'/categorias/frutas'} className="menu-title">Frutas</Link>
    
                </button>
    
                
                </li>
    
                <li className="menu-category">
    
                <button className="accordion-menu" data-accordion-btn>
                    <Link href={'/categorias/bebidasyjugos'} className="menu-title">Bebidas y jugos</Link>
    
                </button>
    
                </li>
    
                <li className="menu-category">
    
                <button className="accordion-menu" data-accordion-btn>
                    <Link href={'/categorias/otrosproductosrelacionados'} className="menu-title">Otros productos relacionados</Link>
    
                   
                </button>
    
                
    
                </li>
    
                <li className="menu-category">
    
                <button className="accordion-menu" data-accordion-btn>
                    <Link href={'/categorias/suplementos'} className="menu-title">Suplementos</Link>

                </button>
    
                
    
                </li>
    
               
    
                <li className="menu-category">
                <Link href={'/ofertas'} className="menu-title">Ofertas</Link>
                </li>
    
            </ul>
    
           
    
            </nav>
        )}
        

    </header>


    )
}