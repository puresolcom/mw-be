import { PrismaService } from './prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IsUnique } from './validators/unique.validator';
import { PostsModule } from './posts/posts.module';
import { UploaderModule } from './uploader/uploader.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, UploaderModule, CategoriesModule, TagsModule],
  controllers: [AppController],
  providers: [PrismaService, AppService, IsUnique],
})
export class AppModule {}
