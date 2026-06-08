import React, { useState, useEffect, useRef } from "react";

// ============ DATA ============
// Categories of phrases/words. Finnish (fi) -> French (fr) + phonetic hint (hint)
const CATEGORIES = [
  {
    id: "tervehdykset",
    title: "Tervehdykset",
    sub: "Salutations",
    icon: "👋",
    items: [
      { fi: "Hei", fr: "Bonjour", hint: "bon-žuur" },
      { fi: "Hyvää iltaa", fr: "Bonsoir", hint: "bon-suaar" },
      { fi: "Näkemiin", fr: "Au revoir", hint: "o re-vuaar" },
      { fi: "Kiitos", fr: "Merci", hint: "mer-sii" },
      { fi: "Ole hyvä", fr: "S'il vous plaît", hint: "sil vu ple" },
      { fi: "Anteeksi", fr: "Pardon", hint: "par-don" },
      { fi: "Kyllä", fr: "Oui", hint: "ui" },
      { fi: "Ei", fr: "Non", hint: "non" },
      { fi: "Mitä kuuluu?", fr: "Ça va ?", hint: "sa va" },
      { fi: "Hyvää, kiitos", fr: "Ça va bien, merci", hint: "sa va bjen mer-sii" },
    ],
  },
  {
    id: "ravintola",
    title: "Ravintola",
    sub: "Restaurant",
    icon: "🍽️",
    items: [
      { fi: "Pöytä kahdelle", fr: "Une table pour deux", hint: "yn tabl pur dö" },
      { fi: "Ruokalista, kiitos", fr: "La carte, s'il vous plaît", hint: "la kart sil vu ple" },
      { fi: "Saanko tilata?", fr: "Je peux commander ?", hint: "že pö ko-man-de" },
      { fi: "Tämän, kiitos", fr: "Ceci, s'il vous plaît", hint: "sö-sii sil vu ple" },
      { fi: "Lasku, kiitos", fr: "L'addition, s'il vous plaît", hint: "la-di-sjon sil vu ple" },
      { fi: "Se oli hyvää", fr: "C'était délicieux", hint: "se-te de-li-sjö" },
      { fi: "Olen kasvissyöjä", fr: "Je suis végétarien", hint: "že sui ve-že-ta-rjen" },
      { fi: "Vettä, kiitos", fr: "De l'eau, s'il vous plaît", hint: "dö lo sil vu ple" },
    ],
  },
  {
    id: "kahvi",
    title: "Kahvi",
    sub: "Café",
    icon: "☕",
    items: [
      { fi: "Kahvi", fr: "Un café", hint: "an ka-fe" },
      { fi: "Maitokahvi", fr: "Un café au lait", hint: "an ka-fe o le" },
      { fi: "Cappuccino", fr: "Un cappuccino", hint: "an ka-pu-tši-no" },
      { fi: "Tee", fr: "Un thé", hint: "an te" },
      { fi: "Kuuma suklaa", fr: "Un chocolat chaud", hint: "an šo-ko-la šo" },
      { fi: "Croissant", fr: "Un croissant", hint: "an krua-san" },
      { fi: "Sokeria?", fr: "Du sucre ?", hint: "dy sykr" },
      { fi: "Terassille", fr: "En terrasse", hint: "an te-ras" },
    ],
  },
  {
    id: "juomat",
    title: "Juomat",
    sub: "Boissons",
    icon: "🍷",
    items: [
      { fi: "Vesi", fr: "De l'eau", hint: "dö lo" },
      { fi: "Punaviini", fr: "Du vin rouge", hint: "dy van ruž" },
      { fi: "Valkoviini", fr: "Du vin blanc", hint: "dy van blan" },
      { fi: "Lasi viiniä", fr: "Un verre de vin", hint: "an ver dö van" },
      { fi: "Olut", fr: "Une bière", hint: "yn bjer" },
      { fi: "Mehu", fr: "Un jus", hint: "an žy" },
      { fi: "Kuohuvesi", fr: "De l'eau gazeuse", hint: "dö lo ga-zöz" },
      { fi: "Kippis!", fr: "Santé !", hint: "san-te" },
    ],
  },
  {
    id: "perus",
    title: "Hyödylliset",
    sub: "Phrases utiles",
    icon: "💬",
    items: [
      { fi: "Puhutko englantia?", fr: "Parlez-vous anglais ?", hint: "par-le vu an-gle" },
      { fi: "En ymmärrä", fr: "Je ne comprends pas", hint: "že nö kom-pran pa" },
      { fi: "Paljonko se maksaa?", fr: "C'est combien ?", hint: "se kom-bjen" },
      { fi: "Missä on...?", fr: "Où est... ?", hint: "u e" },
      { fi: "Vessa", fr: "Les toilettes", hint: "le tua-let" },
      { fi: "Auta!", fr: "Au secours !", hint: "o sö-kuur" },
      { fi: "En tiedä", fr: "Je ne sais pas", hint: "že nö se pa" },
      { fi: "Hetki vain", fr: "Un instant", hint: "an an-stan" },
    ],
  },
  {
    id: "numerot",
    title: "Numerot",
    sub: "Nombres",
    icon: "🔢",
    items: [
      { fi: "Yksi", fr: "Un", hint: "an" },
      { fi: "Kaksi", fr: "Deux", hint: "dö" },
      { fi: "Kolme", fr: "Trois", hint: "trua" },
      { fi: "Neljä", fr: "Quatre", hint: "katr" },
      { fi: "Viisi", fr: "Cinq", hint: "sank" },
      { fi: "Kuusi", fr: "Six", hint: "sis" },
      { fi: "Seitsemän", fr: "Sept", hint: "set" },
      { fi: "Kahdeksan", fr: "Huit", hint: "üit" },
      { fi: "Yhdeksän", fr: "Neuf", hint: "nöf" },
      { fi: "Kymmenen", fr: "Dix", hint: "dis" },
    ],
  },
];

// ============ AUDIO ============
// Notes on why audio fails in browsers:
// - getVoices() is often empty on first load; voices arrive async via onvoiceschanged.
// - iOS Safari keeps speech muted until the FIRST utterance fires inside a real tap.
// - Some engines silently drop an utterance if one is already queued, so we cancel first.
function useSpeech() {
  const voiceRef = useRef(null);
  const [voiceCount, setVoiceCount] = useState(0);
  const [hasFrench, setHasFrench] = useState(false);
  const [supported, setSupported] = useState(true);
  const [speakingId, setSpeakingId] = useState(null); // which item is talking
  const unlockedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const synth = window.speechSynthesis;
    const refresh = () => {
      const voices = synth.getVoices();
      setVoiceCount(voices.length);
      const fr = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("fr"));
      voiceRef.current = fr || null;
      setHasFrench(!!fr);
    };
    refresh();
    synth.onvoiceschanged = refresh;
    // Some browsers populate voices a beat late even without the event.
    const t = setInterval(refresh, 500);
    setTimeout(() => clearInterval(t), 4000);
    return () => {
      clearInterval(t);
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text, id) => {
    if (!window.speechSynthesis) return;
    const synth = window.speechSynthesis;

    // iOS unlock: a near-silent priming utterance on the very first tap.
    if (!unlockedRef.current) {
      unlockedRef.current = true;
      const warm = new SpeechSynthesisUtterance(" ");
      warm.volume = 0;
      try { synth.speak(warm); } catch (e) {}
    }

    synth.cancel(); // clear anything stuck in the queue

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    if (voiceRef.current) u.voice = voiceRef.current;
    u.rate = 0.8;
    u.pitch = 1;
    u.volume = 1;
    u.onstart = () => setSpeakingId(id ?? text);
    u.onend = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);

    // Small delay lets cancel() settle on Chrome/Android before the real speak.
    setTimeout(() => {
      try { synth.speak(u); } catch (e) { setSpeakingId(null); }
    }, 60);
  };

  return { speak, supported, hasFrench, voiceCount, speakingId };
}

// ============ APP ============
export default function App() {
  const [view, setView] = useState("home"); // home | list | quiz
  const [active, setActive] = useState(null);
  const { speak, supported, hasFrench, voiceCount, speakingId } = useSpeech();

  const accent = "#1f4ed8";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(170deg,#fdfbf7 0%,#f4eee3 100%)",
        fontFamily: "'Georgia', serif",
        color: "#2b2620",
        maxWidth: 520,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Flag stripe */}
      <div style={{ display: "flex", height: 6 }}>
        <div style={{ flex: 1, background: "#0055A4" }} />
        <div style={{ flex: 1, background: "#fff" }} />
        <div style={{ flex: 1, background: "#EF4135" }} />
      </div>

      {view === "home" && (
        <Home
          onOpen={(c) => {
            setActive(c);
            setView("list");
          }}
          onQuiz={() => setView("quiz")}
          accent={accent}
          speak={speak}
          supported={supported}
          hasFrench={hasFrench}
          voiceCount={voiceCount}
          speakingId={speakingId}
        />
      )}

      {view === "list" && active && (
        <PhraseList
          cat={active}
          onBack={() => setView("home")}
          speak={speak}
          accent={accent}
          speakingId={speakingId}
        />
      )}

      {view === "quiz" && (
        <Quiz onBack={() => setView("home")} speak={speak} accent={accent} />
      )}
    </div>
  );
}

function Home({ onOpen, onQuiz, accent, speak, supported, hasFrench, voiceCount, speakingId }) {
  const testId = "__test__";
  return (
    <div style={{ padding: "28px 20px 40px" }}>
      <p style={{ margin: 0, letterSpacing: 3, fontSize: 12, color: "#a08c6a", fontFamily: "system-ui" }}>
        SUOMI → RANSKA
      </p>
      <h1 style={{ fontSize: 38, margin: "4px 0 2px", fontWeight: 400 }}>Bonjour</h1>
      <p style={{ margin: "0 0 22px", color: "#7a7060", fontStyle: "italic" }}>
        Ranskaa matkaa varten · alusta alkaen
      </p>

      {/* Audio check card — always visible so sound problems aren't silent */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #ecdfc6",
          borderRadius: 14,
          padding: "12px 14px",
          fontSize: 13,
          fontFamily: "system-ui",
          color: "#6b5f49",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span style={{ fontWeight: 600 }}>Äänitesti</span>
          <button
            onClick={() => speak("Bonjour, ça va ?", testId)}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "8px 14px",
              background: speakingId === testId ? "#2f9e44" : accent,
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {speakingId === testId ? "🔊 Puhuu…" : "▶︎ Testaa ääni"}
          </button>
        </div>
        {!supported && (
          <p style={{ margin: "8px 0 0", color: "#c0392b" }}>
            Selain ei tue ääntä. Avaa sovellus Safarilla (iPhone) tai Chromella (Android).
          </p>
        )}
        {supported && !hasFrench && (
          <p style={{ margin: "8px 0 0" }}>
            Ranskan ääntä ei löytynyt ({voiceCount} ääntä). Android: Asetukset → Kieli →
            Tekstistä puheeksi → lisää ranska. Sovellus yrittää silti puhua.
          </p>
        )}
        {supported && hasFrench && (
          <p style={{ margin: "8px 0 0", color: "#2f9e44" }}>
            Ranskan ääni valmis. Paina “Testaa ääni”.
          </p>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => onOpen(c)}
            style={{
              textAlign: "left",
              border: "none",
              borderRadius: 16,
              padding: "16px 14px",
              background: "#fff",
              boxShadow: "0 2px 14px rgba(80,60,20,0.07)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 28 }}>{c.icon}</div>
            <div style={{ fontSize: 17, marginTop: 6 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: "#a08c6a", fontStyle: "italic" }}>{c.sub}</div>
          </button>
        ))}
      </div>

      <button
        onClick={onQuiz}
        style={{
          marginTop: 18,
          width: "100%",
          border: "none",
          borderRadius: 16,
          padding: "16px",
          background: accent,
          color: "#fff",
          fontSize: 17,
          fontFamily: "Georgia, serif",
          cursor: "pointer",
        }}
      >
        🎯 Harjoittele (visa)
      </button>
    </div>
  );
}

function PhraseList({ cat, onBack, speak, accent, speakingId }) {
  return (
    <div style={{ padding: "20px 20px 50px" }}>
      <BackBar onBack={onBack} title={cat.title} sub={cat.sub} accent={accent} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cat.items.map((it, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "14px 16px",
              boxShadow: "0 2px 12px rgba(80,60,20,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#a08c6a", fontFamily: "system-ui" }}>{it.fi}</div>
              <div style={{ fontSize: 21, margin: "2px 0", color: "#1a1814" }}>{it.fr}</div>
              <div style={{ fontSize: 13, color: accent, fontStyle: "italic" }}>[{it.hint}]</div>
            </div>
            <button
              onClick={() => speak(it.fr, cat.id + i)}
              aria-label="Kuuntele"
              style={{
                border: "none",
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: speakingId === cat.id + i ? "#2f9e44" : accent,
                color: "#fff",
                fontSize: 22,
                cursor: "pointer",
                flexShrink: 0,
                transition: "background .15s",
              }}
            >
              🔊
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BackBar({ onBack, title, sub, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <button
        onClick={onBack}
        style={{
          border: "none",
          background: "#fff",
          width: 42,
          height: 42,
          borderRadius: "50%",
          fontSize: 18,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(80,60,20,0.08)",
        }}
      >
        ←
      </button>
      <div>
        <div style={{ fontSize: 22 }}>{title}</div>
        <div style={{ fontSize: 13, color: "#a08c6a", fontStyle: "italic" }}>{sub}</div>
      </div>
    </div>
  );
}

function Quiz({ onBack, speak, accent }) {
  const allItems = CATEGORIES.flatMap((c) => c.items);
  const [q, setQ] = useState(() => makeQuestion(allItems));
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  function makeQuestion(pool) {
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const options = [correct];
    while (options.length < 3) {
      const r = pool[Math.floor(Math.random() * pool.length)];
      if (!options.find((o) => o.fr === r.fr)) options.push(r);
    }
    return { correct, options: options.sort(() => Math.random() - 0.5) };
  }

  function choose(opt) {
    if (picked) return;
    setPicked(opt);
    setScore((s) => ({ right: s.right + (opt.fr === q.correct.fr ? 1 : 0), total: s.total + 1 }));
    speak(q.correct.fr);
  }

  function next() {
    setPicked(null);
    setQ(makeQuestion(allItems));
  }

  return (
    <div style={{ padding: "20px 20px 50px" }}>
      <BackBar onBack={onBack} title="Harjoittele" sub={`Pisteet ${score.right}/${score.total}`} accent={accent} />

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "26px 20px",
          textAlign: "center",
          boxShadow: "0 2px 14px rgba(80,60,20,0.07)",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 13, color: "#a08c6a", fontFamily: "system-ui" }}>Mitä ranskaksi on:</div>
        <div style={{ fontSize: 30, margin: "8px 0" }}>{q.correct.fi}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.options.map((opt, i) => {
          const isCorrect = picked && opt.fr === q.correct.fr;
          const isWrongPick = picked && opt === picked && opt.fr !== q.correct.fr;
          return (
            <button
              key={i}
              onClick={() => choose(opt)}
              style={{
                border: "none",
                borderRadius: 14,
                padding: "16px",
                fontSize: 20,
                fontFamily: "Georgia, serif",
                cursor: picked ? "default" : "pointer",
                background: isCorrect ? "#2f9e44" : isWrongPick ? "#e03131" : "#fff",
                color: isCorrect || isWrongPick ? "#fff" : "#2b2620",
                boxShadow: "0 2px 10px rgba(80,60,20,0.06)",
              }}
            >
              {opt.fr}
            </button>
          );
        })}
      </div>

      {picked && (
        <button
          onClick={next}
          style={{
            marginTop: 20,
            width: "100%",
            border: "none",
            borderRadius: 16,
            padding: "16px",
            background: accent,
            color: "#fff",
            fontSize: 18,
            fontFamily: "Georgia, serif",
            cursor: "pointer",
          }}
        >
          Seuraava →
        </button>
      )}
    </div>
  );
}
