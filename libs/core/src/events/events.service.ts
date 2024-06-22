import { Injectable, Post } from '@nestjs/common';
import { ReserveSpotDto } from './dto/reserve-spot-dto';

import { Prisma, TicketStatus } from '@prisma/client';
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

    try {
      const tickets = this.prismaService.$transaction(
        async (prisma) => {
          prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              email: dto.email,
              ticketKind: dto.ticket_kind,
              status: TicketStatus.reserved,
            })),
          });
          await prisma.spot.updateMany({
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
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  email: dto.email,
                  ticketKind: dto.ticket_kind,
                },
              });
            }),
          );
          return tickets;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        },
      );
      return tickets;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new Error('unique constraint violation');
          case 'P2034':
            throw new Error('transaction conflict');
          default:
            throw error;
        }
      }
    }
  }
}
