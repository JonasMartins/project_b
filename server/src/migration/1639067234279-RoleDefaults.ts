import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 } from "uuid";

export class RoleDefaults1639067234279 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.role (id, name, code, description) 
            VALUES ('${v4()}', 'Admin', '99999', 'The blog administrator.' );
        
            INSERT INTO public.role (id, name, code, description) 
            VALUES ('${v4()}', 'User', '00001', 'A commom blog user.' );
        
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM public.role;`);
    }
}
