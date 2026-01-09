import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiResponse, Appointment, Doctor, User, Category } from '../types';

// Centralized API service with mock backend data. Swap internals to real fetch when backend is ready.
class ApiService {
  private static instance: ApiService;
  private token: string | null = null;

  static getInstance() {
    if (!ApiService.instance) ApiService.instance = new ApiService();
    return ApiService.instance;
  }

  // Simulate network latency
  private async simulate<T>(data: T, delay = 400): Promise<ApiResponse<T>> {
    return new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
  }

  async setToken(token: string | null) {
    this.token = token;
    if (token) await AsyncStorage.setItem('auth_token', token);
    else await AsyncStorage.removeItem('auth_token');
  }

  async getToken() {
    if (this.token) return this.token;
    const stored = await AsyncStorage.getItem('auth_token');
    this.token = stored;
    return stored;
  }

  // Mock DB
  private categories: Category[] = [
    { id: 'cardio', name: 'Cardiologist' },
    { id: 'derma', name: 'Dermatologist' },
    { id: 'neuro', name: 'Neurologist' },
    { id: 'pedia', name: 'Pediatrician' },
    { id: 'ortho', name: 'Orthopedic' },
    { id: 'ent', name: 'ENT' },
  ];

  private doctors: Doctor[] = [
    {
      id: 'd1',
      name: 'Dr. Ayesha Khan',
      category: 'Cardiologist',
      location: 'Mumbai, IN',
      rating: 4.8,
      reviewsCount: 212,
      totalBookings: 1200,
      qualification: 'MD, DM (Cardiology)',
      experience: 12,
      specialization: ['Cardiac Imaging', 'Interventional Cardiology'],
      clinicAddress: 'HeartCare Clinic, Bandra',
      profileImageUrl: undefined,
      availability: {
        '2026-01-08': ['09:00', '09:30', '10:00', '11:00', '11:30'],
        '2026-01-09': ['10:00', '10:30', '12:00', '15:00'],
      },
    },
    {
      id: 'd2',
      name: 'Dr. Rohan Mehta',
      category: 'Dermatologist',
      location: 'Delhi, IN',
      rating: 4.5,
      reviewsCount: 134,
      totalBookings: 640,
      qualification: 'MD (Dermatology)',
      experience: 8,
      specialization: ['Acne', 'Cosmetic Dermatology'],
      clinicAddress: 'Skin+ Clinic, Saket',
      profileImageUrl: undefined,
      availability: {
        '2026-01-08': ['10:00', '10:30', '11:00', '14:00'],
        '2026-01-10': ['09:00', '09:30', '10:30'],
      },
    },
    {
      id: 'd3',
      name: 'Dr. Neha Sharma',
      category: 'Pediatrician',
      location: 'Bengaluru, IN',
      rating: 4.9,
      reviewsCount: 321,
      totalBookings: 1540,
      qualification: 'MD (Pediatrics)',
      experience: 11,
      specialization: ['General Pediatrics', 'Vaccination'],
      clinicAddress: 'KidsCare, Indiranagar',
      profileImageUrl: undefined,
      availability: {
        '2026-01-07': ['16:00', '16:30', '17:00'],
        '2026-01-09': ['09:00', '09:30', '10:00', '10:30'],
      },
    },
  ];

  private currentUser: User | null = null;
  private appointments: Appointment[] = [];

  // Public API
  async getCategories() {
    return this.simulate(this.categories);
  }

  async getDoctorsByCategory(categoryName: string) {
    const list = this.doctors.filter((d) => d.category === categoryName);
    return this.simulate(list);
  }

  async getDoctor(doctorId: string) {
    const doc = this.doctors.find((d) => d.id === doctorId);
    if (!doc) return { data: null as any, error: 'Doctor not found' };
    return this.simulate(doc);
  }

  async login(email: string, password: string) {
    // Accept any non-empty credentials for mock
    if (!email || !password) return { data: null as any, error: 'Invalid credentials' };
    const user: User = { id: 'u1', name: 'John Doe', email };
    this.currentUser = user;
    const token = 'mock-token-123';
    await this.setToken(token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return this.simulate({ user, token });
  }

  async signup(name: string, email: string, password: string) {
    if (!name || !email || !password) return { data: null as any, error: 'Missing fields' };
    const user: User = { id: 'u2', name, email };
    this.currentUser = user;
    const token = 'mock-token-xyz';
    await this.setToken(token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return this.simulate({ user, token });
  }

  async getProfile() {
    const token = await this.getToken();
    if (!token) return { data: null as any, error: 'Unauthorized' };
    if (this.currentUser) return this.simulate(this.currentUser);
    const raw = await AsyncStorage.getItem('user');
    const parsed = raw ? (JSON.parse(raw) as User) : null;
    this.currentUser = parsed;
    if (!parsed) return { data: null as any, error: 'Unauthorized' };
    return this.simulate(parsed);
  }

  async getAppointments() {
    const token = await this.getToken();
    if (!token) return { data: null as any, error: 'Unauthorized' };
    return this.simulate(this.appointments);
  }

  async bookAppointment(doctorId: string, date: string, timeSlot: string) {
    const token = await this.getToken();
    if (!token) return { data: null as any, error: 'Unauthorized' };
    const doctor = this.doctors.find((d) => d.id === doctorId);
    if (!doctor) return { data: null as any, error: 'Doctor not found' };
    const appt: Appointment = {
      id: 'apt-' + Math.random().toString(36).slice(2, 9),
      doctorName: doctor.name,
      category: doctor.category,
      date,
      timeSlot,
      status: 'Confirmed',
      paymentStatus: 'Pending',
    };
    this.appointments.unshift(appt);
    return this.simulate(appt, 600);
  }

  async initiatePayment(appointmentId: string) {
    const token = await this.getToken();
    if (!token) return { data: null as any, error: 'Unauthorized' };
    const idx = this.appointments.findIndex((a) => a.id === appointmentId);
    if (idx === -1) return { data: null as any, error: 'Appointment not found' };
    this.appointments[idx].paymentStatus = 'Paid';
    return this.simulate({ success: true }, 800);
  }

  async triggerAIVoiceForAppointment(appointmentId: string) {
    const token = await this.getToken();
    if (!token) return { data: null as any, error: 'Unauthorized' };
    // Mock: return success as if a call was initiated
    return this.simulate({ started: true }, 500);
  }

  async triggerAIQuick() {
    // Quick trigger without auth (e.g., general triage)
    return this.simulate({ started: true }, 400);
  }

  async logout() {
    this.currentUser = null;
    await this.setToken(null);
    await AsyncStorage.removeItem('user');
    return this.simulate({ ok: true });
  }
}

export const api = ApiService.getInstance();
