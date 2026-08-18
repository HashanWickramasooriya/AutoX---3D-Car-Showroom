import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { ToastProvider } from './hooks/useToast'

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const Vehicles = lazy(() => import('./pages/Vehicles').then((m) => ({ default: m.Vehicles })))
const VehicleDetail = lazy(() => import('./pages/VehicleDetail').then((m) => ({ default: m.VehicleDetail })))
const Configurator = lazy(() => import('./pages/Configurator').then((m) => ({ default: m.Configurator })))
const Compare = lazy(() => import('./pages/Compare').then((m) => ({ default: m.Compare })))
const Finance = lazy(() => import('./pages/Finance').then((m) => ({ default: m.Finance })))
const Showrooms = lazy(() => import('./pages/Showrooms').then((m) => ({ default: m.Showrooms })))
const TestDrive = lazy(() => import('./pages/TestDrive').then((m) => ({ default: m.TestDrive })))
const Saved = lazy(() => import('./pages/Saved').then((m) => ({ default: m.Saved })))
const Technology = lazy(() => import('./pages/Technology').then((m) => ({ default: m.Technology })))
const Safety = lazy(() => import('./pages/Safety').then((m) => ({ default: m.Safety })))
const Electric = lazy(() => import('./pages/Electric').then((m) => ({ default: m.Electric })))
const Gallery = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.Gallery })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="font-display text-sm uppercase tracking-[0.3em] text-warm-dim">Loading</span>
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/configurator/:id" element={<Configurator />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/showrooms" element={<Showrooms />} />
              <Route path="/test-drive" element={<TestDrive />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/technology" element={<Technology />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/electric" element={<Electric />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  )
}

export default App
