// make sure provided value is unique in the database using prisma
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator';
import { PrismaService } from '../prisma.service';

@ValidatorConstraint({ name: 'IsUnique', async: false })
@Injectable()
export class IsUnique implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: string, args: ValidationArguments) {
    if (
      !args.constraints ||
      !args.constraints[0] ||
      !args.constraints[0].model
    ) {
      throw new Error('Model is not specified in first constraint');
    }

    const exists = await this.prisma[args.constraints[0].model].findUnique({
      where: { [args.property]: value },
    });
    return !exists;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists`;
  }
}
