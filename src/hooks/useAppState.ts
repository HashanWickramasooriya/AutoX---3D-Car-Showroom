import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { SavedConfiguration, TestDriveRequest } from '../data/types'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('autox.favorites', [])
  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
    },
    [setFavorites],
  )
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])
  return { favorites, toggleFavorite, isFavorite }
}

export function useCompareList() {
  const [compareIds, setCompareIds] = useLocalStorage<string[]>('autox.compare', [])
  const toggleCompare = useCallback(
    (id: string) => {
      setCompareIds((prev) => {
        if (prev.includes(id)) return prev.filter((c) => c !== id)
        if (prev.length >= 3) return prev
        return [...prev, id]
      })
    },
    [setCompareIds],
  )
  const clearCompare = useCallback(() => setCompareIds([]), [setCompareIds])
  const isComparing = useCallback((id: string) => compareIds.includes(id), [compareIds])
  return { compareIds, toggleCompare, clearCompare, isComparing }
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useLocalStorage<string[]>('autox.recent', [])
  const addRecent = useCallback(
    (id: string) => {
      setRecent((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, 6))
    },
    [setRecent],
  )
  return { recent, addRecent }
}

export function useSavedConfigurations() {
  const [saved, setSaved] = useLocalStorage<SavedConfiguration[]>('autox.saved-configs', [])
  const saveConfiguration = useCallback(
    (config: Omit<SavedConfiguration, 'id' | 'createdAt'>) => {
      const entry: SavedConfiguration = {
        ...config,
        id: `${config.vehicleId}-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setSaved((prev) => [entry, ...prev])
      return entry
    },
    [setSaved],
  )
  const deleteConfiguration = useCallback(
    (id: string) => setSaved((prev) => prev.filter((c) => c.id !== id)),
    [setSaved],
  )
  return { saved, saveConfiguration, deleteConfiguration }
}

export function useTestDriveRequests() {
  const [requests, setRequests] = useLocalStorage<TestDriveRequest[]>('autox.test-drives', [])
  const submitRequest = useCallback(
    (req: Omit<TestDriveRequest, 'id' | 'createdAt'>) => {
      const entry: TestDriveRequest = {
        ...req,
        id: `td-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setRequests((prev) => [entry, ...prev])
      return entry
    },
    [setRequests],
  )
  return { requests, submitRequest }
}
