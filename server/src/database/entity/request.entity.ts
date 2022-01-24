import { Field, ObjectType } from "type-graphql";
import { Base } from "./base.entity";
import { Column, Entity, ManyToOne, JoinTable } from "typeorm";
import { User } from "./user.entity";
import { RequestValidator } from "./../validators/request.validator";

@ObjectType()
@Entity()
export class Request extends Base {
    @Field(() => User)
    @ManyToOne(() => User, (user) => user.requests)
    @JoinTable()
    public requestor: User;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.invitations)
    @JoinTable()
    public requested: User;

    @Field(() => Boolean, { nullable: true })
    @Column({ nullable: true })
    public accepted: Boolean;

    @Column({ name: "requestor_id" })
    public requestorId: string;

    @Column({ name: "requested_id" })
    public requestedId: string;

    constructor(body?: RequestValidator) {
        super();
        if (body) {
            this.requestedId = body.requestedId;
            this.requestorId = body.requestedId;
        }
    }
}
