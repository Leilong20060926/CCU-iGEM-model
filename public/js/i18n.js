// UI strings and info/about page content (zh / en)
const T = {
  zh: {
    back: '返回',
    brand: '田間監測 · 決策支援',
    tag: '智慧決策 · 風險預警',
    title: '瘤野螟爆發與防治建議系統',
    subtitle: '嘉義民雄二期稻作 · 輸入月份、初始卵密度、農田面積與風速，取得 120 天全期動態防治排程與精準劑量',
    monthLabel: '月份 (7~10)',
    eggsLabel: '初始卵密度 (隻/m²)',
    areaLabel: '農田面積 (公頃)',
    doseLabel: '基準噴灑量 (毫升/公頃)',
    windLabel: '田間風速 (m/s)',
    runButton: '執行模擬 →',
    emptyTitle: '尚未執行模擬',
    emptyHint: '設定參數後，按下「執行模擬」查看生活史時程與全期動態防治排程',
    alertMonth: '月份請輸入 7 到 10 之間的數字',
    alertEggs: '初始卵密度請輸入非負數',
    alertArea: '農田面積請輸入大於 0 的數字',
    alertDose: '基準噴灑量請輸入大於 0 的數字',
    alertWind: '風速請輸入非負數',
    scenarioName: '近五年氣候基準 (2021-2025)',
    timelineLabel: '單世代生活史時程 (無外力介入)',
    eggSeg: '卵期', larvaSeg: '幼蟲期 · 主要危害期', pupaSeg: '蛹期',
    statEgg: '卵期天數', statLarva: '幼蟲期天數', statPupa: '蛹期天數', statGen: '完整世代',
    dayUnit: '天',
    outbreakText: (day,val)=>`預警：田間預計於第 <b>${day}</b> 天「首次突破」經濟危害基準（達 <b>${val.toFixed(1)}</b> 隻/m²）`,
    safeText: (t)=>`全期幼蟲數量皆未超過經濟危害基準（${t} 隻/m²）`,
    statusSafe: '安全', statusWarn: '超過危害基準',
    actionWarnTitle: '⚠ 防治概況',
    actionSafeTitle: '✓ 全期無需施藥',
    duration: (d)=>`物理防護力：單次噴灑預期可持續 <b>${d}</b> 天（依揮發衰減模型）`,
    sprayCount: (n)=>`本季總計需噴灑 <b>${n}</b> 次`,
    totalDose: (a,d)=>`您的農田（<b>${a}</b> 公頃）全期共需準備檸檬烯 <b>${d.toFixed(0)}</b> 毫升`,
    safeAdvice: '恭喜！根據初始蟲量，全期皆未超過危害基準，無需施藥。',
    chartTitle: '瘤野螟 120 天全期動態模擬（含檸檬烯動態劑量干預）',
    chartEgg: '卵', chartLarva: '幼蟲 (主要危害)', chartPupa: '蛹', chartAdult: '成蟲', chartSpray: '噴藥干預點', chartThreshold: '經濟危害基準',
    axisX: '水稻生長期 (天)', axisY: '個體數量 (隻/m²)',
    schedTitle: '水稻二期作 (120天) 瘤野螟全期動態防治排程',
    schedCols: ['噴次', '稻期天數', '針對世代', '建議調配量 (毫升)'],
    schedRow: (i)=>`第 ${i} 噴`, schedDay: (d)=>`第 ${d} 天`, schedGen: (g)=>`第 ${g} 代`,
    statSprays: '噴灑次數', statTotal: '全期總用量 (毫升)', statDuration: '單次防護天數', statArea: '農田面積 (公頃)',
    reportToggle: '查看完整文字報告',
    header: (month)=>`嘉義民雄地區 ${month} 月份 瘤野螟爆發與防治建議\n`,
    baseline: (t)=>`【近五年氣候基準 (2021-2025)】(平均氣溫: ${t.toFixed(1)}℃)`,
    devTitle: '發育時程預測 (無外力介入)：',
    eggStage: (d)=>` - 卵期需約： ${d.toFixed(1)} 天孵化為幼蟲`,
    larvaStage: (d)=>` - 幼蟲期約： ${d.toFixed(1)} 天 (主要危害期)`,
    pupaStage: (d)=>` - 蛹期需約： ${d.toFixed(1)} 天羽化為成蟲`,
    fullGen: (d)=>` - 完整世代： 約 ${d.toFixed(1)} 天`,
    warnTitle: '危害預警與防治概況：',
    outbreakSimple: (day,val)=>` - 預警：田間預計於第 ${day} 天「首次突破」經濟危害基準 (達 ${val.toFixed(1)} 隻/m²)。`,
    durationSimple: (d)=>` - 物理防護力：單次噴灑預期可持續 ${d} 天 (根據揮發衰減模型)。`,
    safeSimple: (t)=>` - 安全：全期幼蟲數量皆未超過經濟危害基準 (${t} 隻/m²)。`,
    noSpraySimple: ' 恭喜！根據初始蟲量，全期皆未超過危害基準，無需施藥。',
    sprayLine: (i,day,g,ml)=>` 第 ${String(i).padStart(2)} 噴： 稻期第 ${String(day).padStart(3)} 天 (針對第 ${g} 代) -> 建議調配量： ${ml.toFixed(0).padStart(4)} 毫升`,
    totalSimple: (n,a,d)=>` 總結算：本季總計需噴灑 ${n} 次，您的農田 (${a.toFixed(1)} 公頃) 全期共需準備檸檬烯 ${d.toFixed(0)} 毫升。`,
    info: {
    "title": "相關資訊",
    "items": [
          {
                "heading": "1. 生物積溫介紹｜蟲體如何進入下一個成長階段",
                "body": "害蟲從卵、幼蟲到蛹的發育速度與溫度密切相關。系統透過「生物積溫」（Degree-day）概念，依氣象資料估算蟲體累積到一定積溫後便會蛻變進入下一階段，藉此推算各生長期所需天數。",
                "link": {
                      "href": "https://azai.tari.gov.tw/BugFile/pub/410/%E6%B0%A3%E5%80%99%E8%AE%8A%E9%81%B7%E5%B0%8D%E8%BE%B2%E6%A5%AD%E4%B8%8A%E6%9C%89%E5%AE%B3%E7%94%9F%E7%89%A9%E4%B9%8B%E7%99%BC%E7%94%9F%E5%88%86%E5%B8%83%E5%8F%8A%E5%85%B6%E5%9B%A0%E6%87%89%E8%AA%BF%E9%81%A9%E7%AD%96%E7%95%A5(2020).pdf",
                      "label": "延伸閱讀：氣候變遷對農業上有害生物之發生分布及其因應調適策略（2020）→"
                }
          },
          {
                "heading": "2. 檸檬烯蒸發模型｜單次噴灑的藥效能維持多久",
                "blocks": [
                      {
                            "p": "這個模型是用分子量、安托萬方程算出的蒸汽壓，以及模擬田間水滴表面積縮小來計算的。這版的輸出除了原本在無外力下推論瘤野螟的完整世代天數，還增加了在一整個稻期（120 天）的噴灑進度及建議量。"
                      },
                      {
                            "p": "檸檬烯的蒸發預測，由檸檬烯的分子量（136.23 g/mol）帶入安托萬方程式，來計算蒸氣壓。傳統的固定表面積蒸發率公式為："
                      },
                      {
                            "math": "<span class=\"fx\"><i>E</i><span class=\"op\">=</span><span class=\"frac\"><span><i>M</i>·<i>K</i>·<i>A</i>·<i>P</i><sub>sat</sub></span><span><i>R</i>·<i>T</i></span></span></span>"
                      },
                      {
                            "p": "但是檸檬烯在揮發時，質量和表面積是會隨著時間不斷推移而縮小的。所以我們捨棄了傳統的線性公式，改用包含初始質量三次方根（<i>m</i><span class=\"supsub\"><sup>1/3</sup><sub>0</sub></span>）與綜合蒸發係數（<i>k</i><sub>evap</sub>）的微分方程非線性解："
                      },
                      {
                            "math": "<span class=\"fx\"><span><i>m</i>(<i>t</i>)</span><span class=\"op\">=</span><span class=\"paren\">(</span><i>m</i><span class=\"supsub\"><sup>1/3</sup><sub>0</sub></span><span class=\"op\">−</span><span class=\"frac\"><span><i>k</i><sub>evap</sub></span><span>3</span></span><span class=\"op\">·</span><i>t</i><span class=\"paren\">)</span><sup class=\"pow\">3</sup></span>"
                      },
                      {
                            "p": "以變化面積的方式來帶入蒸發速率的計算。"
                      }
                ]
          },
          {
                "heading": "3. 瘤野螟的防治標準",
                "body": "農業主管機關訂有瘤野螟的田間監測與用藥防治標準，作為判斷是否需要施藥的依據。",
                "link": {
                      "href": "https://kmweb.moa.gov.tw/theme_data.php?theme=news&id=50898&sub_theme=attention",
                      "label": "查看瘤野螟防治標準說明 →"
                }
          },
          {
                "heading": "4. 氣象資料來源",
                "body": "本系統所使用之氣象資料，來自中央氣象署「氣候觀測資料查詢服務」（CODiS）之嘉義站觀測數據。",
                "link": {
                      "href": "https://codis.cwa.gov.tw/StationData",
                      "label": "前往 CODiS 氣候資料查詢 →"
                }
          },
          {
                "heading": "5. 瘤野螟的破壞",
                "list": [
                      "瘤野螟為水稻二期作重要害蟲之一，也是亞洲所有稻作生態系中最具破壞性的害蟲之一。",
                      "若慣行稻不使用農藥，瘤野螟幼蟲會將葉片捲起並藏匿其中啃食稻葉，這會導致水稻產生嚴重的白葉情況，使稻穗無法結實而無法收成。"
                ]
          },
          {
                "heading": "6. 農藥的危害",
                "list": [
                      "有實驗顯示，在美國農業密集的區域，農民以及居住在農田附近的居民，因環境中的農藥殘留（隨風飄散、水源污染），面臨極高的致癌風險。",
                      "化學農藥與抗藥性形成惡性循環，農民必須不斷交替用藥、混合用藥。",
                      "長期農藥的累積會使新女王蜂的產量暴跌 85%，破壞蜂群。",
                      "農藥毒殺野生授粉昆蟲，甚至影響瀕危物種（如兩棲類樹蛙）。"
                ]
          },
          {
                "heading": "7. 我們能做些什麼",
                "list": [
                      "支持有機稻米，保護環境、保護自身健康。",
                      "支持環保標章，購買選用環保包裝的產品。"
                ]
          }
    ]
},
    about: {
    "title": "關於我們",
    "introLabel": "簡介",
    "paras": [
          "我們是 No Fold，CCU-Taiwan iGEM 團隊，由國立中正大學各學院的學生所組成，涵蓋理學院、工學院、社會科學院、文學院，以及跨領域學士學位學程的同學。",
          "我們團隊計畫利用生物合成學的方式，開發可用於驅趕農業害蟲瘤野螟的系統，希望大家了解農藥對世界的危害以及增進大眾對有機稻米的認知。"
    ],
    "linksLabel": "相關連結",
    "links": [
          {
                "label": "Instagram",
                "href": "https://www.instagram.com/ccuigem/"
          },
          {
                "label": "學校官網",
                "href": "https://igem.ccu.edu.tw/"
          },
          {
                "label": "YouTube",
                "href": "https://www.youtube.com/@ccutaiwanigemteam133/featured"
          },
          {
                "label": "NoFold 小遊戲",
                "href": "https://leilong20060926.github.io/CCU-iGEM-game/"
          },
          {
                "label": "TOAM 台灣有機農業地圖",
                "href": "https://igem.xn--hrr.tw/"
          },
          {
                "label": "LimoSim 檸檬烯代謝模擬器",
                "href": "https://ccu-igem-software.onrender.com/"
          }
    ]
}
  },
  en: {
    back: 'Back',
    brand: 'Field Monitoring · Decision Support',
    tag: 'Smart Decision · Risk Alert',
    title: 'Rice Leaf-roller Outbreak & Control Advisory',
    subtitle: 'Chiayi Minxiong second-crop rice · Enter month, initial egg density, field area and wind speed for a 120-day dynamic spray schedule with precise doses',
    monthLabel: 'Month (7~10)',
    eggsLabel: 'Initial eggs (/m²)',
    areaLabel: 'Field area (ha)',
    doseLabel: 'Base spray dose (mL/ha)',
    windLabel: 'Wind speed (m/s)',
    runButton: 'Run simulation →',
    emptyTitle: 'No simulation yet',
    emptyHint: 'Set the parameters, then press "Run simulation" to see life-cycle timing and the full-season dynamic spray schedule',
    alertMonth: 'Please enter a month between 7 and 10',
    alertEggs: 'Please enter a non-negative initial egg density',
    alertArea: 'Please enter a field area greater than 0',
    alertDose: 'Please enter a base spray dose greater than 0',
    alertWind: 'Please enter a non-negative wind speed',
    scenarioName: 'Recent 5-yr climate baseline (2021-2025)',
    timelineLabel: 'Single-generation life cycle (no intervention)',
    eggSeg: 'Egg', larvaSeg: 'Larva · main damage stage', pupaSeg: 'Pupa',
    statEgg: 'Egg stage', statLarva: 'Larval stage', statPupa: 'Pupal stage', statGen: 'Full generation',
    dayUnit: 'd',
    outbreakText: (day,val)=>`Alert: larvae first exceed the economic threshold on day <b>${day}</b> (<b>${val.toFixed(1)}</b> individuals/m²)`,
    safeText: (t)=>`Larvae stay below the economic threshold (${t} individuals/m²) all season`,
    statusSafe: 'Safe', statusWarn: 'Exceeds threshold',
    actionWarnTitle: '⚠ Control overview',
    actionSafeTitle: '✓ No spraying needed this season',
    duration: (d)=>`Protection: a single spray lasts <b>${d}</b> day(s) (volatilization decay model)`,
    sprayCount: (n)=>`<b>${n}</b> sprays needed this season`,
    totalDose: (a,d)=>`Your field (<b>${a}</b> ha) needs <b>${d.toFixed(0)}</b> mL of limonene in total`,
    safeAdvice: 'Good news! Based on the initial count, larvae never exceed the threshold — no spraying needed.',
    chartTitle: '120-day population dynamics (with dynamic limonene dosing)',
    chartEgg: 'Egg', chartLarva: 'Larva (main damage)', chartPupa: 'Pupa', chartAdult: 'Adult', chartSpray: 'Spray event', chartThreshold: 'Economic threshold',
    axisX: 'Rice growth period (days)', axisY: 'Population (individuals/m²)',
    schedTitle: 'Second-crop rice (120 days) — full-season dynamic spray schedule',
    schedCols: ['Spray', 'Crop day', 'Target generation', 'Recommended mix (mL)'],
    schedRow: (i)=>`#${i}`, schedDay: (d)=>`Day ${d}`, schedGen: (g)=>`Gen ${g}`,
    statSprays: 'Sprays', statTotal: 'Season total (mL)', statDuration: 'Protection (days)', statArea: 'Field area (ha)',
    reportToggle: 'View full text report',
    header: (month)=>`Chiayi Minxiong District — Month ${month} outbreak & control advisory\n`,
    baseline: (t)=>`[Recent 5-yr climate baseline (2021-2025)] (Avg temp: ${t.toFixed(1)}℃)`,
    devTitle: 'Development timeline prediction (without intervention):',
    eggStage: (d)=>` - Egg stage: about ${d.toFixed(1)} days to hatch`,
    larvaStage: (d)=>` - Larval stage: about ${d.toFixed(1)} days (main damage period)`,
    pupaStage: (d)=>` - Pupal stage: about ${d.toFixed(1)} days to emerge`,
    fullGen: (d)=>` - Full generation: about ${d.toFixed(1)} days`,
    warnTitle: 'Risk warning and control overview:',
    outbreakSimple: (day,val)=>` - Alert: larvae first exceed the economic threshold on day ${day} (${val.toFixed(1)} individuals/m²).`,
    durationSimple: (d)=>` - Protection: a single spray is expected to last ${d} day(s) (volatilization decay model).`,
    safeSimple: (t)=>` - Safe: larvae stay below the economic threshold (${t} individuals/m²) all season.`,
    noSpraySimple: ' Good news! Based on the initial count, no spraying is needed this season.',
    sprayLine: (i,day,g,ml)=>` Spray #${String(i).padStart(2)}: crop day ${String(day).padStart(3)} (gen ${g}) -> recommended mix: ${ml.toFixed(0).padStart(4)} mL`,
    totalSimple: (n,a,d)=>` Total: ${n} sprays this season; your field (${a.toFixed(1)} ha) needs ${d.toFixed(0)} mL of limonene in total.`,
    info: {
    "title": "Related Information",
    "items": [
          {
                "heading": "1. Accumulated Temperature | How Larvae Reach the Next Growth Stage",
                "body": "The development speed of pests from egg to larva to pupa is closely tied to temperature. This system uses the concept of \"accumulated temperature\" (degree-days), estimated from weather data, to predict how many days each life stage takes before the insect moults into its next stage.",
                "link": {
                      "href": "https://azai.tari.gov.tw/BugFile/pub/410/%E6%B0%A3%E5%80%99%E8%AE%8A%E9%81%B7%E5%B0%8D%E8%BE%B2%E6%A5%AD%E4%B8%8A%E6%9C%89%E5%AE%B3%E7%94%9F%E7%89%A9%E4%B9%8B%E7%99%BC%E7%94%9F%E5%88%86%E5%B8%83%E5%8F%8A%E5%85%B6%E5%9B%A0%E6%87%89%E8%AA%BF%E9%81%A9%E7%AD%96%E7%95%A5(2020).pdf",
                      "label": "Further reading: Climate Change Impacts on Agricultural Pests — Distribution and Adaptation Strategies (2020) →"
                }
          },
          {
                "heading": "2. Limonene Evaporation Model | How Long a Single Spray Lasts",
                "blocks": [
                      {
                            "p": "This model is built on the vapor pressure calculated from the molecular weight and the Antoine equation, together with a simulation of field droplets shrinking in surface area. In addition to the full-generation length of the rice leaf-roller without intervention, this version also outputs a spray schedule and recommended doses for an entire rice season (120 days)."
                      },
                      {
                            "p": "To predict limonene evaporation, its molecular weight (136.23 g/mol) is plugged into the Antoine equation to calculate vapor pressure. The conventional fixed-surface-area evaporation rate formula is:"
                      },
                      {
                            "math": "<span class=\"fx\"><i>E</i><span class=\"op\">=</span><span class=\"frac\"><span><i>M</i>·<i>K</i>·<i>A</i>·<i>P</i><sub>sat</sub></span><span><i>R</i>·<i>T</i></span></span></span>"
                      },
                      {
                            "p": "However, as limonene volatilizes, both its mass and surface area shrink over time. We therefore replaced the conventional linear formula with a nonlinear solution of the differential equation, involving the cube root of the initial mass (<i>m</i><span class=\"supsub\"><sup>1/3</sup><sub>0</sub></span>) and a combined evaporation coefficient (<i>k</i><sub>evap</sub>):"
                      },
                      {
                            "math": "<span class=\"fx\"><span><i>m</i>(<i>t</i>)</span><span class=\"op\">=</span><span class=\"paren\">(</span><i>m</i><span class=\"supsub\"><sup>1/3</sup><sub>0</sub></span><span class=\"op\">−</span><span class=\"frac\"><span><i>k</i><sub>evap</sub></span><span>3</span></span><span class=\"op\">·</span><i>t</i><span class=\"paren\">)</span><sup class=\"pow\">3</sup></span>"
                      },
                      {
                            "p": "This lets the evaporation rate be calculated with a changing surface area."
                      }
                ]
          },
          {
                "heading": "3. Control Standards for the Rice Leaf-roller",
                "body": "Taiwan's agricultural authorities have established field-monitoring and spraying thresholds for the rice leaf-roller (Cnaphalocrocis medinalis), used to decide whether spraying is warranted.",
                "link": {
                      "href": "https://kmweb.moa.gov.tw/theme_data.php?theme=news&id=50898&sub_theme=attention",
                      "label": "View the official control standards →"
                }
          },
          {
                "heading": "4. Weather Data Source",
                "body": "The weather data used in this system comes from the Chiayi station of the Central Weather Administration's Climate Observation Data Inquire Service (CODiS).",
                "link": {
                      "href": "https://codis.cwa.gov.tw/StationData",
                      "label": "Go to CODiS climate data query →"
                }
          },
          {
                "heading": "5. Damage Caused by the Rice Leaf-roller",
                "list": [
                      "The rice leaf-roller is one of the most important pests of the second rice crop, and one of the most destructive pests across rice ecosystems in Asia.",
                      "In conventional rice grown without pesticides, larvae roll up leaves and hide inside them while feeding, causing severe leaf-whitening damage that prevents grain filling and results in crop loss."
                ]
          },
          {
                "heading": "6. Harms of Pesticides",
                "list": [
                      "Studies show that in intensive agricultural regions of the U.S., farmers and nearby residents face significantly elevated cancer risk from pesticide residues drifting through the air and contaminating water sources.",
                      "Chemical pesticides and pest resistance form a vicious cycle, forcing farmers to constantly rotate and mix different chemicals.",
                      "Long-term pesticide accumulation can cause an 85% drop in new queen bee production, damaging entire colonies.",
                      "Pesticides poison wild pollinators and even affect endangered species such as amphibian tree frogs."
                ]
          },
          {
                "heading": "7. What We Can Do",
                "list": [
                      "Support organic rice to protect the environment and your own health.",
                      "Support eco-labels and choose products with environmentally friendly packaging."
                ]
          }
    ]
},
    about: {
    "title": "About Us",
    "introLabel": "Introduction",
    "paras": [
          "We are No Fold, the CCU-Taiwan iGEM team, formed by students from across National Chung Cheng University — the College of Science, College of Engineering, College of Social Sciences, College of Letters, and the interdisciplinary undergraduate program.",
          "Our team is developing a synthetic-biology-based system to repel the rice leaf-roller, a major agricultural pest, while helping people understand the harms pesticides cause and promoting greater public awareness of organic rice."
    ],
    "linksLabel": "Related Links",
    "links": [
          {
                "label": "Instagram",
                "href": "https://www.instagram.com/ccuigem/"
          },
          {
                "label": "University website",
                "href": "https://igem.ccu.edu.tw/"
          },
          {
                "label": "YouTube",
                "href": "https://www.youtube.com/@ccutaiwanigemteam133/featured"
          },
          {
                "label": "NoFold Mini-Game",
                "href": "https://leilong20060926.github.io/CCU-iGEM-game/"
          },
          {
                "label": "TOAM — Taiwan Organic Agriculture Map",
                "href": "https://igem.xn--hrr.tw/"
          },
          {
                "label": "LimoSim — Limonene Metabolic Simulator",
                "href": "https://ccu-igem-software.onrender.com/"
          }
    ]
}
  }
};
