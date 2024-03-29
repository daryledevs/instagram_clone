"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database/database"));
const database_2 = __importDefault(require("../../exception/database"));
class FollowRepository {
    async getFollowStats(user_id) {
        try {
            const queryFollowers = database_1.default
                .selectFrom("followers")
                .innerJoin("users", "followers.followed_id", "users.user_id")
                .select((eb) => [eb.fn.count("followed_id").as("followers")])
                .where("followers.followed_id", "=", user_id)
                .groupBy("followers.followed_id");
            const queryFollowing = database_1.default
                .selectFrom("followers")
                .innerJoin("users", "followers.follower_id", "users.user_id")
                .select((eb) => eb.fn.count("followers.follower_id").as("following"))
                .where("followers.follower_id", "=", user_id)
                .groupBy("followers.follower_id");
            const { followers, following } = await database_1.default
                .selectNoFrom((eb) => [
                eb.fn.coalesce(queryFollowers, eb.lit(0)).as("followers"),
                eb.fn.coalesce(queryFollowing, eb.lit(0)).as("following"),
            ])
                .executeTakeFirstOrThrow();
            return { followers, following };
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async getFollowersLists(user_id, listsId) {
        try {
            const result = await database_1.default
                .selectFrom("followers")
                .innerJoin("users", "followers.follower_id", "users.user_id")
                .where((eb) => eb.and([
                eb("followers.followed_id", "=", user_id),
                eb("followers.follower_id", "not in", listsId),
            ]))
                .selectAll()
                .limit(10)
                .execute();
            return result;
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async getFollowingLists(user_id, listsId) {
        try {
            const result = await database_1.default
                .selectFrom("followers")
                .innerJoin("users", "followers.followed_id", "users.user_id")
                .where((eb) => eb.and([
                eb("followers.follower_id", "=", user_id),
                eb("followers.followed_id", "not in", listsId),
            ]))
                .selectAll()
                .limit(10)
                .execute();
            return result;
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async isFollowUser(identifier) {
        try {
            const result = await database_1.default
                .selectFrom("followers")
                .selectAll()
                .where((eb) => eb.and([
                eb("follower_id", "=", identifier.follower_id),
                eb("followed_id", "=", identifier.followed_id),
            ]))
                .executeTakeFirst();
            return !!result;
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
    async followUser(identifier) {
        await database_1.default.insertInto("followers").values(identifier).execute();
        return "User followed successfully";
    }
    async unfollowUser(identifier) {
        try {
            await database_1.default
                .deleteFrom("followers")
                .where((eb) => eb.and([
                eb("follower_id", "=", identifier.follower_id),
                eb("followed_id", "=", identifier.followed_id),
            ]))
                .execute();
            return "User unfollowed successfully";
        }
        catch (error) {
            throw database_2.default.fromError(error);
        }
    }
}
;
exports.default = FollowRepository;
