import { LoggedInUser } from './../decorators/loggedin-user.decorator';
import { PostCreateDTO } from './dto/post-create.dto';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Post as TypePost, User } from '@prisma/client';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import QueryBuilder from 'prisma-query-builder';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // implement crud operations using prisma service
  // get posts and allow filtering and sorting and pagination
  @Get('/')
  async getPosts(@Query() query: any): Promise<TypePost[]> {
    const queryBuilder = new QueryBuilder(query);
    return await this.postsService.getPosts(
      queryBuilder.filter().sort().paginate().build(),
    );
  }

  // get post by id
  @Get('/:id')
  async getPost(id: string): Promise<TypePost> {
    return await this.postsService.getPost(id);
  }

  // create post
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createPost(
    @Body() data: PostCreateDTO,
    @LoggedInUser() user: User,
  ): Promise<TypePost> {
    const input: any = data;
    this.handlePostRelationsInput(data, input);
    return await this.postsService.createPost(input, user);
  }

  // update post
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: Partial<PostCreateDTO>,
  ): Promise<TypePost> {
    const input: any = data;
    this.handlePostRelationsInput(data, input);
    return await this.postsService.updatePost(id, input);
  }

  // like a post
  @UseGuards(JwtAuthGuard)
  @Post('/:id/like')
  async likePost(
    @Param('id') id: string,
    @LoggedInUser() user: User,
  ): Promise<TypePost> {
    try {
      return await this.postsService.likePost(id, user);
    } catch (error) {
      // handle error and display proper http response
      throw new ConflictException(error.message);
    }
  }

  // like a post with post id based as body param
  @UseGuards(JwtAuthGuard)
  @Post('/like')
  async likePostWithPostId(
    @Body() body: { id: string },
    @LoggedInUser() user: User,
  ): Promise<TypePost> {
    try {
      return await this.postsService.likePost(body.id, user);
    } catch (error) {
      // handle error and display proper http response
      throw new ConflictException(error.message);
    }
  }

  // unlike a post
  @UseGuards(JwtAuthGuard)
  @Post('/:id/unlike')
  async unlikePost(
    @Param('id') id: string,
    @LoggedInUser() user: User,
  ): Promise<TypePost> {
    try {
      return await this.postsService.unlikePost(id, user);
    } catch (error) {
      // handle error and display proper http response
      throw new ConflictException(error.message);
    }
  }

  // unlike a post with post id based as body param
  @UseGuards(JwtAuthGuard)
  @Post('/unlike')
  async unlikePostWithPostId(
    @Body() body: { id: string },
    @LoggedInUser() user: User,
  ): Promise<TypePost> {
    try {
      return await this.postsService.unlikePost(body.id, user);
    } catch (error) {
      // handle error and display proper http response
      throw new ConflictException(error.message);
    }
  }

  private handlePostRelationsInput(data: Partial<PostCreateDTO>, input: any) {
    if (data.categories) {
      input.categories = {
        connect: data.categories.map((category) => ({
          id: category,
        })),
      };
    }
    if (data.tags) {
      input.tags = {
        connectOrCreate: data.tags.map((tag) => ({
          where: {
            name: tag,
          },
          create: {
            name: tag,
          },
        })),
      };
    }
  }
}
