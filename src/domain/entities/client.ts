import { EmailVO } from '../value-objects/email';
import { PhoneVO } from '../value-objects/phone';

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: EmailVO;
  phone?: PhoneVO;
  createdAt: Date;
  deletedAt?: Date;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string;
}
