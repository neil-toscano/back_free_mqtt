import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaceInput } from './dto/create-place.input';
import { UpdatePlaceInput } from './dto/update-place.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { PlaceImage } from './entities/place-image.entity';
import { SearchPlaceInput } from './dto/search-place.input';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Injectable()
export class PlaceService {
  private readonly logger = new Logger(PlaceService.name);

  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(PlaceImage)
    private readonly imageRepository: Repository<PlaceImage>,
    private readonly datasource: DataSource,
  ) {}

  async create(createPlaceInput: CreatePlaceInput, user: User) {
    try {
      const {
        images = [],

        ...placeDetails
      } = createPlaceInput;

      const placeImages = images.map((imageUrl) =>
        this.imageRepository.create({ url: imageUrl }),
      );

      const place = this.placeRepository.create({
        ...placeDetails,
        user,
      });

      place.images = placeImages;

      const todo = await this.placeRepository.save(place);
      return todo;
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async findAll(paginationArgs: PaginationArgs): Promise<Place[]> {
    const { limit, offset } = paginationArgs;

    try {
      const places = await this.placeRepository
        .createQueryBuilder('place')
        .leftJoinAndSelect('place.images', 'images') // Agrega las relaciones aquí
        .take(limit)
        .skip(offset)
        .getMany();
  
      return places;
    } catch (error) {
      throw new InternalServerErrorException('Something bad happened');
    }

   
  }

  async findMyPlaces(user: User): Promise<Place[]> {
    try {
      const places = await this.placeRepository.find({
        relations: { images: true },
        where: {
          user: {
            id: user.id,
          },
        },
      });
      return places;
    } catch (error) {
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async findByTerm(searchPlaceInput: SearchPlaceInput) {
    if (JSON.stringify(searchPlaceInput) === '{}')
      throw new NotFoundException('Debes enviar mínimo un término de filtro');

    const queryBuilder = this.placeRepository.createQueryBuilder('place');
    queryBuilder.leftJoinAndSelect('place.images', 'image');
    let isFirstCondition = true;

    Object.entries(searchPlaceInput).forEach(([key, value]) => {
      switch (key) {
        case 'titleText':
          if (isFirstCondition) {
            queryBuilder.where(
              new Brackets((qb) => {
                qb.where(
                  'similarity(LOWER(place.titleText), LOWER(:titleText)) >= 0.1',
                  {
                    titleText: value.toLowerCase(),
                  },
                ).orWhere('LOWER(place.titleText) LIKE LOWER(:titleText)', {
                  titleText: `%${value.toLowerCase()}%`,
                });
              }),
            );
            isFirstCondition = false;
          } else {
            queryBuilder.andWhere(
              'LOWER(place.titleText) LIKE LOWER(:titleText)',
              {
                titleText: `%${value.toLowerCase()}%`,
              },
            );
          }
          break;

        case 'typeEvent':
          if (isFirstCondition) {
            queryBuilder.where('place.typeEvent = :typeEvent', {
              typeEvent: value,
            });
            isFirstCondition = false;
          } else {
            queryBuilder.andWhere('place.typeEvent = :typeEvent', {
              typeEvent: value,
            });
          }
          break;

        case 'dateEventStart':
          if (isFirstCondition) {
            queryBuilder.where('place.dateEventStart >= :dateEventStart', {
              dateEventStart: value,
            });
            isFirstCondition = false;
          } else {
            queryBuilder.andWhere('place.dateEventStart >= :dateEventStart', {
              dateEventStart: value,
            });
          }
          break;

        case 'dateEventEnd':
          if (isFirstCondition) {
            queryBuilder.where('place.dateEventEnd <= :dateEventEnd', {
              dateEventEnd: value,
            });
            isFirstCondition = false;
          } else {
            queryBuilder.andWhere('place.dateEventEnd <= :dateEventEnd', {
              dateEventEnd: value,
            });
          }
          break;

        default:
          break;
      }
    });
    return queryBuilder.getMany();
  }

  async findByTermTest(searchPlaceInput: SearchPlaceInput) {
    if (JSON.stringify(searchPlaceInput) === '{}') {
      throw new NotFoundException('Debes enviar mínimo un término de filtro');
    }

    const queryBuilder = this.placeRepository.createQueryBuilder('place');

    if (searchPlaceInput.dateEventStart) {
      queryBuilder.where('place.dateEventStart >= :dateEventStart', {
        dateEventStart: searchPlaceInput.dateEventStart,
      });
    }
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Place> {
    const place = await this.placeRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        images: true,
      },
    });
    if (!place) throw new NotFoundException(`Place with id ${id} not found`);
    return place;
  }

  async update(id: string, updatePlaceInput: UpdatePlaceInput) {
    const { images, ...toUpdate } = updatePlaceInput;
    const place = await this.placeRepository.preload({
      id: id,
      ...toUpdate,
    });

    if (!place) throw new NotFoundException(`Place with id ${id} not found`);
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(PlaceImage, { place: { id } });
        place.images = images.map((imageUrl) =>
          this.imageRepository.create({ url: imageUrl }),
        );
      }

      await queryRunner.manager.save(place);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException('error');
    }
  }

  async remove(id: string) {
    const place = await this.findOne(id);
    await this.placeRepository.remove(place);
    return `this action removes  #${id} place`;
  }
}
