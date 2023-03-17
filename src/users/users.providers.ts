import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '../constants/constants';

export const UsersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
