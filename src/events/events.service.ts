import { Injectable, Post } from '@nestjs/common';
import { ReserveSpotDto } from './dto/reserve-spot-dto';

import { TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}
  @Post()
  async create(createEventDto: CreateEventDto) {
    return await this.prismaService.event.create({
      data: createEventDto,
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: { id },
    });
  }

  update(id: string) {
    return this.prismaService.event.update({
      where: { id },
      data: { name: 'updated name' },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id },
    });
  }
  //select * from spot where name in ('spot1', 'spot2');
  async reserveSpot(dto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: dto.eventId,
        name: {
          in: dto.spots,
        },
      },
    });
    if (spots.length !== dto.spots.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpotsName = dto.spots.filter(
        (spot) => !foundSpotsName.includes(spot),
      );
      throw new Error(`Spots not found: ${notFoundSpotsName.join(', ')}`);
    }
    this.prismaService.reservationHistory.createMany({
      data: spots.map((spot) => ({
        spotId: spot.id,
        email: dto.email,
        ticketKind: dto.ticket_kind,
        status: TicketStatus.reserved,
      })),
    });
    await this.prismaService.spot.updateMany({
      where: {
        id: {
          in: spots.map((spot) => spot.id),
        },
      },
      data: {
        status: TicketStatus.reserved,
      },
    });
    const tickets = await Promise.all(
      spots.map((spot) => {
        this.prismaService.ticket.create({
          data: {
            spotId: spot.id,
            email: dto.email,
            ticketKind: dto.ticket_kind,
          },
        });
      }),
    );
    return tickets;
  }
}
