"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
const kysely_1 = require("kysely");
const database_2 = __importDefault(require("../exception/database"));
class UserRepository {
    static findUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("users")
                    .where("user_id", "=", user_id)
                    .selectAll()
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("users")
                    .where("username", "like", username + "%")
                    .selectAll()
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static searchUsersByQuery(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("users")
                    .where((eb) => eb.or([
                    eb("username", "=", search + "%"),
                    eb("first_name", "=", search + "%"),
                    eb("last_name", "=", search + "%"),
                    eb((0, kysely_1.sql) `
                concat(
                  ${eb.ref("first_name")}, "", 
                  ${eb.ref("last_name")}
                )
              `, "=", search + "%"),
                ]))
                    .selectAll()
                    .execute();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("users")
                    .where("email", "=", email)
                    .selectAll()
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static findUserByCredentials(username, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield database_1.default
                    .selectFrom("users")
                    .selectAll()
                    .where((eb) => eb.or([
                    eb("email", "=", email),
                    eb("username", "=", username)
                ]))
                    .executeTakeFirst();
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static updateUser(user_id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default
                    .updateTable("users")
                    .set(user)
                    .where("user_id", "=", user_id)
                    .executeTakeFirstOrThrow();
                return yield UserRepository.findUserById(user_id);
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
    static deleteUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.default
                    .deleteFrom("users")
                    .where("user_id", "=", user_id)
                    .execute();
                return "User deleted successfully";
            }
            catch (error) {
                throw database_2.default.fromError(error);
            }
            ;
        });
    }
    ;
}
;
exports.default = UserRepository;
