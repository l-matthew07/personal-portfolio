import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        server: {
            configureServer(server) {
                server.middlewares.use(async (req, res, next) => {
                    if (req.url === '/api/spotify/playlists') {
                        try {
                            const clientId = env.SPOTIFY_CLIENT_ID;
                            const clientSecret = env.SPOTIFY_CLIENT_SECRET;

                            if (!clientId || !clientSecret) {
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: 'Spotify credentials missing in .env' }));
                                return;
                            }

                            // 1. Get Access Token
                            const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
                                },
                                body: 'grant_type=client_credentials',
                            });
                            const tokenData = await tokenResponse.json();
                            const accessToken = tokenData.access_token;

                            // 2. Fetch user playlists (ly1kg3wleyfvkw7bq3a5lklzp)
                            const userId = 'ly1kg3wleyfvkw7bq3a5lklzp';
                            const playlistsResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                                headers: {
                                    'Authorization': 'Bearer ' + accessToken,
                                },
                            });
                            const playlistsData = await playlistsResponse.json();

                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(playlistsData.items || []));
                        } catch (error) {
                            console.error('Spotify API Error:', error);
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: 'Failed to fetch Spotify playlists' }));
                        }
                    } else {
                        next();
                    }
                });
            },
        },
    };
});
