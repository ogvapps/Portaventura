import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Lazy Gemini client helper
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Server-side AI Companion Chat Endpoint
  app.post('/api/gemini/chat', async (req: Request, res: Response) => {
    try {
      const { message, systemInstruction, persona, userPreferences, chatHistory } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const client = getGeminiClient();

      // If Gemini API is configured, call gemini-3.7-flash
      if (client) {
        try {
          const formattedHistory = Array.isArray(chatHistory)
            ? chatHistory.slice(-8).map((msg: { sender: string; text: string }) => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
              }))
            : [];

          let contextPrompt = systemInstruction || 'Eres un asistente y guía oficial de PortAventura World.';
          if (userPreferences) {
            contextPrompt += `\n[Perfil del usuario: 
- Nombre/Apodo: ${userPreferences.visitorName || 'Aventurero'} (${userPreferences.nickname || 'Aventurero'})
- Título Honorífico: ${userPreferences.customTitle || 'Explorador del Parque'}
- Arquetipo: ${userPreferences.archetypeName || 'Explorador Legendario'}
- Rol en Grupo: ${userPreferences.personalityRole || 'Líder'}
- Altura: ${userPreferences.heightCm ? userPreferences.heightCm + ' cm' : 'No especificada'}
- Preferencia Adrenalina: ${userPreferences.adrenalinePreference}
- Preferencia Agua: ${userPreferences.waterPreference}
- Vértigo/Alturas: ${userPreferences.heightsPreference}
- Comida Favorita: ${userPreferences.favoriteParkFood || 'Churros con chocolate'}
- Objetivo del Día: ${userPreferences.visitGoal || 'Subirme a todo lo posible'}
- Lema Personal: "${userPreferences.adventureMotto || '¡Vivir cada curva al límite!'}"
Trata al usuario por su nombre o título con calidez, haz referencias a sus preferencias y comida favorita cuando sea oportuno, y ten en cuenta su altura para aconsejarle sobre restricciones de atracciones si pregunta.]`;
          }

          const response = await client.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: [
              ...formattedHistory,
              {
                role: 'user',
                parts: [{ text: message }],
              },
            ],
            config: {
              systemInstruction: contextPrompt,
              temperature: 0.9,
            },
          });

          const replyText = response.text || '¡Vaya! Algo ha ocurrido en la vía. ¿Volvemos a intentarlo?';
          res.json({ reply: replyText, source: 'gemini' });
          return;
        } catch (geminiError) {
          console.error('Gemini API call failed, falling back to intelligent knowledge base:', geminiError);
          // Fall back gracefully to the built-in intelligent park companion engine
        }
      }

      // Intelligent built-in companion response generator (Fallback when offline or key not yet active)
      const fallbackReply = generateFallbackCompanionResponse(message, persona, userPreferences);
      res.json({ reply: fallbackReply, source: 'smart-companion' });
    } catch (error) {
      console.error('Server error in /api/gemini/chat:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

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

// Built-in intelligent park knowledge fallback engine
function generateFallbackCompanionResponse(
  message: string,
  persona: string = 'woody',
  userPrefs?: any
): string {
  const lower = message.toLowerCase();

  // Jokes
  if (lower.includes('chiste') || lower.includes('broma') || lower.includes('risa')) {
    const jokes = [
      '¡Hehehe-he-he! ¿Por qué los trenes de montaña rusa nunca tienen secretos? ¡Porque siempre se van de la lengua en la primera caída! 🎢',
      '¿Qué le dice una tuerca de Dragon Khan a otra? "¡Agárrate fuerte, que vienen 8 inversiones seguidas!" 🐉',
      '¿Por qué el mono de Furius Baco bebe tanto zumo de uva? ¡Porque a 135 km/h no le da tiempo ni a parpadear! 🍇⚡',
      '¿Sabes cuál es el colmo de un vaquero en Stampida? ¡Tener miedo de que el caballo azul le adelante al rojo! 🤠',
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Riddles / Acertijos
  if (lower.includes('acertijo') || lower.includes('adivinanza') || lower.includes('reto') || lower.includes('enigma')) {
    const riddles = [
      '🧩 **Acertijo del Parque**: Tengo 8 loopings, ruge mi nombre en China y visto de rojo intenso desde 1995. ¿Quién soy?\n\n*(Respuesta: ¡Dragon Khan!)*',
      '🧩 **Acertijo de Altura**: Mido 76 metros de caída, toco el cielo del Tíbet y te regalo 5 colinas de gravedad cero (airtime). ¿Cuál es mi nombre?\n\n*(Respuesta: ¡Shambhala!)*',
      '🧩 **Acertijo de Fuego**: Estoy en una pirámide de México, caigo 100 metros al vacío en 3 segundos con 3 tipos de góndolas. ¿Qué coloso soy?\n\n*(Respuesta: ¡Hurakan Condor!)*',
    ];
    return riddles[Math.floor(Math.random() * riddles.length)];
  }

  // Recommendations
  if (lower.includes('recomiend') || lower.includes('cual') || lower.includes('donde') || lower.includes('ir')) {
    if (userPrefs?.adrenalinePreference === 'extrema') {
      return '💥 **Para tu nivel extremo de adrenalina:** ¡Tienes que hacer el trío legendario! **Shambhala** (76m de altura y velocidad vertiginosa), **Dragon Khan** (8 inversiones brutales) y la aceleración instantánea de **Furius Baco** (0 a 135 km/h en 3,5s). ¡Y si vas a Ferrari Land, **Red Force** es tu templo!';
    }
    if (userPrefs?.waterPreference === 'empapado') {
      return '🌊 **¡Para los amantes del agua!** No te pierdas **Tutuki Splash** en Polynesia (la gran ola volcánica), **Silver River Flume** en Far West (los troncos con doble caída) y los **Grand Canyon Rapids** para ir girando y esquivando chorros con el grupo.';
    }
    return '🌟 **Recomendación estrella para hoy:** Te aconsejo empezar por **Shambhala** y **Dragon Khan** en China cuando las colas bajan al mediodía, refrescarte en **Tutuki Splash** a primera hora de la tarde, y terminar con la expedición oscura de **Uncharted** en Far West.';
  }

  // Shambhala questions
  if (lower.includes('shambhala')) {
    return '🏔️ **Curiosidad de Shambhala:** Mide 76 metros de altura máxima, con una caída libre vertiginosa de 78 metros que entra en un túnel subterráneo a 134 km/h. Además, tiene una zona de salpicadura de agua (splash) al final que refresca la plaza.';
  }

  // Dragon Khan
  if (lower.includes('dragon khan') || lower.includes('khan')) {
    return '🐉 **Leyenda de Dragon Khan:** Cuando se inauguró en 1995 rompió el récord mundial absoluto con sus 8 inversiones consecutivas (Vertical Loop, Dive Loop, Zero-G Roll, Cobra Roll, etc.). ¡Sigue siendo una de las montañas rusas más fotografiadas de Europa!';
  }

  // Red Force / Ferrari Land
  if (lower.includes('red force') || lower.includes('ferrari')) {
    return '🏎️ **Red Force:** Es la montaña rusa más alta (112 metros) y más rápida (180 km/h en 5 segundos) de Europa. ¡La sensación en la cima del Top Hat mirando el Mediterráneo es sencillamente inigualable!';
  }

  // Persona specific default greetings
  if (persona === 'woody') {
    return '¡Hehehe-he-he! ¡Qué gran pregunta! Mientras estés en la cola, recuerda que la diversión la hacemos juntos. ¿Quieres que te cuente otro chiste o prefieres que busquemos la atracción con menos tiempo de espera ahora mismo?';
  } else if (persona === 'dragon') {
    return 'El viento de las cumbres susurra que cada minuto de espera forja el temple del verdadero aventurero. Pregúntame sobre cualquier rincón de los 7 mundos y te revelaré su historia ancestral.';
  } else if (persona === 'sheriff') {
    return '¡Howdy! Por todos los coyotes de Penitence, aquí estamos para matar el aburrimiento. Dime si quieres una adivinanza del viejo oeste o consejos para domar a los caballos de Stampida.';
  }

  return '¡Aquí estoy para acompañarte en tu aventura por PortAventura World! Pregúntame sobre curiosidades, secretos de las montañas rusas, chistes para amenizar la cola o recomendaciones personalizadas para tu visita.';
}

startServer();
