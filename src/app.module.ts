import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './event/event.controller';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EventsModule, PrismaModule],
  controllers: [AppController, EventController],
  providers: [AppService],
})
export class AppModule {}
