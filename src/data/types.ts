export type BodyType = 'coupe' | 'sedan' | 'suv' | 'gt'
export type FuelType = 'petrol' | 'electric' | 'hybrid'
export type DriveType = 'RWD' | 'AWD' | 'FWD'

export interface ExteriorColor {
  id: string
  name: string
  hex: string
  metalness: number
  roughness: number
}

export interface WheelOption {
  id: string
  name: string
  size: string
  price: number
}

export interface InteriorOption {
  id: string
  name: string
  hex: string
  price: number
}

export interface VehicleSpec {
  power: string
  torque: string
  zeroToHundred: string
  topSpeed: string
  drive: DriveType
  transmission: string
  range?: string
  fastCharge?: string
  seats: number
  boot: string
  fuel: FuelType
}

export interface Vehicle {
  id: string
  name: string
  model: string
  trim: string
  type: BodyType
  tagline: string
  description: string
  basePrice: number
  spec: VehicleSpec
  colors: ExteriorColor[]
  wheels: WheelOption[]
  interiors: InteriorOption[]
  features: string[]
  gallery: string[]
  heroAccent: string
}

export interface SavedConfiguration {
  id: string
  vehicleId: string
  vehicleName: string
  colorId: string
  wheelId: string
  interiorId: string
  totalPrice: number
  createdAt: string
}

export interface Showroom {
  id: string
  name: string
  city: string
  address: string
  hours: string
  phone: string
  models: string[]
}

export interface TestDriveRequest {
  id: string
  name: string
  email: string
  phone: string
  vehicleId: string
  date: string
  time: string
  location: string
  createdAt: string
}
