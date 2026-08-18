import type { ExteriorColor, InteriorOption, Vehicle, WheelOption } from './types'

export const exteriorColors: ExteriorColor[] = [
  { id: 'obsidian-black', name: 'Obsidian Black', hex: '#0c0d0f', metalness: 0.9, roughness: 0.25 },
  { id: 'pearl-white', name: 'Pearl White', hex: '#eeeee8', metalness: 0.6, roughness: 0.2 },
  { id: 'velocity-red', name: 'Velocity Red', hex: '#a8221b', metalness: 0.7, roughness: 0.22 },
  { id: 'titanium-silver', name: 'Titanium Silver', hex: '#9a9c9f', metalness: 0.85, roughness: 0.2 },
  { id: 'deep-ocean-blue', name: 'Deep Ocean Blue', hex: '#132a44', metalness: 0.75, roughness: 0.22 },
  { id: 'forest-green', name: 'Forest Green', hex: '#1f3325', metalness: 0.7, roughness: 0.24 },
]

/** Real Toyota Land Cruiser colours, used only on the terrano vehicle entry below. */
export const landCruiserColors: ExteriorColor[] = [
  { id: 'white-pearl', name: 'White Pearl Crystal Shine', hex: '#eeeee8', metalness: 0.55, roughness: 0.22 },
  { id: 'midnight-black', name: 'Midnight Black Metallic', hex: '#0c0d0f', metalness: 0.85, roughness: 0.25 },
  { id: 'silver-metallic', name: 'Silver Metallic', hex: '#9a9c9f', metalness: 0.85, roughness: 0.22 },
  { id: 'graphite', name: 'Graphite', hex: '#43454a', metalness: 0.75, roughness: 0.28 },
  { id: 'terra-brown', name: 'Terra', hex: '#6b4a35', metalness: 0.6, roughness: 0.3 },
  { id: 'blueprint', name: 'Blueprint', hex: '#1f3a52', metalness: 0.7, roughness: 0.26 },
]

/** Real Tesla Model 3 colours, used only on the nova vehicle entry below. */
export const model3Colors: ExteriorColor[] = [
  { id: 'pearl-white-multicoat', name: 'Pearl White Multi-Coat', hex: '#eeeee8', metalness: 0.5, roughness: 0.18 },
  { id: 'solid-black', name: 'Solid Black', hex: '#0c0d0f', metalness: 0.85, roughness: 0.22 },
  { id: 'midnight-silver', name: 'Midnight Silver Metallic', hex: '#5c5e62', metalness: 0.85, roughness: 0.2 },
  { id: 'deep-blue-metallic', name: 'Deep Blue Metallic', hex: '#12233f', metalness: 0.75, roughness: 0.22 },
  { id: 'red-multicoat', name: 'Red Multi-Coat', hex: '#9c1c22', metalness: 0.7, roughness: 0.2 },
]

/** Real Mercedes-Maybach colours, used only on the auron vehicle entry below. */
export const maybachColors: ExteriorColor[] = [
  { id: 'obsidian-black', name: 'Obsidian Black', hex: '#0c0d0f', metalness: 0.9, roughness: 0.2 },
  { id: 'diamond-white', name: 'Diamond White Bright', hex: '#eceae4', metalness: 0.55, roughness: 0.2 },
  { id: 'selenite-grey', name: 'Selenite Grey Magno', hex: '#6a6b6d', metalness: 0.3, roughness: 0.55 },
  { id: 'kalahari-gold', name: 'Kalahari Gold', hex: '#9c8155', metalness: 0.7, roughness: 0.24 },
  { id: 'cavansite-blue', name: 'Cavansite Blue', hex: '#233a55', metalness: 0.75, roughness: 0.22 },
]

/** Real Toyota GR Supra exterior colours, used only on the gr-supra vehicle entry below. */
export const grSupraColors: ExteriorColor[] = [
  { id: 'nocturnal', name: 'Nocturnal', hex: '#0c0d0f', metalness: 0.9, roughness: 0.25 },
  { id: 'absolute-zero', name: 'Absolute Zero', hex: '#eeeee8', metalness: 0.6, roughness: 0.2 },
  { id: 'renaissance-red', name: 'Renaissance Red 2.0', hex: '#9c1c22', metalness: 0.7, roughness: 0.2 },
  { id: 'turbulence', name: 'Turbulence', hex: '#87888a', metalness: 0.85, roughness: 0.2 },
  { id: 'downshift-blue', name: 'Downshift Blue', hex: '#1b3a63', metalness: 0.75, roughness: 0.22 },
  { id: 'nitro-yellow', name: 'Nitro Yellow', hex: '#cfd91f', metalness: 0.55, roughness: 0.25 },
]

/** Real BMW M4 (F82) colours, used only on the bmw-m4 vehicle entry below. */
export const m4Colors: ExteriorColor[] = [
  { id: 'alpine-white', name: 'Alpine White', hex: '#eeeee8', metalness: 0.5, roughness: 0.18 },
  { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0c0d0f', metalness: 0.85, roughness: 0.22 },
  { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#4c4d50', metalness: 0.8, roughness: 0.24 },
  { id: 'san-marino-blue', name: 'San Marino Blue', hex: '#1c3a5e', metalness: 0.75, roughness: 0.22 },
  { id: 'sakhir-orange', name: 'Sakhir Orange', hex: '#b8481e', metalness: 0.65, roughness: 0.24 },
]

/** Real Porsche 911 colours, used only on the 911-carrera-4s vehicle entry below. */
export const porsche911Colors: ExteriorColor[] = [
  { id: 'guards-red', name: 'Guards Red', hex: '#9c1620', metalness: 0.65, roughness: 0.2 },
  { id: 'gt-silver', name: 'GT Silver Metallic', hex: '#8f9193', metalness: 0.85, roughness: 0.2 },
  { id: 'jet-black', name: 'Jet Black Metallic', hex: '#0c0d0f', metalness: 0.85, roughness: 0.22 },
  { id: 'miami-blue', name: 'Miami Blue', hex: '#1b8fa0', metalness: 0.6, roughness: 0.2 },
  { id: 'chalk', name: 'Chalk', hex: '#c9c4b8', metalness: 0.5, roughness: 0.24 },
]

/** Real Lamborghini Aventador colours, used only on the aventador vehicle entry below. */
export const aventadorColors: ExteriorColor[] = [
  { id: 'nero-nemesis', name: 'Nero Nemesis', hex: '#0c0d0f', metalness: 0.85, roughness: 0.22 },
  { id: 'giallo-orion', name: 'Giallo Orion', hex: '#d9a91a', metalness: 0.55, roughness: 0.22 },
  { id: 'rosso-mars', name: 'Rosso Mars', hex: '#9c1c22', metalness: 0.65, roughness: 0.2 },
  { id: 'verde-ithaca', name: 'Verde Ithaca', hex: '#1f3f2e', metalness: 0.6, roughness: 0.24 },
  { id: 'blu-cepheus', name: 'Blu Cepheus', hex: '#1b3a63', metalness: 0.7, roughness: 0.22 },
  { id: 'bianco-icarus', name: 'Bianco Icarus', hex: '#eeeee8', metalness: 0.5, roughness: 0.2 },
]

export const wheelOptions: WheelOption[] = [
  { id: 'sport-19', name: 'Sport 19"', size: '19"', price: 0 },
  { id: 'performance-20', name: 'Performance 20"', size: '20"', price: 450_000 },
  { id: 'carbon-21', name: 'Carbon 21"', size: '21"', price: 890_000 },
]

export const interiorOptions: InteriorOption[] = [
  { id: 'black-leather', name: 'Black Leather', hex: '#161513', price: 0 },
  { id: 'ivory-leather', name: 'Ivory Leather', hex: '#e8e1d2', price: 320_000 },
  { id: 'tan-leather', name: 'Tan Leather', hex: '#7a5230', price: 320_000 },
  { id: 'sport-alcantara', name: 'Sport Alcantara', hex: '#221f1e', price: 650_000 },
]

/**
 * The real GR Supra ships one 19" forged wheel design (staggered widths,
 * same diameter front/rear). These three options relabel that as finish
 * choices, matching what CarModel.tsx's wheel-material retint actually does
 * (see the note in the Configurator UI) rather than claiming different
 * factory wheel sizes that don't exist.
 */
export const grSupraWheels: WheelOption[] = [
  { id: 'sport-19', name: 'Gloss Machined 19"', size: '19"', price: 0 },
  { id: 'performance-20', name: 'Gloss Black 19"', size: '19"', price: 180_000 },
  { id: 'carbon-21', name: 'Matte Graphite 19"', size: '19"', price: 260_000 },
]

/** Real GR Supra interior trims. */
export const grSupraInteriors: InteriorOption[] = [
  { id: 'black-leather', name: 'Black Leather', hex: '#161513', price: 0 },
  { id: 'tan-leather', name: 'Tan Leather', hex: '#7a5230', price: 280_000 },
  { id: 'sport-alcantara', name: 'Black Alcantara', hex: '#1b1a1a', price: 420_000 },
]

export const vehicles: Vehicle[] = [
  {
    id: 'gr-supra',
    name: 'Toyota GR Supra',
    model: 'GR Supra',
    trim: '3.0 Premium',
    type: 'coupe',
    tagline: 'Premium Performance Coupe',
    description:
      'The fifth-generation Toyota Supra, a front-engine, rear-drive sports coupe built around a BMW-sourced turbocharged inline-six, developed jointly by Toyota and BMW. AUTOX presents the real GR Supra 3.0 with an interactive 3D configurator built around the actual production model.',
    basePrice: 18_900_000,
    spec: {
      power: '382 HP',
      torque: '500 Nm',
      zeroToHundred: '3.9 sec',
      topSpeed: '250 km/h',
      drive: 'RWD',
      transmission: '8-Speed Automatic',
      seats: 2,
      boot: '290 L',
      fuel: 'petrol',
    },
    colors: grSupraColors,
    wheels: grSupraWheels,
    interiors: grSupraInteriors,
    features: [
      'Adaptive Variable Suspension',
      'Active Differential',
      'Launch Control',
      '8.8" Multimedia Display',
      'JBL Premium Audio',
      'Toyota Safety Sense 2.0',
    ],
    gallery: ['exterior', 'interior', 'wheels', 'detail'],
    heroAccent: '#e8492f',
  },
  {
    id: 'auron',
    name: 'Mercedes-Maybach S 580',
    model: 'Maybach S 580',
    trim: '4MATIC',
    type: 'sedan',
    tagline: 'Luxury Sedan',
    description:
      'Mercedes-Maybach takes the S-Class and adds a longer wheelbase, a quieter cabin and rear-seat comfort features aimed squarely at the person being driven, not just the person driving.',
    basePrice: 15_400_000,
    spec: {
      power: '496 HP',
      torque: '700 Nm',
      zeroToHundred: '4.9 sec',
      topSpeed: '250 km/h',
      drive: 'AWD',
      transmission: '9-Speed Automatic',
      seats: 5,
      boot: '550 L',
      fuel: 'petrol',
    },
    colors: maybachColors,
    wheels: wheelOptions,
    interiors: interiorOptions,
    features: [
      'Adaptive Cruise Control',
      'Executive Rear Seating',
      'Burmester 4D Surround Sound',
      'Air Body Control Suspension',
      'MBUX Infotainment',
      'Active Ambient Lighting',
    ],
    gallery: ['exterior', 'interior', 'wheels', 'detail'],
    heroAccent: '#c9a26a',
  },
  {
    id: 'terrano',
    name: 'Toyota Land Cruiser 250',
    model: 'Land Cruiser 250',
    trim: 'VX',
    type: 'suv',
    tagline: 'Performance SUV',
    description:
      'The 250-series Land Cruiser returns to a body-on-frame platform built for real off-road work, without giving up the comfort Toyota has added to the range over the years.',
    basePrice: 21_700_000,
    spec: {
      power: '204 HP',
      torque: '500 Nm',
      zeroToHundred: '10.3 sec',
      topSpeed: '170 km/h',
      drive: 'AWD',
      transmission: '8-Speed Automatic',
      seats: 7,
      boot: '620 L',
      fuel: 'petrol',
    },
    colors: landCruiserColors,
    wheels: wheelOptions,
    interiors: interiorOptions,
    features: [
      '360° Camera',
      'Multi-Terrain Select',
      'Crawl Control',
      'Full-Time 4WD',
      'Toyota Safety Sense',
      'Premium Audio',
    ],
    gallery: ['exterior', 'interior', 'wheels', 'detail'],
    heroAccent: '#4a6b52',
  },
  {
    id: 'nova',
    name: 'Tesla Model 3',
    model: 'Model 3',
    trim: 'Long Range RWD',
    type: 'sedan',
    tagline: 'Electric Sedan',
    description:
      'The car that took Tesla from niche to mainstream, a compact electric sedan built around a single rear motor, a minimal cabin, and software that keeps improving after you buy it.',
    basePrice: 24_500_000,
    spec: {
      power: '325 HP',
      torque: '450 Nm',
      zeroToHundred: '5.6 sec',
      topSpeed: '225 km/h',
      drive: 'RWD',
      transmission: 'Single-Speed Direct Drive',
      range: '499 km',
      fastCharge: '15 min to ~270 km (Supercharger)',
      seats: 5,
      boot: '425 L',
      fuel: 'electric',
    },
    colors: model3Colors,
    wheels: wheelOptions,
    interiors: interiorOptions,
    features: [
      'Autopilot',
      '15" Touchscreen',
      'Glass Roof',
      'Over-the-Air Updates',
      'Premium Connectivity',
      'Premium Audio',
    ],
    gallery: ['exterior', 'interior', 'wheels', 'detail'],
    heroAccent: '#3a7d8c',
  },
  {
    id: 'bmw-m4',
    name: 'BMW M4 Competition',
    model: 'M4',
    trim: 'Competition',
    type: 'coupe',
    tagline: 'Performance Coupe',
    description:
      'The F82-generation M4, built around a twin-turbo inline-six tuned by BMW M. A shorter wheelbase and a stiffer chassis than the standard 4 Series make it feel like a different car, not just a faster one.',
    basePrice: 17_200_000,
    spec: {
      power: '431 HP',
      torque: '550 Nm',
      zeroToHundred: '4.1 sec',
      topSpeed: '250 km/h',
      drive: 'RWD',
      transmission: '7-Speed DCT',
      seats: 4,
      boot: '445 L',
      fuel: 'petrol',
    },
    colors: m4Colors,
    wheels: wheelOptions,
    interiors: interiorOptions,
    features: [
      'M Adaptive Suspension',
      'Active M Differential',
      'Launch Control',
      'M Sport Exhaust',
      'Carbon Fibre Roof',
      'Harman Kardon Audio',
    ],
    gallery: ['exterior', 'interior', 'wheels', 'detail'],
    heroAccent: '#1c3a5e',
  },
  {
    id: '911-carrera-4s',
    name: 'Porsche 911 Carrera 4S',
    model: '911 Carrera 4S',
    trim: 'Carrera 4S',
    type: 'coupe',
    tagline: 'Sports Coupe',
    description:
      'All-wheel drive and a twin-turbo flat-six give the Carrera 4S the kind of usable, everyday speed the 911 has built its reputation on for six decades, without asking the driver to compromise on anything.',
    basePrice: 24_100_000,
    spec: {
      power: '443 HP',
      torque: '530 Nm',
      zeroToHundred: '3.6 sec',
      topSpeed: '306 km/h',
      drive: 'AWD',
      transmission: '8-Speed PDK',
      seats: 4,
      boot: '132 L',
      fuel: 'petrol',
    },
    colors: porsche911Colors,
    wheels: wheelOptions,
    interiors: interiorOptions,
    features: [
      'Porsche Active Suspension Management',
      'Sport Chrono Package',
      'Porsche Traction Management (AWD)',
      'Sport Exhaust System',
      'Bose Surround Sound',
      'Porsche Communication Management',
    ],
    gallery: ['exterior', 'interior', 'wheels', 'detail'],
    heroAccent: '#9c1620',
  },
  {
    id: 'aventador',
    name: 'Lamborghini Aventador',
    model: 'Aventador',
    trim: 'LP 700-4',
    type: 'coupe',
    tagline: 'Flagship Supercar',
    description:
      'A naturally aspirated V12 in a carbon-fibre monocoque, built with no concession to comfort or subtlety. The Aventador is Lamborghini at its most uncompromising, and it looks the part from every angle.',
    basePrice: 68_500_000,
    spec: {
      power: '700 HP',
      torque: '690 Nm',
      zeroToHundred: '2.9 sec',
      topSpeed: '350 km/h',
      drive: 'AWD',
      transmission: '7-Speed ISR',
      seats: 2,
      boot: '110 L',
      fuel: 'petrol',
    },
    colors: aventadorColors,
    wheels: wheelOptions,
    interiors: interiorOptions,
    features: [
      'Pushrod Suspension',
      'Carbon Fibre Monocoque',
      'Lamborghini Dynamic Steering',
      'Launch Control',
      'Adjustable Drive Modes',
      'Full Carbon Interior Trim',
    ],
    gallery: ['exterior', 'interior', 'wheels', 'detail'],
    heroAccent: '#9c1c22',
  },
]

export const getVehicleById = (id: string) => vehicles.find((v) => v.id === id)
