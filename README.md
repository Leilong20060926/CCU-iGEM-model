# Rice Leaf-roller Smart Decision System

The Rice Leaf-roller Smart Decision System is a population simulator built by the CCU-Taiwan iGEM team to give farmers and the public an intuitive picture of how limonene acts on the rice leaf-roller (*Cnaphalocrocis medinalis*). Enter the month, the initial egg density observed in the field, the field area and the wind speed, and it returns the pest's life-cycle timing, a 120-day population forecast, and a full-season limonene spray schedule with a recommended dose for every spray.

**Live demo:** https://leilong20060926.github.io/CCU-iGEM-model/

## Overview

From July to October, during the second rice crop, the rice leaf-roller seriously threatens farmers' harvests. Its larvae roll up rice leaves and feed inside them, causing leaf-whitening that can stop grain filling altogether. Like other insects, it develops through four stages: **egg → larva → pupa → adult**.

The simulator has several built-in datasets: how many days each stage takes to develop into the next, the recent 5-year mean monthly temperature for Minxiong, Chiayi, the amount of pest suppression limonene can achieve, and limonene's evaporation rate.

- **Life-cycle timing:** Uses the degree-day law to work out how long the egg, larval and pupal stages last at the selected month's temperature, plus the length of a full generation.
- **Early warning:** Simulates the population with no intervention and reports the first day the larvae exceed the economic injury threshold (20 larvae/m²).
- **Spray protection:** Uses a shrinking-droplet evaporation model to estimate how many days a single limonene spray stays effective in the field.
- **Full-season dynamic schedule:** Simulates all 120 days of the rice season. Every time the larvae cross the threshold, it schedules a spray, calculates the exact dose needed to bring them back down, and totals the limonene your field needs for the season.
- **Population chart:** Plots eggs, larvae, pupae and adults over 120 days, marking the threshold line and every spray event.

All results can expand into a full plain-text report. The interface switches instantly between Chinese/English and has a light/dark theme toggle.

## Methods

| Function | Computes | Method |
|---|---|---|
| Stage development time | Days per stage at temperature *T* | Degree-day law, *D* = *K* / (*T* − *T*₀): egg 60.2 / (*T* − 12), larva 240 / (*T* − 11), pupa 84 / (*T* − 14) |
| Population dynamics | Daily egg / larva / pupa / adult counts | 4-stage matrix projection (Lefkovitch, 1965); survival *s* = [0.9, 0.8, 0.9, 0.85], transition rate *P* = 1 / *D*, fecundity *f* = (200 × 0.5) / 14 per day |
| Temperature input | Mean temperature for the selected month | 2021–2025 monthly means from CWA CODiS station data (Jul 29.1, Aug 28.7, Sep 28.3, Oct 26.2 °C) |
| Limonene evaporation | Remaining droplet mass over time | Shrinking-surface solution *m*(*t*) = (*m*₀^1/3 − (*k*<sub>evap</sub> / 3)·*t*)³, with *k*<sub>evap</sub> = 0.035 · (*T* / 25) · (1 + *v*<sub>wind</sub>) |
| Spray protection | Days a single spray stays effective | Full-evaporation time 3·*m*₀^1/3 / *k*<sub>evap</sub>, rounded up to whole days |
| Early warning | First day larvae exceed the threshold | No-intervention run against the economic injury threshold of 20 larvae/m² (1 larva per hill) |
| Dynamic dosing | Dose for each spray | Reduction *r* = max((*L* − 20) / *L*, 0.5 × 0.40); dose = area × base dose × *r* / 0.40; next spray allowed after protection + 5 days |

The vapor pressure behind *k*<sub>evap</sub> comes from limonene's molecular weight (136.23 g/mol) plugged into the Antoine equation. The conventional fixed-surface-area evaporation formula, *E* = *M*·*K*·*A*·*P*<sub>sat</sub> / (*R*·*T*), assumes the surface area stays constant. In reality, both the mass and the surface area of a limonene droplet shrink as it volatilizes, so we use the nonlinear solution above instead.

## How We Built It

1. **Literature.** We first gathered published data on how many days the rice leaf-roller takes to move from one life stage to the next, and built these values into the model.
2. **Temperature.** Insect growth follows the law of effective accumulated temperature. Insects are ectotherms, so their development rate changes with temperature. Within a certain range, once the effective temperature above the lower developmental threshold accumulates to a fixed total, the insect moves on to its next life stage. We downloaded CSV records from the Central Weather Administration's CODiS service (https://codis.cwa.gov.tw/StationData) for the station nearest the target rice field and analyzed them.
3. **Limonene evaporation rate.** The reference experiment was based on L-limonene, but chemical suppliers told us it is hard to obtain and expensive. With our advisor's approval, we tested evaporation with D-limonene instead, whose properties differ only marginally. We placed limonene on a precision balance outdoors with the draft shield open to let air flow, and timed how long it took to evaporate completely.
4. **Pest suppression by limonene.** We originally planned to collect leaf-rollers from the field to test this directly, but by the time the experiment was settled the season had passed and no leaf-rollers could be found. The simulator therefore uses a placeholder lethality of 40% until field data is available.
5. **MATLAB.** We combined all of the data above and ran the simulation in MATLAB (`leafroller_limonene_sim.m`).
6. **Website.** Once the MATLAB results were in place, we ported the model to a website so users can enter their own data and see our recommendations directly.

## Other pages

- **Related Information page:** The degree-day concept, the limonene evaporation model with its formulas, official leaf-roller control standards, the weather data source, the damage the leaf-roller causes, the harms of pesticides, and what consumers can do.
- **About Us page:** Team introduction with links to Instagram, the school site, YouTube, and the team's other projects: NoFold, the Taiwan Organic Agriculture Map (TOAM), and LimoSim.

## Development

Technical notes for anyone working on the codebase.

### Project structure

```
.
├── index.html                   # Page structure (entry point)
├── leafroller_limonene_sim.m    # Reference MATLAB model
├── public/
│   ├── assets/                  # Logo and theme icons
│   ├── css/
│   │   └── style.css            # All styling (CSS variables, light/dark themes)
│   └── js/
│       ├── i18n.js              # Chinese/English UI strings and info/about content
│       ├── model.js             # Simulation: evaporation, stage matrix, spray schedule
│       ├── chart.js             # Canvas population chart
│       └── app.js               # Theme, language, page rendering, text report
├── README.md
└── .gitignore
```

The site is fully static: every calculation runs in the browser, and there is no backend. The scripts share global variables, so `index.html` must load them in this order: `i18n.js` → `model.js` → `chart.js` → `app.js`.

`leafroller_limonene_sim.m` is the reference model. When you change a parameter or formula, update `public/js/model.js` to match so the website and MATLAB produce the same results.

## Features

- Life-cycle timing, early warning, and spray protection days from a single set of inputs
- 120-day dynamic spray schedule with a per-spray dose and a season total for your field area
- Population chart with threshold line and spray markers
- Full plain-text report
- Chinese / English toggle, light/dark theme
- Runs on mobile and desktop, no installation

## Getting Started

### Use it online

No installation needed. Just open: https://leilong20060926.github.io/CCU-iGEM-model/

1. Enter the **month** (7–10), the **initial egg density** (eggs/m²), the **field area** (ha), the **base spray dose** (mL/ha) and the **wind speed** (m/s).
2. Press **Run simulation**.
3. Read the life-cycle card, the population chart, and the spray schedule table. Expand **View full text report** for the complete output.

### Run it locally

**Step 1: Download the project**

Option A — Using Git (recommended)

```
git clone https://github.com/Leilong20060926/CCU-iGEM-model.git
cd CCU-iGEM-model
```

Option B — Without Git

Go to https://github.com/Leilong20060926/CCU-iGEM-model, click **Code** → **Download ZIP**, and unzip it.

**Step 2: Open the website**

Double-click `index.html` to open it in your browser. Nothing needs to be installed.

**Step 3 (optional): Run the MATLAB model**

Open `leafroller_limonene_sim.m` in MATLAB, edit the parameters in section 1 at the top, and press **Run**. The report prints in the Command Window and the population chart opens in a new figure.

## Troubleshooting

- **The page opens in Chinese:** The site remembers the last language you chose. Press the **English** button in the top-right corner to switch back.
- **The theme icon is missing:** Make sure `moon.svg` and `sun.svg` are inside `public/assets/`.
- **The page looks unstyled or nothing happens when I press Run:** Check that the `public/` folder sits next to `index.html`, then hard-refresh (Ctrl/Cmd+Shift+R) to clear stale cached files.
- **Website and MATLAB results differ:** Check that the month's temperature and the other parameters match. The MATLAB script sets the temperature directly (`T_cel`), while the website looks it up from the month.

## References

- Central Weather Administration, Climate Observation Data Inquire Service (CODiS): https://codis.cwa.gov.tw/StationData
- Ministry of Agriculture, rice leaf-roller monitoring and control standards: https://kmweb.moa.gov.tw/theme_data.php?theme=news&id=50898&sub_theme=attention
- Taiwan Agricultural Research Institute, 2020: 氣候變遷對農業上有害生物之發生分布及其因應調適策略 (Distribution of agricultural pests under climate change and adaptation strategies)
- Lefkovitch, 1965, *Biometrics*: The study of population growth in organisms grouped by stages