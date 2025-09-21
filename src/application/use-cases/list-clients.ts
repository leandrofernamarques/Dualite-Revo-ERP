import { ClientRepository, ListClientsParams, ListClientsResult } from '@/domain/repositories/client-repository';
import { Result } from '@/domain/types/result';

export class ListClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(params: ListClientsParams): Promise<Result<ListClientsResult>> {
    return await this.clientRepository.list(params);
  }
}
