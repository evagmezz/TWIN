import { Module } from '@nestjs/common'
import { PostService } from './services/post.service'
import { PostController } from './controller/post.controller'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { PostMapper } from './mapper/post-mapper'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Post } from './entities/post.entity'
import { User } from '../user/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { CommentModule } from '../comment/comment.module'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    CommentModule,
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(Post)
          schema.plugin(mongoosePaginate)
          return schema
        },
      },
    ]),
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      dest: './uploads',
    }),
    CacheModule.register(),
  ],
  controllers: [PostController],
  providers: [PostService, PostMapper],
})
export class PostModule {}
