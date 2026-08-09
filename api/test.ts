import { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    success: true,
    message: "CrisisMind AI Vercel Serverless Function is active and working!",
    timestamp: new Date().toISOString()
  });
}
