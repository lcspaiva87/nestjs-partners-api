import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { SpotsService } from './spots.service';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Body() createSpotDto: CreateSpotDto,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.create({
      ...createSpotDto,
      eventId,
    });
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':spotId')
  findOne(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.findOne(spotId, eventId);
  }

  @Patch(':spotId')
  update(
    @Param('spotId') spotId: string,
    @Body() updateSpotDto: UpdateSpotDto,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.update(spotId, eventId, updateSpotDto);
  }

  @Delete(':spotId')
  remove(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.remove(spotId, eventId);
  }
}
