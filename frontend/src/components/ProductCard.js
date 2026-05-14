import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { MdAddShoppingCart } from 'react-icons/md';
import { IoLocationSharp } from 'react-icons/io5';
import { TbLeaf } from 'react-icons/tb';
import { ReactComponent as MangoIcon } from '../assets/mango.svg';

/* ── Local asset loader ── */
const loadImg = (p) => { try { return require(`../assets/${p}`); } catch { return null; } };

export const PRODUCT_IMAGES = {
  'Dasheri Mango':  loadImg('Dasherimango.png'),
  'Banganapalli':   loadImg('Banganapallimango.png'),
  'Langda':         loadImg('Langdamango.png'),
  'Shafeda':        loadImg('Shafedamangoes.png'),
  'Tota Pari':      loadImg('TotaParimangoes.png'),
  'Amrapali':       loadImg('Amrpalimangoes.png'),
  'Mallika':        loadImg('Mallikamangoes.png'),
  'Pure Desi Ghee': loadImg('desi ghee2.png'),
  'Fresh Milk':     loadImg('freshmilk.png'),
  'Jackfruit':      loadImg('jackfruit.png'),
  'Fresh Lemon':    loadImg('lemon.png'),
  'Kaju (Cashews)': loadImg('Kaju.png'),
  'Star Fruit':     loadImg('star fruit.png'),
};

const FALLBACKS = {
  mango: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=75',
  dairy: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=75',
  fruit: 'https://images.unsplash.com/photo-1563746924237-f4471932d9e7?w=400&q=75',
  nut:   'https://images.unsplash.com/photo-1563113952-e43de389e001?w=400&q=75',
};

export const getProductImage = (product) =>
  PRODUCT_IMAGES[product.name] || FALLBACKS[product.category] || FALLBACKS.mango;
      
/* category icon */
const CategoryIcon = ({ category, size = 13 }) => {
  if (category === 'mango') {               
    return (
      <MangoIcon
        style={{
          width: size,
          height: size,
          fill: 'currentColor',
          flexShrink: 0
        }}
      />
    );
  }
  return <TbLeaf size={size} />;
};        

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.34, 1.2, 0.64, 1] } },
};

const ProductCard = ({ product, showAdd = true, index = 0 }) => {
  const { dispatch } = useCart();
  const img = getProductImage(product);
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_ITEM', payload: product });          
    toast.success(
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MdAddShoppingCart size={18} />
        <strong>{product.name}</strong> added to cart
      </span>,
      {
        style: {
          background: 'var(--forest-deep)', color: 'white',
          borderRadius: 12, fontFamily: "'Jost', sans-serif", fontSize: 13,
          padding: '10px 16px', 
        },
        iconTheme: { primary: 'var(--beige)', secondary: 'var(--forest-deep)' },
        duration: 2000,
      }
    );
  }; 

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <Link to={`/products/${product._id}`} style={{ display: 'flex', textDecoration: 'none' }}>
        <div className="product-card" style={{ width: '100%' }}>
          {/* Image */}
          <div className="product-card-img">
            <img
              src={img}
              alt={product.name}
              loading="lazy"
              onError={e => { e.target.src = FALLBACKS[product.category] || FALLBACKS.mango; }}
            />
            {product.badge && <span className="product-badge">{product.badge}</span>}
            {product.featured && <span className="product-featured-badge">Featured</span>}
          </div>

          {/* Body */}
          <div className="product-card-body">
            {product.origin && (
              <div className="product-origin">
                <IoLocationSharp size={11} />
                {product.origin}
              </div>             
            )}
            <h3 className="product-name" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <CategoryIcon category={product.category} size={15} />
              {product.name}
            </h3>
            <p className="product-desc">{product.description.slice(0, 85)}…</p>

            <div className="product-footer">
              <div>
                {product.price ? (
                  <>
                    <div className="product-price">₹{product.price}</div>
                    <div className="product-unit">per {product.unit}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Enquire for price</div>
                )}
              </div>
              {showAdd && product.price && (
                <button className="add-btn" onClick={handleAdd}>
                  <MdAddShoppingCart size={15} />
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;