// Equipment types with background images - matching the confirm-rental page equipmentMap
export const equipmentTypes = [
  {
    id: 'bulldozer',
    name: 'Bulldozer',
    image: '/rentals/bulldozer.jpg',
  },
  {
    id: 'bucket-truck',
    name: 'Bucket Truck',
    image: '/rentals/bucket%20truck.jpg',
  },
  {
    id: 'backhoe',
    name: 'Backhoe',
    image: '/rentals/Backhoe.jpg',
  },
  {
    id: 'wheeled-loader',
    name: 'Wheeled Loader',
    image: '/rentals/Wheeled%20Loader.jpg',
  },
  {
    id: 'asphalt-paver',
    name: 'Asphalt Paver',
    image: '/rentals/Asphalt%20Paver.jpg',
  },
  {
    id: 'water-truck',
    name: 'Water Truck',
    image: '/rentals/Water%20Truck.jpg',
  },
  {
    id: 'triaxle',
    name: 'Triaxle',
    image: '/rentals/Triaxle.jpg',
  },
  {
    id: 'articulated-dump-truck',
    name: 'Articulated Dump Truck',
    image: '/rentals/Articulated%20Dump%20Truck.jpg',
  },
  {
    id: 'triaxle-pup-trailer',
    name: 'Triaxle with Pup Trailer',
    image: '/rentals/Triaxle%20with%20pup%20trailer.jpg',
  },
  {
    id: '1-ton-dump-truck',
    name: '1 Ton Dump Truck',
    image: '/rentals/1%20ton%20dump%20truck.jpg',
  },
  {
    id: 'sweeper',
    name: 'Sweeper',
    image: '/rentals/Sweeper.jpg',
  },
  {
    id: 'skid-steer',
    name: 'Skid Steer',
    image: '/rentals/Skid%20Steer.jpg',
  },
  {
    id: 'roll-off-bins',
    name: 'Roll Off Bins',
    image: '/rentals/Roll%20off%20Bins.jpg',
  },
  {
    id: 'rock-truck',
    name: 'Rock Truck',
    image: '/rentals/Rock%20Truck.jpg',
  },
  {
    id: 'mini-ex',
    name: 'Mini Excavator',
    image: '/rentals/Mini-Ex.jpg',
  },
  {
    id: 'live-bottom-trailer',
    name: 'Live Bottom Trailer',
    image: '/rentals/Live%20bottom%20trailer.jpg',
  },
  {
    id: 'grader',
    name: 'Grader',
    image: '/rentals/grader.jpg',
  },
  {
    id: 'flusher-hydrovac-truck',
    name: 'Flusher Hydrovac Truck',
    image: '/rentals/Flusher%20Hydrovac%20Truck.jpg',
  },
  {
    id: 'float',
    name: 'Float',
    image: '/rentals/Float.jpg',
  },
  {
    id: 'excavator',
    name: 'Excavator',
    image: '/rentals/Excavator.jpg',
  },
  {
    id: 'crane',
    name: 'Crane',
    image: '/rentals/Crane.jpg',
  },
  {
    id: 'concrete-mixer',
    name: 'Concrete Mixer',
    image: '/rentals/Concrete%20Mixer.jpg',
  },
  {
    id: 'compactor',
    name: 'Compactor',
    image: '/rentals/Compactor.jpg',
  },
  {
    id: 'chipper-truck',
    name: 'Chipper Truck',
    image: '/rentals/Chipper%20Truck.jpg',
  },
  {
    id: 'cctv-sewer-inspection',
    name: 'CCTV Sewer Inspection',
    image: '/rentals/CCTV%20Sewer%20Inspection.jpg',
  },
] as const;

export type EquipmentType = typeof equipmentTypes[number];
