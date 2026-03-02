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
  descriptionKey: string;
  imageId: string;
}

export const courses: Course[] = [
  { id: 'flight-attendant', categoryId: 'luxury-hospitality', titleKey: 'courses.flightAttendant.title', descriptionKey: 'courses.flightAttendant.desc', imageId: 'course-flight-attendant' },
  { id: 'luxury-restaurant', categoryId: 'luxury-hospitality', titleKey: 'courses.luxuryRestaurant.title', descriptionKey: 'courses.luxuryRestaurant.desc', imageId: 'course-luxury-restaurant' },
  { id: 'luxury-hotel', categoryId: 'luxury-hospitality', titleKey: 'courses.luxuryHotel.title', descriptionKey: 'courses.luxuryHotel.desc', imageId: 'course-luxury-hotel' },
  { id: 'sommelier', categoryId: 'luxury-hospitality', titleKey: 'courses.sommelier.title', descriptionKey: 'courses.sommelier.desc', imageId: 'course-sommelier' },
  
  { id: 'fashion-model', categoryId: 'sport-management', titleKey: 'courses.fashionModel.title', descriptionKey: 'courses.fashionModel.desc', imageId: 'course-fashion-model' },
  { id: 'football-coach', categoryId: 'sport-management', titleKey: 'courses.footballCoach.title', descriptionKey: 'courses.footballCoach.desc', imageId: 'course-football-coach' },
  { id: 'fifa-agent', categoryId: 'sport-management', titleKey: 'courses.fifaAgent.title', descriptionKey: 'courses.fifaAgent.desc', imageId: 'course-fifa-agent' },
  { id: 'sports-data', categoryId: 'sport-management', titleKey: 'courses.sportsData.title', descriptionKey: 'courses.sportsData.desc', imageId: 'course-sports-data' },

  { id: 'fle', categoryId: 'languages-international', titleKey: 'courses.fle.title', descriptionKey: 'courses.fle.desc', imageId: 'course-fle' },
  { id: 'hsk', categoryId: 'languages-international', titleKey: 'courses.hsk.title', descriptionKey: 'courses.hsk.desc', imageId: 'course-hsk' },
  { id: 'tefl', categoryId: 'languages-international', titleKey: 'courses.tefl.title', descriptionKey: 'courses.tefl.desc', imageId: 'course-tefl' },

  { id: 'business-china', categoryId: 'business-strategy', titleKey: 'courses.businessChina.title', descriptionKey: 'courses.businessChina.desc', imageId: 'course-business-china' },
  { id: 'gateway-europe', categoryId: 'business-strategy', titleKey: 'courses.gatewayEurope.title', descriptionKey: 'courses.gatewayEurope.desc', imageId: 'course-gateway-europe' },
  { id: 'fifa-agent-alt', categoryId: 'business-strategy', titleKey: 'courses.fifaAgentAlt.title', descriptionKey: 'courses.fifaAgentAlt.desc', imageId: 'course-fifa-agent-alt' },
];

export interface Testimonial {
    id: string;
    quoteKey: string;
    authorKey: string;
    originKey: string;
    imageId: string;
}

export const testimonials: Testimonial[] = [
    { id: '1', quoteKey: 'testimonials.1.quote', authorKey: 'testimonials.1.author', originKey: 'testimonials.1.origin', imageId: 'testimonial-1' },
    { id: '2', quoteKey: 'testimonials.2.quote', authorKey: 'testimonials.2.author', originKey: 'testimonials.2.origin', imageId: 'testimonial-2' },
    { id: '3', quoteKey: 'testimonials.3.quote', authorKey: 'testimonials.3.author', originKey: 'testimonials.3.origin', imageId: 'testimonial-3' },
];
