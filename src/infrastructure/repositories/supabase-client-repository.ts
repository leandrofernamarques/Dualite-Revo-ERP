import { supabase } from '@/lib/supabase';
import { 
  ClientRepository, 
  ListClientsParams, 
  ListClientsResult 
} from '@/domain/repositories/client-repository';
import { Client, CreateClientData, UpdateClientData } from '@/domain/entities/client';
import { EmailVO } from '@/domain/value-objects/email';
import { PhoneVO } from '@/domain/value-objects/phone';
import { DuplicatedEmailError, ClientNotFoundError } from '@/domain/errors/client-errors';
import { Result, success, failure } from '@/domain/types/result';

export class SupabaseClientRepository implements ClientRepository {
  private fromEntity(dbClient: any): Client {
    return {
      id: dbClient.id,
      userId: dbClient.user_id,
      name: dbClient.name,
      email: EmailVO.create(dbClient.email),
      phone: dbClient.phone ? PhoneVO.create(dbClient.phone) : undefined,
      createdAt: new Date(dbClient.created_at),
      deletedAt: dbClient.deleted_at ? new Date(dbClient.deleted_at) : undefined,
    };
  }

  async create(data: CreateClientData, userId: string): Promise<Result<Client>> {
    const { data: clientData, error } = await supabase
      .from('clients')
      .insert({
        ...data,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return failure(new DuplicatedEmailError(data.email));
      }
      return failure(error);
    }

    return success(this.fromEntity(clientData));
  }

  async update(id: string, data: UpdateClientData): Promise<Result<Client>> {
    const { data: clientData, error } = await supabase
      .from('clients')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return failure(new DuplicatedEmailError(data.email || ''));
      }
      return failure(error);
    }

    return success(this.fromEntity(clientData));
  }

  async findByEmail(email: string): Promise<Result<Client | null>> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) return failure(error);
    return success(data ? this.fromEntity(data) : null);
  }

  async findById(id: string): Promise<Result<Client | null>> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) return failure(error);
    return success(data ? this.fromEntity(data) : null);
  }

  async list(params: ListClientsParams): Promise<Result<ListClientsResult>> {
    const { page, pageSize, q } = params;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;

    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' });

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }

    query = query.order('created_at', { ascending: false }).range(startIndex, endIndex);

    const { data, error, count } = await query;

    if (error) return failure(error);

    const clients = data.map(this.fromEntity);
    return success({ clients, total: count || 0 });
  }

  async softDelete(id: string): Promise<Result<void>> {
    const { error } = await supabase
      .from('clients')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return failure(new ClientNotFoundError(id));
    return success(undefined);
  }
}
