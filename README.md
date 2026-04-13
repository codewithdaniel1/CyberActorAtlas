# Cyber Actor Atlas

React + Vite + Leaflet map for exploring the publicly reported origins of cyber actors, including malicious groups, cyber-enabled financial and crypto crime actors, and defensive white-hat organizations.

## What this project is

This is a curated, static atlas of cyber actors based on public attribution reporting and official organization information.

It is not:

- A live threat-intelligence feed
- A definitive list of every cyber actor
- A claim of legal guilt beyond what public reporting states
- A source of real-time incident statistics

## Running locally

```bash
npm install
npm run dev
```

## What changed

The app now uses a bundled static dataset instead of live venue lookups. The map centers on the world, and the sidebar tracks whichever mapped groups are currently inside the viewport.

The current dataset blends cybercrime groups, cyber-enabled financial fraud actors, blockchain / crypto theft actors, hacktivist groups, hybrid actors that mix financial and political motives, and a set of prominent white-hat / defensive organizations. It includes both first-tier globally notorious actors and a curated second-tier layer of widely tracked criminal and defensive groups.

Downloadable copies of the dataset are also published in Excel-friendly and machine-readable formats:

- [`public/data/cyber-actor-atlas.csv`](./public/data/cyber-actor-atlas.csv) for Excel, Google Sheets, and other spreadsheet tools
- [`public/data/cyber-actor-atlas.json`](./public/data/cyber-actor-atlas.json) for programmatic use

Each entry includes:

- Display name used in the app and exports
- Reported origin point
- Category
- First-seen year
- Tradecraft notes and source-backed alternate names where relevant
- Attribution note and source label

## Methodology

### How the dataset is built

The dataset source of truth is stored locally in [`src/data/groups.js`](./src/data/groups.js). There is no live API call and no automated sync. Each record is manually curated from public reporting or official organization materials and then normalized into a consistent schema for the map.

Spreadsheet and JSON exports are generated from that source file with:

```bash
npm run export:data
```

That command writes downloadable files to [`public/data`](./public/data).

For each group, I collect:

- `name`: the canonical base name stored in the source data
- `aliases`: major public alternate names used by vendors or governments when they clearly refer to the same actor
- `firstSeen`: the earliest activity year stated or implied in the cited reporting
- `knownFor`: a short summary of the activity most associated with that group
- `attribution`: a plain-language note describing the public claim about origin, affiliation, or official organizational basis
- `sourceLabel`: a short citation label shown in the UI

In the UI and downloadable CSV/JSON files, the visible `name` field is rendered as a combined label like `Primary, Alias, Alias` when aliases are present.

### How the map location is chosen

The app does not claim precise geolocation of people. Pins represent the best publicly supportable origin level available in open sources:

- If reporting names a city, the pin uses that city
- If reporting only names a country, the pin is placed on the national capital for readability
- If the entry is a legitimate white-hat organization, the pin uses the organization origin described on its official site or the most relevant official office / headquarters location
- If the entry is a security team inside a larger company, the team name comes from the official product or research page while the pin uses the parent organization’s official headquarters location
- Latitude and longitude are manually assigned map coordinates used for visualization

This means the map is best read as an origin-attribution atlas, not a precise operational geolocation system.

### What is sourced vs. what is editorial

Directly sourced from public reporting or official organization materials:

- Group names and aliases
- Reported country or city of origin
- First-seen timeframe
- Activity summary and attribution note

Editorial or normalized by this project:

- The choice of one canonical base name when multiple sources use different names for the same actor
- The concatenated display/export name format derived from that base name plus aliases
- `type` categories such as `ransomware`, `financial-fraud`, `crypto-crime`, `hacktivist`, `white-hat`, `carding`, `bec-fraud`, and `access-brokerage`
- `scope` labels such as `Global` or `Regional`
- The exact display coordinate used on the map
- The shortened summary text used in cards and detail panels

### Important limitation

Some malicious groups have conflicting or incomplete public attribution. In those cases, the dataset uses the strongest public source I could find, and a small number of entries rely on converging public reporting rather than a single indictment or sanctions notice. White-hat entries are included as official organizations, not attributed threat actors. This repository should be treated as a research-driven visualization layer over public reporting, not as a canonical intelligence database.

Where multiple names clearly refer to the same actor, the atlas keeps one canonical base name in the source data and concatenates the rest into the displayed/exported name, for example `Primary, Alias, Alias`. For defensive organizations, the canonical base name is usually the clearest current official organization or team name rather than a stack of near-duplicate brand variants.

## Sources

Primary source families used in the current dataset:

- U.S. Department of Justice:
  [LockBit](https://www.justice.gov/opa/pr/united-states-charges-dual-russian-and-israeli-national-developer-lockbit-ransomware-group),
  [Trickbot / Conti](https://www.justice.gov/opa/pr/multiple-foreign-nationals-charged-connection-trickbot-malware-and-conti-ransomware),
  [Hydra Market](https://www.justice.gov/usao-ndca/pr/justice-department-investigation-leads-shutdown-largest-online-darknet-marketplace),
  [Nemesis Market](https://www.justice.gov/opa/pr/iranian-national-indicted-operating-online-marketplace-offering-fentanyl-and-money),
  [GameOver Zeus / Bogachev reward notice](https://www.justice.gov/archives/opa/pr/reward-announced-cyber-fugitive)
- U.S. Department of the Treasury:
  [Evil Corp sanctions](https://home.treasury.gov/news/press-releases/sm845),
  [additional Evil Corp action in 2024](https://home.treasury.gov/news/press-releases/jy2623)
- MITRE ATT&CK:
  [Wizard Spider](https://attack.mitre.org/groups/G0102/),
  [FIN7](https://attack.mitre.org/groups/G0046/),
  [APT38](https://attack.mitre.org/groups/G0082/),
  [Lazarus Group](https://attack.mitre.org/groups/G0032/),
  [Gorgon Group](https://attack.mitre.org/groups/G0078/),
  [APT41](https://attack.mitre.org/groups/G0096/),
  [Moonstone Sleet](https://attack.mitre.org/groups/G1036/),
  [CyberAv3ngers](https://attack.mitre.org/groups/G1027/),
  [APT28](https://attack.mitre.org/groups/G0007/),
  [APT29](https://attack.mitre.org/groups/G0016/),
  [Sandworm Team](https://attack.mitre.org/groups/G0034/),
  [Turla](https://attack.mitre.org/groups/G0010/),
  [LAPSUS$](https://attack.mitre.org/groups/G1004/),
  [TA505](https://attack.mitre.org/groups/G0092/),
  [FIN5](https://attack.mitre.org/groups/G0053/),
  [FIN6](https://attack.mitre.org/groups/G0037/),
  [Play](https://attack.mitre.org/groups/G1040/),
  [BlackByte](https://attack.mitre.org/groups/G1043/),
  [Medusa Group](https://attack.mitre.org/groups/G1051/),
  [Mustard Tempest](https://attack.mitre.org/groups/G1020/)
- Additional MITRE ATT&CK entries:
  [Andariel](https://attack.mitre.org/groups/G0138/)
- CISA and partner advisories:
  [BianLian](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-136a),
  [TraderTraitor](https://www.cisa.gov/sites/default/files/publications/AA22-108A-TraderTraitor-North_Korea_APT_Targets_Blockchain_Companies.pdf),
  [AppleJeus](https://www.cisa.gov/news-events/analysis-reports/ar21-048c)
- Secureworks CTU:
  [GOLD SKYLINE](https://www.secureworks.com/research/threat-profiles/gold-skyline),
  [GOLD GALLEON](https://www.secureworks.com/research/threat-profiles/gold-galleon),
  [GOLD BARONDALE](https://www.secureworks.com/research/threat-profiles/gold-barondale),
  [GOLD WATERFALL](https://www.secureworks.com/research/threat-profiles/gold-waterfall),
  [GOLD SYMPHONY](https://www.secureworks.com/research/threat-profiles/gold-symphony),
  [GOLD PARAKEET](https://www.secureworks.com/research/threat-profiles/gold-parakeet)
- Additional vendor research:
  [Cosmic Lynx / Agari H2 2020 report](https://www.agari.com/cyber-intelligence-research/e-books/agari-h2-2020-email-fraud-report.pdf),
  [FBI reward notice for Bogachev](https://www.fbi.gov/news/press-releases/reward-announced-for-cyber-fugitive),
  [MoneyTaker / Group-IB report summary](https://www.group-ib.com/media-center/press-releases/moneytaker/)
- ESET Research:
  [Grandoreiro](https://www.welivesecurity.com/2020/04/28/grandoreiro-how-engorged-can-exe-get/),
  [Guildma](https://www.welivesecurity.com/2020/03/05/guildma-devil-drives-electric/),
  [Vadokrist](https://www.welivesecurity.com/br/2021/01/21/vadokrist-malware-bancario-direcionado-ao-brasil/)
- Official organization sources for white-hat entries:
  [Project Zero](https://googleprojectzero.blogspot.com/p/about-project-zero.html),
  [CERT/CC](https://www.sei.cmu.edu/about/divisions/cert/),
  [CISA](https://www.cisa.gov/about),
  [FIRST](https://www.first.org/about/),
  [OWASP Foundation](https://owasp.org/about/),
  [Microsoft Threat Analysis Center](https://www.microsoft.com/en-us/corporate-responsibility/customer-security-trust/microsoft-threat-analysis-center),
  [Microsoft office locations](https://www.microsoft.com/en-us/about/office-locations),
  [Google Threat Intelligence](https://cloud.google.com/security/threats),
  [Google Mountain View HQ](https://www.google.com/about/careers/applications/locations/mountain-view/),
  [Cisco Talos](https://www.cisco.com/site/uk/en/products/security/talos/index.html),
  [Unit 42](https://origin-unit42.paloaltonetworks.com/about-unit-42/),
  [CrowdStrike Falcon Intelligence](https://www.crowdstrike.com/en-us/platform/threat-intelligence/falcon-intelligence/),
  [Recorded Future contact page](https://www.recordedfuture.com/contact),
  [SentinelLABS / SentinelOne](https://www.sentinelone.com/labs/),
  [Rapid7 Labs](https://www.rapid7.com/research/),
  [Huntress](https://www.huntress.com/),
  [ESET headquarters announcement](https://www.eset.com/us/about/newsroom/press-releases/cybersecurity-leader-eset-to-build-new-global-headquarters/),
  [Secureworks press page](https://www.secureworks.com/about/press/81306),
  [Shadowserver Foundation fact sheet](https://www.shadowserver.org/wp-content/uploads/2022/10/Shadowserver-Overview-v1.5-2022-10-04.pdf),
  [Team Cymru contact page](https://www.team-cymru.com/contact-us)

## Updating the data

When adding or editing a group entry, the workflow is:

1. Find a primary public source such as a government case, sanctions notice, vendor threat profile, or official organization page.
2. Extract the origin claim, first-seen timing, alternate names, and activity summary.
3. Decide whether the attribution is city-level or only country-level.
4. Add the normalized record to `src/data/groups.js`.
5. Run `npm run export:data` to refresh the downloadable CSV and JSON files.
6. Keep the wording conservative if attribution is disputed, incomplete, or simplified from a multi-country ecosystem into a single map pin.

## Project structure

```text
public/
└── data/
    ├── cyber-actor-atlas.csv
    └── cyber-actor-atlas.json
scripts/
└── export-dataset.mjs
src/
├── App.jsx
├── components/
│   ├── DetailPanel.jsx
│   ├── FilterBar.jsx
│   ├── MapView.jsx
│   ├── NavBar.jsx
│   ├── VenueCard.jsx
│   └── VenueList.jsx
├── data/
│   └── groups.js
├── hooks/
│   └── useGroups.js
└── styles/
    └── global.css
```

## Build

```bash
npm run build
```
