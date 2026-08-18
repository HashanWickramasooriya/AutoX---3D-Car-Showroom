import type { Showroom } from './types'

export const showrooms: Showroom[] = [
  {
    id: 'colombo',
    name: 'AUTOX Colombo',
    city: 'Colombo',
    address: '142 Galle Road, Colombo 03',
    hours: 'Mon-Sat, 9:00 AM - 7:00 PM',
    phone: '+94 11 234 5678',
    models: ['gr-supra', 'auron', 'terrano', 'nova', 'bmw-m4', '911-carrera-4s', 'aventador'],
  },
  {
    id: 'kandy',
    name: 'AUTOX Kandy',
    city: 'Kandy',
    address: '58 Peradeniya Road, Kandy',
    hours: 'Mon-Sat, 9:00 AM - 6:30 PM',
    phone: '+94 81 223 4567',
    models: ['gr-supra', 'auron', 'terrano', 'bmw-m4'],
  },
  {
    id: 'galle',
    name: 'AUTOX Galle',
    city: 'Galle',
    address: '21 Wackwella Road, Galle',
    hours: 'Mon-Sat, 9:00 AM - 6:00 PM',
    phone: '+94 91 222 3456',
    models: ['gr-supra', 'terrano', 'nova', '911-carrera-4s'],
  },
]

export const getShowroomById = (id: string) => showrooms.find((s) => s.id === id)
