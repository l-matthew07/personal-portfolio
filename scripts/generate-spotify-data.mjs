import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const outputPath = path.join(rootDir, 'public', 'spotify-playlists.json');

const basePlaylists = [
  { id: '5rfckXYfGDYzqjGlhZ1mi0', name: 'is that the sun...' },
  { id: '7wWdbbCP8uDPw1hrHL4E2J', name: 'if good things come to those who wait' },
  { id: '18pYnnqkxH5WOdckMfuYO2', name: 'greatness or nothing' },
  { id: '3qeaGw3is8z2PEwXqGf9k2', name: 'yo dre... i got sum to say' },
  { id: '6Wwo9uCCSeweglzHciwNg7', name: 'GO FAST!!!' },
  { id: '1dv1ejVoFrfrw0npSbnAIs', name: 'i <3 soju' },
  { id: '4Gr0Q3FD53KFdvlTYi6Rvk', name: 'O Captain, my Captain!' },
  { id: '3iRdBR2spDET03IWirkxC0', name: 'Life has no meaning' },
  { id: '2zzAlissGDWEiCARjDDq0j', name: 'The last day on earth' },
  { id: '0WiWR3VxH6bY1YBV9migr0', name: 'i love the cranberries' },
  { id: '5qKtZ6cf4S5sP5iodPGX01', name: 'Life has no meaning' },
  { id: '7LCuSiv8FfGV0Z1cUnICF9', name: '🤷' },
  { id: '2B86yS7JSREKWMoUuo7qGg', name: 'cali or bust' },
  { id: '1zo1fO3azwyDyh79cDSerM', name: 'My Playlist #29' },
  { id: '3yHdDg7gUZsRiFaojCMo5J', name: 'My Playlist #28' },
  { id: '5IbjKObTsv6CY4ooA1BymC', name: 'My Playlist #27' },
  { id: '4IXaFDC4Jq7P8mmqTKGq19', name: 'My Playlist #24' },
  { id: '2QGmdCOKfVNAV7BMYaROZ5', name: 'My Playlist #21' }
];

function parseEnv(text) {
  return Object.fromEntries(
    text
      .split(/\n+/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const index = line.indexOf('=');
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );
}

function decodeHtml(text = '') {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function formatDuration(ms = 0) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mapWithConcurrency(items, limit, iteratee) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await iteratee(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

async function getAccessToken(clientId, clientSecret) {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, options);
    if (response.ok) return response;

    const retryAfter = Number(response.headers.get('retry-after')) || 0;
    const shouldRetry = response.status === 429 || response.status >= 500;
    if (!shouldRetry || attempt === retries - 1) return response;

    const backoffMs = retryAfter ? retryAfter * 1000 : 1200 * (attempt + 1);
    await sleep(backoffMs);
  }
}

async function fetchPlaylistMeta(playlistId, token) {
  const fields = [
    'name',
    'description',
    'owner(display_name)',
    'images',
    'external_urls'
  ].join(',');
  const response = await fetchWithRetry(
    `https://api.spotify.com/v1/playlists/${playlistId}?market=CA&fields=${encodeURIComponent(fields)}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!response.ok) {
    throw new Error(`Playlist metadata request failed for ${playlistId}: ${response.status}`);
  }

  return response.json();
}

async function fetchPlaylistPage(playlistId) {
  const response = await fetchWithRetry(`https://open.spotify.com/playlist/${playlistId}`);
  if (!response.ok) {
    throw new Error(`Playlist page request failed for ${playlistId}: ${response.status}`);
  }
  return response.text();
}

function extractTrackCount(html) {
  const match = html.match(/og:description" content="Playlist .*? · (\d+) items"/);
  return match ? Number(match[1]) : null;
}

async function fetchTrackPage(trackId) {
  const response = await fetchWithRetry(`https://open.spotify.com/track/${trackId}`);
  if (!response.ok) {
    throw new Error(`Track page request failed for ${trackId}: ${response.status}`);
  }
  return response.text();
}

function enrichTrackFromPage(track, html) {
  const durationMatch = html.match(/meta name="music:duration" content="(\d+)"/);
  const descriptionMatch = html.match(/meta property="og:description" content="([^"]+)"/);
  const descriptionParts = decodeHtml(descriptionMatch?.[1] || '')
    .split(' · ')
    .map(part => part.trim());

  const album = descriptionParts.length >= 2 ? descriptionParts[1] : '';
  const durationSeconds = durationMatch ? Number(durationMatch[1]) : 0;

  return {
    ...track,
    album,
    durationMs: durationSeconds * 1000,
    duration: durationSeconds ? formatDuration(durationSeconds * 1000) : ''
  };
}

function extractTracksFromHtml(html) {
  const marker = 'data-testid="track-row"';
  const positions = [];
  let startIndex = html.indexOf(marker);

  while (startIndex !== -1) {
    positions.push(startIndex);
    startIndex = html.indexOf(marker, startIndex + marker.length);
  }

  const tracks = [];
  const seen = new Set();

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = positions[i + 1] || html.length;
    const row = html.slice(start, end);

    const idMatch = row.match(/onClickHinttrack-spotify:track:([A-Za-z0-9]+)-/);
    if (!idMatch) continue;

    const id = idMatch[1];
    if (seen.has(id)) continue;
    seen.add(id);

    const hrefMatch = row.match(/href="\/track\/([A-Za-z0-9]+)"/);
    const titleMatch = row.match(/data-encore-id="listRowTitle"[^>]*>.*?<span class="e-10310-line-clamp"[^>]*>(.*?)<\/span>/s);
    const imageMatch = row.match(/<img[^>]+src="([^"]+)"/);
    const artistMatches = [...row.matchAll(/href="\/artist\/[^"]+">([^<]+)<\/a>/g)];

    tracks.push({
      id,
      uri: `spotify:track:${id}`,
      title: decodeHtml(titleMatch?.[1] || ''),
      artists: artistMatches.map(match => decodeHtml(match[1])),
      album: '',
      durationMs: 0,
      duration: '',
      trackUrl: hrefMatch ? `https://open.spotify.com/track/${hrefMatch[1]}` : '',
      albumImageUrl: imageMatch?.[1] || ''
    });
  }

  return tracks;
}

async function buildPlaylist(playlistId, token) {
  const [meta, html] = await Promise.all([
    fetchPlaylistMeta(playlistId, token),
    fetchPlaylistPage(playlistId)
  ]);

  const tracks = extractTracksFromHtml(html);
  const enrichedTracks = await mapWithConcurrency(tracks, 4, async track => {
    try {
      const trackHtml = await fetchTrackPage(track.id);
      return enrichTrackFromPage(track, trackHtml);
    } catch {
      return track;
    }
  });

  return {
    id: playlistId,
    name: meta.name,
    description: decodeHtml(meta.description || ''),
    ownerName: meta.owner?.display_name || 'Spotify',
    imageUrl: meta.images?.[0]?.url || '',
    spotifyUrl: meta.external_urls?.spotify || `https://open.spotify.com/playlist/${playlistId}`,
    totalTracks: extractTrackCount(html) || enrichedTracks.length,
    visibleTrackCount: enrichedTracks.length,
    tracks: enrichedTracks
  };
}

function buildFallbackPlaylist(basePlaylist, existingPlaylist) {
  if (existingPlaylist) return existingPlaylist;

  return {
    id: basePlaylist.id,
    name: basePlaylist.name,
    description: 'Open this playlist in Spotify to browse the full catalog.',
    ownerName: 'Matthew',
    imageUrl: '',
    spotifyUrl: `https://open.spotify.com/playlist/${basePlaylist.id}`,
    totalTracks: 0,
    visibleTrackCount: 0,
    tracks: []
  };
}

async function main() {
  const envText = await fs.readFile(envPath, 'utf8');
  const env = parseEnv(envText);
  let existingPlaylistsById = new Map();

  try {
    const existingText = await fs.readFile(outputPath, 'utf8');
    const existingData = JSON.parse(existingText);
    existingPlaylistsById = new Map((existingData.playlists || []).map(playlist => [playlist.id, playlist]));
  } catch {
    existingPlaylistsById = new Map();
  }

  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
    throw new Error('Missing Spotify credentials in .env');
  }

  const token = await getAccessToken(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
  const playlists = [];

  for (const playlist of basePlaylists) {
    try {
      playlists.push(await buildPlaylist(playlist.id, token));
    } catch (error) {
      if (existingPlaylistsById.has(playlist.id)) {
        console.warn(`Using cached playlist ${playlist.id}: ${error.message}`);
        playlists.push(existingPlaylistsById.get(playlist.id));
      } else {
        console.warn(`Using fallback playlist ${playlist.id}: ${error.message}`);
        playlists.push(buildFallbackPlaylist(playlist));
      }
    }
    await sleep(250);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    playlists
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${playlists.length} playlists to ${path.relative(rootDir, outputPath)}`);
}

main().catch(async error => {
  console.error(error.message);
  process.exitCode = 1;
});
