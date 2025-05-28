import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestantsService } from './contestants.service';
import { ContestantsController } from './contestants.controller';
import { Contestant } from './entities/contestant.entity';
import { Dictator } from 'src/dictators/entities/dictator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contestant, Dictator]),
  ],
  controllers: [ContestantsController],
  providers: [ContestantsService],
  exports: [ContestantsService],
})
export class ContestantsModule {}
