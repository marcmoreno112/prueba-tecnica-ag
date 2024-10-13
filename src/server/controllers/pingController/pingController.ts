import { type Request, type Response } from "express";

const pingController = (req: Request, res: Response) => {
  const status = 200;
  const message = "🏓 Pong";

  res.status(status).json({ message });
};

export default pingController;
