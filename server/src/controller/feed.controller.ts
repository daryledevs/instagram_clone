import FeedService                         from "@/service/feed/feed.service.impl";
import { NextFunction, Request, Response } from "express";

class FeedController {
  private feedService: FeedService;

  constructor(feedService: FeedService) {
    this.feedService = feedService;
  };

  public getTotalFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.feedService.getTotalFeed();
      res.status(200).send({ count: data });
    } catch (error) {
      next(error);
    };
  };

  public getUserFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { post_ids, user_id } = req.body;
      const values = post_ids.length ? post_ids : [0];
      const data = await this.feedService.getUserFeed(values, user_id);
      res.status(200).send({ feed: data });
    } catch (error) {
      next(error);
    };
  };

  public getExploreFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.body;
      const data = await this.feedService.getExploreFeed(user_id);
      res.status(200).send({ explore: data });
    } catch (error) {
      next(error);
    };
  };
};

export default FeedController;