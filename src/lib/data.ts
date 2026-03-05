
export const courseCategories = [
  { id: 'luxury-hospitality', titleKey: 'category.luxury' },
  { id: 'sport-management', titleKey: 'category.sport' },
  { id: 'languages-international', titleKey: 'category.languages' },
  { id: 'business-strategy', titleKey: 'category.business' },
] as const;

export type CourseCategoryId = (typeof courseCategories)[number]['id'];

export interface Course {
  id: string;
  categoryId: CourseCategoryId;
  titleKey: string;
  shortDescriptionKey: string;
  fullDescriptionKey: string;
  durationKey: string;
  targetAudienceKey: string;
  prerequisitesKey: string;
  careerOutcomesKey: string;
  thumbnailImageId: string;
  heroImageId: string;
  iconMediaId: string;
  galleryImageIds: string[];
}

export const courses: Course[] = [
  { 
    id: 'flight-attendant', 
    categoryId: 'luxury-hospitality', 
    titleKey: 'courses.flightAttendant.title', 
    shortDescriptionKey: 'courses.flightAttendant.shortDesc',
    fullDescriptionKey: 'courses.flightAttendant.fullDesc',
    durationKey: 'courses.flightAttendant.duration',
    targetAudienceKey: 'courses.flightAttendant.target',
    prerequisitesKey: 'courses.flightAttendant.prerequisites',
    careerOutcomesKey: 'courses.flightAttendant.outcomes',
    thumbnailImageId: 'course-flight-attendant',
    heroImageId: 'hero-course-flight-attendant',
    iconMediaId: 'icon-flight-attendant',
    galleryImageIds: ['gallery-course-flight-attendant-1', 'gallery-course-flight-attendant-2', 'gallery-course-flight-attendant-3']
  },
  { 
    id: 'luxury-restaurant', 
    categoryId: 'luxury-hospitality', 
    titleKey: 'courses.luxuryRestaurant.title', 
    shortDescriptionKey: 'courses.luxuryRestaurant.shortDesc',
    fullDescriptionKey: 'courses.luxuryRestaurant.fullDesc',
    durationKey: 'courses.luxuryRestaurant.duration',
    targetAudienceKey: 'courses.luxuryRestaurant.target',
    prerequisitesKey: 'courses.luxuryRestaurant.prerequisites',
    careerOutcomesKey: 'courses.luxuryRestaurant.outcomes',
    thumbnailImageId: 'course-luxury-restaurant',
    heroImageId: 'hero-course-luxury-restaurant',
    iconMediaId: 'icon-luxury-restaurant',
    galleryImageIds: ['gallery-course-luxury-restaurant-1', 'gallery-course-luxury-restaurant-2', 'gallery-course-luxury-restaurant-3']
  },
  { 
    id: 'luxury-hotel', 
    categoryId: 'luxury-hospitality', 
    titleKey: 'courses.luxuryHotel.title', 
    shortDescriptionKey: 'courses.luxuryHotel.shortDesc',
    fullDescriptionKey: 'courses.luxuryHotel.fullDesc',
    durationKey: 'courses.luxuryHotel.duration',
    targetAudienceKey: 'courses.luxuryHotel.target',
    prerequisitesKey: 'courses.luxuryHotel.prerequisites',
    careerOutcomesKey: 'courses.luxuryHotel.outcomes',
    thumbnailImageId: 'course-luxury-hotel',
    heroImageId: 'hero-course-luxury-hotel',
    iconMediaId: 'icon-luxury-hotel',
    galleryImageIds: ['gallery-course-luxury-hotel-1', 'gallery-course-luxury-hotel-2', 'gallery-course-luxury-hotel-3']
  },
  { 
    id: 'sommelier', 
    categoryId: 'luxury-hospitality', 
    titleKey: 'courses.sommelier.title', 
    shortDescriptionKey: 'courses.sommelier.shortDesc',
    fullDescriptionKey: 'courses.sommelier.fullDesc',
    durationKey: 'courses.sommelier.duration',
    targetAudienceKey: 'courses.sommelier.target',
    prerequisitesKey: 'courses.sommelier.prerequisites',
    careerOutcomesKey: 'courses.sommelier.outcomes',
    thumbnailImageId: 'course-sommelier',
    heroImageId: 'hero-course-sommelier',
    iconMediaId: 'icon-sommelier',
    galleryImageIds: ['gallery-course-sommelier-1', 'gallery-course-sommelier-2', 'gallery-course-sommelier-3']
  },
  { 
    id: 'fashion-model', 
    categoryId: 'sport-management', 
    titleKey: 'courses.fashionModel.title', 
    shortDescriptionKey: 'courses.fashionModel.shortDesc',
    fullDescriptionKey: 'courses.fashionModel.fullDesc',
    durationKey: 'courses.fashionModel.duration',
    targetAudienceKey: 'courses.fashionModel.target',
    prerequisitesKey: 'courses.fashionModel.prerequisites',
    careerOutcomesKey: 'courses.fashionModel.outcomes',
    thumbnailImageId: 'course-fashion-model',
    heroImageId: 'hero-course-fashion-model',
    iconMediaId: 'icon-fashion-model',
    galleryImageIds: ['gallery-course-fashion-model-1', 'gallery-course-fashion-model-2', 'gallery-course-fashion-model-3']
  },
  { 
    id: 'football-coach', 
    categoryId: 'sport-management', 
    titleKey: 'courses.footballCoach.title', 
    shortDescriptionKey: 'courses.footballCoach.shortDesc',
    fullDescriptionKey: 'courses.footballCoach.fullDesc',
    durationKey: 'courses.footballCoach.duration',
    targetAudienceKey: 'courses.footballCoach.target',
    prerequisitesKey: 'courses.footballCoach.prerequisites',
    careerOutcomesKey: 'courses.footballCoach.outcomes',
    thumbnailImageId: 'course-football-coach',
    heroImageId: 'hero-course-football-coach',
    iconMediaId: 'icon-football-coach',
    galleryImageIds: ['gallery-course-football-coach-1', 'gallery-course-football-coach-2', 'gallery-course-football-coach-3']
  },
  { 
    id: 'fifa-agent', 
    categoryId: 'sport-management', 
    titleKey: 'courses.fifaAgent.title', 
    shortDescriptionKey: 'courses.fifaAgent.shortDesc',
    fullDescriptionKey: 'courses.fifaAgent.fullDesc',
    durationKey: 'courses.fifaAgent.duration',
    targetAudienceKey: 'courses.fifaAgent.target',
    prerequisitesKey: 'courses.fifaAgent.prerequisites',
    careerOutcomesKey: 'courses.fifaAgent.outcomes',
    thumbnailImageId: 'course-fifa-agent',
    heroImageId: 'hero-course-fifa-agent',
    iconMediaId: 'icon-fifa-agent',
    galleryImageIds: ['gallery-course-fifa-agent-1', 'gallery-course-fifa-agent-2', 'gallery-course-fifa-agent-3']
  },
  { 
    id: 'sports-data', 
    categoryId: 'sport-management', 
    titleKey: 'courses.sportsData.title', 
    shortDescriptionKey: 'courses.sportsData.shortDesc',
    fullDescriptionKey: 'courses.sportsData.fullDesc',
    durationKey: 'courses.sportsData.duration',
    targetAudienceKey: 'courses.sportsData.target',
    prerequisitesKey: 'courses.sportsData.prerequisites',
    careerOutcomesKey: 'courses.sportsData.outcomes',
    thumbnailImageId: 'course-sports-data',
    heroImageId: 'hero-course-sports-data',
    iconMediaId: 'icon-sports-data',
    galleryImageIds: ['gallery-course-sports-data-1', 'gallery-course-sports-data-2', 'gallery-course-sports-data-3']
  },

  { 
    id: 'fle', 
    categoryId: 'languages-international', 
    titleKey: 'courses.fle.title', 
    shortDescriptionKey: 'courses.fle.shortDesc',
    fullDescriptionKey: 'courses.fle.fullDesc',
    durationKey: 'courses.fle.duration',
    targetAudienceKey: 'courses.fle.target',
    prerequisitesKey: 'courses.fle.prerequisites',
    careerOutcomesKey: 'courses.fle.outcomes',
    thumbnailImageId: 'course-fle',
    heroImageId: 'hero-course-fle',
    iconMediaId: 'icon-fle',
    galleryImageIds: ['gallery-course-fle-1', 'gallery-course-fle-2', 'gallery-course-fle-3']
  },
  { 
    id: 'hsk', 
    categoryId: 'languages-international', 
    titleKey: 'courses.hsk.title', 
    shortDescriptionKey: 'courses.hsk.shortDesc',
    fullDescriptionKey: 'courses.hsk.fullDesc',
    durationKey: 'courses.hsk.duration',
    targetAudienceKey: 'courses.hsk.target',
    prerequisitesKey: 'courses.hsk.prerequisites',
    careerOutcomesKey: 'courses.hsk.outcomes',
    thumbnailImageId: 'course-hsk',
    heroImageId: 'hero-course-hsk',
    iconMediaId: 'icon-hsk',
    galleryImageIds: ['gallery-course-hsk-1', 'gallery-course-hsk-2', 'gallery-course-hsk-3']
  },
  { 
    id: 'tefl', 
    categoryId: 'languages-international', 
    titleKey: 'courses.tefl.title', 
    shortDescriptionKey: 'courses.tefl.shortDesc',
    fullDescriptionKey: 'courses.tefl.fullDesc',
    durationKey: 'courses.tefl.duration',
    targetAudienceKey: 'courses.tefl.target',
    prerequisitesKey: 'courses.tefl.prerequisites',
    careerOutcomesKey: 'courses.tefl.outcomes',
    thumbnailImageId: 'course-tefl',
    heroImageId: 'hero-course-tefl',
    iconMediaId: 'icon-tefl',
    galleryImageIds: ['gallery-course-tefl-1', 'gallery-course-tefl-2', 'gallery-course-tefl-3']
  },

  { 
    id: 'business-china', 
    categoryId: 'business-strategy', 
    titleKey: 'courses.businessChina.title', 
    shortDescriptionKey: 'courses.businessChina.shortDesc',
    fullDescriptionKey: 'courses.businessChina.fullDesc',
    durationKey: 'courses.businessChina.duration',
    targetAudienceKey: 'courses.businessChina.target',
    prerequisitesKey: 'courses.businessChina.prerequisites',
    careerOutcomesKey: 'courses.businessChina.outcomes',
    thumbnailImageId: 'course-business-china',
    heroImageId: 'hero-course-business-china',
    iconMediaId: 'icon-business-china',
    galleryImageIds: ['gallery-course-business-china-1', 'gallery-course-business-china-2', 'gallery-course-business-china-3']
  },
  { 
    id: 'gateway-europe', 
    categoryId: 'business-strategy', 
    titleKey: 'courses.gatewayEurope.title', 
    shortDescriptionKey: 'courses.gatewayEurope.shortDesc',
    fullDescriptionKey: 'courses.gatewayEurope.fullDesc',
    durationKey: 'courses.gatewayEurope.duration',
    targetAudienceKey: 'courses.gatewayEurope.target',
    prerequisitesKey: 'courses.gatewayEurope.prerequisites',
    careerOutcomesKey: 'courses.gatewayEurope.outcomes',
    thumbnailImageId: 'course-gateway-europe',
    heroImageId: 'hero-course-gateway-europe',
    iconMediaId: 'icon-gateway-europe',
    galleryImageIds: ['gallery-course-gateway-europe-1', 'gallery-course-gateway-europe-2', 'gallery-course-gateway-europe-3']
  },
  { 
    id: 'fifa-agent-alt', 
    categoryId: 'business-strategy', 
    titleKey: 'courses.fifaAgentAlt.title', 
    shortDescriptionKey: 'courses.fifaAgentAlt.shortDesc',
    fullDescriptionKey: 'courses.fifaAgentAlt.fullDesc',
    durationKey: 'courses.fifaAgentAlt.duration',
    targetAudienceKey: 'courses.fifaAgentAlt.target',
    prerequisitesKey: 'courses.fifaAgentAlt.prerequisites',
    careerOutcomesKey: 'courses.fifaAgentAlt.outcomes',
    thumbnailImageId: 'course-fifa-agent-alt',
    heroImageId: 'hero-course-fifa-agent-alt',
    iconMediaId: 'icon-fifa-agent-alt',
    galleryImageIds: ['gallery-course-fifa-agent-alt-1', 'gallery-course-fifa-agent-alt-2', 'gallery-course-fifa-agent-alt-3']
  },
];

export interface CampusLocation {
  id: string;
  name: string;
  descriptionKey: string;
  detailsKey: string;
  mainImageId: string;
  galleryImageIds: string[];
}

export const campusLocations: CampusLocation[] = [
  { 
    id: 'evron', 
    name: 'Évron', 
    descriptionKey: 'locations.evron', 
    detailsKey: 'locations.details.evron', 
    mainImageId: 'campus-evron',
    galleryImageIds: ['campus-evron-gallery-1', 'campus-evron-gallery-2', 'campus-evron-gallery-3']
  },
  { 
    id: 'sainte-tulle', 
    name: 'Sainte-Tulle', 
    descriptionKey: 'locations.sainteTulle', 
    detailsKey: 'locations.details.sainteTulle', 
    mainImageId: 'campus-sainte-tulle',
    galleryImageIds: ['campus-sainte-tulle-gallery-1', 'campus-sainte-tulle-gallery-2', 'campus-sainte-tulle-gallery-3']
  },
  { 
    id: 'sainte-bazeille', 
    name: 'Sainte-Bazeille', 
    descriptionKey: 'locations.sainteBazeille', 
    detailsKey: 'locations.details.sainteBazeille', 
    mainImageId: 'campus-sainte-bazeille',
    galleryImageIds: ['campus-sainte-bazeille-gallery-1', 'campus-sainte-bazeille-gallery-2', 'campus-sainte-bazeille-gallery-3']
  },
];
