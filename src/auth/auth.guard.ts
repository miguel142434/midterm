import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository  } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dictator } from 'src/dictators/entities/dictator.entity';

@Injectable()
export class AutenticadorGuard implements CanActivate {

  constructor(
    @InjectRepository(Dictator)
    private dictatorRepository: Repository<Dictator>,
  ) {}

  async canActivate(context: ExecutionContext,): Promise<boolean>  {
    
    const req=context.switchToHttp().getRequest();
    const user=req.user;


    if (!user || !user.name) {
      throw new UnauthorizedException('No estás autenticado o falta el nombre de usuario');
    }


    const dictator = await this.dictatorRepository.findOne({ where: { name: user.name }, });


    if (!dictator) {
      throw new UnauthorizedException('No eres un dictator registrado');
    }

    return true;

  }
}