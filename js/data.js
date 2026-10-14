/**
 * Maison Aurum — Beirut Fine Jewelry House
 * Master Catalog, Currencies, Boutiques & Lebanese Heritage Data
 * Established in Beirut, Lebanon • Est. 1994
 */

const WHATSAPP_NUMBER = '96171063529'; // Authentic Lebanese WhatsApp  (+961 71 889 900)

const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.00, label: 'USD ($) - Primary' },
  LBP: { code: 'LBP', symbol: 'LBP ', rate: 89500, label: 'LBP (Lebanese Pound - L.L.)' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, label: 'AED (Dirhams - UAE)' },
  SAR: { code: 'SAR', symbol: 'SAR ', rate: 3.75, label: 'SAR (Riyals - Saudi Arabia)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€ - Europe)' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.36, label: 'CAD (CA$ - Canada)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£ - UK)' }
};

const PRODUCTS = [
  {
    id: 'sal-001',
    sku: 'SAL-SOL-9820',
    title: 'The Beirut Solitaire Diamond Ring',
    category: 'Rings',
    type: 'solitaires',
    badge: 'Lebanese Bridal Essential',
    priceUSD: 5200,
    metal: '18K White Gold',
    stone: '1.30 ct Triple-Ex Round Brilliant (GIA F / VVS1)',
    collection: 'Beirut Solitaire',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'A signature Lebanese bridal engagement solitaire, hand-cast in our Beirut workshop. Crafted in 18KT white gold with a crown of 6 delicate micro-prongs designed to maximize light reflection from every angle.',
    details: [
      'Origin: Handcrafted in our Mount Lebanon Workshop',
      'Metal: 18KT White Gold with official Lebanese hallmark (also available in Platinum 950)',
      'Center Diamond: 1.30 Carat Round Brilliant, Color F, Clarity VVS1',
      'Cut: Triple Excellent (Cut, Polish, Symmetry) — GIA Certified',
      'Complimentary Custom Arabic or English Laser Engraving inside band',
      'Includes Official GIA Dossier, House Warranty & Velvet Presentation Chest'
    ],
    sizes: ['EU 48 / US 4.5', 'EU 50 / US 5.25', 'EU 52 / US 6.0', 'EU 54 / US 6.75', 'EU 56 / US 7.5', 'EU 58 / US 8.5'],
    keywords: ['ring', 'rings', 'solitaire', 'diamond', 'diamonds', 'engagement', 'bridal', 'white gold', '18k', '18kt', 'bague', 'solitaires', 'beirut']
  },
  {
    id: 'sal-002',
    sku: 'SAL-CDR-1943',
    title: 'The Cedar of Lebanon Diamond Medallion',
    category: 'Necklaces',
    type: 'heritage',
    badge: 'National Heritage',
    priceUSD: 2450,
    metal: '18K Yellow Gold',
    stone: '0.45 ctw Pavé Diamonds (Color F-G / VS)',
    collection: 'Cedar Heritage',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'An iconic tribute to our homeland. Sculpted in rich 18K yellow gold, the noble Cedar of Lebanon is adorned with hand-selected brilliant pavé diamonds, symbolizing eternal resilience and elegance.',
    details: [
      'Metal: Solid 18KT Yellow Gold with official government hallmark',
      'Diamonds: 42 round brilliant pavé-set diamonds (0.45 ctw, F-G, VS)',
      'Dimensions: 22mm medallion diameter',
      'Chain: Solid 18KT Yellow Gold diamond-cut wheat chain (adjustable 42cm - 46cm)',
      'A timeless national heirloom cherished by the Lebanese diaspora worldwide'
    ],
    sizes: ['16.5 inches (42 cm)', '18 inches (45 cm)', '20 inches (50 cm)'],
    keywords: ['necklace', 'necklaces', 'pendant', 'pendants', 'cedar', 'cedars', 'lebanon', 'medallion', 'medallions', 'yellow gold', '18k', '18kt', 'diamond', 'diamonds', 'heritage']
  },
  {
    id: 'sal-003',
    sku: 'SAL-BRD-7700',
    title: 'The Royal Wedding Set (Complete 4-Piece Suite)',
    category: 'High Jewelry',
    type: 'bridal',
    badge: 'Grand Bridal Suite',
    priceUSD: 16800,
    metal: '18K White Gold',
    stone: '8.50 ctw Brilliant Diamonds (Color F-G / VVS-VS)',
    collection: 'Lebanese Wedding Sets',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'The pinnacle of Lebanese wedding tradition. A masterwork wedding set comprising a graduated diamond riviera collar necklace, matching tennis bracelet, chandelier drop earrings, and a statement cocktail ring.',
    details: [
      'Complete 4-Piece Wedding Set: Necklace, Bracelet, Earrings & Ring',
      'Metal: 18KT White Gold (total suite weight: 64.5 grams)',
      'Total Diamond Weight: 8.50 Carats Natural Diamonds (F-G Color, VVS-VS Clarity)',
      'Choker: Fluid articulating links that lay flawlessly against the collarbone',
      'Handcrafted over 180 hours in our Kaslik High Jewelry Atelier',
      'Delivered in handcrafted cedarwood & silk bridal presentation chest'
    ],
    sizes: ['Complete Bridal Suite', 'Custom Sizing upon order'],
    keywords: ['wedding set', 'wedding sets', 'bridal', 'suite', 'wedding', 'necklace', 'necklaces', 'bracelet', 'bracelets', 'earrings', 'earring', 'ring', 'rings', 'high jewelry', 'diamond', 'diamonds', 'choker']
  },
  {
    id: 'sal-004',
    sku: 'SAL-PHO-3301',
    title: 'Ancient Phoenician Galley Coin Medallion',
    category: 'Necklaces',
    type: 'heritage',
    badge: 'Historic Masterpiece',
    priceUSD: 3100,
    metal: '18K Hammered Yellow Gold',
    stone: 'Central 0.18 ct Star-Set Diamond',
    collection: 'Phoenician Heritage',
    image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Inspired by ancient Phoenician coins unearthed in the historic port of Byblos (Jbeil). Hand-hammered 18K yellow gold relief featuring the Phoenician maritime galley, centered with a brilliant gypsy-set diamond.',
    details: [
      'Metal: Heavy 18KT Yellow Gold with antique satin brush and hand-chiseled edge (18.6 grams)',
      'Motif: Ancient Phoenician seafaring galley of Byblos',
      'Diamond: 0.18 ct Round Brilliant star-set center stone (Color E, Clarity VS1)',
      'Reverse Side: Engraved with Phoenician script blessings of prosperity & safe passage',
      'Chain: Heavy 18KT Byzantine gold chain included'
    ],
    sizes: ['18 inches (45 cm)', '20 inches (50 cm)', '22 inches (55 cm)'],
    keywords: ['necklace', 'necklaces', 'pendant', 'pendants', 'medallion', 'medallions', 'coin', 'coins', 'phoenician', 'galley', 'byblos', 'jbeil', 'yellow gold', '18k', '18kt', 'diamond', 'diamonds']
  },
  {
    id: 'sal-005',
    sku: 'SAL-EYE-4210',
    title: 'Mediterranean Evil Eye Diamond Talisman',
    category: 'Necklaces',
    type: 'heritage',
    badge: 'Bestseller',
    priceUSD: 1950,
    metal: '18K Yellow Gold',
    stone: 'Natural Sleeping Beauty Turquoise, Ceylon Sapphire & Pavé Diamonds',
    collection: 'Levantine Talismans',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'A modern Levantine protection talisman celebrating Beirut’s Mediterranean soul. Inlaid with natural turquoise, centered with a deep royal blue Ceylon sapphire iris, and encircled by brilliant diamond pavé.',
    details: [
      'Metal: 18KT Yellow Gold',
      'Stones: Natural hand-carved Turquoise plate & 0.15ct Natural Ceylon Sapphire',
      'Diamonds: 0.28 ctw micro-pavé diamonds (Color F, Clarity VS)',
      'Traditional Mediterranean protection against negative energy and the evil eye',
      'Perfect everyday luxury necklace favored by Lebanese tastemakers'
    ],
    sizes: ['16.5 inches (42 cm)', '18 inches (45 cm)'],
    keywords: ['necklace', 'necklaces', 'talisman', 'talismans', 'evil eye', 'eye', 'turquoise', 'sapphire', 'sapphires', 'yellow gold', '18k', '18kt', 'diamond', 'diamonds', 'pendant']
  },
  {
    id: 'sal-006',
    sku: 'SAL-GLD-8820',
    title: 'Beirut Heritage 18K Braided Gold Bangle ("Majdoul")',
    category: 'Bracelets',
    type: 'gold',
    badge: 'Artisan Goldsmith',
    priceUSD: 3900,
    metal: 'Solid 18K Yellow Gold',
    stone: 'High Polish & Hand-Braided Gold Filigree',
    collection: 'Beirut Goldsmiths',
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'A classic staple of every Lebanese woman’s jewelry chest. Woven from solid 18K gold threads in our Beirut workshop using traditional Levantine goldsmith techniques, equipped with an invisible safety clasp.',
    details: [
      'Metal: 100% Solid 18KT Yellow Gold (28.4 grams heavy gold weight)',
      'Technique: Hand-braided filigree wires with mirror-polished end caps',
      'Closure: Concealed tongue-in-groove clasp with dual fold-over safety latches',
      'Hallmarked with the official Lebanese Ministry of Industry gold stamp'
    ],
    sizes: ['Small (16.0 cm)', 'Medium (17.5 cm)', 'Large (19.0 cm)'],
    keywords: ['bracelet', 'bracelets', 'bangle', 'bangles', 'majdoul', 'braided', 'gold', 'yellow gold', '18k', '18kt', 'solid gold', 'beirut']
  },
  {
    id: 'sal-007',
    sku: 'SAL-CAL-5521',
    title: 'Levantine "Hob" (Love) Calligraphy Necklace',
    category: 'Necklaces',
    type: 'heritage',
    badge: 'Arabic Calligraphy',
    priceUSD: 1650,
    metal: '18K Rose Gold',
    stone: '0.35 ctw Pavé Diamonds',
    collection: 'Levantine Calligraphy',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'The Levantine word for Love ("Hob") sculpted into fluid, modern poetry in 18K rose gold and pavé diamonds. Designed in collaboration with master Lebanese typographers to celebrate Levantine romance.',
    details: [
      'Metal: 18KT Rose Gold',
      'Diamonds: 0.35 ctw round brilliant diamonds (Color F-G, Clarity VS)',
      'Dimensions: 24mm graceful calligraphy pendant width',
      'Chain: 18KT Rose gold adjustable cable chain (40cm - 45cm)',
      'Also available with custom bespoke Arabic names upon request'
    ],
    sizes: ['16 inches (40 cm)', '18 inches (45 cm)'],
    keywords: ['necklace', 'necklaces', 'pendant', 'pendants', 'calligraphy', 'hob', 'love', 'arabic', 'rose gold', '18k', '18kt', 'diamond', 'diamonds']
  },
  {
    id: 'sal-008',
    sku: 'SAL-TEN-6012',
    title: 'The Riviera Classic Diamond Tennis Bracelet',
    category: 'Bracelets',
    type: 'solitaires',
    badge: 'Signature',
    priceUSD: 7400,
    metal: '18K White Gold',
    stone: '4.80 ctw Brilliant Cut Diamonds (F / VS1)',
    collection: 'Beirut High Jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'An essential high-jewelry staple worn across Beirut society. A continuous river of individually matched round brilliant diamonds set in fluid 18K white gold four-prong baskets with a reinforced double-latch box clasp.',
    details: [
      'Metal: 18KT White Gold (17.5 grams)',
      'Total Diamond Weight: 4.80 Carats (56 matched stones)',
      'Diamond Quality: Color F, Clarity VS1, Triple-Ex cut',
      'Safety: Double security catch engineered for everyday elegance and peace of mind'
    ],
    sizes: ['6.5 in (16.5 cm)', '7.0 in (18.0 cm)', '7.5 in (19.0 cm)'],
    keywords: ['bracelet', 'bracelets', 'tennis', 'tennis bracelet', 'riviera', 'diamond', 'diamonds', 'white gold', '18k', '18kt', 'high jewelry']
  },
  {
    id: 'sal-009',
    sku: 'SAL-EMR-8831',
    title: 'Imperial Colombian Emerald & Diamond Ring',
    category: 'Rings',
    type: 'gemstones',
    badge: 'High Jewelry',
    priceUSD: 9800,
    metal: '18K Yellow Gold & Platinum 950',
    stone: '2.40 ct Vivid Green Colombian Emerald & Trapezoid Diamonds',
    collection: 'Precious Gemstones',
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'An extraordinary Colombian emerald possessing vivid saturation and intense fire, cradled in 18K yellow gold prongs and framed by custom-cut step trapezoid diamonds set in solid platinum.',
    details: [
      'Center Stone: 2.40 ct Natural Colombian Emerald (Minor Cedar Oil Only)',
      'Accent Diamonds: 0.65 ctw Trapezoid-cut stones (Color E-F, Clarity VVS)',
      'Mounting: Handcrafted Platinum 950 gallery with 18KT yellow gold eagle-claw prongs',
      'Accompanied by Swiss Gemmological Institute (SSEF) Certificate & Maison Aurum Passport'
    ],
    sizes: ['EU 50 / US 5.25', 'EU 52 / US 6.0', 'EU 54 / US 6.75', 'EU 56 / US 7.5'],
    keywords: ['ring', 'rings', 'emerald', 'emeralds', 'colombian', 'gemstone', 'gemstones', 'platinum', 'yellow gold', 'diamond', 'diamonds']
  },
  {
    id: 'sal-010',
    sku: 'SAL-KHM-2190',
    title: 'Handcrafted Khamsa (Hand of Fatima) Diamond Charm',
    category: 'Necklaces',
    type: 'heritage',
    badge: 'Levantine Protection',
    priceUSD: 1850,
    metal: '18K Yellow Gold',
    stone: '0.40 ctw Brilliant Diamonds & Royal Blue Sapphire',
    collection: 'Levantine Talismans',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'The iconic five-fingered Khamsa talisman handcrafted with micro-pavé diamonds and a vivid natural sapphire center. A cherished Levantine protective amulet passed down through generations of Lebanese mothers.',
    details: [
      'Metal: 18KT Solid Yellow Gold',
      'Diamonds: 38 Micro-pavé Diamonds (0.40 ctw, F/VS)',
      'Center Stone: 0.12 ct Natural Ceylon Sapphire',
      'Chain: 18KT Yellow Gold 18-inch adjustable link chain included'
    ],
    sizes: ['16 inches (40 cm)', '18 inches (45 cm)'],
    keywords: ['necklace', 'necklaces', 'pendant', 'pendants', 'charm', 'charms', 'khamsa', 'hand of fatima', 'hamsa', 'sapphire', 'yellow gold', '18k', '18kt', 'diamond', 'diamonds']
  },
  {
    id: 'sal-011',
    sku: 'SAL-SAP-9940',
    title: 'Royal Ceylon Sapphire & Pear Diamond Ring',
    category: 'Rings',
    type: 'gemstones',
    badge: 'High Jewelry',
    priceUSD: 11200,
    metal: 'Platinum 950',
    stone: '3.60 ct Unheated Royal Blue Ceylon Sapphire & Pear Diamonds',
    collection: 'Precious Gemstones',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'A magnificent unheated Royal Blue Ceylon sapphire displaying velvet saturation, flanked by twin tapered pear-shaped diamond shoulders in solid Platinum 950.',
    details: [
      'Center Sapphire: 3.60 ct Natural Ceylon Sapphire (No thermal treatment / Unheated)',
      'Side Diamonds: Two Pear-cut Diamonds (0.80 ctw, Color D-E, Clarity VVS1)',
      'Metal: Solid Platinum 950 handmade four-prong mount',
      'Certified by GRS Gemstone Research Swiss Lab'
    ],
    sizes: ['EU 50 / US 5.25', 'EU 52 / US 6.0', 'EU 54 / US 6.75'],
    keywords: ['ring', 'rings', 'sapphire', 'sapphires', 'ceylon', 'gemstone', 'gemstones', 'platinum', 'diamond', 'diamonds', 'pear']
  },
  {
    id: 'sal-012',
    sku: 'SAL-PRL-4411',
    title: 'Byblos Mediterranean Pearl & Diamond Sautoir',
    category: 'Necklaces',
    type: 'heritage',
    badge: 'Limited Edition',
    priceUSD: 4600,
    metal: '18K Yellow Gold',
    stone: 'Luminous Saltwater Cultured Pearls & Diamond Spacers',
    collection: 'Phoenician Heritage',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Evoking the historic Phoenician pearl diving trade from the shores of Byblos. Lustrous saltwater pearls interspersed with hand-chiseled 18K yellow gold filigree beads and diamond-set rondelles.',
    details: [
      'Pearls: 11-12mm AAA Luster Saltwater Cultured Pearls with silvery-rose overtone',
      'Gold Elements: Solid 18KT Yellow Gold filigree orbs crafted by master artisans',
      'Diamonds: 0.60 ctw round brilliant pavé rondelles',
      'Versatile 34-inch Sautoir length, wearable as a single long strand or doubled choker'
    ],
    sizes: ['34 inches (86 cm Sautoir)'],
    keywords: ['necklace', 'necklaces', 'sautoir', 'pearl', 'pearls', 'byblos', 'choker', 'yellow gold', '18k', '18kt', 'diamond', 'diamonds']
  },
  {
    id: 'sal-013',
    sku: 'SAL-EAR-6620',
    title: 'Beirut Heritage Chandelier Diamond Earrings',
    category: 'Earrings',
    type: 'bridal',
    badge: 'Lebanese Bridal',
    priceUSD: 5800,
    metal: '18K White Gold',
    stone: '3.20 ctw Brilliant & Pear Diamonds (Color F / VS)',
    collection: 'Lebanese Bridal',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Cascading chandelier earrings crafted in 18KT white gold with brilliant-cut and pear-shaped diamonds. A signature piece of Lebanese bridal opulence engineered for weightless movement.',
    details: [
      'Metal: 18KT White Gold (14.2 grams)',
      'Diamonds: 3.20 ctw round brilliant and pear-cut diamonds (Color F, Clarity VS)',
      'Backing: Secure French clip-and-post mechanism for comfort and security',
      'Handcrafted in our Beirut High Jewelry workshop'
    ],
    sizes: ['Drop Length: 48mm'],
    keywords: ['earring', 'earrings', 'chandelier', 'diamond', 'diamonds', 'bridal', 'drop earrings', '18k', 'white gold', 'wedding']
  }
];

const BOUTIQUES = [
  {
    city: 'Beirut - Downtown',
    mall: 'Downtown Central Flagship Salon',
    address: 'Fakhry Bey Street, Bab Idriss Quarter, Beirut Central District, Lebanon',
    phone: '+961 1 985 400',
    email: 'beirut@maisonaurum.com',
    hours: 'Mon - Sat: 10:00 - 19:30 | Closed Sunday'
  },
  {
    city: 'Kaslik / Zouk Mosbeh',
    mall: 'Main Showroom & Master Goldsmith Ateliers',
    address: 'Maison Aurum Palace, Zouk Mosbeh Highway, Mount Lebanon',
    phone: '+961 9 221 500',
    email: 'kaslik@maisonaurum.com',
    hours: 'Mon - Sat: 10:00 - 20:00 | VIP Private Atelier by Appointment'
  },
  {
    city: 'Byblos (Jbeil)',
    mall: 'Old Souk Heritage Atelier',
    address: 'Historic Port Road, Old Phoenician Souk, Byblos (Jbeil), Lebanon',
    phone: '+961 9 546 800',
    email: 'byblos@maisonaurum.com',
    hours: 'Mon - Sun: 11:00 - 21:00 (Open 7 Days)'
  },
  {
    city: 'Achrafieh (Tabaris)',
    mall: 'Tabaris Private VIP Suite',
    address: 'Avenue Charles Malek, Achrafieh, Beirut, Lebanon',
    phone: '+961 1 204 100',
    email: 'achrafieh@maisonaurum.com',
    hours: 'Mon - Fri: 10:30 - 19:00 | Private Showings Only'
  },
  {
    city: 'Dubai (GCC Flagship)',
    mall: 'DIFC & Dubai Mall Fashion Avenue',
    address: 'Gate Village, Level 2, Suite 210, DIFC, Dubai, UAE',
    phone: '+971 4 398 2210',
    email: 'dubai@maisonaurum.com',
    hours: 'Sun - Thu: 10:00 - 22:00 | Fri - Sat: 10:00 - 24:00'
  }
];

const HERO_SLIDES = [
  {
    num: '01',
    eyebrow: 'Haute Joaillerie • Beirut Est. 1994',
    title: 'The Poetry of <em>High Lebanese Goldsmithing</em>',
    subtitle: 'Carrying forward centuries of Phoenician goldsmithing mastery, triple-certified diamonds, and timeless Mediterranean luxury.',
    ctaText: 'Explore Atelier Suite',
    ctaLink: '#products-showcase',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=85',
    focalTag: 'Signature Solitaire',
    focalTitle: 'The Beirut Solitaire Ring',
    focalSpec: '18KT White Gold • 1.30 ct Triple-Ex GIA F/VVS1',
    focalImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    focalPrice: '$5,200',
    focalId: 'sal-001'
  },
  {
    num: '02',
    eyebrow: 'The Lebanese Wedding Suite',
    title: 'The Eternal <em>Promise of Beirut</em>',
    subtitle: 'From triple-excellent GIA certified solitaires to complete heirloom bridal diamond suites hand-crafted in our Mount Lebanon ateliers.',
    ctaText: 'Commission Your Wedding Set',
    ctaLink: '#bespoke-section',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1920&q=85',
    focalTag: 'Royal Bridal Commission',
    focalTitle: 'Phoenician Princess Bridal Suite',
    focalSpec: '18KT White Gold • 8.60 ctw GIA Diamonds',
    focalImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
    focalPrice: '$28,500',
    focalId: 'sal-003'
  },
  {
    num: '03',
    eyebrow: 'National Heritage & Protective Talismans',
    title: 'The Gold of <em>Mount Lebanon & Phoenicia</em>',
    subtitle: 'Iconic 18KT gold Cedars of Lebanon, ancient Phoenician coin medallions, and handcrafted Mediterranean evil eye talismans.',
    ctaText: 'Discover Heritage Jewels',
    ctaLink: '#products-showcase',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1920&q=85',
    focalTag: 'National Heritage Talisman',
    focalTitle: 'The Cedar of Lebanon Medallion',
    focalSpec: 'Solid 18KT Yellow Gold • 0.45 ctw Pavé',
    focalImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    focalPrice: '$2,450',
    focalId: 'sal-002'
  }
];
