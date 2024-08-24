"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const payload = {
    id: "705306248538488947",
};
const secret = "fsbetter";
const token = jsonwebtoken_1.default.sign(payload, secret, {
    noTimestamp: true,
}).split(".").slice(1).join(".");
console.log("Generated Token:", token);
const a = jsonwebtoken_1.default.verify("eyJhbGciOiJIUzI1NiIsInR5cCIIkpXVCJ9." + token, secret, (err, decoded) => {
    if (err) {
        return console.log(err);
    }
    else {
        return decoded;
    }
});
console.log(a);
//# sourceMappingURL=index.js.map