import { Request, Response } from "express";
import { EntityManager } from "typeorm";

export type Context = {
    req: Request;
    res: Response;
    em: EntityManager;
};
