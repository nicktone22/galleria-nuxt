type Locale = 'it' | 'en'
type LocaleMap = Record<string, string>
type Dictionary = Record<Locale, LocaleMap>

const fieldLabels: Dictionary = {
  it: {
    signed: 'Firmata',
    signature_type: 'Tipo di firma',
    signature_position: 'Posizione della firma',
    numbering: 'Numerazione',
    certificate_of_authenticity: 'Certificato di autenticità',

    general_condition: 'Condizione generale',
    restored: 'Restaurata',
    framed: 'Incorniciata',
    condition_images: 'Immagini condizione',

    object_type: 'Tipo oggetto',
    artwork_type: 'Tipologia opera',
    type: 'Tipologia',
    style: 'Stile',
    materials: 'Materiali',
    material: 'Materiale',
    technique: 'Tecnica',
    medium: 'Tecnica',
    category: 'Categoria',
    year: 'Anno',
    date: 'Data',

    width: 'Larghezza',
    height: 'Altezza',
    depth: 'Profondità',
    weight: 'Peso',
    dimension_unit: 'Unità dimensioni',
    weight_unit: 'Unità peso',

    commercial_status: 'Stato commerciale',
    physical_status: 'Stato fisico',
    location_type: 'Tipo posizione',
    location_label: 'Posizione',
    ownership_type: 'Tipo proprietà',
    inventory_code: 'Codice inventario',
    internal_notes: 'Note interne',

    price: 'Prezzo',
    reserve_price: 'Prezzo di riserva',
    purchase_price: 'Prezzo di acquisto',
    currency: 'Valuta',
    vat_included: 'IVA inclusa',
    hide_price: 'Nascondi prezzo'
  },
  en: {
    signed: 'Signed',
    signature_type: 'Signature type',
    signature_position: 'Signature position',
    numbering: 'Numbering',
    certificate_of_authenticity: 'Certificate of authenticity',

    general_condition: 'General condition',
    restored: 'Restored',
    framed: 'Framed',
    condition_images: 'Condition images',

    object_type: 'Object type',
    artwork_type: 'Artwork type',
    type: 'Type',
    style: 'Style',
    materials: 'Materials',
    material: 'Material',
    technique: 'Technique',
    medium: 'Technique',
    category: 'Category',
    year: 'Year',
    date: 'Date',

    width: 'Width',
    height: 'Height',
    depth: 'Depth',
    weight: 'Weight',
    dimension_unit: 'Dimension unit',
    weight_unit: 'Weight unit',

    commercial_status: 'Commercial status',
    physical_status: 'Physical status',
    location_type: 'Location type',
    location_label: 'Location',
    ownership_type: 'Ownership type',
    inventory_code: 'Inventory code',
    internal_notes: 'Internal notes',

    price: 'Price',
    reserve_price: 'Reserve price',
    purchase_price: 'Purchase price',
    currency: 'Currency',
    vat_included: 'VAT included',
    hide_price: 'Hide price'
  }
}

const sectionLabels: Dictionary = {
  it: {
    artwork_details: 'Dettagli opera',
    dimensions: 'Dimensioni',
    management: 'Diritti e provenienza',
    pricing: 'Prezzo e gestione'
  },
  en: {
    artwork_details: 'Artwork details',
    dimensions: 'Dimensions',
    management: 'Rights and provenance',
    pricing: 'Price and management'
  }
}

const enumLabels: Dictionary = {
  it: {
    YES: 'Sì',
    NO: 'No',
    true: 'Sì',
    false: 'No',

    GOOD: 'Buono',
    EXCELLENT: 'Eccellente',
    VERY_GOOD: 'Molto buono',
    FAIR: 'Discreto',
    POOR: 'Scarso',
    DAMAGED: 'Danneggiato',

    VASE: 'Vaso',
    PAINTING: 'Dipinto',
    SCULPTURE: 'Scultura',
    DRAWING: 'Disegno',
    PHOTOGRAPHY: 'Fotografia',
    PRINT: 'Stampa',
    BOOKS_PORTFOLIOS: 'Libri e portfolio',
    DESIGN_OBJECT: 'Oggetto di design',
    OTHER: 'Altro',

    RESTAURAZIONE: 'Restaurazione',
    RESTORATION: 'Restauro',
    MODERN: 'Moderno',
    CONTEMPORARY: 'Contemporaneo',
    ANCIENT: 'Antico',
    VINTAGE: 'Vintage',

    BRONZE: 'Bronzo',
    MARBLE: 'Marmo',
    STONE: 'Pietra',
    WOOD: 'Legno',
    PAPER: 'Carta',
    CANVAS: 'Tela',
    GLASS: 'Vetro',
    CERAMIC: 'Ceramica',
    METAL: 'Metallo',
    MIXED_MEDIA: 'Tecnica mista',

    PAINTED: 'Dipinto',
    CASTING: 'Fusione',
    CARVING: 'Intaglio',
    ENGRAVING: 'Incisione',
    LITHOGRAPH: 'Litografia',
    SCREENPRINT: 'Serigrafia',

    CM: 'Centimetri',
    MM: 'Millimetri',
    M: 'Metri',
    IN: 'Pollici',
    KG: 'Chilogrammi',
    G: 'Grammi',
    LB: 'Libbre',
    OZ: 'Once',

    FOR_SALE: 'In vendita',
    NOT_FOR_SALE: 'Non in vendita',
    ON_HOLD: 'In sospeso',
    IN_NEGOTIATION: 'In trattativa',
    SOLD_PENDING_PAYMENT: 'Venduto, pagamento in attesa',
    AT_FAIR: 'In fiera',
    LOANED_OUT: 'In prestito',
    SOLD: 'Venduto',

    ACTIVE: 'Attivo',
    IN_TRANSIT: 'In transito',
    AT_RESTORER: 'Dal restauratore',
    RETURN_PENDING: 'In attesa di rientro',
    DEACCESSIONED: 'Dismesso',

    GALLERY: 'Galleria',
    WAREHOUSE: 'Magazzino',
    FAIR_VENUE: 'Sede fiera',
    PARTNER_GALLERY: 'Galleria partner',
    CLIENT: 'Cliente',
    SHIPPER: 'Spedizioniere',
    RESTORER: 'Restauratore',
    ARTIST: 'Artista',
    COLLECTOR: 'Collezionista',
    INSTITUTION: 'Istituzione',
    THIRD_PARTY: 'Terza parte'
  },
  en: {
    YES: 'Yes',
    NO: 'No',
    true: 'Yes',
    false: 'No',

    GOOD: 'Good',
    EXCELLENT: 'Excellent',
    VERY_GOOD: 'Very good',
    FAIR: 'Fair',
    POOR: 'Poor',
    DAMAGED: 'Damaged',

    VASE: 'Vase',
    PAINTING: 'Painting',
    SCULPTURE: 'Sculpture',
    DRAWING: 'Drawing',
    PHOTOGRAPHY: 'Photography',
    PRINT: 'Print',
    BOOKS_PORTFOLIOS: 'Books and portfolios',
    DESIGN_OBJECT: 'Design object',
    OTHER: 'Other',

    RESTAURAZIONE: 'Restoration',
    RESTORATION: 'Restoration',
    MODERN: 'Modern',
    CONTEMPORARY: 'Contemporary',
    ANCIENT: 'Ancient',
    VINTAGE: 'Vintage',

    BRONZE: 'Bronze',
    MARBLE: 'Marble',
    STONE: 'Stone',
    WOOD: 'Wood',
    PAPER: 'Paper',
    CANVAS: 'Canvas',
    GLASS: 'Glass',
    CERAMIC: 'Ceramic',
    METAL: 'Metal',
    MIXED_MEDIA: 'Mixed media',

    PAINTED: 'Painted',
    CASTING: 'Casting',
    CARVING: 'Carving',
    ENGRAVING: 'Engraving',
    LITHOGRAPH: 'Lithograph',
    SCREENPRINT: 'Screenprint',

    CM: 'Centimetres',
    MM: 'Millimetres',
    M: 'Metres',
    IN: 'Inches',
    KG: 'Kilograms',
    G: 'Grams',
    LB: 'Pounds',
    OZ: 'Ounces',

    FOR_SALE: 'For sale',
    NOT_FOR_SALE: 'Not for sale',
    ON_HOLD: 'On hold',
    IN_NEGOTIATION: 'In negotiation',
    SOLD_PENDING_PAYMENT: 'Sold, pending payment',
    AT_FAIR: 'At fair',
    LOANED_OUT: 'Loaned out',
    SOLD: 'Sold',

    ACTIVE: 'Active',
    IN_TRANSIT: 'In transit',
    AT_RESTORER: 'At restorer',
    RETURN_PENDING: 'Return pending',
    DEACCESSIONED: 'Deaccessioned',

    GALLERY: 'Gallery',
    WAREHOUSE: 'Warehouse',
    FAIR_VENUE: 'Fair venue',
    PARTNER_GALLERY: 'Partner gallery',
    CLIENT: 'Client',
    SHIPPER: 'Shipper',
    RESTORER: 'Restorer',
    ARTIST: 'Artist',
    COLLECTOR: 'Collector',
    INSTITUTION: 'Institution',
    THIRD_PARTY: 'Third party'
  }
}

function normalizeLocale(locale = 'it'): Locale {
  return locale.startsWith('en') ? 'en' : 'it'
}

function normalizeKey(value: string) {
  return String(value || '')
    .replace(/^tss_/i, '')
    .replace(/^artwork_/i, '')
    .replace(/^various_/i, '')
}

export function useArtworkI18n() {
  function tArtworkField(key: string, locale = 'it') {
    const lang = normalizeLocale(locale)
    const cleanKey = normalizeKey(key)

    return fieldLabels[lang][key] || fieldLabels[lang][cleanKey] || ''
  }

  function tArtworkSection(key: string, locale = 'it') {
    const lang = normalizeLocale(locale)
    return sectionLabels[lang][key] || key
  }

  function tArtworkValue(value: any, locale = 'it') {
    if (value === null || value === undefined || value === '') return ''

    const lang = normalizeLocale(locale)
    const normalizedValue = String(value)

    return enumLabels[lang][normalizedValue] || normalizedValue
  }

  return {
    tArtworkField,
    tArtworkSection,
    tArtworkValue
  }
}
