export interface AdminRole {
    isAdmin: boolean;
}

export interface TrainingCategory {
    id: string;
    nameFr: string;
    nameEn: string;
    nameZh: string;
    displayOrder: number;
}

export interface TrainingCourse {
    id: string;
    categoryId: string;
    titleFr: string;
    titleEn: string;
    titleZh: string;
    shortDescriptionFr: string;
    shortDescriptionEn: string;
    shortDescriptionZh: string;
    fullDescriptionFr: string;
    fullDescriptionEn: string;
    fullDescriptionZh: string;
    durationFr: string;
    durationEn: string;
    durationZh: string;
    targetAudienceFr: string;
    targetAudienceEn: string;
    targetAudienceZh: string;
    prerequisitesFr: string;
    prerequisitesEn: string;
    prerequisitesZh: string;
    careerOutcomesFr: string;
    careerOutcomesEn: string;
    careerOutcomesZh: string;
    thumbnailMediaId: string;
    heroMediaId: string;
    iconMediaId: string;
    galleryMediaIds?: string[];
}

export interface Testimonial {
    id: string;
    studentName: string;
    studentOrigin: string;
    quoteFr: string;
    quoteEn: string;
    quoteZh: string;
    courseId?: string;
    profilePictureMediaId: string;
    published: boolean;
    createdAt: string;
}

export interface MediaAsset {
    id: string;
    url: string;
    type: 'image' | 'video';
    altTextFr: string;
    altTextEn: string;
    altTextZh: string;
    uploadedAt: string;
    mimeType: string;
    fileName: string;
    width?: number;
    height?: number;
    durationInSeconds?: number;
}

export interface HomePageContent {
    id: string;
    heroTitleFr: string;
    heroTitleEn: string;
    heroTitleZh: string;
    heroSubtitleFr?: string;
    heroSubtitleEn?: string;
    heroSubtitleZh?: string;
    heroMediaId: string;
    aboutUsFr: string;
    aboutUsEn: string;
    aboutUsZh: string;
    contactEmail: string;
    contactPhone: string;
    contactAddressFr: string;
    contactAddressEn: string;
    contactAddressZh: string;
    mapEmbedUrl: string;
}
