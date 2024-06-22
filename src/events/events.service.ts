import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@
@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}
  async create(createEventDto: CreateEventDto) {
    return await this.prismaService.event.create({
      data: createEventDto,
    });
  }

  findAll() {
    return `This action returns all events`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
