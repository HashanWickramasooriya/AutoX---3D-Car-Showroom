import type { HotspotData } from '../components/3d/Hotspot'

export const vehicleHotspots: HotspotData[] = [
  {
    id: 'headlights',
    position: [2.1, 0.85, 0.5],
    title: 'Matrix LED Headlights',
    description: 'Adaptive beam patterns that adjust automatically to traffic and road conditions.',
  },
  {
    id: 'wheels',
    position: [1.45, 0.5, 0.95],
    title: 'Forged Alloy Wheels',
    description: 'Lightweight forged construction reduces unsprung weight for sharper handling.',
  },
  {
    id: 'brakes',
    position: [-1.45, 0.45, 0.9],
    title: 'Performance Brakes',
    description: 'High-performance braking system designed for confident stopping under demanding conditions.',
  },
  {
    id: 'cockpit',
    position: [0.3, 1.15, 0],
    title: '12.3" Digital Cockpit',
    description: 'A fully configurable display puts navigation, performance data and media at a glance.',
  },
  {
    id: 'roof',
    position: [-0.1, 1.35, 0],
    title: 'Panoramic Roof',
    description: 'Extended glass roof floods the cabin with light and opens up the sense of space.',
  },
]
