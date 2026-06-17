export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Only handle product pages
  if (!path.startsWith('/products/')) {
    return context.next();
  }

  const id = path.split('/products/')[1];
  if (!id || id.includes('/')) return context.next();

  // Static product data — mirrors your STATIC_PRODUCTS
  const PRODUCTS = {
    '1':  { name: 'Dasheri Mango',    emoji: '🥭', price: 180, unit: 'kg',    desc: 'The king of mangoes from UP — intensely sweet, silky smooth, and absolutely fibrous-free.', img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80' },
    '2':  { name: 'Banganapalli',     emoji: '🥭', price: 160, unit: 'kg',    desc: 'Large, golden-yellow mangoes with a thin skin and rich, juicy pulp.',                        img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80' },
    '3':  { name: 'Langda',           emoji: '🥭', price: 200, unit: 'kg',    desc: 'The iconic green-skinned mango from Varanasi. Sweet, slightly tangy.',                       img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80' },
    '4':  { name: 'Shafeda',          emoji: '🥭', price: 220, unit: 'kg',    desc: 'A Maharashtrian gem — mild sweetness, heavenly fragrance, and silky texture.',              img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80' },
    '5':  { name: 'Tota Pari',        emoji: '🥭', price: 150, unit: 'kg',    desc: 'Named for its distinctive parrot-beak shape. Fibre-free, sweet pulp.',                      img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80' },
    '6':  { name: 'Amrapali',         emoji: '🥭', price: 170, unit: 'kg',    desc: 'A hybrid mango that fruits regularly through the season. Deep orange pulp, small seed.',    img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80' },
    '7':  { name: 'Mallika',          emoji: '🥭', price: 190, unit: 'kg',    desc: "The best of two worlds — Neelam's aroma meets Dasheri's sweetness.",                        img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80' },
    '8':  { name: 'Pure Desi Ghee',   emoji: '🧈', price: 800, unit: '500ml', desc: "Hand-churned from fresh cow's milk using traditional bilona method.",                        img: 'https://images.unsplash.com/photo-1631209121750-a9f656d28f24?w=600&q=80' },
    '9':  { name: 'Fresh Milk',       emoji: '🥛', price: 60,  unit: 'litre', desc: 'Pure, unadulterated farm-fresh milk. No preservatives, no additives.',                      img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&q=80' },
    '10': { name: 'Jackfruit',        emoji: '🍈', price: 80,  unit: 'kg',    desc: "Organic jackfruit — nature's meat alternative. Tender, flavourful, and packed with nutrients.", img: 'https://images.unsplash.com/photo-1563746924237-f4471932d9e7?w=600&q=80' },
    '11': { name: 'Fresh Lemon',      emoji: '🍋', price: 60,  unit: 'kg',    desc: 'Tangy, juicy, organic lemons packed with Vitamin C.',                                        img: 'https://images.unsplash.com/photo-1563746924237-f4471932d9e7?w=600&q=80' },
    '12': { name: 'Kaju (Cashews)',   emoji: '🌰', price: 900, unit: 'kg',    desc: 'Premium quality whole cashews. Creamy, buttery, and rich in healthy fats.',                 img: 'https://images.unsplash.com/photo-1563113952-e43de389e001?w=600&q=80' },
    '13': { name: 'Star Fruit',       emoji: '⭐', price: 120, unit: 'kg',    desc: 'Exotic tropical star fruit — visually stunning, tangy-sweet taste.',                         img: 'https://images.unsplash.com/photo-1563746924237-f4471932d9e7?w=600&q=80' },
  };

  const product = PRODUCTS[id];
  if (!product) return context.next();

  const pageUrl  = `https://www.navbodhorganic.com/products/${id}`;
  const title    = `${product.emoji} ${product.name} — Navbodh Organics`;
  const desc     = `₹${product.price} per ${product.unit} · ${product.desc} | 100% Organic, Farm Fresh. Free delivery in Raipur.`;
  const imgUrl   = product.img;

  // Get the original HTML from Netlify
  const response = await context.next();
  const html     = await response.text();

  // Inject OG tags into <head>
  const ogTags = `
    <meta property="og:type"         content="product" />
    <meta property="og:site_name"    content="Navbodh Organics" />
    <meta property="og:title"        content="${title}" />
    <meta property="og:description"  content="${desc}" />
    <meta property="og:image"        content="${imgUrl}" />
    <meta property="og:image:width"  content="600" />
    <meta property="og:image:height" content="400" />
    <meta property="og:url"          content="${pageUrl}" />
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:title"       content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image"       content="${imgUrl}" />
    <title>${title}</title>
  `;

  const modified = html.replace('<head>', `<head>${ogTags}`);

  return new Response(modified, {
    headers: { 'content-type': 'text/html' },
  });
};

export const config = { path: '/products/:id' };         