import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));


app.post("/api/review", async (req, res) => {
  const { sessionNotes, referenceNotes, meta } = req.body || {};

  if (!Array.isArray(sessionNotes)) return res.status(400).json({ error: "sessionNotes missing" });


  const apiKey = process.env.GEMINI_API_KEY;
  const configuredUrl = process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate";

  if (apiKey) {
    try {

      const prompt = `Compara las notas de canto del usuario con las notas de referencia y devuelve SOLAMENTE un objeto JSON con las siguientes claves:\n- score: número entre 0 y 100\n- summary: texto corto que explique brevemente la evaluación\n- motivation: una frase motivadora en español de menos de 75 palabras, enfocada en animar al usuario según la puntuación\n\nSessionNotes:\n${JSON.stringify(sessionNotes)}\n\nReferenceNotes:\n${JSON.stringify(referenceNotes)}\n\nDevuelve SOLO JSON con esas claves (score, summary, motivation).`;


      let finalUrl = configuredUrl;
      if (!finalUrl.includes("?")) {
        finalUrl = `${finalUrl}?key=${encodeURIComponent(apiKey)}`;
      } else if (!finalUrl.includes("key=")) {
        finalUrl = `${finalUrl}&key=${encodeURIComponent(apiKey)}`;
      }


      const body = {
        prompt: { text: prompt },
        temperature: 0.2,
        maxOutputTokens: 512,
      };

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const respJson = await response.json();
s
      let textOutput = null;
      if (respJson?.candidates && Array.isArray(respJson.candidates) && respJson.candidates.length > 0) {

        textOutput = respJson.candidates[0].output || respJson.candidates[0].content || respJson.candidates[0].text;
      }
      if (!textOutput && typeof respJson?.output === "string") textOutput = respJson.output;
      if (!textOutput && typeof respJson?.result === "string") textOutput = respJson.result;
      if (!textOutput && respJson?.candidates && respJson.candidates.length > 0 && typeof respJson.candidates[0] === "string") textOutput = respJson.candidates[0];


      if (!textOutput) textOutput = JSON.stringify(respJson);


      try {
        const parsed = JSON.parse(textOutput);
        return res.json(parsed);
      } catch (err) {

        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed2 = JSON.parse(jsonMatch[0]);
            return res.json(parsed2);
          } catch (err2) {

          }
        }

        return res.json({ score: 0, summary: String(textOutput), motivation: "Sigue practicando — cada intento te acerca más a tu objetivo." });
      }
    } catch (err) {
      return res.status(500).json({ error: String(err) });
    }
  }


  try {
    function scoreLocal(session, reference) {
      if (!reference || reference.length === 0) return 0;

      const scores = session.map((s) => {
        const t = s.timeSec ?? 0;
        const ref = reference.find((r) => t >= r.start && t < r.start + (r.duration ?? 0));
        if (!ref) return 0.2; 
        const diffHz = Math.abs(s.pitchHz - ref.freq_hz);

        const score = Math.max(0, 1 - diffHz / Math.max(50, ref.freq_hz * 0.2));
        return score;
      });
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return Math.round(avg * 100);
    }

    const score = scoreLocal(sessionNotes, referenceNotes || []);

    const summary = `Score basado en coincidencia de frecuencia y tiempo. ${sessionNotes.length} notas analizadas.`;

    let motivation = "Sigue practicando — cada intento te acerca más a tu objetivo.";
    if (score >= 95) {
      motivation = "¡Excelente trabajo! Tu afinación y timing fueron sobresalientes. Mantén esta constancia y seguirás mejorando.";
    } else if (score >= 85) {
      motivation = "Muy buen desempeño — se nota progreso. Pulir pequeños detalles te llevará al siguiente nivel.";
    } else if (score >= 70) {
      motivation = "Buen intento — tienes una base sólida. Practica las notas difíciles y verás mejoras rápidas.";
    } else if (score >= 50) {
      motivation = "Buen esfuerzo. Concéntrate en la entonación y el ritmo; con práctica verás resultados.";
    } else {
      motivation = "No te desanimes. Empieza con ejercicios sencillos de afinación y ritmo, y vuelve a intentarlo paso a paso.";
    }

    return res.json({ score, summary, motivation });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 5174;
app.listen(port, () => console.log(`Review server listening on http://localhost:${port}`));
