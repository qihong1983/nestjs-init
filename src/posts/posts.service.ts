import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Post,PaginatedPost } from './post.entity';
import { Post,PaginatedPost } from './post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { CreateCommentInput } from '../comments/dto/create-comment.input';

@Injectable()
export class PostsService {
  constructor(
    // @InjectRepository(PaginatedPost)
    // private readonly ppostsRepository: Repository<PaginatedPost>,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}


//       async all(): Promise<PaginatedPost> {

 
//         // console.log(await this.ppostsRepository.findAndCount({take: 3, skip:0}), 'this.postsRepository');
    
//         console.log(this.ppostsRepository, 'ppostsRepository');
//  return {
//       edges:[{
//         "id": 1,
//         "body": "xiaohong"
//       },
//       {
//         "id": 2,
//         "body": "xiaohong2"
//       }],
//       totalCount:100
//     };

//         // return [];
//         // return this.ppostsRepository.findAndCount({take: 3, skip:0})
//       }
// async one(id: number): Promise<Post> {
async all(offset:number, limit: number): Promise<PaginatedPost> {

 
  console.log(offset, 'offset');

  // console.log(await this.postsRepository.findAndCount({take: 3, skip:0}), 'this.postsRepository');

  let datas = await this.postsRepository.findAndCount({take: limit, skip:offset});
  

  let data = {
    edges:  datas[0],
    totalCount: datas[1]
  }
  
  

return data;

return {
        edges:[{
          "id": 1,
          "body": "qihong"
        },
        {
          "id": 2,
          "body": "xiaohong2"
        }],
        totalCount:100
      }

  return this.postsRepository.find();
}


  // async all(): Promise<Post[]> {

 
  //   console.log(await this.postsRepository.findAndCount({take: 3, skip:0}), 'this.postsRepository');


  //   return this.postsRepository.find();
  // }

  async one(id: number): Promise<Post> {
    return this.postsRepository.findOneOrFail(id, {
      relations: ['comments', 'likes'],
    });
  }

  async createPost(createPostData: CreatePostInput, user: User): Promise<Post> {
    return this.postsRepository
      .create({
        ...createPostData,
        user,
      })
      .save();
  }

  async createComment(
    postId: number,
    createCommentData: CreateCommentInput,
    user: User,
  ): Promise<Comment> {
    const post = await this.postsRepository.findOneOrFail(postId);

    return this.commentsRepository
      .create({
        ...createCommentData,
        user,
        post,
      })
      .save();
  }

  async updatePost(
    id: number,
    updatePostData: UpdatePostInput,
    user: User,
  ): Promise<Post> {
    let post = await this.postsRepository.findOneOrFail({ id, user });

    return await this.postsRepository.save({ post, ...updatePostData });
  }

  async deletePost(id: number, user: User): Promise<boolean> {
    let post = await this.postsRepository.findOneOrFail({ id, user });

    await this.postsRepository.remove(post);
    return true;
  }

  async deleteComment(id: number, user: User): Promise<boolean> {
    let comment = await this.commentsRepository.findOneOrFail({ id, user });

    await this.commentsRepository.remove(comment);
    return true;
  }

  async likePost(id: number, user: User): Promise<Post> {
    let post = await this.postsRepository.findOneOrFail(id, {
      relations: ['likes'],
    });

    if (post.likes && post.likes.find(like => like.id === user.id)) {
      post.likes = post.likes.filter(like => like.id !== user.id);
    } else {
      post.likes = [...post.likes, user];
    }

    return await this.postsRepository.save(post);
  }
}
