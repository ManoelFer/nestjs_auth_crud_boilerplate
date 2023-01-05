export interface IUserWithoutPassword {
  id: number;
  secureId: string;
  email: string;
  name: string;
  cellphone: string;
  createdAt: Date;
  updatedAt: Date | null;
}
