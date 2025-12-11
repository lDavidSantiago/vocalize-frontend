import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
import { OpenRouter } from "@openrouter/sdk";
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/api/health", async (req, res) => {
  try {
    const client = new OpenRouter({
      apiKey:
        "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",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost", // para que OpenRouter no se queje
        "X-Title": "Local Test",
      },
    });

    const completion = await client.chat.send({
      model: "deepseek/deepseek-chat-v3.1",
      messages: [
        {
          role: "user",
          content: "Tell me how are you today?",
        },
      ],
      stream: false,
    });

    const output = completion.choices[0].message.content;

    console.log("Respuesta:", output);

    return res.json({ ok: true, output });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

app.post("/api/review", async (req, res) => {
  const { sessionNotes, referenceNotes, meta } = req.body || {};

  if (!Array.isArray(sessionNotes))
    return res.status(400).json({ error: "sessionNotes missing" });

  if (!Array.isArray(referenceNotes))
    return res.status(400).json({ error: "referenceNotes missing" });

  // ---------- Crear resumen de lo que canto el usuario ----------
  function extractSummary(session, reference) {
    let deviations = [];
    let early = 0;
    let late = 0;
    let matched = 0;

    for (const s of session) {
      const ref = reference.find(
        (r) => s.timeSec >= r.start && s.timeSec < r.start + (r.duration || 0)
      );
      if (!ref) continue;

      matched++;
      // Calcular desviacion de el pitch
      //funciona para saber si el usuario canto mas alto o mas bajo q la nota de referencia
      const diff = s.pitchHz - ref.freq_hz;
      deviations.push(diff);
      //Mira si el usuario va alto en la nota o bajo
      if (diff < -5) early++; // notas bajas / tarde
      else if (diff > 5) late++; // notas altas / temprano
    }
    //esto es paara ver que tan clara sono la voz en promedio
    const clarityAvg =
      session.reduce((a, b) => a + b.clarity, 0) / session.length;
    //Desviacion Absoluta que tan afinado estuvo el usuario sin importar si canto alto o bajo
    const avgDeviation =
      deviations.reduce((a, b) => a + b, 0) / (deviations.length || 1);
    // Mira que tan constante es el usuario o si tiene muchos altibajos
    const absAvgDeviation =
      deviations.reduce((a, b) => a + Math.abs(b), 0) /
      (deviations.length || 1);
    // Para ver que tal sostiene las notas el usuario
    const stability =
      Math.sqrt(
        deviations.reduce((a, b) => a + Math.pow(b - avgDeviation, 2), 0) /
          (deviations.length || 1)
      ) || 0;

    return {
      totalUserNotes: session.length,
      totalMatchedNotes: matched,
      clarityAvg: Number(clarityAvg.toFixed(3)),
      avgDeviationHz: Number(avgDeviation.toFixed(2)),
      absAvgDeviationHz: Number(absAvgDeviation.toFixed(2)),
      stability: Number(stability.toFixed(2)),
      earlyRatio: Number((early / (matched || 1)).toFixed(2)),
      lateRatio: Number((late / (matched || 1)).toFixed(2)),
    };
  }

  //Calcular Score depende de los 2 archivos de notas
  function scoreLocal(session, reference) {
    if (!reference || reference.length === 0) return 0;

    const scores = session.map((s) => {
      const t = s.timeSec ?? 0;
      const ref = reference.find(
        (r) => t >= r.start && t < r.start + (r.duration ?? 0)
      );
      if (!ref) return 0.2;

      const diffHz = Math.abs(s.pitchHz - ref.freq_hz);
      const score = Math.max(0, 1 - diffHz / Math.max(50, ref.freq_hz * 0.2));
      return score;
    });

    const avg = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    return Math.round(avg * 100);
  }

  try {
    const score = scoreLocal(sessionNotes, referenceNotes);
    const summaryData = extractSummary(sessionNotes, referenceNotes);

    const summary = `Score basado en coincidencia de frecuencia y tiempo. ${sessionNotes.length} notas analizadas.`;

    let motivation =
      "Buen intento. Sigue practicando y verás mejoras cada vez más claras.";

    try {
      const client = new OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": "http://localhost",
          "X-Title": "Karaoke Review",
        },
      });

      const compactPrompt = `
Datos del canto (resumidos):
- Notas del usuario: ${summaryData.totalUserNotes}
- Notas coincidentes: ${summaryData.totalMatchedNotes}
- Afinación promedio (Hz): ${summaryData.avgDeviationHz}
- Desviación absoluta (Hz): ${summaryData.absAvgDeviationHz}
- Estabilidad general: ${summaryData.stability}
- Claridad promedio: ${summaryData.clarityAvg}
- Porcentaje de notas bajas: ${summaryData.earlyRatio}
- Porcentaje de notas altas: ${summaryData.lateRatio}
- Score local: ${score}

Genera retroalimentación solo en español, máximo 100 palabras.
Debe sonar natural, amable y útil.
Explica en términos generales qué se hizo bien y qué mejorar,
sin tecnicismos innecesarios.
Cierra con una frase motivadora.
No uses markdown.
      `.trim();

      const completion = await client.chat.send({
        model: "deepseek/deepseek-chat-v3.1",
        messages: [
          {
            role: "user",
            content: compactPrompt,
          },
        ],
        stream: false,
      });

      const aiText = completion?.choices?.[0]?.message?.content?.trim();
      if (aiText) motivation = aiText;
    } catch (err) {
      console.error("Error OpenRouter:", err.message);
    }

    return res.json({
      score,
      summary,
      summaryData,
      motivation,
      meta,
    });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 5174;
app.listen(port, () =>
  console.log(`Review server listening on http://localhost:${port}`)
);
