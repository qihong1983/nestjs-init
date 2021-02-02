import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Base } from '../shared/base.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { Type } from '@nestjs/common';


@Entity('posts')
@ObjectType()
export class Post extends Base {
  @Column('text')
  @Field()
  body: string;

  @Column('text')
  @Field()
  body2: string;

  @Column('text')
  @Field()
  bod888: string;

  @ManyToOne(
    () => User,
    user => user.posts,
    { eager: true },
  )
  @Field(() => User)
  user: User;

  @OneToMany(
    () => Comment,
    comment => comment.post,
  )
  @Field(() => [Comment], { nullable: 'items' })
  comments: Comment[];

  @Field(() => Int)
  get commentCount() {
    return this.comments.length;
  }

  @Field(() => Int)
  get likeCount() {
    return this.likes.length;
  }

  @ManyToMany(() => User)
  @JoinTable()
  @Field(() => [User], { nullable: 'items' })
  likes: User[];

}


export function Paginated<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`)

  // abstract class EdgeType {
  //   @Field(() => String)
  //   cursor: string;

  //   @Field(() => classRef)
  //   node: T;
  // }


  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    


    @Field(() => [classRef], { nullable: true })
    edges: T;

    @Field(() => Int)
    totalCount: number;

    
  }
  return PaginatedType;
}


@ObjectType()
export class PaginatedPost extends Paginated(Post) {

}
