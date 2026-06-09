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
      { fi: "Hauska tavata", fr: "Enchanté", hint: "an-šan-te" },
      { fi: "Hyvää yötä", fr: "Bonne nuit", hint: "bon nüi" },
      { fi: "Tervetuloa", fr: "Bienvenue", hint: "bjen-vö-ny" },
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
      { fi: "Jälkiruoka", fr: "Le dessert", hint: "lö de-ser" },
      { fi: "Jäätelö", fr: "Une glace", hint: "yn glas" },
      { fi: "Suklaajäätelö", fr: "Une glace au chocolat", hint: "yn glas o šo-ko-la" },
      { fi: "Vaniljajäätelö", fr: "Une glace à la vanille", hint: "yn glas a la va-nij" },
      { fi: "Saanko jäätelön?", fr: "Je voudrais une glace", hint: "žö vud-re yn glas" },
      { fi: "Lisää leipää, kiitos", fr: "Encore du pain, s'il vous plaît", hint: "an-kor dy pan sil vu ple" },
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
      { fi: "Espresso", fr: "Un expresso", hint: "an eks-pre-so" },
      { fi: "Lasi vettä", fr: "Un verre d'eau", hint: "an ver do" },
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
      { fi: "Limonadi", fr: "Une limonade", hint: "yn li-mo-nad" },
      { fi: "Samppanja", fr: "Du champagne", hint: "dy šam-pañ" },
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
      { fi: "Haluaisin...", fr: "Je voudrais...", hint: "žö vud-re" },
      { fi: "Voitteko auttaa?", fr: "Pouvez-vous m'aider ?", hint: "pu-ve vu me-de" },
      { fi: "Missä on hotelli?", fr: "Où est l'hôtel ?", hint: "u e lo-tel" },
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
      { fi: "Nolla", fr: "Zéro", hint: "ze-ro" },
      { fi: "Sata", fr: "Cent", hint: "san" },
    ],
  },
];

// French -> Finnish, for reading a menu. Same {fi, fr, hint} shape; dir flips
// the display so the French word is shown first with the Finnish meaning under it.
const MENU_CATEGORIES = [
  {
    id: "menusanat",
    title: "Menun sanat",
    sub: "Le menu",
    icon: "📋",
    dir: "fr-fi",
    items: [
      { fr: "Entrée", fi: "Alkuruoka", hint: "an-tre" },
      { fr: "Plat principal", fi: "Pääruoka", hint: "pla pran-si-pal" },
      { fr: "Dessert", fi: "Jälkiruoka", hint: "de-ser" },
      { fr: "Plat du jour", fi: "Päivän annos", hint: "pla dy žuur" },
      { fr: "Formule", fi: "Kiinteän hinnan menu", hint: "for-myl" },
      { fr: "La carte", fi: "Ruokalista", hint: "la kart" },
      { fr: "Boissons", fi: "Juomat", hint: "bua-son" },
      { fr: "Saignant", fi: "Vähän paistettu (punainen)", hint: "se-ñan" },
      { fr: "À point", fi: "Medium", hint: "a puan" },
      { fr: "Bien cuit", fi: "Kypsäksi paistettu", hint: "bjen küi" },
      { fr: "Maison", fi: "Talon oma", hint: "me-zon" },
    ],
  },
  {
    id: "ruokalajit",
    title: "Ruokalajit",
    sub: "Les plats",
    icon: "🍽️",
    dir: "fr-fi",
    items: [
      { fr: "Soupe", fi: "Keitto", hint: "sup" },
      { fr: "Salade", fi: "Salaatti", hint: "sa-lad" },
      { fr: "Steak frites", fi: "Pihvi ja ranskalaiset", hint: "stek frit" },
      { fr: "Poulet", fi: "Kana", hint: "pu-le" },
      { fr: "Poisson", fi: "Kala", hint: "pua-son" },
      { fr: "Bœuf", fi: "Naudanliha", hint: "böf" },
      { fr: "Porc", fi: "Sianliha", hint: "por" },
      { fr: "Agneau", fi: "Lammas", hint: "a-ño" },
      { fr: "Jambon", fi: "Kinkku", hint: "žam-bon" },
      { fr: "Frites", fi: "Ranskalaiset", hint: "frit" },
      { fr: "Soupe à l'oignon", fi: "Sipulikeitto", hint: "sup a lo-ñon" },
      { fr: "Quiche", fi: "Suolainen piiras", hint: "kiš" },
      { fr: "Crêpe", fi: "Ohukainen (lettu)", hint: "krep" },
      { fr: "Moules", fi: "Sinisimpukat", hint: "mul" },
      { fr: "Escargots", fi: "Etanat", hint: "es-kar-go" },
    ],
  },
  {
    id: "pizza",
    title: "Pizzan täytteet",
    sub: "Garnitures de pizza",
    icon: "🍕",
    dir: "fr-fi",
    items: [
      { fr: "Fromage", fi: "Juusto", hint: "fro-maž" },
      { fr: "Mozzarella", fi: "Mozzarella", hint: "mo-tsa-re-la" },
      { fr: "Jambon", fi: "Kinkku", hint: "žam-bon" },
      { fr: "Champignons", fi: "Herkkusienet", hint: "šam-pi-ñon" },
      { fr: "Tomate", fi: "Tomaatti", hint: "to-mat" },
      { fr: "Oignon", fi: "Sipuli", hint: "o-ñon" },
      { fr: "Olives", fi: "Oliivit", hint: "o-liiv" },
      { fr: "Poivron", fi: "Paprika", hint: "pua-vron" },
      { fr: "Anchois", fi: "Anjovis", hint: "an-šua" },
      { fr: "Chorizo", fi: "Chorizo-makkara", hint: "šo-ri-zo" },
      { fr: "Roquette", fi: "Rucola", hint: "ro-ket" },
      { fr: "Basilic", fi: "Basilika", hint: "ba-zi-lik" },
      { fr: "Crème fraîche", fi: "Ranskankerma", hint: "krem freš" },
      { fr: "Lardons", fi: "Pekonisuikaleet", hint: "lar-don" },
      { fr: "Reine", fi: "Kinkku, herkkusieni & juusto", hint: "ren" },
      { fr: "Quatre fromages", fi: "Neljä juustoa", hint: "katr fro-maž" },
      { fr: "Merguez", fi: "Mausteinen lammasmakkara", hint: "mer-gez" },
    ],
  },
];

// Flatten a category list into searchable rows tagged with their category.
const flatten = (cats) =>
  cats.flatMap((c) =>
    c.items.map((it, i) => ({
      ...it,
      catId: c.id,
      catTitle: c.title,
      catIcon: c.icon,
      dir: c.dir,
      key: c.id + i,
    }))
  );
const ALL_PHRASES = flatten(CATEGORIES);
const ALL_MENU = flatten(MENU_CATEGORIES);

// Lowercase + strip accents so "vetta" matches "Vettä" and "cafe" matches "café".
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

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
  const [mode, setMode] = useState("speak"); // speak (fi->fr) | menu (fr->fi)
  const [query, setQuery] = useState("");

  const menuMode = mode === "menu";
  const categories = menuMode ? MENU_CATEGORIES : CATEGORIES;
  const pool = menuMode ? ALL_MENU : ALL_PHRASES;

  const q = norm(query.trim());
  const searching = q.length > 0;
  const results = searching
    ? pool.filter(
        (it) => norm(it.fi).includes(q) || norm(it.fr).includes(q) || norm(it.hint).includes(q)
      )
    : [];

  const switchMode = (m) => {
    setMode(m);
    setQuery(""); // a query from the other direction rarely makes sense
  };

  return (
    <div style={{ padding: "28px 20px 40px" }}>
      <p style={{ margin: 0, letterSpacing: 3, fontSize: 12, color: "#a08c6a", fontFamily: "system-ui" }}>
        {menuMode ? "RANSKA → SUOMI" : "SUOMI → RANSKA"}
      </p>
      <h1 style={{ fontSize: 38, margin: "4px 0 2px", fontWeight: 400 }}>Bonjour</h1>
      <p style={{ margin: "0 0 16px", color: "#7a7060", fontStyle: "italic" }}>
        {menuMode ? "Lue ranskalainen menu" : "Ranskaa matkaa varten · alusta alkaen"}
      </p>

      {/* Mode toggle: speak French vs. read a French menu */}
      <div
        style={{
          display: "flex",
          gap: 6,
          background: "#efe6d4",
          borderRadius: 12,
          padding: 4,
          marginBottom: 16,
        }}
      >
        {[
          { id: "speak", label: "🗣️ Sano" },
          { id: "menu", label: "🍽️ Lue menu" },
        ].map((m) => {
          const on = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              aria-pressed={on}
              style={{
                flex: 1,
                border: "none",
                borderRadius: 9,
                padding: "10px 8px",
                fontSize: 15,
                fontFamily: "Georgia, serif",
                cursor: "pointer",
                background: on ? "#fff" : "transparent",
                color: on ? accent : "#8a7c60",
                boxShadow: on ? "0 1px 6px rgba(80,60,20,0.12)" : "none",
                fontWeight: on ? 600 : 400,
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Search box — filters every phrase in the current mode as you type */}
      <div style={{ position: "relative", marginBottom: 18 }}>
        <span
          aria-hidden="true"
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.5 }}
        >
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={menuMode ? "Etsi ruokaa tai sanaa menusta…" : "Etsi sanaa tai lausetta…"}
          aria-label="Etsi"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px 40px 13px 40px",
            fontSize: 16,
            fontFamily: "system-ui",
            color: "#2b2620",
            background: "#fff",
            border: "1px solid #ecdfc6",
            borderRadius: 14,
            outline: "none",
          }}
        />
        {searching && (
          <button
            onClick={() => setQuery("")}
            aria-label="Tyhjennä haku"
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              fontSize: 18,
              color: "#a08c6a",
              cursor: "pointer",
              padding: 6,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {searching ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {results.length === 0 ? (
            <p style={{ color: "#7a7060", fontStyle: "italic", fontFamily: "system-ui", fontSize: 14 }}>
              Ei tuloksia haulle “{query.trim()}”.
            </p>
          ) : (
            results.map((it) => (
              <PhraseRow
                key={it.key}
                item={it}
                id={it.key}
                speak={speak}
                accent={accent}
                speakingId={speakingId}
                tag={`${it.catIcon} ${it.catTitle}`}
                dir={it.dir}
              />
            ))
          )}
        </div>
      ) : (
        <HomeBrowse
          categories={categories}
          showQuiz={!menuMode}
          onOpen={onOpen}
          onQuiz={onQuiz}
          accent={accent}
          speak={speak}
          supported={supported}
          hasFrench={hasFrench}
          voiceCount={voiceCount}
          speakingId={speakingId}
          testId={testId}
        />
      )}
    </div>
  );
}

// The default home content (audio test, category grid, quiz) shown when not searching.
function HomeBrowse({ categories, showQuiz, onOpen, onQuiz, accent, speak, supported, hasFrench, voiceCount, speakingId, testId }) {
  return (
    <>
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
        {categories.map((c) => (
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

      {showQuiz && (
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
      )}
    </>
  );
}

// A single tappable phrase card. Shared by the category list and search results.
// `tag` shows the source category (used only in search results).
// `dir` controls which language is the headline: "fi-fr" (default, speak French)
// shows Finnish small + French big; "fr-fi" (read a menu) shows French big + Finnish meaning.
function PhraseRow({ item, id, speak, accent, speakingId, tag, dir }) {
  const big = { fontSize: 21, margin: "2px 0", color: "#1a1814" };
  const small = { fontSize: 13, color: "#a08c6a", fontFamily: "system-ui" };
  const french = <div style={big}>{item.fr}</div>;
  const finnish = <div style={small}>{item.fi}</div>;
  return (
    <div
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
        {dir === "fr-fi" ? (
          <>
            {french}
            {finnish}
          </>
        ) : (
          <>
            {finnish}
            {french}
          </>
        )}
        <div style={{ fontSize: 13, color: accent, fontStyle: "italic" }}>[{item.hint}]</div>
        {tag && (
          <div style={{ fontSize: 11, color: "#a08c6a", fontFamily: "system-ui", marginTop: 4 }}>{tag}</div>
        )}
      </div>
      <button
        onClick={() => speak(item.fr, id)}
        aria-label="Kuuntele"
        style={{
          border: "none",
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: speakingId === id ? "#2f9e44" : accent,
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
  );
}

function PhraseList({ cat, onBack, speak, accent, speakingId }) {
  return (
    <div style={{ padding: "20px 20px 50px" }}>
      <BackBar onBack={onBack} title={cat.title} sub={cat.sub} accent={accent} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cat.items.map((it, i) => (
          <PhraseRow
            key={i}
            item={it}
            id={cat.id + i}
            speak={speak}
            accent={accent}
            speakingId={speakingId}
            dir={cat.dir}
          />
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
