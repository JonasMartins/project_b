import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BaseEntity,
} from "typeorm";
import { v4 } from "uuid";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export abstract class Base extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Field()
    @CreateDateColumn()
    public createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    public updatedAt!: Date;

    @BeforeInsert()
    addId() {
        this.id = v4();
    }
}
