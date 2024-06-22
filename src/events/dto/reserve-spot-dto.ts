import { TicketKind } from '@prisma/client';

export class ReserveSpotDto {
  spots: [];
  ticket_kind: TicketKind;
  email: string;
}
