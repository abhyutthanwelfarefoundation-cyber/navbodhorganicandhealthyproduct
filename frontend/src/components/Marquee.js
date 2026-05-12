import React from 'react';
import { IoLeafOutline } from 'react-icons/io5';
import { ReactComponent as MangoIcon } from '../assets/mango.svg';

const ITEMS = [
  { label: 'Dasheri Mango' },
  { label: 'Banganapalli' },
  { label: 'Langda' },
  { label: 'Shafeda' },
  { label: 'Tota Pari' },
  { label: 'Amrapali' },
  { label: 'Mallika' },
  { label: 'Pure Desi Ghee' },
  { label: 'Fresh Milk' },
  { label: 'Jackfruit' },
  { label: 'Fresh Lemon' },
  { label: 'Kaju' },
  { label: 'Star Fruit' },
];

const Marquee = ({ dark = false }) => {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="marquee-wrap" style={{ background: dark ? '#1a2c1e' : 'var(--forest-deep)' }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            {/* alternate mango / leaf icon */}
            { i % 2 === 0
  ? <MangoIcon style={{ width: 14, height: 14, fill: 'var(--beige)', opacity: 0.8, flexShrink: 0 }} />
  : <IoLeafOutline size={13} color="var(--beige)" style={{ opacity: 0.7, flexShrink: 0 }} />
}
            {item.label}
            <span className="marquee-sep" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;