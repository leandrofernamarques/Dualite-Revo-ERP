import { Client, CreateClientData, UpdateClientData } from '../entities/client';
import { Result } from '../types/result';

export interface ListClientsParams {
  q?: string;
  page: number;
  pageSize: number;
}

export interface ListClientsResult {
  clients: Client[];
  total: number;
}

export interface ClientRepository {
  create(data: CreateClientData, userId: string): Promise<Result<Client>>;
  update(id: string, data: UpdateClientData): Promise<Result<Client>>;
  findByEmail(email: string): Promise<Result<Client | null>>;
  list(params: ListClientsParams): Promise<Result<ListClientsResult>>;
  softDelete(id: string): Promise<Result<void>>;
  findById(id: string): Promise<Result<Client | null>>;
}
