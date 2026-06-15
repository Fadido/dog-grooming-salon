// DTOs mirrored from the ASP.NET Core backend.

export interface UserDto {
  id: number;
  username: string;
  firstName: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserDto;
}

export interface HaircutTypeDto {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface AppointmentQueueDto {
  id: number;
  customerFirstName: string;
  dogType: string;
  durationMinutes: number;
  scheduledTime: string;
  finalPrice: number;
  discountApplied: boolean;
  createdAt: string;
  isMine: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface AppointmentDetailsDto {
  id: number;
  userId: number;
  customerFirstName: string;
  username: string;
  haircutTypeId: number;
  dogType: string;
  durationMinutes: number;
  scheduledTime: string;
  finalPrice: number;
  discountApplied: boolean;
  createdAt: string;
  isMine: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AppointmentInput {
  haircutTypeId: number;
  scheduledTime: string;
}

export interface AppointmentFilter {
  fromDate?: string;
  toDate?: string;
  customerName?: string;
}
