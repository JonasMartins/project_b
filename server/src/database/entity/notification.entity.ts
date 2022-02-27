import { Field, ObjectType } from "type-graphql";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Notification extends Base {
    @Field(() => User)
    @ManyToOne(() => User, (user) => user.nofiticationsCreated)
    @JoinTable()
    public creator: User;

    @Field(() => String)
    @Column()
    public description!: string;

    @Field(() => [User])
    @ManyToMany(() => User, (user) => user.relatedNotifications, {
        nullable: true,
        cascade: true,
    })
    @JoinTable({
        name: "user_notifications_notification",
        joinColumns: [{ name: "notification_id" }],
        inverseJoinColumns: [{ name: "user_id" }],
    })
    public relatedUsers!: User[];

    @Field(() => [String])
    @Column({ type: "text", array: true, default: [] })
    public userSeen: string[];
}
