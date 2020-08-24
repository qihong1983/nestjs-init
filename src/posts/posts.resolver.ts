import { UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Mutation, Args, Context, Resolver, Query, Int} from '@nestjs/graphql';
import { Post,PaginatedPost } from './post.entity';
// import { Post } from './post.entity';
import { Comment } from '../comments/comment.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { CreateCommentInput } from '../comments/dto/create-comment.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';





@Resolver()
export class PostsResolver  {
// export class PostsResolver  {
  constructor(private readonly postsService: PostsService) {
    
  }

  // @Query(() => [Post], { nullable: 'items' })
  @Query(() => PaginatedPost)
  
  async getPosts(@Args({ name: 'offset', type: () => Int }) offset: number,@Args({ name: 'limit', type: () => Int }) limit: number) {
   

    console.log(111);
    // return {
    //   edges:[{
    //     "id": 1,
    //     "body": "xiaohong"
    //   },
    //   {
    //     "id": 2,
    //     "body": "xiaohong"
    //   },
    //   {
    //     "id": 3,
    //     "body": "xiaohong"
    //   }],
    //   totalCount:100
    // };

    // return {
    //   edges:[{
    //     "id": 1,
    //     "body": "xiaohong"
    //   },
    //   {
    //     "id": 2,
    //     "body": "xiaohong2"
    //   }],
    //   totalCount:100
    // };

    return await this.postsService.all(offset,limit);
  }

  @Query(() => Post)
  async getPost(@Args({ name: 'id', type: () => Int }) id: number) {
    return await this.postsService.one(id);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('data') createPostData: CreatePostInput,
    @Context() context: any,
  ): Promise<Post> {
    const { user } = context.req;
    return await this.postsService.createPost(createPostData, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Context() context: any,
  ): Promise<boolean> {
    const { user } = context.req;
    return await this.postsService.deletePost(id, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteComment(
    @Args({ name: 'commentId', type: () => Int }) id: number,
    @Context() context: any,
  ): Promise<boolean> {
    const { user } = context.req;
    return await this.postsService.deleteComment(id, user);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('data') updatePostData: UpdatePostInput,
    @Context() context: any,
  ): Promise<Post> {
    const { user } = context.req;
    return await this.postsService.updatePost(id, updatePostData, user);
  }

  @Mutation(() => Comment)
  @UseGuards(GqlAuthGuard)
  async createComment(
    @Args({ name: 'postId', type: () => Int }) postId: number,
    @Args('data') createCommentData: CreateCommentInput,
    @Context() context: any,
  ): Promise<Comment> {
    const { user } = context.req;
    return await this.postsService.createComment(
      postId,
      createCommentData,
      user,
    );
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async likePost(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Context() context: any,
  ): Promise<Post> {
    const { user } = context.req;
    return await this.postsService.likePost(id, user);
  }
}
