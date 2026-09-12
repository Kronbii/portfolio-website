/**
 * Drone model manifest.
 *
 * Regenerated when models are added — see the session notes for the fetch +
 * Draco pipeline. `hp` marks models that carry their own PBR texture sets;
 * those keep their materials by default, because flat-tinting a textured
 * model throws away exactly the detail it was chosen for.
 *
 * `faces` is the source face count from Sketchfab, before Draco. For scale:
 * the quadcopter.glb that was rejected as "very poly" was 2,397.
 */
export interface DroneModel {
  id: string
  label: string
  faces: number
  hp: boolean
  credit?: string
  note: string
}

export const DRONE_MODELS: DroneModel[] = [
  {
    id: '/models/dji-matrice-300.glb',
    label: "Quadcopter DJI Matrice 3…",
    faces: 904053,
    hp: true,
    credit: "CC-BY · 19vitali99",
    note: "The DJI Matrice 300 RTK — the actual industrial inspection platform. Closest thing here to the hardware class the Oreyeon work lives in.",
  },
  {
    id: '/models/dji-fpv.glb',
    label: "Dji FPV by SDC -  High p…",
    faces: 429806,
    hp: true,
    credit: "CC-BY · SDC PERFORMANCE™️",
    note: "DJI FPV. Consumer racing airframe with full shell and camera.",
  },
  {
    id: '/models/fpv-racing.glb',
    label: "FPV Racing Drone",
    faces: 272218,
    hp: true,
    credit: "CC-BY · jbabs",
    note: "Exposed-frame racing quad. Reads as built rather than bought.",
  },
  {
    id: '/models/fpv-racer.glb',
    label: "Fpv Racing Drone Quadcop…",
    faces: 272218,
    hp: true,
    credit: "CC-BY · eagleanurag",
    note: "Exposed-frame racing quad with its own textures.",
  },
  {
    id: '/models/delivery-drone.glb',
    label: "DeliveryDrone",
    faces: 231230,
    hp: true,
    credit: "CC-BY · KonPrineas",
    note: "Delivery airframe with cargo cage. Logistics register.",
  },
  {
    id: '/models/parrot-drone.glb',
    label: "Parrot Camo drone",
    faces: 172978,
    hp: true,
    credit: "CC-BY · domiiniic",
    note: "Camo PBR texture set. Smooth props, no faceting at hero size.",
  },
  {
    id: '/models/camera-drone-anim.glb',
    label: "animated drone with came…",
    faces: 83712,
    hp: true,
    credit: "CC-BY · ulunkwulunk",
    note: "Camera drone, rigged and animated by its author.",
  },
  {
    id: '/models/beta85x-scan.glb',
    label: "Drone Beta85X HD - 3D Scan",
    faces: 69366,
    hp: true,
    credit: "CC-BY · Yannoid",
    note: "A real Beta85X, 3D-scanned. Scan artefacts and all — the most physically honest of the set.",
  },
  {
    id: '/models/quadcopter-annelida.glb',
    label: "Quadcopter drone",
    faces: 65712,
    hp: true,
    credit: "CC-BY · Annelida",
    note: "Clean consumer quadcopter silhouette. Direct replacement for the one you rejected.",
  },
  {
    id: '/models/fpv-drone.glb',
    label: "FPV Drone",
    faces: 58840,
    hp: true,
    credit: "CC-BY · Jeyhun1985",
    note: "Compact FPV airframe.",
  },
  {
    id: '/models/camera-drone-midpoly.glb',
    label: "Camera Drone Midpoly Gam…",
    faces: 50706,
    hp: true,
    credit: "CC-BY · valterjherson1",
    note: "Game-ready camera drone. Lightest of the textured models.",
  },
  {
    id: '/models/tricopter.glb',
    label: "Tricopter",
    faces: 36144,
    hp: true,
    credit: "CC-BY · pierre.paslier",
    note: "Three rotors rather than four — unusual enough to read as deliberate.",
  },
  {
    id: '/models/uav.glb',
    label: "UAV",
    faces: 28712,
    hp: true,
    credit: "CC-BY · dread_comrade",
    note: "Fixed-wing style UAV. Surveillance register.",
  },
  {
    id: '/models/eachine-e58.glb',
    label: "Eachine E58 Pocket Drone…",
    faces: 20758,
    hp: true,
    credit: "CC-BY · the_Thorminator",
    note: "Eachine E58 pocket drone, folding arms.",
  },
  {
    id: 'procedural',
    label: 'Procedural',
    faces: 0,
    hp: false,
    note: 'Built in code from geometry.ts — named part handles, so behaviours can drive rotors, booms, gimbal and nav lights individually. The only one the exploded and scan behaviours can fully articulate.',
  },
  {
    id: '/models/racing-quad.glb',
    label: 'Racing quad (Poly Pizza)',
    faces: 4564,
    hp: false,
    credit: 'CC-BY · Poly Pizza',
    note: 'Single flat material. Kept for comparison against the dense models.',
  },
  {
    id: '/models/fixed-wing-uav.glb',
    label: 'Fixed-wing (Poly Pizza)',
    faces: 434,
    hp: false,
    credit: 'CC-BY · Poly Pizza',
    note: 'Only 434 faces, but its shapes are naturally flat so the low density never shows.',
  },
]
