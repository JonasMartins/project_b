"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 4000;
app.get("/", (_req, res) => {
    res.send("Hello World!");
});
app.listen(4000, () => {
    console.log("Graphql server now up at port 4000");
});
//# sourceMappingURL=server.js.map