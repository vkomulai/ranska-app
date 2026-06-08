# Ranskaa matkaa varten

A small Finnish-to-French travel phrasebook with audio pronunciation. Built for zero prior knowledge, sized for phones (Android and iOS). Categories cover greetings, restaurant, café, drinks, useful phrases, and numbers, plus a practice quiz. Pronunciation uses the device's built-in French text-to-speech voice, so it works offline once the page is loaded.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL on your computer, or on a phone connected to the same network.

## Build for hosting

```bash
npm run build
```

The output lands in `dist/`. Host that folder anywhere static (GitHub Pages, Netlify, Vercel). On each phone, open the hosted URL and use "Add to Home Screen" so it behaves like an app.

## Audio notes

- iOS Safari unlocks speech on the first tap; the app primes it automatically.
- Android needs a French text-to-speech voice installed: Settings -> Languages -> Text-to-speech -> add French.
- The home screen has an audio test button and shows whether a French voice was found.
