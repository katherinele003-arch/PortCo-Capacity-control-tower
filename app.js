const modules = {
  vessel: {
    title: "Vessel and berth scheduling",
    copy: "Dynamic berth windows sequence arrivals against quay length, crane reach and tidal constraints so larger vessels are worked first when they unlock the most TEU-hours.",
    impacts: [["Berth delay", 72, "20-30% down"], ["Turnaround", 58, "8-12h saved"], ["Quay utilisation", 64, "+12%"]]
  },
  labour: {
    title: "Crane and labour allocation",
    copy: "Crane gangs are rostered against vessel size, outreach limits and maintenance status, reducing idle berth time without needing every crane replaced immediately.",
    impacts: [["Crane productivity", 68, "+10-15%"], ["Overtime leakage", 42, "Lower"], ["Berth time", 55, "Down"]]
  },
  yard: {
    title: "Yard-stack optimisation",
    copy: "The yard is stacked by mode, customer pickup reliability, reefer demand and rail readiness, so containers do not block high-value moves or consume scarce plugs unnecessarily.",
    impacts: [["Dwell time", 70, "10-20% down"], ["Rehandles", 62, "Down"], ["Yard utilisation", 74, "+10-15%"]]
  },
  reefer: {
    title: "Reefer monitoring",
    copy: "Reefers are assigned to monitored plugs, ranked by cargo value and departure plan, and alerted before power or temperature exceptions become service failures.",
    impacts: [["Reefer uptime", 88, "95%+"], ["Plug conflicts", 58, "Down"], ["Energy visibility", 66, "Up"]]
  },
  truck: {
    title: "Truck appointments and readiness confirmation",
    copy: "Truck slots open only after customs, yard location, equipment and carrier capacity are confirmed, preventing missed pickups and morning gate bunching.",
    impacts: [["Truck turn time", 76, "15-25% down"], ["Missed pickups", 70, "30-40% down"], ["Gate peaks", 62, "Smoothed"]]
  },
  rail: {
    title: "Rail, road and customer visibility",
    copy: "Customers see the same container status as PortCo, with rail capacity reserved earlier and road movements moved into off-peak windows where possible.",
    impacts: [["Rail share", 54, "22% to 30%"], ["Customer calls", 48, "Down"], ["Readiness trust", 78, "Up"]]
  },
  alerts: {
    title: "Predictive congestion and delay alerts",
    copy: "The platform forecasts vessel bunching, gate overload, rail shortfalls and reefer saturation 24-72 hours ahead, then recommends rebalancing actions.",
    impacts: [["Delay prediction", 82, "High"], ["Recovery time", 56, "Faster"], ["Service reliability", 69, "Up"]]
  }
};

const ranks = [
  ["Digital systems", "A$10m", "Coordinates all levers first; fast payback and low construction risk.", 94],
  ["Gate and yard optimisation", "A$7m", "Cuts missed pickups, gate bunching and dwell from the existing footprint.", 90],
  ["Rail opex contract", "A$18m", "Locks peak-period rail capacity so boxes leave the yard earlier.", 82],
  ["Targeted crane retrofit", "A$21m", "Improves large-vessel handling and reduces maintenance risk.", 78],
  ["Reefer infrastructure", "A$55m", "Protects the highest-value growth segment and avoids unpowered-reefer risk.", 76],
  ["Cold-chain partnership", "A$15m", "Creates overflow capacity for refrigerated exports and faster terminal evacuation.", 68],
  ["Major berth/channel works", "Defer", "Prepare feasibility now, but invest only when demand triggers are met.", 42]
];

const slots = [
  ["06:00-07:00", "Full", 100],
  ["07:00-08:00", "Full", 96],
  ["10:00-11:00", "Best slot", 58],
  ["12:00-13:00", "Available", 64],
  ["15:00-16:00", "Available", 48],
  ["20:00-21:00", "Off-peak discount", 34]
];

const timeline = [
  ["Container discharged", "Berth 2, stack C14. Reefer temperature stable at -18 C."],
  ["Readiness confirmed", "Customs cleared, plug assigned, truck lane available."],
  ["Appointment booked", "10:00-11:00 gate window confirmed for BlueLine Transport."],
  ["Inland handoff planned", "Rail capacity reserved if carrier misses pickup window."],
  ["Customer ETA", "Darnley DC arrival forecast: today 16:40."]
];

const interventions = [
  { name: "Reefer infrastructure", capex: 55, ebitdaLow: 8, ebitdaHigh: 12, savingsLow: 1, savingsHigh: 2, active: true, note: "Add 600-800 smart plugs and protect high-value cold-chain cargo." },
  { name: "Crane retrofit", capex: 21, ebitdaLow: 4, ebitdaHigh: 6, savingsLow: 2.5, savingsHigh: 4, active: true, note: "Retrofit 3 cranes, replace highest-risk units later, and reduce maintenance drag." },
  { name: "Inland cold-chain partnership", capex: 15, ebitdaLow: 3, ebitdaHigh: 5, savingsLow: 0, savingsHigh: 0, active: true, note: "Create overflow capacity so reefers leave the terminal earlier." },
  { name: "Digital systems", capex: 10, ebitdaLow: 3, ebitdaHigh: 5, savingsLow: 0.5, savingsHigh: 1, active: true, note: "Control tower, predictive alerts, maintenance data and booking visibility." },
  { name: "Rail opex contract", capex: 18, ebitdaLow: 2, ebitdaHigh: 3, savingsLow: 0, savingsHigh: 0, active: true, note: "Reserve rail capacity in peak periods to release yard space." },
  { name: "Gate and yard optimisation", capex: 7, ebitdaLow: 1.5, ebitdaHigh: 2.5, savingsLow: 0, savingsHigh: 0, active: true, note: "Dedicated zones, extended gates and readiness-based appointments." },
  { name: "Program contingency", capex: 9, ebitdaLow: 0, ebitdaHigh: 0, savingsLow: 0, savingsHigh: 0, active: true, note: "Delivery governance and implementation risk buffer." },
  { name: "Pricing implementation", capex: 2, ebitdaLow: 0.5, ebitdaHigh: 0.5, savingsLow: 0, savingsHigh: 0, active: true, note: "Support off-peak incentives and service-level charging." }
];

const forecastData = {
  base: {
    tiles: [["Minimum spare capacity", "6%", "Reefer plugs on Fri"], ["Peak berth load", "94%", "Tue and Wed"], ["Truck gate headroom", "11%", "Morning peak"], ["Rail slots open", "18", "Next 7 days"]],
    days: [
      ["Mon", 16, [22, 18, 10, 14, 20]],
      ["Tue", 9, [6, 13, 8, 11, 15]],
      ["Wed", 12, [8, 10, 14, 16, 13]],
      ["Thu", 18, [18, 16, 12, 22, 21]],
      ["Fri", 6, [12, 8, 4, 10, 11]],
      ["Sat", 24, [28, 22, 18, 24, 30]],
      ["Sun", 31, [34, 28, 24, 35, 36]]
    ],
    actions: [
      ["Move Friday reefers first", "Reserve 126 plugs for perishable exports and send low-risk dry boxes to off-peak collection."],
      ["Smooth Tue/Wed vessel calls", "Bring forward one feeder vessel and delay one low-priority call by six hours."],
      ["Open off-peak truck incentives", "Apply the 8% off-peak discount where gate headroom is above 20%."]
    ]
  },
  platform: {
    tiles: [["Minimum spare capacity", "14%", "Truck gate on Tue"], ["Peak berth load", "86%", "Wed"], ["Truck gate headroom", "23%", "After re-slotting"], ["Rail slots open", "31", "Next 7 days"]],
    days: [
      ["Mon", 24, [30, 26, 18, 24, 24]],
      ["Tue", 14, [16, 20, 17, 14, 20]],
      ["Wed", 17, [14, 18, 19, 20, 16]],
      ["Thu", 27, [28, 24, 22, 31, 29]],
      ["Fri", 18, [22, 18, 16, 19, 20]],
      ["Sat", 34, [36, 32, 30, 35, 38]],
      ["Sun", 39, [42, 36, 34, 42, 41]]
    ],
    actions: [
      ["Approve digital-first package", "The forecast shows the control tower creates capacity before heavy civil works finish."],
      ["Lock rail windows earlier", "Reserve peak-period rail capacity before import boxes reach the terminal yard."],
      ["Release appointments by readiness", "Open truck slots only for cleared, located and serviceable containers."]
    ]
  },
  stress: {
    tiles: [["Minimum spare capacity", "-3%", "Reefer plugs on Fri"], ["Peak berth load", "103%", "Tue"], ["Truck gate headroom", "2%", "Morning peak"], ["Rail slots open", "5", "Next 7 days"]],
    days: [
      ["Mon", 8, [12, 9, 5, 7, 9]],
      ["Tue", -2, [-3, 4, 2, 3, 5]],
      ["Wed", 4, [1, 3, 8, 6, 4]],
      ["Thu", 10, [9, 8, 6, 14, 12]],
      ["Fri", -3, [4, 2, -3, 2, 3]],
      ["Sat", 15, [18, 14, 11, 16, 17]],
      ["Sun", 22, [24, 20, 17, 26, 25]]
    ],
    actions: [
      ["Declare capacity protection mode", "Prioritise reefers, rail-ready boxes and vessels with the highest TEU-hours released."],
      ["Block unready truck bookings", "Stop carriers booking against boxes that are not cleared or physically available."],
      ["Escalate overflow plan", "Use inland storage partners and temporary reefer generators before Friday saturation."]
    ]
  }
};

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function showToast(message) {
  const toast = qs("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderRanks() {
  qs("#rankList").innerHTML = ranks.map((rank, index) => `
    <div class="rank-card">
      <div class="rank-top"><span>${index + 1}. ${rank[0]}</span><span>${rank[1]}</span></div>
      <p>${rank[2]}</p>
      <div class="bar"><span style="width:${rank[3]}%"></span></div>
    </div>
  `).join("");
}

function renderModule(key) {
  const item = modules[key];
  qs("#moduleTitle").textContent = item.title;
  qs("#moduleCopy").textContent = item.copy;
  qs("#impactBars").innerHTML = item.impacts.map(row => `
    <div class="impact-row">
      <span>${row[0]}</span>
      <div class="bar"><span style="width:${row[1]}%"></span></div>
      <strong>${row[2]}</strong>
    </div>
  `).join("");
  qsa(".module").forEach(button => button.classList.toggle("active", button.dataset.module === key));
}

function renderSlots() {
  const select = qs("#slotSelect");
  const slotBoard = qs("#slots");
  select.innerHTML = slots.map(slot => `<option>${slot[0]} - ${slot[1]}</option>`).join("");
  slotBoard.innerHTML = slots.map(slot => {
    const klass = slot[1] === "Full" ? "full" : slot[1] === "Best slot" ? "best" : "";
    return `<div class="slot ${klass}"><strong>${slot[0]}</strong><span>${slot[1]} - gate load ${slot[2]}%</span><div class="bar"><span style="width:${slot[2]}%"></span></div></div>`;
  }).join("");
}

function renderTimeline() {
  qs("#timeline").innerHTML = timeline.map(item => `
    <div class="timeline-item">
      <span class="timeline-dot"></span>
      <div><strong>${item[0]}</strong><p>${item[1]}</p></div>
    </div>
  `).join("");
}

function renderInterventions() {
  qs("#interventionControls").innerHTML = `<div class="control-list">${interventions.map((item, index) => `
    <div class="control-row">
      <div>
        <strong>${item.name}</strong>
        <p>A$${item.capex}m | ${item.note}</p>
      </div>
      <button class="switch ${item.active ? "active" : ""}" data-index="${index}" aria-label="Toggle ${item.name}"></button>
    </div>
  `).join("")}</div>`;
  qsa(".switch").forEach(button => {
    button.addEventListener("click", () => {
      interventions[Number(button.dataset.index)].active = !interventions[Number(button.dataset.index)].active;
      renderInterventions();
      renderScenario();
    });
  });
}

function renderScenario() {
  const active = interventions.filter(item => item.active);
  const capex = active.reduce((sum, item) => sum + item.capex, 0);
  const ebitdaLow = active.reduce((sum, item) => sum + item.ebitdaLow, 0);
  const ebitdaHigh = active.reduce((sum, item) => sum + item.ebitdaHigh, 0);
  const savingsLow = active.reduce((sum, item) => sum + item.savingsLow, 0);
  const savingsHigh = active.reduce((sum, item) => sum + item.savingsHigh, 0);
  const payback = ebitdaHigh ? capex / ebitdaHigh : 0;
  qs("#capexOut").textContent = `A$${capex}m`;
  qs("#capacityOut").textContent = `A$${ebitdaLow}-${ebitdaHigh}m`;
  qs("#efficiencyOut").textContent = `A$${savingsLow}-${savingsHigh}m`;
  qs("#paybackOut").textContent = midpoint ? `~${payback.toFixed(1)} years` : "N/A";
  qs("#recommendationCopy").textContent = capex > 137
    ? "This exceeds the A$137m first-phase package. Keep the high-return operating levers and defer major berth and channel works until demand triggers are clear."
    : "Recommended answer: invest in the A$137m operational relief package first. It targets the bottlenecks causing vessel waits, reefer saturation, yard dwell and gate bunching, while preserving the A$1.2bn development envelope for later downstream growth.";
}

function renderForecast(mode = qs("#forecastMode")?.value || "base") {
  const forecast = forecastData[mode];
  qs("#forecastSummary").innerHTML = forecast.tiles.map(tile => `
    <div class="forecast-tile">
      <span>${tile[0]}</span>
      <strong>${tile[1]}</strong>
      <small>${tile[2]}</small>
    </div>
  `).join("");

  qs("#forecastChart").innerHTML = forecast.days.map(day => `
    <div class="forecast-row">
      <div class="forecast-day">${day[0]}</div>
      <div class="capacity-stack">
        ${day[2].map((value, index) => {
          const label = ["Berth", "Yard", "Reefer", "Gate", "Rail"][index];
          const status = value < 5 ? "critical" : value < 15 ? "tight" : "";
          return `<div class="capacity-cell ${status}" title="${label} spare capacity">${value}%</div>`;
        }).join("")}
      </div>
      <div class="forecast-score">${day[1]}% avg free</div>
    </div>
  `).join("");

  qs("#forecastActions").innerHTML = forecast.actions.map(action => `
    <div class="action-card">
      <strong>${action[0]}</strong>
      <span>${action[1]}</span>
    </div>
  `).join("");
}

qsa(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    qsa(".nav-item").forEach(item => item.classList.remove("active"));
    qsa(".view").forEach(view => view.classList.remove("active"));
    button.classList.add("active");
    qs(`#${button.dataset.view}`).classList.add("active");
  });
});

qsa(".module").forEach(button => {
  button.addEventListener("click", () => renderModule(button.dataset.module));
});

qs("#rebalanceBtn").addEventListener("click", () => {
  renderModule("alerts");
  showToast("Rebalance complete: move 14% of morning trucks to off-peak, reserve two rail paths, and protect 126 reefer plugs.");
});

qs("#bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  showToast("Appointment confirmed. Container readiness, yard location and carrier capacity are now locked.");
});

qs("#forecastMode").addEventListener("change", event => {
  renderForecast(event.target.value);
});

renderRanks();
renderModule("vessel");
renderSlots();
renderTimeline();
renderForecast();
renderInterventions();
renderScenario();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
