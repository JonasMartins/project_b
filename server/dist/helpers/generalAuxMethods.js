"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericError = void 0;
const genericError = (field, method, path, message) => {
    let arrError = [];
    let err = {
        field: "",
        message: "",
        method: "",
    };
    if (!field || !method) {
        err = {
            field: "-",
            message: "Must pass field, method and path, as arguments",
            method: "-",
        };
    }
    else {
        err = {
            field,
            message: message + ` Field: ( ${field} ) at, ${path}`,
            method,
        };
    }
    arrError.push(err);
    return arrError;
};
exports.genericError = genericError;
//# sourceMappingURL=generalAuxMethods.js.map