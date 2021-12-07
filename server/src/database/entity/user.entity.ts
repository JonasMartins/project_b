import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@Entity()
export class User extends Base {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;
}
