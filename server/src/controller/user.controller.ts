import UsersService                        from "../service/user/user.service.impl";
import { NextFunction, Request, Response } from "express";

class UsersController {
  private userService: UsersService;

  constructor(userService: UsersService) {
    this.userService = userService;
  };

  public getUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.body.user_id;
      const person = req.query.person || "";
      const user = await this.userService.getUserById(
        user_id,
        person as string
      );
      res.status(200).send(user);
    } catch (error) {
      next(error);
    };
  };

  public searchUsersByQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search;
      const users = await this.userService.searchUserByFields(search as string);
      res.status(200).send(users);
    } catch (error) {
      next(error);
    };
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id: any = req.params.user_id;
      const message = await this.userService.deleteUser(user_id);
      res.status(200).send(message);
    } catch (error) {
      next(error);
    };
  };

  public getFollowStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const stats = await this.userService.getFollowStats(user_id);
      res.status(200).send(stats);
    } catch (error) {
      next(error);
    };
  };

  public getRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const searches = await this.userService.getAllRecentSearches(user_id);
      res.status(200).send(searches);
    } catch (error) {
      next(error);
    };
  };

  public getFollowerFollowingLists = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const fetch = req.query.fetch;
      const listsId = req.body.listsId;
      const users = await this.userService.getFollowerFollowingLists(
        user_id,
        fetch as string,
        listsId
      );
      res.status(200).send(users);
    } catch (error) {
      next(error);
    };
  };

  public toggleFollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const followed_id = req.params.followed_id;
      const message = await this.userService.toggleFollow(user_id, followed_id);
      res.status(200).send(message);
    } catch (error) {
      next(error);
    };
  };

  public saveRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const search_user_id = req.params.searched_id;
      const message = await this.userService.saveRecentSearches(
        user_id,
        search_user_id
      );
      res.status(200).send(message);
    } catch (error) {
      next(error);
    };
  };

  public removeRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recent_id = req.params.recent_id;
      const message = await this.userService.removeRecentSearches(recent_id);
      res.status(200).send(message);
    } catch (error) {
      next(error);
    };
  };
};

export default UsersController;