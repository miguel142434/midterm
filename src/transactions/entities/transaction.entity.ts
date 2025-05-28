import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Dictator } from 'src/dictators/entities/dictator.entity';

export enum TransactionStatus {
    COMPLETED = 'Completed',
    FAILED = 'Failed',
    DISCOVERED = 'Discovered'
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    buyer_id: string;

    @Column('uuid')
    seller_id: string;

    @ManyToOne(() => Dictator, dictator => dictator.transactionsAsBuyer)
    @JoinColumn({ name: 'buyer_id' })
    buyer: Dictator;

    @ManyToOne(() => Dictator, dictator => dictator.transactionsAsSeller)
    @JoinColumn({ name: 'seller_id' })
    seller: Dictator;

    @Column('varchar', {
        nullable: false
    })
    item: string;

    @Column('decimal', {
        precision: 10,
        scale: 2
    })
    amount: number;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.COMPLETED
    })
    status: TransactionStatus;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
}
