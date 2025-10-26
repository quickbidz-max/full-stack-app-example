const {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} = require("typeorm");

@Entity("user")
class User {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: "varchar", length: 255 })
  name;

  @Column({ type: "varchar", length: 255, unique: true })
  email;

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  userName;

  @Column({ type: "varchar", length: 255 })
  password;

  @Column({ type: "varchar", length: 255, nullable: true })
  dob;

  @Column({ type: "varchar", length: 255, nullable: true })
  phone;

  @Column({ type: "varchar", length: 255, nullable: true })
  address;

  @Column({ type: "varchar", length: 255, nullable: true })
  city;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}

module.exports = { User };
