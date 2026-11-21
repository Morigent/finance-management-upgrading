import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum';
import { decimalTransformer } from '../transformers/decimal.transformer';
import { Category } from './category.entity';

@Entity('transactions')
@Index('idx_transactions_transaction_date', ['transactionDate'])
@Index('idx_transactions_category_id', ['categoryId'])
@Index('idx_transactions_type', ['type'])
@Index('idx_transactions_type_date', ['type', 'transactionDate'])
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: decimalTransformer,
  })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'transaction_date', type: 'date' })
  transactionDate: string;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
