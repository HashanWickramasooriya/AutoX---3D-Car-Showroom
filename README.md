# AUTOX - 3D Car Showroom & Configurator

**Drive what defines you.**

## Overview

AUTOX is a frontend-only, 3D-first digital automotive showroom. Instead of a
static hero image with a page of cards underneath, the interactive 3D vehicle
is the core of the experience: every major section - the hero, the scroll
story, the configurator, the vehicle detail page - is built around a live
WebGL viewer, not a photo.

**AUTOX itself is a fictional showroom brand, but every vehicle in it is a
real, currently-in-production car**, each rendered from its own real GLB
model: the Toyota GR Supra, the Toyota Land Cruiser 250, the Tesla Model 3
and the Mercedes-Maybach S 580 (see [3D Assets](#3d-assets) for source and
license per file). AUTOX's pricing, showroom locations and test-drive
handling are demo data layered on top of these real vehicles - see
[Demo Data](#demo-data) and [Frontend-only Architecture](#frontend-only-architecture)
below for exactly what's real and what's illustrative.

## Features

- Cinematic full-screen 3D hero with a real-time vehicle viewer
- Scroll-driven storytelling section that moves the camera through
  exterior → performance → engineering → interior beats as you scroll
- Live exterior colour, wheel and interior configurator with dynamic pricing
- Vehicle showroom with search, filters (body type, fuel type, price) and sort
- Vehicle detail pages with specs, features, gallery and quick preview controls
- Side-by-side comparison (up to 3 vehicles), responsive table on desktop,
  stacked cards on mobile
- Finance calculator with a real amortization estimate
- Test-drive booking form (demo submission, stored locally)
- Saved configurations, favorites, recently viewed and compare list - all
  persisted to `localStorage`
- Technology, Safety, Electric (Nova) and Gallery pages
- Fully responsive, from 360px phones to 1920px desktops
- Graceful fallback if WebGL/3D fails to load

## 3D Experience

Built with [Three.js](https://threejs.org/) via
[@react-three/fiber](https://github.com/pmndrs/react-three-fiber) and
[@react-three/drei](https://github.com/pmndrs/drei).

- **Camera controls** - drag/touch to rotate, scroll/pinch to zoom, idle
  auto-rotate that pauses on interaction, and five camera presets (Overview,
  Front, Side, Rear, Interior) with smooth damped transitions handled by a
  custom `CameraRig` component (`src/components/3d/CameraRig.tsx`).
- **Interactive materials** - exterior colour changes update the car body's
  `MeshPhysicalMaterial` (metalness/roughness/clearcoat) directly; there is no
  swap-the-label fakery.
- **Lighting** - key/fill/rim directional lights plus a fully procedural
  studio environment built from `<Lightformer>` panels
  (`src/components/3d/Studio.tsx`). This is intentional: it keeps the viewer
  100% self-contained with no external HDR fetch, so it works offline and
  never depends on a third-party asset CDN.
- **Hotspots** - clickable in-scene markers (`src/components/3d/Hotspot.tsx`)
  built on drei's `<Html>`, with a small info panel per hotspot.
- **Headlights / hood / doors** - headlights toggle the real headlight
  material's emissive channel plus a real spotlight anchored to the model's
  actual front-axle geometry (not a guessed offset); the hood and both doors
  are the model's own hinged mesh groups, animated open/closed with damped
  rotation. All three are only exposed because the loaded asset actually
  supports them - see [On the 3D model](#on-the-3d-model).
- **Error handling** - a dedicated `CanvasErrorBoundary` catches any 3D
  render failure and shows a graceful "3D model unavailable" fallback with
  *Try again* / *View vehicle gallery* actions, without taking down the rest
  of the page.
- **Performance** - capped device pixel ratio; shadows, environment
  resolution and DPR drop on low-power devices, which `useDeviceCapability`
  detects from CPU core count, viewport width, `prefers-reduced-motion`, **and
  a live WebGL renderer check** (`WEBGL_debug_renderer_info`) that catches
  software rasterizers (SwiftShader/llvmpipe) some real users land on with
  blocklisted or virtualized GPUs; lazy-loaded routes/models via `React.lazy`
  + `Suspense`; a drei `Loader` with progress feedback; and viewport-gated
  mounting (`useInView`) so the Home page's hero and scroll-story viewers
  aren't both driving a live WebGL context when only one is on screen.

### On the 3D models

Each of the seven AUTOX vehicles renders its own real GLB - not a shared
placeholder, not a primitive blockout:

| AUTOX vehicle | Real car | Body type |
| --- | --- | --- |
| GR Supra | Toyota GR Supra | Coupe |
| Auron | Mercedes-Maybach S 580 | Luxury sedan |
| Terrano | Toyota Land Cruiser 250 | SUV |
| Nova | Tesla Model 3 | Electric sedan |
| M4 | BMW M4 Competition | Performance coupe |
| 911 Carrera 4S | Porsche 911 Carrera 4S | Sports coupe |
| Aventador | Lamborghini Aventador | Flagship supercar |

Every one of them has real body panels, glass, wheels/tires, headlights and
taillights, and a modeled cockpit. See [3D Assets](#3d-assets) for exactly
where each file came from and its license.

Seven different artists/pipelines produced these files, so each one names its
nodes and materials differently. Rather than hardcoding one asset's
conventions, `CarModel.tsx` reads a small **per-vehicle 3D config**
(`src/data/vehicle3d.ts`) that tells it how to drive that specific file:

1. **Clones the scene and every material** the model uses, so multiple
   `<CarViewer>` instances on screen at once (e.g. the Home hero + scroll
   story) never fight over shared materials/nodes.
2. **Auto-detects functional groups by material name**, using a per-vehicle
   list of name fragments (`materialMatchers` in the config) merged over
   sensible defaults (`"paint"` → body colour, `"leather"` → interior accent,
   `"rim"` → wheel finish, `"headlight"` → emissive headlight surface). The
   Tesla's body paint material is literally named `primary`, the Land
   Cruiser's leather is named `Cuero_*` (Spanish for "leather") - the config
   overrides the matcher per vehicle instead of guessing one convention fits
   all seven files.
3. **Resolves which way the car faces** using whichever strategy that
   vehicle's asset actually supports (`orientation` in the config):
   - `wheels` - read the four wheel-assembly nodes' world positions (GR
     Supra). Most robust when the node names are there.
   - `frontRearPoints` - read a single front-reference and rear-reference
     node, e.g. bumper pivots (Tesla's `bump_front_dummy` /
     `bump_rear_dummy`).
   - `manual` - the asset has no usable named reference nodes at all (Land
     Cruiser, Maybach), so the heading was determined once by visual
     inspection and hardcoded as a constant.

   Whichever strategy applies, the result centers the model on X/Z, sits it
   on the ground plane (Y=0), and uniformly scales it to the same target
   length - so the five camera presets in `CarViewer.tsx` stay correct across
   all seven very differently-authored files without per-model camera tuning.
4. **Reports which interactions the asset actually supports** - headlights,
   hood, doors - back to `CarViewer`, which only renders those buttons when
   the corresponding node/material was actually found. The GR Supra and
   Tesla both expose real hinged hood/door nodes; the Land Cruiser and
   Maybach exports don't split those into separate meshes, so those buttons
   simply don't appear for them rather than existing and doing nothing.
5. **Strips third-party sample-asset branding** where applicable - the GR
   Supra's underlying Khronos sample asset has a small badge mesh and a
   wordmark baked into one material's texture; both are hidden/stripped at
   load time so no unrelated logo ships in the AUTOX experience.

**Adding another vehicle:** drop the GLB in `public/models/`, add an entry to
`VEHICLE_3D` in `src/data/vehicle3d.ts` (model URL, orientation strategy,
any material matcher overrides), and add the vehicle to `src/data/vehicles.ts`.
Everything else (camera rig, hotspots, lighting, configurator wiring)
continues to work unchanged, the same way it already does across seven
differently-sourced files.

## Vehicle Configurator

`/configurator/:id` (`src/pages/Configurator.tsx`)

- **Exterior colours** - 5–6 real manufacturer colour options per vehicle;
  selecting one updates the 3D body material in real time.
- **Wheels** - Sport 19" / Performance 20" / Carbon 21", each with a price
  delta; the 3D preview retints the model's real rim material's finish
  (silver/gloss white/matte carbon) per option. The GLB ships one modeled
  wheel design, so this is an honest finish preview rather than a geometry
  swap - see [On the 3D model](#on-the-3d-model) and the note in the
  configurator UI itself.
- **Interior** - 4 trim options that recolour the visible interior details
  (seats, dash) inside the cabin.
- **Dynamic pricing** - base price + special paint + wheel delta + interior
  delta, recalculated live in a sticky summary panel with Save / Reset /
  Request Test Drive actions.
- Mobile uses horizontally-scrollable option rows with the 3D viewer pinned
  above, so you never lose sight of the car while configuring.

## Vehicle Comparison

`/compare` (`src/pages/Compare.tsx`) - pick up to 3 vehicles from any vehicle
card or the compare page itself. Renders an 11-row spec table on desktop;
collapses to stacked cards on mobile so nothing scrolls off-screen. Backed by
`useCompareList` (`localStorage`).

## Finance Calculator

`/finance` (`src/pages/Finance.tsx`) - standard amortization formula over
vehicle price, down payment, loan period and interest rate, all editable via
sliders. Clearly labelled **"Demo calculation - not a financial offer."**

## Test Drive

`/test-drive` (`src/pages/TestDrive.tsx`) - a form (name, email, phone,
vehicle, date, time, location) that stores the request in `localStorage` via
`useTestDriveRequests` and shows a confirmation screen. No request is sent to
any real dealership or backend.

## Saved Configurations

`/saved` (`src/pages/Saved.tsx`) - every configuration saved from the
configurator is written to `localStorage` (`useSavedConfigurations`) and
listed here with view/edit/delete actions. Favorites, compare list and
recently-viewed vehicles use the same pattern (`src/hooks/useAppState.ts`).

## Technology Stack

Read directly from `package.json`:

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (build tool/dev server)
- [Three.js](https://threejs.org/)
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) and
  [@react-three/drei](https://github.com/pmndrs/drei)
- [React Router](https://reactrouter.com/) v7
- [Tailwind CSS v4](https://tailwindcss.com/)

No backend framework, ORM or database library is used anywhere in this
project.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home - cinematic hero, scroll story, performance stats, showroom teaser |
| `/vehicles` | Vehicle showroom with search/filter/sort |
| `/vehicles/:id` | Vehicle detail - 3D viewer, specs, gallery |
| `/configurator/:id` | Colour/wheel/interior configurator with pricing |
| `/compare` | Vehicle comparison |
| `/finance` | Finance calculator |
| `/showrooms` | Showroom locations |
| `/test-drive` | Test-drive booking form |
| `/saved` | Saved configurations |
| `/technology` | Technology features |
| `/safety` | Safety features |
| `/electric` | AUTOX Nova / EV range visual |
| `/gallery` | Photo-style gallery per model |
| `*` | 404 |

## Project Structure

```
src/
├── components/
│   ├── 3d/            CarModel, CarViewer, CameraRig, Studio, Hotspot, Wheel (type only)
│   ├── layout/         Navbar, Footer, MobileMenu, SearchOverlay, ScrollToTop
│   ├── ui/              Button, SectionHeading, DemoBadge
│   └── vehicles/     VehicleCard, CarSilhouette
├── pages/                Home, Vehicles, VehicleDetail, Configurator, Compare,
│                         Finance, Showrooms, TestDrive, Saved, Technology,
│                         Safety, Electric, Gallery, NotFound
├── data/                 vehicles.ts, showrooms.ts, hotspots.ts, types.ts
├── hooks/                useLocalStorage, useAppState (favorites/compare/
│                         saved configs/test drives/recently viewed),
│                         useDeviceCapability, useInView, useActiveSection,
│                         useToast, usePageTitle
└── utils/                format.ts (currency formatting)

public/
└── models/               toyota_gr_supra.glb, 2025_toyota_land_cruiser_250.glb,
                          tesla_2018_model_3.glb, mercedes-benz_maybach_2022.glb
                          - the seven real 3D vehicle assets (see 3D Assets)
```

## Demo Data

**What's real:** all seven vehicles (Toyota GR Supra, Toyota Land Cruiser
250, Tesla Model 3, Mercedes-Maybach S 580, BMW M4 Competition, Porsche 911
Carrera 4S, Lamborghini Aventador) are actual production cars, and their
headline specs (power, torque, 0-100, top speed, range) are the
manufacturers' own published figures - labelled **"Manufacturer
specifications"** in the UI, not "demo".

**What's illustrative/fictional:** the AUTOX brand and showroom itself;
every price (labelled **"Demo pricing"**); the exact exterior colour swatch
hex values (named after each manufacturer's real colour names, approximated
by eye rather than verified against paint-code references); showroom
locations; and all test-drive/finance handling (labelled **"Demo
calculation"**). Nothing in this project represents a real AUTOX product,
dealership, financial offer, or an endorsement by Toyota, Tesla, or
Mercedes-Benz.

## Frontend-only Architecture

This is a pure static frontend. There is **no backend, no server, no
database, and no API**. Everything that looks like "data persistence"
(favorites, saved configurations, compare list, recently viewed, test-drive
requests) is written to the browser's `localStorage` and never leaves the
device. Clearing site data or using a different browser resets all of it.

## 3D Assets

All seven files live in `public/models/` and are loaded at runtime via
`useGLTF()` in `src/components/3d/CarModel.tsx`, per the mapping in
`src/data/vehicle3d.ts`. All seven were sourced from [Sketchfab](https://sketchfab.com/).
**None of these are Toyota/Tesla/BMW/Porsche/Lamborghini/Mercedes-Benz
assets** - they're independent 3D artists' fan-made reproductions of those
vehicles, shared under Creative Commons licenses. AUTOX is not affiliated
with, endorsed by, or produced by any of those manufacturers.

| File | Real car | Creator | License | Source |
| --- | --- | --- | --- | --- |
| `toyota_gr_supra.glb` | Toyota GR Supra | thelightning | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [sketchfab.com/3d-models/toyota-gr-supra-9231f2d5e71a43dd87603dc0b339d99d](https://sketchfab.com/3d-models/toyota-gr-supra-9231f2d5e71a43dd87603dc0b339d99d) |
| `2025_toyota_land_cruiser_250.glb` | Toyota Land Cruiser 250 | Ddiaz Design | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) | Sketchfab, "2025 Toyota Land Cruiser 250" |
| `tesla_2018_model_3.glb` | Tesla Model 3 (2018) | Uploaded under the title "tesla_2018_model_3" | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Sketchfab - multiple identical mirror listings exist under this exact title; if you have the specific listing this file was downloaded from, update this row with its uploader/URL |
| `mercedes-benz_maybach_2022.glb` | Mercedes-Maybach 2022 | Mpgs.studio3DModels | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Sketchfab, "Mercedes-Benz Maybach 2022" |
| `bmw_m4_f82.glb` | BMW M4 (F82) | Sketchfab upload, "bmw_m4_f82" | Verify on Sketchfab before commercial use | Sketchfab |
| `free_porsche_911_carrera_4s.glb` | Porsche 911 Carrera 4S | Sketchfab upload, "Free Porsche 911 Carrera 4S" | Verify on Sketchfab before commercial use | Sketchfab |
| `lamborghini_aventador_with_interior.glb` | Lamborghini Aventador | Sketchfab upload, "Lamborghini Aventador with Interior" | Verify on Sketchfab before commercial use | Sketchfab |

**⚠️ License note on the Land Cruiser:** unlike most of the others (plain
CC BY - attribution only, commercial use fine), the Land Cruiser file is
**CC BY-NC-SA 4.0** - NonCommercial and ShareAlike. Non-commercial portfolio/
demo display is normally within scope for an NC license, but if this project
is ever used commercially, that file specifically needs replacing or a
license upgrade from the creator first.

**⚠️ License note on the BMW M4, Porsche 911 and Aventador:** these three
were added in a later pass and their exact Sketchfab listing/license/creator
were not re-verified as rigorously as the first four - the license column
above is a placeholder. Confirm the exact source listing and license on
Sketchfab (matching by filename/vertex count as the GR Supra/Land
Cruiser/Tesla/Maybach rows were verified) before any commercial use.

Files were downloaded manually from Sketchfab (its download endpoint
requires an authenticated account for every model regardless of license,
so there's no way to fetch one programmatically without a user's own
credentials) and are committed directly rather than fetched at build time.

**Optimization:** several of these came down as 55-80 MB uncompressed
exports, far too heavy to ship as-is. Each was run through
[`@gltf-transform/cli`](https://gltf-transform.dev/):

```bash
# Models with usable node names for orientation (GR Supra, Tesla): weld + simplify only,
# so named nodes/materials survive untouched.
gltf-transform weld in.glb welded.glb
gltf-transform simplify welded.glb out.glb --ratio 0.25 --error 0.01

# Models with no named nodes to preserve (Land Cruiser): full optimize, safe to
# join/flatten meshes by material since nothing depends on individual mesh names.
gltf-transform optimize in.glb out.glb --texture-compress false --simplify false --palette false --compress false
```

This took the four files from ~56 MB / ~76 MB / ~23 MB / ~82 MB down to
~23 MB / ~27 MB / ~23 MB (unchanged) / ~20 MB respectively, with node and
material names verified intact afterward (`gltf-transform` doesn't rename
what it doesn't merge). None use Draco/KTX2 compression, so they load with
plain `GLTFLoader` semantics - no extra decoder setup needed.

## Vehicle Card Photography

`/vehicles`, the homepage range section, and the Gallery's first tile per
vehicle show a real photograph rather than a live 3D render - rendering all
seven GLBs at once on a listing page would be far too heavy, so
`VehicleCard.tsx` and `Gallery.tsx` load a static image from
`public/images/vehicles/{vehicle-id}.jpg` instead, and only the vehicle
detail/configurator pages load the actual 3D model. If an image ever fails
to load, the card falls back to the existing flat `CarSilhouette` component
rather than showing a broken image.

All seven photos are real, unedited photographs of the correct vehicle,
downloaded from [Wikimedia Commons](https://commons.wikimedia.org/) under
Creative Commons licenses:

| File | Vehicle | Commons file | Author | License |
| --- | --- | --- | --- | --- |
| `gr-supra.jpg` | Toyota GR Supra (A90) | [Toyota GR Supra (A90) Washington DC Metro Area, USA.jpg](https://commons.wikimedia.org/wiki/File:Toyota_GR_Supra_(A90)_Washington_DC_Metro_Area,_USA.jpg) | OWS Photography | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `auron.jpg` | Mercedes-Maybach S-Class | [Mercedes-Maybach S Class at IAA 2015.JPG](https://commons.wikimedia.org/wiki/File:Mercedes-Maybach_S_Class_at_IAA_2015.JPG) | NearEMPTiness | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `terrano.jpg` | Toyota Land Cruiser 250 | [2024 Toyota Land Cruiser 250 VX in Platinum White Pearl Mica, front left.jpg](https://commons.wikimedia.org/wiki/File:2024_Toyota_Land_Cruiser_250_VX_in_Platinum_White_Pearl_Mica,_front_left.jpg) | Mr.choppers | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `nova.jpg` | Tesla Model 3 | [Tesla Model 3 Front View.jpg](https://commons.wikimedia.org/wiki/File:Tesla_Model_3_Front_View.jpg) | Ominae | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `bmw-m4.jpg` | BMW M4 Coupe (F82) | [BMW M4 Coupe (F82) front.JPG](https://commons.wikimedia.org/wiki/File:BMW_M4_Coupe_(F82)_front.JPG) | Tokumeigakarinoaoshima | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (public domain) |
| `911-carrera-4s.jpg` | Porsche 911 Carrera S (992) | [2020 Porsche 911 Carrera S (1).jpg](https://commons.wikimedia.org/wiki/File:2020_Porsche_911_Carrera_S_(1).jpg) | Ethan Llamas | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `aventador.jpg` | Lamborghini Aventador LP700-4 | [Lamborghini Aventador LP700-4 IMG 0004.jpg](https://commons.wikimedia.org/wiki/File:Lamborghini_Aventador_LP700-4_IMG_0004.jpg) | Alexander Migl | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

The Porsche photo is of a 911 Carrera S rather than the specific Carrera 4S
trim named in AUTOX's data (visually near-identical 992-generation body).
CC BY-SA requires derivatives to be shared under the same license and
requires attribution - the table above is that attribution; keep it if
these files are redistributed. None of these are manufacturer press images;
they're independent contributors' photographs of vehicles in public
settings, so backgrounds are real-world (streets, dealer lots, shows)
rather than a photo studio.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Responsive Design

Verified from 360×800 phones up through 1920×1080 desktops, including common
tablet breakpoints (768–1024px). The 3D viewer, configurator, comparison
table, finance calculator and navigation all have dedicated mobile layouts,
and nothing is hidden with `display: none`.

## Performance

- Routes are code-split with `React.lazy`; the 3D viewer bundle only loads
  when a page that needs it is visited.
- Device pixel ratio is capped and shadows/environment resolution drop on
  detected low-power devices (`useDeviceCapability`), including a live check
  for software GL rasterizers (SwiftShader/llvmpipe), not just CPU/viewport
  heuristics.
- The studio environment is procedural (no HDR download).
- The Home page's hero and scroll-story viewers are viewport-gated
  (`useInView`) so at most one is actively driving a WebGL context when the
  other is scrolled well out of view.
- Materials are cloned once per `<CarModel>` instance and geometries/textures
  are shared by reference across clones - cloning duplicates only what needs
  independent color, not the underlying mesh/texture data.

## Limitations

- None of the seven GLBs use Draco/meshopt geometry compression or KTX2
  texture compression - each is still a 20–27 MB download even after the
  weld/simplify pass documented in [3D Assets](#3d-assets). They're
  lazy-loaded only on pages that render a `<CarViewer>` and cached by the
  browser after first load, but a slow connection will still feel the
  initial fetch of whichever vehicle is viewed first.
- The Land Cruiser file is CC BY-NC-SA - see the license note in
  [3D Assets](#3d-assets) before using this project commercially.
- None of the seven vehicles are manufacturer-produced 3D assets (they're
  independent artists' fan-made reproductions), and none of the card photos
  are manufacturer press images either. AUTOX is not affiliated with or
  endorsed by Toyota, Tesla, BMW, Porsche, Lamborghini, or Mercedes-Benz.
- The wheel configurator changes the real rim material's finish, not its
  geometry - each source asset ships one modeled wheel design. This is
  stated in the configurator UI rather than implied.
- The hood/doors controls only appear for the GR Supra and Tesla, since only
  those two source assets have separately-hinged hood/door meshes - see
  [On the 3D models](#on-the-3d-models).
- The Land Cruiser and Maybach files have no usable named reference nodes,
  so their orientation is a hardcoded constant determined once by visual
  inspection rather than derived automatically like the GR Supra and Tesla.
  This is robust as long as the file isn't replaced; swapping either asset
  for a different export would need that heading re-checked.
- Exterior colour swatches use each manufacturer's real colour *names*, with
  hex values approximated by eye rather than verified against official paint
  codes.
- Pricing, specs shown outside the "Manufacturer specifications" sections,
  financing, showrooms and test-drive booking are demo-only and not
  connected to any real system.
- There is no authentication - saved data is per-browser via `localStorage`.

## Future Improvements

- Real vehicle inventory API
- Real dealership integration
- Real authentication and user accounts
- Real financing API and lender integration
- Real test-drive booking with dealership confirmation
- Real-time vehicle availability by showroom
- Real payments / reservation deposits
- Draco/KTX2 geometry+texture compression on all seven GLBs
- A properly-licensed (non-NC) replacement for the Land Cruiser asset

---

Created by Hashan Janith Wickramasooriya
