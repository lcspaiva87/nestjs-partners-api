import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EventsController } from './events/events.controller';
import { EventsModule } from './events/events.module';
import { EventsService } from './events/events.service';
import { PrismaModule } from './prisma/prisma.module';
import { SpotsModule } from './spots/spots.module';

@Module({
  imports: [EventsModule, PrismaModule, SpotsModule],
  controllers: [AppController, EventsController],
  providers: [AppService, EventsService],
})
export class AppModule {}
