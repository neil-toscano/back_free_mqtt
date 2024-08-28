import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from 'src/place/entities/place.entity';
import { Repository } from 'typeorm';
import { SEED_PLACES } from './data/seed-data';
import { PlaceService } from 'src/place/place.service';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly placeService: PlaceService,
  ) {}
  async executeSeed() {
    await this.deleteDatabase();
    await this.loadPlaces();
    return true;
  }

  async deleteDatabase() {
    await this.placeRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadPlaces() {
    // const places = [];
    // for (const place of SEED_PLACES) {
    //   places.push(await this.placeService.create(place));
    // }
    return;
  }
}
