import { Client, UpdateClientData } from '@/domain/entities/client';
import { ClientRepository } from '@/domain/repositories/client-repository';
import { EmailVO } from '@/domain/value-objects/email';
import { PhoneVO } from '@/domain/value-objects/phone';
import { DuplicatedEmailError, ClientNotFoundError } from '@/domain/errors/client-errors';
import { Result, success, failure } from '@/domain/types/result';

export class UpdateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(id: string, data: UpdateClientData): Promise<Result<Client>> {
    try {
      // Verificar se cliente existe
      const existingResult = await this.clientRepository.findById(id);
      
      if (!existingResult.success) {
        return failure(existingResult.error);
      }

      if (!existingResult.data) {
        return failure(new ClientNotFoundError(id));
      }

      const updateData: UpdateClientData = {};

      // Validar dados se fornecidos
      if (data.name !== undefined) {
        updateData.name = data.name.trim();
      }

      if (data.email !== undefined) {
        const email = EmailVO.create(data.email);
        
        // Verificar e-mail único se mudou
        if (email.getValue() !== existingResult.data.email.getValue()) {
          const duplicateResult = await this.clientRepository.findByEmail(email.getValue());
          
          if (!duplicateResult.success) {
            return failure(duplicateResult.error);
          }

          if (duplicateResult.data) {
            return failure(new DuplicatedEmailError(email.getValue()));
          }
        }
        
        updateData.email = email.getValue();
      }

      if (data.phone !== undefined) {
        if (data.phone) {
          const phone = PhoneVO.create(data.phone);
          updateData.phone = phone.getValue();
        } else {
          updateData.phone = undefined;
        }
      }

      const result = await this.clientRepository.update(id, updateData);
      return result;
    } catch (error) {
      return failure(error as Error);
    }
  }
}
