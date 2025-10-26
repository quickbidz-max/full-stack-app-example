const { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } = require('typeorm');

@Entity('product')
class Product {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'varchar', length: 255 })
  product_name;

  @Column({ type: 'text' })
  description;

  @Column({ type: 'varchar', length: 255 })
  price;

  @Column({ type: 'varchar', length: 255 })
  quantity;

  @Column({ type: 'varchar', length: 255 })
  category;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}

module.exports = { Product };
