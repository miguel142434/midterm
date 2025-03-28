import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDictatorDto } from './dto/create-dictator.dto';
import { UpdateDictatorDto } from './dto/update-dictator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictator } from './entities/dictator.entity';
import { Repository } from 'typeorm';
import { Contestant } from 'src/contestants/entities/contestant.entity';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interface/JwtPayload';

@Injectable()
export class DictatorsService {
  constructor(
    @InjectRepository(Dictator)
    private readonly dictatorRepository: Repository<Dictator>,
    @InjectRepository(Contestant)
    private readonly contestantRepository: Repository<Contestant>,
    private readonly jwtService: JwtService
  ) {}
  
  async create(createDictatorDto: CreateDictatorDto) {
    const newDictator = this.dictatorRepository.create({
      ...createDictatorDto, 
      password: bcrypt.hashSync(createDictatorDto.password, 10) 
    });
    await this.dictatorRepository.save(newDictator);
    return newDictator;
  }

  private getJwtToken(jwtPayload: JwtPayload) {
    return this.jwtService.sign(jwtPayload);
  }

  async login(loginDTO: LoginDTO) {
    const { name, password } = loginDTO;
    const dictator = await this.dictatorRepository.findOneBy({ name });
    
    if (!dictator) {
      throw new NotFoundException('Usted no es un dictator, no puede ingresar a la plataforma');
    }
    
    const valid = bcrypt.compareSync(password, dictator.password);
    if (!valid) {
      throw new NotFoundException('Credenciales invalidas');
    }
    
    const jwtPayload: JwtPayload = { name };
    const token = this.getJwtToken(jwtPayload); 
    return { dictator, token };
  }
  
  findAll() {
    return this.dictatorRepository.find({ relations: ['contestants'] });
  }

  async findOne(id: string) {
    return this.dictatorRepository.findOne({
      where: { id },
      relations: ['contestants'],
    });
  }
     
  async update(id: string, updateDictatorDto: UpdateDictatorDto) {
    await this.dictatorRepository.update(id, {
      ...updateDictatorDto, 
      password: bcrypt.hashSync(updateDictatorDto.password, 10) 
    });
    await this.updateNumberOfContestants(id);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.dictatorRepository.delete(id);
  }

  async updateNumberOfContestants(id: string) {
    const dictator = await this.dictatorRepository.findOne({
      where: { id },
      relations: ['contestants'],
    });
  
    if (!dictator) {
      console.log(`Dictator ${id} no encontrado`);
      return;
    }
    
    dictator.number_of_slaves = dictator.contestants.length;
    await this.dictatorRepository.save(dictator);
  }

  async findContestantsByDictator(dictatorId: string): Promise<Contestant[]> {
    const contestants = await this.contestantRepository.find({
      where: { dictator: { id: dictatorId } },
    });
  
    return contestants;
  }
}