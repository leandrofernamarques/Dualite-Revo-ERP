import { ClientRepository } from '@/domain/repositories/client-repository';
import { ClientNotFoundError } from '@/domain/errors/client-errors';
import { Result, success, failure } from '@/domain/types/result';

export class SoftDeleteClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(id: string): Promise<Result<void>> {
    const existingResult = await this.clientRepository.findById(id);
    
    if (!existingResult.success) {
      return failure(existingResult.error);
    }

    if (!existingResult.data) {
      return failure(new ClientNotFoundError(id));
    }

    return await this.clientRepository.softDelete(id);
  }
}
