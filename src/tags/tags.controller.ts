import { Controller, Get } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/')
  getCategories(): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
