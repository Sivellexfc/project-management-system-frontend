export interface JwtPayload {
  userId: number;
  userRole: string;
  exp: number;
  iat: number;
} 