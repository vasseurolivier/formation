import { courses, campusLocations } from '@/lib/data';

export function getImageUsageInfo(imageId: string, t: (key: string) => string): string {
    if (imageId.startsWith('hero-')) {
        const page = imageId.replace('hero-', '');
        switch (page) {
            case 'home': return "Page d'accueil - Section Héro";
            case 'about': return "Page 'À Propos' - Section Héro";
            case 'courses': return "Page 'Formations' - Section Héro";
            case 'locations': return "Page 'Nos Campus' - Section Héro";
            case 'contact': return "Page 'Contact' - Section Héro";
            case 'privacy-policy': return "Page 'Politique de Confidentialité' - Section Héro";
            case 'terms-of-use': return "Page 'Conditions d'Utilisation' - Section Héro";
            default:
                if (page.startsWith('course-')) {
                    const courseId = page.replace('course-', '');
                    const course = courses.find(c => c.id === courseId);
                    return course ? `Page Formation '${t(course.titleKey)}' - Section Héro` : "Section Héro de page de formation";
                }
                return "";
        }
    }

    if (imageId.startsWith('course-')) {
        const courseId = imageId.replace('course-', '');
        const course = courses.find(c => c.id === courseId);
        return course ? `Vignette : '${t(course.titleKey)}' (Pages Accueil & Formations)`: 'Vignette de formation';
    }

    if (imageId.startsWith('gallery-course-')) {
        const courseId = imageId.split('-')[2];
        const course = courses.find(c => c.id === courseId);
        return course ? `Galerie : Formation '${t(course.titleKey)}'`: 'Galerie de formation';
    }

    if (imageId.startsWith('campus-')) {
        if (imageId.includes('-gallery-')) {
            const campusId = imageId.split('-')[1];
            const campus = campusLocations.find(c => c.id === campusId);
            return campus ? `Galerie : Campus '${campus.name}' (Page Nos Campus)` : 'Galerie de campus';
        }
        const campusId = imageId.replace('campus-', '');
        const campus = campusLocations.find(c => c.id === campusId);
        return campus ? `Image principale : Campus '${campus.name}' (Page Nos Campus)`: 'Image de campus';
    }

    if (imageId === 'about-us-image') {
        return "Pages 'Accueil' et 'À Propos'";
    }

    return "";
}
