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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserInput = exports.CreateUserInput = exports.User = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
let User = class User {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)()
], User);
exports.User = User;
let CreateUserInput = class CreateUserInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], CreateUserInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], CreateUserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], CreateUserInput.prototype, "password", void 0);
CreateUserInput = __decorate([
    (0, type_graphql_1.InputType)()
], CreateUserInput);
exports.CreateUserInput = CreateUserInput;
let UpdateUserInput = class UpdateUserInput {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.Length)(5, 100),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "password", void 0);
UpdateUserInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateUserInput);
exports.UpdateUserInput = UpdateUserInput;
//# sourceMappingURL=user.schema.js.map