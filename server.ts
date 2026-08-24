import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Cached wait times state in memory
  let cachedWaitTimesData: any = null;
  let lastWaitTimesFetchTime = 0;
  const CACHE_TTL_MS = 60 * 1000; // 1 minute

  // Live Wait Times API endpoint for PortAventura & Ferrari Land
  app.get('/api/wait-times', async (req: Request, res: Response) => {
    const now = Date.now();

    if (cachedWaitTimesData && now - lastWaitTimesFetchTime < CACHE_TTL_MS) {
      res.json(cachedWaitTimesData);
      return;
    }

    try {
      // Fetch PortAventura Park (ID: 41) and Ferrari Land (ID: 42) from queue-times.com
      const [paRes, ferrariRes] = await Promise.allSettled([
        fetch('https://queue-times.com/parks/41/queue_times.json', {
          headers: { 'User-Agent': 'PortAventuraSurveyCompanion/2.0' },
        }),
        fetch('https://queue-times.com/parks/42/queue_times.json', {
          headers: { 'User-Agent': 'PortAventuraSurveyCompanion/2.0' },
        }),
      ]);

      const mergedTimes: Record<string, any> = {};
      let isLiveOfficial = false;
      let totalOpenCount = 0;

      const processParkData = (json: any) => {
        if (!json || !json.lands) return;
        isLiveOfficial = true;
        json.lands.forEach((land: any) => {
          if (Array.isArray(land.rides)) {
            land.rides.forEach((ride: any) => {
              const rawName = (ride.name || '').toLowerCase().trim();
              const matchedId = matchRideNameToId(rawName);
              if (matchedId) {
                const isOpen = Boolean(ride.is_open);
                if (isOpen) totalOpenCount++;
                mergedTimes[matchedId] = {
                  attractionId: matchedId,
                  name: ride.name,
                  status: isOpen ? 'open' : 'closed',
                  waitMinutes: isOpen ? Math.max(0, ride.wait_time || 0) : 0,
                  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isOfficialLive: true,
                };
              }
            });
          }
        });
      };

      if (paRes.status === 'fulfilled' && paRes.value.ok) {
        const paJson = await paRes.value.json();
        processParkData(paJson);
      }

      if (ferrariRes.status === 'fulfilled' && ferrariRes.value.ok) {
        const ferrariJson = await ferrariRes.value.json();
        processParkData(ferrariJson);
      }

      const responsePayload = {
        times: mergedTimes,
        isLiveOfficial,
        openAttractionsCount: totalOpenCount,
        parkOpen: totalOpenCount > 0,
        updatedAt: new Date().toISOString(),
      };

      cachedWaitTimesData = responsePayload;
      lastWaitTimesFetchTime = now;

      res.json(responsePayload);
    } catch (error) {
      console.error('Error fetching live queue times:', error);
      res.json({
        times: {},
        isLiveOfficial: false,
        parkOpen: false,
        error: 'Failed to reach official queue provider, fallback active',
        updatedAt: new Date().toISOString(),
      });
    }
  });

  // Name normalizer to map official queue-times names to attraction IDs
  function matchRideNameToId(name: string): string | null {
    const n = name.toLowerCase();
    if (n.includes('shambhala')) return 'shambhala';
    if (n.includes('dragon khan')) return 'dragon-khan';
    if (n.includes('furius baco')) return 'furius-baco';
    if (n.includes('uncharted')) return 'uncharted';
    if (n.includes('hurakan condor') || n.includes('huracán')) return 'hurakan-condor';
    if (n.includes('stampida')) return 'stampida';
    if (n.includes('tutuki splash')) return 'tutuki-splash';
    if (n.includes('silver river')) return 'silver_river_flume';
    if (n.includes('grand canyon') || n.includes('rapids')) return 'grand-canyon-rapids';
    if (n.includes('angkor')) return 'angkor';
    if (n.includes('street mission')) return 'street-mission';
    if (n.includes('templo del fuego')) return 'templo-del-fuego';
    if (n.includes('diablo') || n.includes('tren de la mina')) return 'el-diablo';
    if (n.includes('tomahawk')) return 'tomahawk';
    if (n.includes('volpaiute')) return 'volpaiute';
    if (n.includes('serpiente')) return 'serpiente-emplumada';
    if (n.includes('crazy barrels')) return 'crazy-barrels';
    if (n.includes('wild buffalos') || n.includes('buffalos')) return 'wild-buffalos';
    if (n.includes('canoes')) return 'canoes';
    if (n.includes('tea cups') || n.includes('tazas')) return 'tea-cups';
    if (n.includes('kontiki')) return 'kontiki';
    if (n.includes('cobracha')) return 'cobracha';
    if (n.includes('potrillos')) return 'los-potrillos';
    if (n.includes('armadillos')) return 'armadillos';
    if (n.includes('carousel') || n.includes('carrusel')) return 'carousel';
    if (n.includes('tami') || n.includes('tami-tami')) return 'tami-tami';
    if (n.includes('coco piloto')) return 'coco-piloto';
    if (n.includes('granja de elmo') || n.includes('elmo')) return 'la-granja-de-elmo';
    if (n.includes('mariposas')) return 'mariposas-saltarinas';
    if (n.includes('magic fish')) return 'magic-fish';
    if (n.includes('huerto')) return 'el-huerto-encantado';
    if (n.includes('salto de blas') || n.includes('blas')) return 'el-salto-de-blas';
    if (n.includes('kiddi dragons')) return 'kiddi-dragons';
    if (n.includes('red force')) return 'red-force';
    if (n.includes('flying dreams')) return 'flying-dreams';
    if (n.includes('racing legends')) return 'racing-legends';
    if (n.includes('caida libre') || n.includes('torre caida')) return 'thrill-towers-caida';
    if (n.includes('rebote') || n.includes('torre rebote')) return 'thrill-towers-rebote';
    if (n.includes('maranello')) return 'maranello-grand-race';
    if (n.includes('junior championship')) return 'junior-championship';
    if (n.includes('flying race')) return 'flying-race';
    if (n.includes('crazy pistons')) return 'crazy-pistons';
    if (n.includes('champions race')) return 'champions-race';
    if (n.includes('pole position')) return 'pole-position-challenge';
    return null;
  }

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PortAventura Server running on http://localhost:${PORT}`);
  });
}

startServer();
