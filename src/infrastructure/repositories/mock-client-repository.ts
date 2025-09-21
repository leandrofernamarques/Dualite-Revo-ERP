import { 
  ClientRepository, 
  ListClientsParams, 
  ListClientsResult 
} from '@/domain/repositories/client-repository';
import { Client, CreateClientData, UpdateClientData } from '@/domain/entities/client';
import { EmailVO } from '@/domain/value-objects/email';
import { PhoneVO } from '@/domain/value-objects/phone';
import { DuplicatedEmailError } from '@/domain/errors/client-errors';
import { Result, success, failure } from '@/domain/types/result';

export class MockClientRepository implements ClientRepository {
  private clients: Client[] = [];
  private nextId = 1;

  async create(data: CreateClientData, userId: string): Promise<Result<Client>> {
    try {
      const existingEmail = this.clients.find(
        c => c.email.getValue() === data.email && !c.deletedAt && c.userId === userId
      );
      
      if (existingEmail) {
        return failure(new DuplicatedEmailError(data.email));
      }

      const client: Client = {
        id: String(this.nextId++),
        userId: userId,
        name: data.name,
        email: EmailVO.create(data.email),
        phone: data.phone ? PhoneVO.create(data.phone) : undefined,
        createdAt: new Date(),
      };

      this.clients.push(client);
      return success(client);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async update(id: string, data: UpdateClientData): Promise<Result<Client>> {
    try {
      const clientIndex = this.clients.findIndex(c => c.id === id && !c.deletedAt);
      
      if (clientIndex === -1) {
        return failure(new Error('Cliente não encontrado'));
      }

      const client = this.clients[clientIndex];
      
      if (data.email && data.email !== client.email.getValue()) {
        const existingEmail = this.clients.find(
          c => c.email.getValue() === data.email && c.id !== id && !c.deletedAt
        );
        
        if (existingEmail) {
          return failure(new DuplicatedEmailError(data.email));
        }
      }

      const updatedClient: Client = {
        ...client,
        name: data.name ?? client.name,
        email: data.email ? EmailVO.create(data.email) : client.email,
        phone: data.phone !== undefined ? 
          (data.phone ? PhoneVO.create(data.phone) : undefined) : 
          client.phone,
      };

      this.clients[clientIndex] = updatedClient;
      return success(updatedClient);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findByEmail(email: string): Promise<Result<Client | null>> {
    try {
      const client = this.clients.find(
        c => c.email.getValue() === email && !c.deletedAt
      );
      return success(client || null);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findById(id: string): Promise<Result<Client | null>> {
    try {
      const client = this.clients.find(c => c.id === id && !c.deletedAt);
      return success(client || null);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async list(params: ListClientsParams): Promise<Result<ListClientsResult>> {
    try {
      let filteredClients = this.clients.filter(c => !c.deletedAt);

      if (params.q) {
        const query = params.q.toLowerCase();
        filteredClients = filteredClients.filter(c =>
          c.name.toLowerCase().includes(query) ||
          c.email.getValue().toLowerCase().includes(query)
        );
      }

      filteredClients.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const total = filteredClients.length;
      const startIndex = (params.page - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const clients = filteredClients.slice(startIndex, endIndex);

      return success({ clients, total });
    } catch (error) {
      return failure(error as Error);
    }
  }

  async softDelete(id: string): Promise<Result<void>> {
    try {
      const clientIndex = this.clients.findIndex(c => c.id === id && !c.deletedAt);
      
      if (clientIndex === -1) {
        return failure(new Error('Cliente não encontrado'));
      }

      this.clients[clientIndex] = {
        ...this.clients[clientIndex],
        deletedAt: new Date(),
      };

      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
