import { NextApiRequest, NextApiResponse } from 'next';
import { AuthorizationCode } from 'simple-oauth2';
import {GATEWAY_ENDPOINTS} from '../../../constants/api';
const client = new AuthorizationCode({
  client: {
    id: process.env.GOOGLE_CLIENT_ID!,
    secret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  auth: {
    tokenHost: 'https://oauth2.googleapis.com',
    tokenPath: '/token',
    authorizeHost: 'https://accounts.google.com',
    authorizePath: '/o/oauth2/v2/auth',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state } = req.query;

    // Lấy base URL từ request headers
    const isProduction = process.env.NODE_ENV === 'production';
    const protocol = isProduction ? (req.headers['x-forwarded-proto'] || 'https') : 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    if (!code) {
      // Redirect to Google OAuth
      const authorizationUri = client.authorizeURL({
        redirect_uri: `${baseUrl}/api/auth/google`,
        scope: 'openid email profile',
        state: 'random_state',
      });
      return res.redirect(authorizationUri);
    }

    // Exchange code for token
    const tokenParams = {
      code: code as string,
      redirect_uri: `${baseUrl}/api/auth/google`,
    };

    const accessToken = await client.getToken(tokenParams);

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken.token.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    const backendResponse = await fetch(`${GATEWAY_ENDPOINTS.GOOGLE_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: accessToken.token.access_token,
        email: userInfo.email,
        name: userInfo.name,
        google_id: userInfo.id,
        picture: userInfo.picture,
      }),
    });

    if (!backendResponse.ok) {
      throw new Error('Backend authentication failed');
    }

    const authData = await backendResponse.json();

    // Redirect với token trong URL hash để client-side lưu vào localStorage
    res.redirect(`/dashboard#token=${authData.token || authData.accessToken}`);

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect('/login?error=oauth_failed');
  }
}