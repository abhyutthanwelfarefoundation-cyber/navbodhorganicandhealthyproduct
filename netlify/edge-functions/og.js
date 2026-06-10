export default async (request, context) => {
  const url  = new URL(request.url);
  const path = url.pathname;

  // Only handle /products/1 through /products/13
  if (!path.startsWith('/products/')) return context.next();
  const id = path.replace('/products/', '').split('/')[0].trim();
  if (!id || isNaN(id)) return context.next();

  const PRODUCTS = {
    '1':  { name: 'Dasheri Mango',  emoji: '🥭', price: 180, unit: 'kg',    desc: 'The king of mangoes from UP — intensely sweet, silky smooth and fibrous-free.', img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85' },
    '2':  { name: 'Banganapalli',   emoji: '🥭', price: 160, unit: 'kg',    desc: 'Large golden-yellow mangoes with rich juicy pulp. A South Indian classic.',      img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85' },
    '3':  { name: 'Langda',         emoji: '🥭', price: 200, unit: 'kg',    desc: 'The iconic green-skinned mango from Varanasi. Sweet and slightly tangy.',         img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85' },
    '4':  { name: 'Shafeda',        emoji: '🥭', price: 220, unit: 'kg',    desc: 'A Maharashtrian gem with mild sweetness and heavenly fragrance.',                  img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85' },
    '5':  { name: 'Tota Pari',      emoji: '🥭', price: 150, unit: 'kg',    desc: 'Named for its parrot-beak shape. Fibre-free, sweet pulp.',                         img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85' },
    '6':  { name: 'Amrapali',       emoji: '🥭', price: 170, unit: 'kg',    desc: 'A hybrid mango with deep orange pulp and small seed. Intensely sweet.',            img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85' },
    '7':  { name: 'Mallika',        emoji: '🥭', price: 190, unit: 'kg',    desc: "Neelam's aroma meets Dasheri's sweetness. Smooth, rich and delicious.",            img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85' },
    '8':  { name: 'Pure Desi Ghee', emoji: '🧈', price: 800, unit: '500ml', desc: "Hand-churned from fresh A2 cow's milk using traditional bilona method.",           img: 'https://images.unsplash.com/photo-1631209121750-a9f656d28f24?w=800&q=85' },
    '9':  { name: 'Fresh Milk',     emoji: '🥛', price: 60,  unit: 'litre', desc: 'Pure unadulterated farm-fresh milk. No preservatives, no additives.',              img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800&q=85' },
    '10': { name: 'Jackfruit',      emoji: '🍈', price: 80,  unit: 'kg',    desc: "Organic jackfruit — nature's meat alternative. Tender and flavourful.",            img: 'https://images.unsplash.com/photo-1563746924237-f4471932d9e7?w=800&q=85' },
    '11': { name: 'Fresh Lemon',    emoji: '🍋', price: 60,  unit: 'kg',    desc: 'Tangy juicy organic lemons packed with Vitamin C.',                                img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=85' },
    '12': { name: 'Kaju (Cashews)', emoji: '🌰', price: 900, unit: 'kg',    desc: 'Premium quality whole cashews. Creamy, buttery and rich in healthy fats.',         img: 'https://images.unsplash.com/photo-1563113952-e43de389e001?w=800&q=85' },
    '13': { name: 'Star Fruit',     emoji: '⭐', price: 120, unit: 'kg',    desc: 'Exotic tropical star fruit — tangy-sweet taste loaded with antioxidants.',         img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&q=85' },
  };

  const p = PRODUCTS[id];
  if (!p) return context.next();

  const pageUrl = `https://www.navbodhorganic.com/products/${id}`;
  const title   = `${p.name} - Navbodh Organics | 100% Organic`;
  const desc    = `${p.emoji} ${p.name} at only Rs.${p.price} per ${p.unit}. ${p.desc} Free delivery in Raipur, Chhattisgarh.`;

  // Build a complete minimal HTML with all meta tags
  // This is returned directly to crawlers — no JS needed
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />

  <!-- Open Graph -->
  <meta property="og:type"         content="product" />
  <meta property="og:site_name"    content="Navbodh Organics" />
  <meta property="og:title"        content="${title}" />
  <meta property="og:description"  content="${desc}" />
  <meta property="og:image"        content="${p.img}" />
  <meta property="og:image:secure_url" content="${p.img}" />
  <meta property="og:image:type"   content="image/jpeg" />
  <meta property="og:image:width"  content="800" />
  <meta property="og:image:height" content="600" />
  <meta property="og:url"          content="${pageUrl}" />

  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:site"        content="@navbodhorganics" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image"       content="${p.img}" />
  <meta name="twitter:image:alt"   content="${p.name} from Navbodh Organics" />

  <!-- WhatsApp reads og:image — redirect real users to React app -->
  <script>
    // If this is a real browser (not a crawler), redirect to the React app
    if (typeof window !== 'undefined') {
      window.location.replace('${pageUrl}');
    }
  </script>
</head>
<body>
  <p>${p.emoji} <strong>${p.name}</strong> — Rs.${p.price} per ${p.unit}</p>
  <p>${p.desc}</p>
  <p>100% Organic, Farm Fresh. Free delivery in Raipur.</p>
  <a href="${pageUrl}">View on Navbodh Organics</a>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=3600',  
    },
  });
};

export const config = { path: '/products/:id' };