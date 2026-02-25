export interface Dentist {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  neighborhood: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  specialties: string[] | null;
  rating: number | null;
  review_count: number | null;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  verified: boolean;
  premium_until: string | null;
  created_at: string;
}

export interface DentistFilters {
  q?: string;
  neighborhood?: string;
  specialty?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}
