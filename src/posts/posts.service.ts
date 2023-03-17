import { Inject, Injectable } from '@nestjs/common';
import { POST_REPOSITORY } from 'src/constants/constants';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly PostRepository: typeof Post,
  ) {}
  async create(createPostDto: CreatePostDto, userID: number):Promise<Post> {
    return await this.PostRepository.create<Post>({ ...createPostDto, userID });
  }

  async findAll() {
    return await this.PostRepository.findAndCountAll<Post>({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
      offset: 0,
      limit: 10,
    });
  }

  async findOne(id: number): Promise<Post> {
    return await this.PostRepository.findOne({
      where: { id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto, userID: number) {
    const [numberOfAffectedRows, [updatedPost]] =
      await this.PostRepository.update(
        { ...updatePostDto },
        { where: { id, userID }, returning: true },
      );
    return { numberOfAffectedRows, updatedPost };
  }

  remove(id: string, userID: number) {
    return this.PostRepository.destroy({ where: { id, userID } });
  }
}
