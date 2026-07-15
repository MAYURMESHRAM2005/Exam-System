export type UserRole = 'student' | 'instructor' | null;

export interface JwtPayload {
  id: string;
  role: UserRole;
  exp: number;
}
