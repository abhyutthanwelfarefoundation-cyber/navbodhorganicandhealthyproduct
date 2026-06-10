import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoLocationSharp, IoCallOutline, IoMailOutline, IoGlobeOutline, IoChevronDownOutline } from 'react-icons/io5';
import { MdArrowForward, MdBusiness, MdConstruction, MdLocalHospital, MdPrint } from 'react-icons/md';
import { TbBooks, TbBuildingSkyscraper } from 'react-icons/tb';
import { GiBookshelf } from 'react-icons/gi';

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const CONCERNS = [
  {
    id: 1,
    name: 'Nikhil Agro Product',
    project: 'Navbodh Tower',
    tagline: 'Premium Commercial Complex · Shankar Nagar, Raipur',
    category: 'Construction & Real Estate',
    color: '#1a2c1c',
    accent: '#e8d5b0',
    bg: 'linear-gradient(135deg, #1a2c1c 0%, #2a4b2e 100%)',
    icon: <TbBuildingSkyscraper size={28} />,
    emoji: '🏢',
    // status: 'Active',
    // statusColor: '#16a34a',
    description: 'Navbodh Tower is a modern, government-approved commercial complex designed to cater to the diverse needs of today\'s businesses. Strategically located in the bustling area of Shankar Nagar, Raipur (C.G.), it offers premium commercial spaces with excellent visibility, seamless connectivity, and world-class infrastructure.',
    highlight: 'Cutting-edge design with flexible space options, poised to become the go-to destination for businesses looking to thrive in a dynamic and growing market.',
    services: ['Premium Office Spaces', 'Commercial Retail Units', 'Modern Infrastructure', 'Strategic Location', 'Government Approved', 'Flexible Space Options'],
    website: 'https://www.navbodhtower.in',
    phone: '+91 7591 066 666',
    email: 'construction@navbodh.com',
    location: 'Shankar Nagar, Raipur, Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  },
  {
    id: 2,
    name: 'Navbodh Prakashan',
    project: 'Educational Publishing House',
    tagline: 'Est. 1985 · Leading Publisher in CG & MP',
    category: 'Books & Publishing',
    color: '#7c3aed',
    accent: '#ede9fe',
    bg: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
    icon: <TbBooks size={28} />,
    emoji: '📚',
    // status: 'Est. 1985',
    // statusColor: '#7c3aed',
    description: 'Established in 1985 by Shri Lalchand Agrawal, Navbodh Prakashan is a leading publishing house in Chhattisgarh and Madhya Pradesh. With over 30 years of experience, we publish 500+ titles including children\'s books, textbooks, and guides. We empower 60% of education in Chhattisgarh.',
    highlight: 'Our mission is to enhance education by providing high-quality, innovative, and accessible study materials that empower students and educators to achieve excellence.',
    services: ['School Textbooks', 'College Study Materials', 'Children\'s Books', 'Educational Guides', 'Reference Books', '500+ Titles Published'],
    website: 'https://www.navbodhprakashan.com',
    phone: '0771-4200930 / 4200905',
    email: 'prakashan@navbodh.com',
    location: 'Raipur, Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  },
  {
    id: 3,
    name: 'Gyanbodh Prakashan',
    project: 'Children\'s Book Publishing',
    tagline: 'Est. 2023 · Pan India Children\'s Publisher',
    category: 'Books & Publishing',
    color: '#d97706',
    accent: '#fef3c7',
    bg: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
    icon: <GiBookshelf size={28} />,
    emoji: '📖',
    // status: 'Est. 2023',
    // statusColor: '#d97706',
    description: 'Gyanbodh Prakashan, established in 2023, is a dedicated children\'s book publishing house operating across Pan India. Our mission is to ignite a love for reading in young minds and inspire a generation of thinkers, dreamers, and creators. We focus exclusively on children\'s literature.',
    highlight: 'We believe books have the power to shape a child\'s understanding of the world — offering rich stories that entertain, educate, and empower young readers.',
    services: ['Children\'s Storybooks', 'Picture Books', 'Educational Children\'s Content', 'Pan India Distribution', 'Age-Appropriate Literature', 'Multilingual Titles'],
    website: 'https://www.gyanbodhprakashan.com',
    phone: '+91 7471 145 503',
    email: 'gyanbodhprakashan@gmail.com',
    location: 'Raipur, Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
  },
  {
    id: 4,
    name: 'Shivayan Health Care',
    project: '50-Bed Multi-Specialty Hospital',
    // tagline: 'Under Construction · Nardaha, Raipur',
    category: 'Healthcare & Hospital',
    color: '#0891b2',
    accent: '#cffafe',
    bg: 'linear-gradient(135deg, #164e63 0%, #0891b2 100%)',
    icon: <MdLocalHospital size={28} />,
    emoji: '🏥',
    status: 'Coming Soon',
    statusColor: '#0891b2',
    description: 'Shivayan Health Care Hospital is a 50-bed multi-specialty hospital under construction in Nardaha, Raipur, Chhattisgarh. Being developed with modern infrastructure and advanced medical facilities to provide affordable, quality healthcare services to the community.',
    highlight: 'Upon completion, the hospital will offer emergency care, OPD services, inpatient facilities, ICU, maternity care, and diagnostic services — all under one roof.',
    services: ['Emergency Care', 'OPD Services', 'Inpatient Facilities', 'ICU', 'Maternity Care', 'Diagnostic Services'],
    website: null,
    phone: null,
    email: null,
    location: 'Nardaha, Raipur, Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
  },
  {
    id: 5,
    name: 'Yugbodh Digital Prints',
    project: 'Commercial Printing & Publishing',
    tagline: 'Raipur\'s Leading Printing Firm',
    category: 'Printing & Digital Media',
    color: '#dc2626',
    accent: '#fee2e2',
    bg: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
    icon: <MdPrint size={28} />,
    emoji: '🖨️',
    // status: 'Active',
    // statusColor: '#16a34a',
    description: 'Yugbodh Digital Prints is a prominent commercial printing and publishing firm in Raipur, Chhattisgarh. Established as an offset printer and publisher, it serves as the primary production house for major educational publishing concerns including Navbodh Prakashan.',
    highlight: 'Specializing in bulk educational text printing, children\'s literature, magazines, and commercial offset jobs — serving businesses across Chhattisgarh and Madhya Pradesh.',
    services: ['Educational Textbook Printing', 'Children\'s Literature', 'Commercial Offset', 'Digital Reproduction', 'Magazines & Brochures', 'Visiting Cards'],
    website: null,
    phone: '+91 7896 541 236',
    email: null,
    location: 'Samta Colony, Raipur, Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1516131206008-dd041a9764fd?w=800&q=80',
  },
];

const ConcernCard = ({ concern, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.34, 1.2, 0.64, 1] }}
      style={{ background: 'white', borderRadius: 24, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', transition: 'box-shadow 0.3s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'}
    >
      {/* Hero image with gradient overlay */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={concern.image} alt={concern.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: concern.bg, opacity: 0.82 }} />

        {/* Content over image */}
        <div style={{ position: 'absolute', inset: 0, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '8px 10px', color: 'white' }}>
              {concern.icon}
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>
                {concern.category}
              </span>
              <span style={{ background: concern.statusColor, color: 'white', padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700 }}>
                {concern.status}
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              {concern.emoji} {concern.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{concern.tagline}</div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '20px 24px' }}>

        {/* Project name */}
        <div style={{ display: 'inline-block', background: concern.accent, color: concern.color, padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, marginBottom: 14, letterSpacing: '0.04em' }}>
          {concern.project}
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.75, marginBottom: 16 }}>
          {concern.description}
        </p>

        {/* Services pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {concern.services.map((s, i) => (
            <span key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#374151', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
              {s}
            </span>
          ))}
        </div>

        {/* Expandable highlight */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}>
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', marginBottom: 16, borderLeft: `3px solid ${concern.color}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: concern.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Highlight</div>
                <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.75, margin: 0 }}>{concern.highlight}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, padding: '14px 0', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
            <IoLocationSharp size={14} color={concern.color} />
            <span>{concern.location}</span>
          </div>
          {concern.phone && (
            <a href={`tel:${concern.phone.replace(/\s/g,'')}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', textDecoration: 'none', fontWeight: 600 }}>
              <IoCallOutline size={14} color={concern.color} />
              {concern.phone}
            </a>
          )}
          {concern.email && (
            <a href={`mailto:${concern.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', textDecoration: 'none' }}>
              <IoMailOutline size={14} color={concern.color} />
              {concern.email}
            </a>
          )}
          {!concern.phone && !concern.email && (
            <div style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>Contact details coming soon</div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {concern.website && (
            <a href={concern.website} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 14px', background: concern.color, color: 'white', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <IoGlobeOutline size={14} /> Visit Website <MdArrowForward size={13} />
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
            onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}>
            {expanded ? 'Less' : 'More'}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <IoChevronDownOutline size={14} />
            </motion.span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SisterConcerns = () => {
  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>

      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f1f11 0%, #1a2c1c 50%, #2a4b2e 100%)', padding: 'clamp(60px,9vw,100px) 0 clamp(48px,6vw,72px)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <motion.div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(232,213,176,0.06)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,213,176,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(232,213,176,0.2)', borderRadius: 100, padding: '6px 18px', marginBottom: 20 }}>
              <MdBusiness size={13} color="#e8d5b0" />
              <span style={{ color: '#e8d5b0', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Navbodh Group of Companies</span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px,5.5vw,68px)', color: 'white', lineHeight: 1.06, fontWeight: 600, marginBottom: 16, maxWidth: 700 }}>
              Our Sister<br />
              <em style={{ color: '#e8d5b0', fontStyle: 'italic' }}>Concerns</em>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.8, maxWidth: 560, marginBottom: 36 }}>
              A diversified group with ventures spanning publishing, construction, healthcare, and printing — united by a shared commitment to quality and community.
            </motion.p>

            {/* Stats row */}
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 'clamp(20px,4vw,48px)', flexWrap: 'wrap' }}>
              {[
                { value: '5',    label: 'Sister Concerns' },
                { value: '40+', label: 'Years of Legacy' },
                { value: '500+', label: 'Book Titles' },
                { value: 'CG',   label: 'Based in Raipur' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#e8d5b0', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Cards grid */}
      <section style={{ background: '#f9fafb', padding: 'clamp(40px,6vw,72px) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: 'clamp(16px,3vw,28px)' }}>
            {CONCERNS.map((concern, i) => (
              <ConcernCard key={concern.id} concern={concern} index={i} />
            ))}
          </div>    
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: 'var(--forest-deep)', padding: 'clamp(52px,7vw,80px) 0', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,48px)', color: 'white', marginBottom: 14 }}>
              Want to Know More?
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
              Reach out to us for partnerships, collaborations, or any enquiries about the Navbodh Group.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:7471145013" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 28px', background: '#e8d5b0', color: '#1a2c1c', borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                <IoCallOutline size={17} /> +91 74711 45013
              </a>
              <a href="mailto:navbodhorganics@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                <IoMailOutline size={17} /> Email Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default SisterConcerns;