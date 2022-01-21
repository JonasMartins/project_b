import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 } from "uuid";
import argon2 from "argon2";

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
                `INSERT INTO public.user (id, name, email, password) VALUES ('${generatedId}', 'Richard', 'richard@email.com', '${argon2.hash(
                    "pb_richard"
                )}' );`
            );

            generatedId = v4();
            this.createdUsers.push(generatedId);
            await queryRunner.query(
                `INSERT INTO public.user (id, name, email, password) VALUES ('${generatedId}', 'Paul', 'paul@email.com', '${argon2.hash(
                    "pb_paul"
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
