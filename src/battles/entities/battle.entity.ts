import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Contestant } from '../../contestants/entities/contestant.entity';

@Entity()
export class Battle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    contestant_1_id: string;

    @Column('uuid')
    contestant_2_id: string;

    @Column('uuid', {
        nullable: true
    })
    winner_id: string;

    @Column('boolean', {
        default: false
    })
    death_occurred: boolean;

    @Column('varchar', {
        nullable: true
    })
    injuries: string | null;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    date: Date;
}