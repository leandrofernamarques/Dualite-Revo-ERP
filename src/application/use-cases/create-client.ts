import { Client, CreateClientData } from '@/domain/entities/client';
import { ClientRepository } from '@/domain/repositories/client-repository';
import { EmailVO } from '@/domain/value-objects/email';
import { PhoneVO } from '@/domain/value-objects/phone';
import { DuplicatedEmailError } from '@/domain/errors/client-errors';
import { Result, success, failure } from '@/domain/types/result';

export class CreateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(data: CreateClientData, userId: string): Promise<Result<Client>> {
    try {
      const email = EmailVO.create(data.email);
      const phone = data.phone ? PhoneVO.create(data.phone) : undefined;

      const existingResult = await this.clientRepository.findByEmail(email.getValue());
      
      if (!existingResult.success) {
        return failure(existingResult.error);
      }

      if (existingResult.data) {
        return failure(new DuplicatedEmailError(email.getValue()));
      }

      const result = await this.clientRepository.create({
        name: data.name.trim(),
        email: email.getValue(),
        phone: phone?.getValue(),
      }, userId);

      return result;
    } catch (error) {
      return failure(error as Error);
    }
  }
}
