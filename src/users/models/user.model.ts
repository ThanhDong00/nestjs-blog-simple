import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/common/constants/enum';
import { Post } from 'src/posts/models/post.model';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: Role.User,
  })
  declare role: Role;

  @HasMany(() => Post)
  posts: Post[];
}
