# Cyber Actor Atlas

![Cyber Actor Atlas icon](./public/branding/cyberactoratlas-icon.png)

Hi my name is Daniel. I am a Graduate Student Researcher at NYU Center for Cybersecurity. 

I created Cyber Actor Atlas as an open-source map and downloadable dataset for exploring the publicly reported origins of cyber actors. It is designed as a lightweight research and education resource for people who want a clearer geographic view of how named actors are described in public reporting.

Live site: [Cyber Actor Atlas](https://codewithdaniel1.github.io/CyberActorAtlas/)

The atlas brings together cybercrime groups, financial fraud actors, crypto-crime actors, darknet market operators, hacktivist collectives, state-linked theft groups, access brokers, and a limited set of defensive or white-hat organizations for context.

## What You Can Do

- Browse 81 curated actors on an interactive world map
- Search by actor name, alias, tag, or keyword
- Filter across major actor categories
- Open a detail panel with origin, aliases, first-seen year, activity summary, and attribution note
- Download the dataset as CSV or JSON

## Downloads

- [`public/data/cyber-actor-atlas.csv`](./public/data/cyber-actor-atlas.csv) for Excel, Google Sheets, and other spreadsheet tools
- [`public/data/cyber-actor-atlas.json`](./public/data/cyber-actor-atlas.json) for programmatic use

## How To Read The Map

This project is best understood as an origin-attribution atlas, not a live operational tracking tool.

- Pins represent the best publicly supportable origin level available in open sources
- If reporting only identifies a country, the map pin is placed on the national capital for readability
- If reporting identifies a city, the map uses that city
- If an actor is decentralized or does not have a defensible fixed origin, it can remain in the dataset without a map pin
- Defensive or white-hat entries use official organization origin information rather than threat attribution

## What This Project Is

- A curated reference layer built from public reporting and official organization materials
- A simple way to compare actors geographically across different categories
- A downloadable open dataset that can support classroom use, exploratory research, or lightweight analysis

## What This Project Is Not

- A live threat-intelligence feed
- A definitive list of every cyber actor
- A claim of legal guilt beyond what public reporting states
- A real-time incident tracker
- A precise geolocation system for individual operators

## Methodology

The source of truth lives in [`src/data/groups.js`](./src/data/groups.js). Each record is manually curated from public reporting or official organization materials and normalized into a consistent schema for the map and downloadable exports.

Each entry is built around a small set of fields that make the atlas readable and comparable, including:

- Canonical name and major aliases
- Reported origin
- Actor category
- First-seen year
- Short activity summary
- Attribution note
- Source label

When multiple public names clearly refer to the same actor, the project keeps one canonical name and preserves important alternate names as aliases. Where attribution is disputed or incomplete, the wording is intentionally conservative.

## Source Families

The current dataset draws primarily from:

- U.S. Department of Justice
- U.S. Department of the Treasury
- MITRE ATT&CK
- CISA and partner advisories
- Vendor threat research
- Official organization pages for defensive and white-hat entries

This repository is a research-driven visualization layer over those public sources, not a replacement for reading the primary material itself.

## Contributing

Improvements are welcome, especially when they make the dataset more accurate, clearer, or better sourced.

If you want to add or update an entry:

1. Start with a strong public source such as a government action, sanctions notice, vendor threat profile, or official organization page.
2. Keep attribution language conservative and source-backed.
3. Update [`src/data/groups.js`](./src/data/groups.js).
4. Regenerate the public exports with `npm run export:data`.

## Local Development

If you want to run the project locally:

```bash
npm install
npm run dev
```

If you update the dataset and want to refresh the downloadable files:

```bash
npm run export:data
```
