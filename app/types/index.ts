export type Doctor = {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewsCount: number;
  totalBookings: number;
  qualification: string;
  experience: number; // years
  specialization: string[];
  clinicAddress: string;
  profileImageUrl?: string;
  availability?: Record<string, string[]>; // ISO date (YYYY-MM-DD) => array of time slot labels
};

export type AppointmentStatus = 'Confirmed' | 'Cancelled' | 'Completed';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

export type Appointment = {
  id: string;
  doctorName: string;
  category: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., '10:00 - 10:30'
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
};

export type User = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

export type Category = {
  id: string;
  name: string;
  icon?: string; // placeholder for icon keys if needed later
};

export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type AuthToken = string;
