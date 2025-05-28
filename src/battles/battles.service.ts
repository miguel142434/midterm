import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from './entities/battle.entity';
import { CreateBattleDto } from './dto/create-battle.dto';
import { ContestantsService } from '../contestants/contestants.service';
import { ContestantStatus } from '../contestants/entities/contestant.entity';

@Injectable()
export class BattlesService {
    constructor(
        @InjectRepository(Battle)
        private battleRepository: Repository<Battle>,
        private contestantsService: ContestantsService,
    ) {}

    async create(createBattleDto: CreateBattleDto): Promise<Battle> {
        await this.contestantsService.findOne(createBattleDto.contestant_1_id);
        await this.contestantsService.findOne(createBattleDto.contestant_2_id);

        const battle = this.battleRepository.create(createBattleDto);

        if (createBattleDto.date) {
            battle.date = createBattleDto.date;
        }

        return this.battleRepository.save(battle);
    }

    async findAll(): Promise<Battle[]> {
        return this.battleRepository.find({
            order: {
                date: 'DESC',
            },
        });
    }

    async findOne(id: string): Promise<Battle> {
        const battle = await this.battleRepository.findOne({ where: { id } });
        if (!battle) {
            throw new NotFoundException(`Battle with ID "${id}" not found`);
        }
        return battle;
    }

    async update(id: string, updateBattleDto: Partial<CreateBattleDto>): Promise<Battle> {
        const battle = await this.findOne(id);
        this.battleRepository.merge(battle, updateBattleDto);
        return this.battleRepository.save(battle);
    }

    async remove(id: string): Promise<void> {
        const result = await this.battleRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Battle with ID "${id}" not found`);
        }
    }

    async endBattle(id: string, winnerId: string, deathOccurred: boolean, injuries?: string): Promise<Battle> {
        const battle = await this.findOne(id);
        
        
        battle.winner_id = winnerId;
        battle.death_occurred = deathOccurred;
        battle.injuries = injuries || null;
        
        
        await this.contestantsService.incrementWins(winnerId);
        
        const loserId = battle.contestant_1_id === winnerId 
            ? battle.contestant_2_id 
            : battle.contestant_1_id;
        
        if (deathOccurred) {
            
            await this.contestantsService.update(loserId, { status: ContestantStatus.DEAD });
        } else {
            await this.contestantsService.incrementLosses(loserId);
        }
        
        return this.battleRepository.save(battle);
    }
}