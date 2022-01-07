import { Injectable } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostsService {
  // implement crud operations using prisma service
  constructor(private readonly prisma: PrismaService) {}

  // get posts and allow filtering and sorting and pagination
  async getPosts(query): Promise<Post[]> {
    return await this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        likes: true,
      },
      ...query,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // get post by id
  async getPost(id: string): Promise<Post> {
    return await this.prisma.post.findFirst({
      where: { id },
    });
  }

  // create post
  async createPost(data: Prisma.PostCreateInput, user?: User): Promise<Post> {
    // if user logged in then set user id from request
    if (user) {
      data.author = { connect: { id: user.id } };
    }
    return await this.prisma.post.create({ data });
  }

  // update post
  async updatePost(id: string, data: Prisma.PostUpdateInput): Promise<Post> {
    return await this.prisma.post.update({
      where: { id },
      data,
    });
  }

  // delete post
  async deletePost(id: string): Promise<Post> {
    return await this.prisma.post.delete({
      where: { id },
    });
  }

  // like a post
  async likePost(id: string, user: User): Promise<Post> {
    // check if post already liked by user
    const post = await this.prisma.post.findFirst({
      where: { id },
      include: { likes: true },
    });
    if (post.likes.some((like) => like.userId === user.id)) {
      throw new Error('Post already liked');
    }

    return await this.prisma.post.update({
      where: { id },
      data: {
        likes: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
        likesCount: {
          increment: 1,
        },
      },
    });
  }

  // unlike a post and decrement likes count by 1
  async unlikePost(id: string, user: User): Promise<Post> {
    // check if post already liked by user
    const post = await this.prisma.post.findFirst({
      where: { id },
      include: { likes: true },
    });
    if (!post.likes.some((like) => like.userId === user.id)) {
      throw new Error('Post not liked');
    }
    // get and delete likes by user id
    const likes = await this.prisma.like.findMany({
      where: {
        user: {
          id: user.id,
        },
        post: {
          id,
        },
      },
    });

    await this.prisma.like.deleteMany({
      where: {
        id: {
          in: likes.map((like) => like.id),
        },
      },
    });

    return await this.prisma.post.update({
      where: { id },
      data: {
        likesCount: {
          decrement: 1,
        },
      },
    });
  }
}
