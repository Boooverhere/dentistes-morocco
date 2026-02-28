export interface Dentist {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
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
  photos: string[] | null;
  verified: boolean;
  premium_until: string | null;
  views_count: number;
  leads_count: number;
  created_at: string;
}

export interface Lead {
  id: string;
  dentist_id: string;
  patient_name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  created_at: string;
  status: string;
}

export interface PendingDentist {
  id: string;
  name: string;
  city: string;
  neighborhood: string | null;
  address: string | null;
  phone: string;
  email: string | null;
  website: string | null;
  specialties: string[] | null;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  submitted_at: string;
  submitted_by: string | null;
  status: "pending" | "approved" | "rejected";
  moderator_notes: string | null;
  rejection_reason: string | null;
}

export interface DentistFilters {
  q?: string;
  city?: string;
  neighborhood?: string;
  specialty?: string;
  verified?: boolean;
  minRating?: number;
  limit?: number;
  offset?: number;
}
