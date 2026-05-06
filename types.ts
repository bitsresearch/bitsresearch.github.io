
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  expertise: string[];
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface ResourceItem {
  title: string;
  type: string;
  link: string;
}

export enum PageRoute {
  HOME = '/',
  ABOUT = '/about',
  TEAM = '/team',
  CARE = '/what-we-care',
  RESEARCH = '/research-update',
  OUTPUT = '/output-resources',
  INVOLVED = '/get-involved',
  CONTACT = '/contact',
  PRIVACY = '/privacy-policy',
  TERMS = '/terms-of-use',
  ACCESSIBILITY = '/accessibility',
  ETHICS = '/research-ethics',
  WORKSHOPS = '/upcomingworkshops',
}
