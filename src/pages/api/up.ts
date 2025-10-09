import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  pong: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ pong: '', error: 'Method not allowed' });
  }

  const { ping } = req.body;

  if (ping === 'Ping') {
    return res.status(200).json({ pong: 'Pong' });
  }

  return res.status(200).json({ pong: 'Pong' });
}
