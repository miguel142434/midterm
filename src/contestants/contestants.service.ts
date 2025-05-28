import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contestant } from './entities/contestant.entity';
import { CreateContestantDto } from './dto/create-contestant.dto';
import { Dictator } from 'src/dictators/entities/dictator.entity';

@Injectable()
export class ContestantsService {
  constructor(
    @InjectRepository(Contestant)
    private contestantRepository: Repository<Contestant>,

    @InjectRepository(Dictator)
    private dictatorRepository: Repository<Dictator>,
  ) {}

  async create(createContestantDto: CreateContestantDto): Promise<Contestant> {
    const { dictatorId, created_at, ...rest } = createContestantDto;

    const dictator = await this.dictatorRepository.findOne({
      where: { id: dictatorId },
    });

    if (!dictator) {
      throw new NotFoundException(`Dictator with ID "${dictatorId}" not found`);
    }

    const contestant = this.contestantRepository.create({
      ...rest,
      dictator,
      created_at: created_at ? new Date(created_at) : new Date(),
    });

    return this.contestantRepository.save(contestant);
  }

  async findAll(): Promise<Contestant[]> {
    return this.contestantRepository.find({
      relations: ['dictator'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Contestant> {
    const contestant = await this.contestantRepository.findOne({
      where: { id },
      relations: ['dictator'],
    });

    if (!contestant) {
      throw new NotFoundException(`Contestant with ID "${id}" not found`);
    }

    return contestant;
  }

  async update(id: string, updateContestantDto: Partial<CreateContestantDto>): Promise<Contestant> {
    const contestant = await this.findOne(id);

    if (updateContestantDto.dictatorId) {
      const newDictator = await this.dictatorRepository.findOne({
        where: { id: updateContestantDto.dictatorId },
      });

      if (!newDictator) {
        throw new NotFoundException(`Dictator with ID "${updateContestantDto.dictatorId}" not found`);
      }

      contestant.dictator = newDictator;
    }

    this.contestantRepository.merge(contestant, {
      ...updateContestantDto,
      dictator: contestant.dictator,
    });

    return this.contestantRepository.save(contestant);
  }

  async remove(id: string): Promise<void> {
    const result = await this.contestantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contestant with ID "${id}" not found`);
    }
  }

  async incrementWins(id: string): Promise<Contestant> {
    const contestant = await this.findOne(id);
    contestant.wins += 1;
    return this.contestantRepository.save(contestant);
  }

  async incrementLosses(id: string): Promise<Contestant> {
    const contestant = await this.findOne(id);
    contestant.losses += 1;
    return this.contestantRepository.save(contestant);
  }
}
