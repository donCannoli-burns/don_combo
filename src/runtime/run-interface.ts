// @ts-nocheck
// Passive Don Combo CLI observation report. No KoL actions and no network calls.
// Kept in ES2018 syntax so the release bundle can embed the same pure helpers.
export function startRunInterface(requested, startedAt, routeMode) {
  return {
    schema: "don-combo-cli-run/v0.1",
    started_at: new Date(startedAt).toISOString(),
    requested_combs: requested,
    route_mode: routeMode,
    observations: [],
    counts: { event_tiles: 0, scratched_fronts: 0, any_rare_tiles: 0, uncommon_rare_tiles: 0,
      ultra_rare_tiles: 0, revisited_tiles: 0, high_scratch: 0,
      very_high_scratch: 0, sand_castles: 0, twinkles: 0, whales: 0,
      message_bottles: 0, driftwood: 0, cursed_gear: 0,
      meteorite: 0, rainbow_pearl: 0, route_target_matches: 0 },
  };
}
function layoutHas(layout, symbol) {
  return String(layout || "").split(",").some(function (row) {
    var p = row.split(":");
    return p.length === 2 && p[1].indexOf(symbol) >= 0;
  });
}
function plannedCombed(layout, row, col) {
  return String(layout || "").split(",").some(function (part) {
    var p = part.split(":");
    return p.length === 2 && Number(p[0]) === row && p[1].charAt(col) === "c";
  });
}
function scratchSize(layout) {
  var total = 0;
  var seen = {};
  var parts = String(layout || "").split(",");
  for (var i = 0; i < parts.length; i++) {
    var match = /^(\d+):([A-Za-z?]{10})$/.exec(parts[i]);
    if (!match || seen[match[1]]) continue;
    seen[match[1]] = true;
    total += (match[2].match(/[cC]/g) || []).length;
  }
  return total;
}
export function observeRunAction(report, action) {
  if (!report) return { observed: false, names: [] };
  var labels = [];
  var add = function (name) { if (labels.indexOf(name) < 0) labels.push(name); };
  var count = report.counts;
  var size = scratchSize(action.layout);
  if (size > 0) { count.scratched_fronts++; add("scratch_observed"); }
  if (size >= 6) { count.high_scratch++; add("high_scratch"); }
  if (size >= 11) { count.very_high_scratch++; add("very_high_scratch"); }
  if (layoutHas(action.layout, "C") || String(action.outcome).indexOf("sand_castle") === 0) {
    count.sand_castles++; add("sand_castle");
  }
  if (layoutHas(action.layout, "t") || action.outcome === "twinkle_fallback") {
    count.twinkles++; add("twinkle");
  }
  if (layoutHas(action.layout, "W") || action.outcome === "whale") {
    count.whales++; add("beached_whale");
  }
  var bottle = String(action.output || "").split(/\r?\n/).some(function (line) {
    return /^\s*(?:>\s*)?You found a message in a bottle!\s*$/i.test(line.trim());
  });
  if (bottle) { count.message_bottles++; add("message_in_a_bottle"); }
  var rare = false, uncommon = bottle || action.outcome === "whale", ultra = false;
  var items = action.items || {};
  Object.keys(items).forEach(function (name) {
    if (!(items[name] > 0)) return;
    var n = name.toLowerCase().replace(/\s+/g, " ").trim();
    if (n === "piece of driftwood") {
      count.driftwood++; rare = true; add("piece_of_driftwood");
    } else if (/^cursed(?: pirate)? (?:tricorn hat|tricorn|swash buckle|swashbuckle|cutlass)$/.test(n)) {
      count.cursed_gear++; rare = true; uncommon = true; add("cursed_pirate_gear");
    } else if (n === "meteorite fragment") {
      count.meteorite++; rare = true; ultra = true; add("meteorite_fragment");
    } else if (n === "rainbow pearl") {
      count.rainbow_pearl++; rare = true; ultra = true; add("rainbow_pearl");
    }
  });
  // Encounter-only bottle/whale are admitted to the inclusive scarce ladder.
  if (uncommon) rare = true;
  if (rare) count.any_rare_tiles++;
  if (uncommon) count.uncommon_rare_tiles++;
  if (ultra) count.ultra_rare_tiles++;
  var watersheep = report.route_mode.indexOf("watersheep-") === 0;
  var revisit = watersheep && plannedCombed(action.layout, action.planned_row, action.planned_col);
  if (revisit) { count.revisited_tiles++; add("planned_rare_revisit"); }
  if (watersheep && action.planned_row === action.actual_row &&
      action.planned_col === action.actual_col) count.route_target_matches++;
  if (labels.length > 0) count.event_tiles++;
  report.observations.push({ minute: action.minute, row: action.actual_row,
    column: action.actual_col, outcome: action.outcome, labels: labels,
    planned_revisit: revisit, scratch_count: size });
  return { observed: labels.length > 0, names: labels };
}
export function runProgress(spent, requested) {
  return "+ (" + String(spent).padStart(4, "0") + "/" +
    String(requested).padStart(4, "0") + ") -- turns(spent/requested)";
}
function runRate(value, total) {
  return value + "/" + total + " (" + (total ? (100 * value / total).toFixed(2) : "0.00") + "%)";
}
export function renderRunObservation(report, completed, finishedAt) {
  var c = report.counts;
  var elapsed = Math.max(0, finishedAt - Date.parse(report.started_at));
  var mins = Math.floor(elapsed / 60000);
  var secs = Math.floor(elapsed / 1000) % 60;
  var millis = Math.floor(elapsed % 1000);
  var duration = mins + "m " + String(secs).padStart(2, "0") + "s " +
    String(millis).padStart(3, "0") + "ms";
  var rows = ["+ === OBSERVATION ===",
    "+ timestamp: " + new Date(finishedAt).toISOString(),
    "+ event_tiles: " + runRate(c.event_tiles, completed),
    "+ scratches_any: " + runRate(c.scratched_fronts, completed),
    "+ high_scratch: " + runRate(c.high_scratch, completed),
    "+ very_high_scratch: " + runRate(c.very_high_scratch, completed),
    "+ sand_castles: " + runRate(c.sand_castles, completed),
    "+ twinkles: " + runRate(c.twinkles, completed),
    "+ beached_whale: " + runRate(c.whales, completed),
    "+ message_in_a_bottle: " + runRate(c.message_bottles, completed),
    "+ any_rare_tiles: " + runRate(c.any_rare_tiles, completed),
    "+ uncommon_rare_tiles: " + runRate(c.uncommon_rare_tiles, completed),
    "+ ultra_rare_tiles: " + runRate(c.ultra_rare_tiles, completed),
    "+ piece_of_driftwood: " + runRate(c.driftwood, completed),
    "+ cursed_pirate_gear: " + runRate(c.cursed_gear, completed),
    "+ meteorite_fragment: " + runRate(c.meteorite, completed),
    "+ rainbow_pearl: " + runRate(c.rainbow_pearl, completed)];
  if (report.route_mode.indexOf("watersheep-") === 0) {
    rows.push("+ revisited_tiles (planned already-combed): " + runRate(c.revisited_tiles, completed));
    rows.push("+ correctly_predicted_tiles: N/A (WaterSheep scores uncalibrated; no verified prediction label)");
    rows.push("+ planned_target_actually_combed: " + runRate(c.route_target_matches, completed));
  } else {
    rows.push("+ revisited_tiles: N/A (only classified for WaterSheep routes)");
    rows.push("+ correctly_predicted_tiles: N/A (no WaterSheep prediction)");
  }
  rows.push("+ total IRL time: " + duration);
  rows.push("+ average time per completed comb: " +
    (completed ? (elapsed / completed / 1000).toFixed(3) + "s" : "N/A (0 combs)"));
  rows.push("+ note: event categories overlap; only item deltas/native bottle/whale actions count as rare finds.");
  return rows;
}
export function priceCacheFromText(text) {
  var cache = {};
  var lines = String(text || "").split(/\r?\n/);
  // KoLmafia mallprices.txt version 0xF00D5, rows: item_id TAB timestamp TAB price.
  if (!lines.length || Number(lines[0].trim()) !== 983253) return { prices: cache, valid: false };
  for (var i = 1; i < lines.length; i++) {
    var fields = lines[i].trim().split(/\s+/);
    if (fields.length < 3) continue;
    var id = Number(fields[0]), ts = Number(fields[1]), price = Number(fields[2]);
    if (!Number.isInteger(id) || id < 1 || !Number.isFinite(ts) || ts <= 0 ||
      !Number.isInteger(price) || price <= 0 || price > 999999999) continue;
    if (!cache[id] || cache[id].timestamp < ts) cache[id] = { timestamp: ts, price: price };
  }
  return { prices: cache, valid: true };
}
// KoLmafia's Rhino Number.toLocaleString does not accept "en-US"; in some
// revisions it treats that argument as a radix, causing "illegal radix 0".
export function formatMeatNumber(value) {
  var pieces = String(value).split(".");
  pieces[0] = pieces[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return pieces.join(".");
}
export function renderRunValue(items, rawMeat, cachedText) {
  var cache = priceCacheFromText(cachedText);
  var rows = ["+ === VALUE ===",
    "+ source: local KoLmafia data/mallprices.txt (historical cache only; no Mall requests)"];
  var priced = 0, unknown = 0, total = rawMeat;
  var details = items.map(function (e) {
    var id = Number(e.id), quantity = Number(e.quantity);
    var hit = cache.prices[id];
    var price = hit ? hit.price : null;
    if (price === null) unknown++;
    else { priced++; total += quantity * price; }
    return { name: e.name, quantity: quantity, price: price,
      subtotal: price === null ? null : quantity * price, price_timestamp: hit ? hit.timestamp : null };
  });
  details.sort(function (a,b) { return (b.subtotal || 0) - (a.subtotal || 0); });
  details.forEach(function (d) {
    rows.push("+ " + d.name + " | " + d.quantity + " x " +
      (d.price === null ? "N/A" : formatMeatNumber(d.price)) + " = " +
      (d.subtotal === null ? "unknown" : formatMeatNumber(d.subtotal)) + " meat");
  });
  rows.push("+ raw meat: " + formatMeatNumber(rawMeat));
  rows.push("+ est final total: " + formatMeatNumber(total) +
    " meat" + (unknown ? " (known-price subtotal; " + unknown + " unpriced item types)" : ""));
  if (!cache.valid) rows.push("+ cached price file missing or incompatible; unknown items not valued.");
  return { lines: rows, priced: priced, unpriced: unknown,
    estimated_total_known_meat: total, file_valid: cache.valid, items: details };
}
