import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiResponse, Appointment, Doctor, User, Category } from '../types';

const IP="172.21.93.40"
const API_URL=`http://${IP}:3001/api`


class ApiService {

  private async request(endpoint: string,options: RequestInit = {}){
    const token = await this.getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }



  private static instance: ApiService;
  private token: string | null = null;

  static getInstance() {
    if (!ApiService.instance) ApiService.instance = new ApiService();
    return ApiService.instance;
  }

  // // Simulate network latency
  // private async simulate<T>(data: T, delay = 400): Promise<ApiResponse<T>> {
  //   return new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
  // }

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
  // private categories: Category[] = [
  //   { id: 'cardio', name: 'Cardiologist' },
  //   { id: 'derma', name: 'Dermatologist' },
  //   { id: 'neuro', name: 'Neurologist' },
  //   { id: 'pedia', name: 'Pediatrician' },
  //   { id: 'ortho', name: 'Orthopedic' },
  //   { id: 'ent', name: 'ENT' },
  // ];

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
      phone: '+919876543210',
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
    try {
      const response = await fetch(`${API_URL}/categories`);
      
      if (!response.ok) {
        return { data: [] as Category[], error: 'Failed to fetch categories' };
      }
      
      const categories = await response.json();
      return { data: categories as Category[] };
    } catch (error) {
      console.error('Get categories error:', error);
      return { data: [] as Category[], error: 'Network error. Please try again.' };
    }
  }

async getDoctorsByCategory(categoryName: string) {
  try {
    const data = await this.request(
      `/doctor_by_category?category=${encodeURIComponent(categoryName)}`
    );
    console.log(`searching doctors in ${categoryName}`);

    return { data: data as Doctor[] };
  } catch (err: any) {
    return { data: [], error: err.message };
  }
}


async getDoctor(doctorId: string) {
  try {
    const data = await this.request(`/doctors/${doctorId}`);
    return { data: data as Doctor };
  } catch (err: any) {
    return { data: null as any, error: err.message };
  }
}


  async login(email: string, password: string) {
    if (!email || !password) return { data: null as any, error: 'Invalid credentials' };
    
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { data: null as any, error: data.message || 'Login failed' };
      }
      
      const { user, token } = data;
      this.currentUser = user;
      await this.setToken(token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { data: { user, token } };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null as any, error: 'Network error. Please try again.' };
    }
  }

  async signup(name: string, email: string, password: string) {
    if (!name || !email || !password) return { data: null as any, error: 'Missing fields' };
    
    try {
      const response = await fetch(`${API_URL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { data: null as any, error: data.message || 'Signup failed' };
      }
      
      const { user, token } = data;
      this.currentUser = user;
      await this.setToken(token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { data: { user, token } };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null as any, error: 'Network error. Please try again.' };
    }
  }

async getProfile() {
  try {
    const data = await this.request(`/user/profile`);

    this.currentUser = data;
    await AsyncStorage.setItem("user", JSON.stringify(data));

    return { data: data as User };
  } catch (err: any) {
    return { data: null as any, error: err.message };
  }
}


  async getAppointments() {
    try {
      const data = await this.request(`/appointments`);
      return { data: data as Appointment[] };
    } catch (err: any) {
      return { data: [], error: err.message };
    }
  }


async bookAppointment(
  doctorId: string,
  date: string,
  timeSlot: string
  ) {
    try {
      const data = await this.request(`/appointments`, {
        method: "POST",
        body: JSON.stringify({
          doctorId,
          date,
          timeSlot,
        }),
      });

      return { data: data as Appointment };
    } catch (err: any) {
      return { data: null as any, error: err.message };
    }
}


async initiatePayment(appointmentId: string) {
  try {
    const data = await this.request(
      `/payments/${appointmentId}`,
      { method: "POST" }
    );

    return { data };
  } catch (err: any) {
    return { data: null as any, error: err.message };
  }
}


async triggerAIVoiceForAppointment(appointmentId: string) {
  try {
    const data = await this.request(
      `/ai/call/${appointmentId}`,
      { method: "POST" }
    );

    return { data };
  } catch (err: any) {
    return { data: null as any, error: err.message };
  }
}

async triggerAIQuick() {
  try {
    const data = await this.request(
      `/ai/quick`,
      { method: "POST" }
    );

    return { data };
  } catch (err: any) {
    return { data: null as any, error: err.message };
  }
}


  async logout() {
    this.currentUser = null;
    await this.setToken(null);
    await AsyncStorage.removeItem('user');
    return this.simulate({ ok: true });
  }
}

export const api = ApiService.getInstance();
