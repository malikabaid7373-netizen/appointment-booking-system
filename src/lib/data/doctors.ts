export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  rating: number;
  consultationFee: number;
  availableToday: boolean;
  languages: string[];
  initials: string;
  about: string;
  availableDays: string[];
};