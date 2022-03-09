import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 } from "uuid";
import bcrypt from "bcrypt";

export class CreatingInitialUsers1642787828247 implements MigrationInterface {
    public createdUsers: string[] = [];

    public async up(queryRunner: QueryRunner): Promise<void> {
        const role = await queryRunner.query(
            "SELECT id FROM public.role WHERE name like '%User%'; "
        );
        let generatedId = "";
        if (role[0].id) {
            generatedId = v4();
            this.createdUsers.push(generatedId);
            await queryRunner.query(
                `INSERT INTO public.user (id, name, email, password) VALUES ('${generatedId}', 'Admin', 'admin@email.com', '${bcrypt.hash(
                    "pb_admin",
                    10
                )}' );`
            );

            generatedId = v4();
            this.createdUsers.push(generatedId);
            await queryRunner.query(
                `INSERT INTO public.user (id, name, email, password) VALUES ('${generatedId}', 'Richard', 'richard@email.com', '${bcrypt.hash(
                    "pb_richard",
                    10
                )}' );`
            );

            generatedId = v4();
            this.createdUsers.push(generatedId);
            await queryRunner.query(
                `INSERT INTO public.user (id, name, email, password) VALUES ('${generatedId}', 'Paul', 'paul@email.com', '${bcrypt.hash(
                    "pb_paul",
                    10
                )}' );`
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (this.createdUsers.length) {
            this.createdUsers.forEach(async (id) => {
                await queryRunner.query(`
                    DELETE FROM public.user WHERE id = '${id}'
                `);
            });
        }
    }
}
