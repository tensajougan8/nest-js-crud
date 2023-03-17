import { Sequelize } from 'sequelize-typescript';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'host.docker.internal',
        port: 32768,
        username: 'postgres',
        password: 'postgrespw',
        database: 'nest',
      });
      sequelize.addModels([User, Post]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
