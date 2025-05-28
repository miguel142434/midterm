import { Contestant } from "src/contestants/entities/contestant.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Dictator')
export class Dictator {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        nullable: false,
        unique: true,
    })
    name: string;

    @Column('varchar', {
        nullable: false,
        default: "Denver Colorado",
    })
    territory: string;

    @Column('int', {
        nullable: false,
        default: 1  
    })
    number_of_slaves: number; 
    
    @Column('int', {
        nullable: false,
        default: 1, 
    })
    loyalty_to_carolina: number;

    @OneToMany(() => Contestant, (contestant) => contestant.dictator)
    contestants: Contestant[];

    @OneToMany(() => Transaction, (transaction) => transaction.buyer_id)
    transactionsAsBuyer: Transaction[];

    @OneToMany(() => Transaction, (transaction) => transaction.seller_id)
    transactionsAsSeller: Transaction[];

    @Column('varchar', {
        nullable: true,
        unique: true,
    })
    email: string;

    @Column('varchar', {
        nullable: true,
    })
    password: string;

    @Column('timestamp', { 
        default: () => 'CURRENT_TIMESTAMP' 
    })
    created_at: Date;
}