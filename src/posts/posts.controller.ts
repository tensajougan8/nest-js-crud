import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Request,
  Put,
  UseInterceptors,
  CacheTTL,
  CacheInterceptor,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Post as PostEntity } from './entities/post.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PostEntity> {
    try {
      const post = await this.postsService.findOne(id);
      if (!post) {
        throw new NotFoundException("This Post doesn't exist");
      }
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CreatePostDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    return await this.postsService.create(createPostDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdatePostDto: UpdatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    const { numberOfAffectedRows, updatedPost } =
      await this.postsService.update(id, UpdatePostDto, req.user.id);

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }
    return updatedPost;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const deleted = await this.postsService.remove(id, req.user.id);
    if (deleted === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }
    return 'Successfully deleted';
  }
}
