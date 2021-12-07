"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const user_entity_1 = require("./../database/entity/user.entity");
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const class_validator_1 = require("class-validator");
const errorFieldHandler_1 = require("./../helpers/errorFieldHandler");
const generalAuxMethods_1 = require("./../helpers/generalAuxMethods");
let UserValidator = class UserValidator {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserValidator.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserValidator.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserValidator.prototype, "password", void 0);
UserValidator = __decorate([
    (0, type_graphql_1.InputType)()
], UserValidator);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [errorFieldHandler_1.ErrorFieldHandler], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    getUserById(id, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(user_entity_1.User, { id });
            if (!user) {
                return {
                    errors: (0, generalAuxMethods_1.genericError)("id", "getUserById", __filename, `Could not found user with id: ${id}`),
                };
            }
            return { user };
        });
    }
    createUser(options, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield em.create(user_entity_1.User, {
                    name: options.name,
                    email: options.email,
                    password: options.password,
                });
                yield user.save();
                return { user };
            }
            catch (e) {
                return {
                    errors: (0, generalAuxMethods_1.genericError)("-", "createUser", __filename, `Could not create the user, details: ${e.message}`),
                };
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUserById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserValidator, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
UserResolver = __decorate([
    (0, typedi_1.Service)(),
    (0, type_graphql_1.Resolver)(() => user_entity_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map