'use strict';

var kolmafia = require('kolmafia');

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var WATERSHEEP_EVIDENCE_CONTRACT = "don-combo-watersheep-evidence/v1";
function fact(kind, name, state, value, source) {
  return {
    kind,
    name,
    state,
    value,
    source
  };
}
function relation(relationName, left, right, truth, basis) {
  return {
    relation: relationName,
    left,
    right,
    truth,
    basis
  };
}
function decodeRuntimeRequest(raw) {
  if (raw.schema !== "kol-runtime-request/v1") throw new Error("unsupported runtime request schema");
  if (!raw.id) throw new Error("runtime request id is required");
  if (raw.capability !== "don-combo-matrix" && raw.capability !== "excavator-smoke") {
    throw new Error("unsupported runtime capability");
  }
  if (raw.action !== "refresh" && raw.action !== "smoke") {
    throw new Error("unsupported runtime action");
  }
  if ((raw.authority || "none") !== "none") throw new Error("runtime request must be advisory");
  return {
    schema: "kol-runtime-request/v1",
    id: raw.id,
    capability: raw.capability,
    action: raw.action,
    reason: raw.reason || "manual",
    authority: "none",
    event: raw.event,
    meta: raw.meta,
    page: raw.page
  };
}

// Read-only historical baseline assembled from the full *local* event log and
// raretiles.json. This does not change the game, model weights, or source files.
// The historic corpus is a location catalogue, NOT a dated harvest record.

var key$1 = (minute, row, column) => "".concat(minute, ",").concat(row, ",").concat(column);
var empty = () => ({
  recorded_in_rare_catalogue: true,
  prior_target_observations: 0,
  legacy_unbound_observations: 0,
  run_bound_observations: 0,
  rare_target_attempts: 0,
  confirmed_combed_preactions: 0,
  visible_twinkles_at_target: 0,
  first_target_observed_at: null,
  last_target_observed_at: null,
  last_rare_attempt_at: null,
  days_since_last_rare_attempt: null,
  elapsed_days_between_target_attempts: [],
  verified_rare_harvests: null,
  observed_respawn_intervals: null,
  provenance: "historical-coordinate-catalogue-and-ml-events"
});
function symbolAt$1(layout, row, column) {
  var _iterator = _createForOfIteratorHelper(String(layout || "").split(",")),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var part = _step.value;
      var colon = part.indexOf(":");
      if (colon < 0 || Number(part.slice(0, colon)) !== row) continue;
      return part.slice(colon + 1).charAt(column) || null;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return null;
}
function validEpoch(value) {
  var n = Date.parse(value);
  return Number.isFinite(n) ? n : null;
}
function buildHistoricalRareIndex(points, events, nowMs) {
  var byTile = {};
  var excluded = 0;
  var _iterator2 = _createForOfIteratorHelper(points),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var point = _step2.value;
      if (point.false_rare) {
        excluded++;
        continue;
      }
      var _coord = key$1(point.minute, point.row, point.column);
      byTile[_coord] ?? (byTile[_coord] = empty());
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var seenIds = new Set();
  var hits = {};
  var considered = 0;
  var matched = 0;
  var legacy = 0;
  var bound = 0;
  var attempts = 0;
  var _iterator3 = _createForOfIteratorHelper(events),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _event$run_context;
      var event = _step3.value;
      if (event.event_id && seenIds.has(event.event_id)) continue;
      if (event.event_id) seenIds.add(event.event_id);
      considered++;
      var planned = event.planned_target;
      if (!planned || planned.minute !== event.minute) continue;
      var _coord2 = key$1(planned.minute, planned.row, planned.column);
      var evidence = byTile[_coord2];
      if (!evidence) continue;
      var when = validEpoch(event.observed_at);
      // Ignore future events and bad timestamps, never manufacture a date.
      if (when !== null && when > nowMs) continue;
      matched++;
      evidence.prior_target_observations++;
      var isBound = !!((_event$run_context = event.run_context) !== null && _event$run_context !== void 0 && _event$run_context.run_id);
      if (isBound) {
        bound++;
        evidence.run_bound_observations++;
      } else {
        legacy++;
        evidence.legacy_unbound_observations++;
      }
      if (when !== null) {
        var stamp = new Date(when).toISOString();
        if (!evidence.first_target_observed_at || stamp < evidence.first_target_observed_at) evidence.first_target_observed_at = stamp;
        if (!evidence.last_target_observed_at || stamp > evidence.last_target_observed_at) evidence.last_target_observed_at = stamp;
      }
      var symbol = symbolAt$1(event.layout, planned.row, planned.column);
      if (symbol === "c") evidence.confirmed_combed_preactions++;
      if (symbol === "t") evidence.visible_twinkles_at_target++;
      var actual = event.actual_comb;
      if (event.outcome === "rare_target" && (actual === null || actual === void 0 ? void 0 : actual.minute) === planned.minute && actual.row === planned.row && actual.column === planned.column) {
        attempts++;
        evidence.rare_target_attempts++;
        if (when !== null) {
          (hits[_coord2] ?? (hits[_coord2] = [])).push(when);
          var _stamp = new Date(when).toISOString();
          if (!evidence.last_rare_attempt_at || _stamp > evidence.last_rare_attempt_at) evidence.last_rare_attempt_at = _stamp;
        }
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  for (var _i = 0, _Object$entries = Object.entries(byTile); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      coord = _Object$entries$_i[0],
      entry = _Object$entries$_i[1];
    var timestamps = _toConsumableArray(new Set(hits[coord] || [])).sort((a, b) => a - b);
    for (var i = 1; i < timestamps.length; i++) entry.elapsed_days_between_target_attempts.push(Math.round((timestamps[i] - timestamps[i - 1]) / 86400000 * 1000) / 1000);
    entry.days_since_last_rare_attempt = entry.last_rare_attempt_at ? Math.max(0, Math.round((nowMs - Date.parse(entry.last_rare_attempt_at)) / 86400000 * 1000) / 1000) : null;
  }
  var entries = Object.values(byTile);
  return {
    baseline: {
      schema: "don-combo-historical-rare-baseline/v0.1",
      catalogue_coordinates: entries.length,
      catalogue_false_rare_excluded: excluded,
      events_scanned: events.length,
      distinct_events_considered: considered,
      historical_observations_matched: matched,
      legacy_unbound_observations: legacy,
      run_bound_observations: bound,
      rare_target_attempts: attempts,
      coordinates_with_observations: entries.filter(x => x.prior_target_observations > 0).length,
      coordinates_with_rare_attempts: entries.filter(x => x.rare_target_attempts > 0).length,
      verified_rare_harvests: null,
      completed_respawn_intervals: null,
      note: "All locally recorded ML events are scanned. Historical catalogue locations have no dates. Rare-target actions are not confirmed rare-item harvests; repeated attempts are not verified respawn intervals. No synthetic training samples or cooldown probabilities."
    },
    byTile
  };
}
function historicalRareForTile(index, minute, row, column) {
  return index.byTile[key$1(minute, row, column)] || null;
}

/* eslint-disable eqeqeq */
// Evidence is per coordinate, not per beachfront. Unknown is not a successful harvest.

function tileKey(minute, row, column) {
  return "".concat(minute, ",").concat(row, ",").concat(column);
}
function emptyRecoveryLedger() {
  return {
    schema: "don-combo-tile-recovery/v0.1",
    tiles: {},
    updated_at: null
  };
}
function recoveryFeatures(entry, nowEpoch) {
  var age = epoch => epoch == null || epoch > nowEpoch ? null : Math.round((nowEpoch - epoch) / 8640) / 10;
  var days = entry ? age(entry.last_harvest_epoch) : null;
  var intervals = (entry === null || entry === void 0 ? void 0 : entry.recovery_intervals) || [];
  var lastInterval = intervals.length ? intervals[intervals.length - 1] : null;
  var observedRespawn = !!(entry !== null && entry !== void 0 && entry.last_harvest_epoch) && !!lastInterval && lastInterval.first_available_epoch >= entry.last_harvest_epoch;
  var stillCombed = !!(entry !== null && entry !== void 0 && entry.last_harvest_epoch) && !!entry.last_combed_epoch && entry.last_combed_epoch >= entry.last_harvest_epoch && entry.last_state === "combed";
  return {
    observations: (entry === null || entry === void 0 ? void 0 : entry.observations) || 0,
    harvests: (entry === null || entry === void 0 ? void 0 : entry.harvests) || 0,
    last_state: (entry === null || entry === void 0 ? void 0 : entry.last_state) || "unknown",
    days_since_harvest: days,
    days_since_observed: entry ? age(entry.last_seen_epoch) : null,
    last_harvest_item: (entry === null || entry === void 0 ? void 0 : entry.last_harvest_item) || null,
    harvest_evidence: (entry === null || entry === void 0 ? void 0 : entry.last_harvest_provenance) || "unknown",
    still_combed_after_harvest: stillCombed,
    respawn_observed_after_harvest: observedRespawn,
    completed_intervals: intervals.length,
    cooldown_lower_days: (lastInterval === null || lastInterval === void 0 ? void 0 : lastInterval.lower_days) ?? null,
    cooldown_upper_days: (lastInterval === null || lastInterval === void 0 ? void 0 : lastInterval.upper_days) ?? null,
    // Explicitly a policy heuristic, NOT a fitted chance of respawn.
    revisit_signal: days == null ? null : Math.min(1, Math.max(0, days / 12)),
    revisit_signal_kind: days == null ? "UNKNOWN" : "12_DAY_EXPLORATION_HEURISTIC_NOT_PROBABILITY"
  };
}

// Scratch density is a count of PRE-ACTION "c" (already-combed) beach
// squares in the visible KoLmafia _beachLayout, not a discovered rare drop.
// Day buckets use UTC calendar dates, consistently for old and new events,
// to avoid inventing KoL game-day identity for legacy unbound observations.
var SCRATCH_LEDGER_SCHEMA = "don-combo-scratch-observations/v0.1";
var SCRATCH_HIGH_THRESHOLD = 6;
var SCRATCH_VERY_INTERESTING_THRESHOLD = 11;
function emptyScratchLedger(player) {
  return {
    schema: SCRATCH_LEDGER_SCHEMA,
    player_id: player,
    fronts: {},
    updated_at: null
  };
}

// Strictly parse the rows we were able to see. Hidden tidal rows are absent
// and never assumed to be zero scratches. Invalid/duplicate rows are rejected.
function scratchCount(layout) {
  var rows = new Set();
  var scratches = 0;
  var visible = 0;
  var _iterator = _createForOfIteratorHelper(String(layout || "").split(",")),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var part = _step.value;
      var match = /^(\d+):([A-Za-z?]{10})$/.exec(part.trim());
      if (!match) return null;
      var row = Number(match[1]);
      if (row < 1 || row > 10 || rows.has(row)) return null;
      rows.add(row);
      visible += 10;
      scratches += (match[2].match(/[cC]/g) || []).length;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return rows.size > 0 ? {
    scratches,
    visible
  } : null;
}
function normalizeTime(value) {
  var ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}
function addScratchVisit(ledger, minute, layout, observedAt, provenance) {
  var _ledger$fronts, _String;
  var observation = scratchCount(layout);
  var timestamp = normalizeTime(observedAt);
  if (!Number.isInteger(minute) || minute < 1 || minute > 10000 || !observation || !timestamp) return false;
  var day = timestamp.slice(0, 10);
  var front = (_ledger$fronts = ledger.fronts)[_String = String(minute)] ?? (_ledger$fronts[_String] = {
    days: {}
  });
  var existing = front.days[day];
  var source = existing ? existing.provenance === provenance ? provenance : "both" : provenance;
  front.days[day] = {
    max_scratches: Math.max((existing === null || existing === void 0 ? void 0 : existing.max_scratches) ?? 0, observation.scratches),
    visible_cells_at_max: !existing || observation.scratches >= existing.max_scratches ? observation.visible : existing.visible_cells_at_max,
    last_observed_at: !existing || timestamp > existing.last_observed_at ? timestamp : existing.last_observed_at,
    provenance: source
  };
  if (!ledger.updated_at || timestamp > ledger.updated_at) ledger.updated_at = timestamp;
  return true;
}
function evidenceForScratchFront(ledger, minute) {
  var _ledger$fronts$String;
  var days = ((_ledger$fronts$String = ledger.fronts[String(minute)]) === null || _ledger$fronts$String === void 0 ? void 0 : _ledger$fronts$String.days) || {};
  var dates = Object.keys(days).sort();
  var high = dates.filter(day => days[day].max_scratches >= SCRATCH_HIGH_THRESHOLD);
  var very = dates.filter(day => days[day].max_scratches >= SCRATCH_VERY_INTERESTING_THRESHOLD);
  var max = dates.reduce((v, day) => Math.max(v, days[day].max_scratches), 0);
  // A single observation matters; repeated distinct-day evidence compounds
  // interest but can never become an unbounded positive-feedback loop.
  var base = max >= 11 ? 0.7 : max >= 6 ? 0.35 : 0;
  var repeatBonus = Math.min(0.2, Math.max(0, high.length - 1) * 0.08);
  var veryRepeatBonus = Math.min(0.1, Math.max(0, very.length - 1) * 0.05);
  var interest = Math.min(1, Math.round((base + repeatBonus + veryRepeatBonus) * 1000) / 1000);
  return {
    schema: "don-combo-scratch-interest/v0.1",
    unit: "visible-pre-action-combed-squares",
    day_basis: "UTC-calendar-date",
    front_minute: minute,
    observed_days: dates.length,
    high_scratch_days: high.length,
    very_interesting_days: very.length,
    repeat_high_days: Math.max(0, high.length - 1),
    max_scratch_count: max,
    last_high_day: high[high.length - 1] || null,
    interest_score: interest,
    interest_kind: "BOUNDED_EXPLORATION_HEURISTIC_NOT_RARE_PROBABILITY",
    evidence_source: "historical-and-live-layout-observations"
  };
}

// Merge the persistent live ledger and the FULL ML-event history. Daily maxima
// ensure a visited beach cannot earn extra interest simply by being revisited
// repeatedly during one day. IDs are de-duplicated where available.
function backfillScratchHistory(persisted, events, nowMs) {
  var ledger = {
    schema: SCRATCH_LEDGER_SCHEMA,
    player_id: persisted.player_id,
    updated_at: persisted.updated_at,
    fronts: JSON.parse(JSON.stringify(persisted.fronts || {}))
  };
  var seen = new Set();
  var imported = 0;
  var _iterator2 = _createForOfIteratorHelper(events),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _event$run_context;
      var event = _step2.value;
      var eventPlayer = (_event$run_context = event.run_context) === null || _event$run_context === void 0 ? void 0 : _event$run_context.player_id;
      if (typeof eventPlayer === "number" && eventPlayer !== persisted.player_id) continue;
      if (event.event_id && seen.has(event.event_id)) continue;
      if (event.event_id) seen.add(event.event_id);
      var date = Date.parse(event.observed_at);
      if (!Number.isFinite(date) || date > nowMs) continue;
      if (addScratchVisit(ledger, event.minute, event.layout, event.observed_at, "historical")) imported++;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return {
    ledger,
    imported
  };
}
function summarizeScratchLedger(ledger, importedHistoricalEvents) {
  var minutes = Object.keys(ledger.fronts);
  var fronts = minutes.map(minute => evidenceForScratchFront(ledger, Number(minute)));
  var days = new Set();
  for (var _i = 0, _Object$values = Object.values(ledger.fronts); _i < _Object$values.length; _i++) {
    var front = _Object$values[_i];
    for (var _i2 = 0, _Object$keys = Object.keys(front.days); _i2 < _Object$keys.length; _i2++) {
      var day = _Object$keys[_i2];
      days.add(day);
    }
  }
  return {
    schema: "don-combo-scratch-summary/v0.1",
    fronts_observed: fronts.length,
    fronts_high: fronts.filter(x => x.high_scratch_days > 0).length,
    fronts_very_interesting: fronts.filter(x => x.very_interesting_days > 0).length,
    fronts_repeated_high: fronts.filter(x => x.high_scratch_days > 1).length,
    recorded_utc_days: days.size,
    imported_historical_events: importedHistoricalEvents,
    note: "Scratch count = pre-action c/combed squares in visible rows. >5 high, >=11 very interesting. Per-UTC-day maxima and bounded repeat-day interest; not a rare or respawn probability."
  };
}

// Experimental dual-pool cooldown observation. The rarity ladder is a
// user-supplied HYPOTHESIS, not a discovered KoL rule or learned probability.
// Evidence comes solely from recorded layouts, exact item deltas and actions.

var tier = (pool, kind, grade, certainty, quantity, item_name) => ({
  pool,
  kind,
  tier: grade,
  certainty,
  quantity,
  item_name
});
var key = c => "".concat(c.minute, ",").concat(c.row, ",").concat(c.column);
function poolForItem(item, quantity) {
  if (!Number.isFinite(quantity) || quantity <= 0) return null;
  var n = item.toLowerCase().replace(/\s+/g, " ").trim();
  if (n === "rainbow pearl") return tier("pool_1", "rainbow_pearl", "rare_rare", "item-delta", quantity, item);
  if (n === "piece of driftwood") return tier("pool_2", "piece_of_driftwood", "common_rare", "item-delta", quantity, item);
  if (n === "meteorite fragment") return tier("pool_2", "meteorite_fragment", "rare_rare", "item-delta", quantity, item);
  // Exact restricted equipment family; excludes ordinary swashbuckling loot.
  if (/^cursed(?: pirate)? (?:tricorn hat|tricorn|swash buckle|swashbuckle|cutlass)$/.test(n)) return tier("pool_2", "cursed_pirate_gear", "uncommon_rare", "item-delta", quantity, item);
  return null;
}
function layoutSymbols(layout, symbol) {
  var out = [];
  var seen = new Set();
  var _iterator = _createForOfIteratorHelper(String(layout || "").split(",")),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var part = _step.value;
      var match = /^(\d+):([A-Za-z?]{10})$/.exec(part.trim());
      if (!match) continue;
      var row = Number(match[1]);
      if (!Number.isInteger(row) || row < 1 || row > 10 || seen.has(row)) continue;
      seen.add(row);
      for (var column = 0; column < 10; column++) if (match[2].charAt(column) === symbol) out.push({
        row,
        column
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return out;
}
function symbolAt(layout, row, column) {
  var _p$split$;
  var p = layout.split(",").find(x => x.startsWith("".concat(row, ":")));
  return (p === null || p === void 0 || (_p$split$ = p.split(":")[1]) === null || _p$split$ === void 0 ? void 0 : _p$split$.charAt(column)) || "?";
}
var emptyCounts = () => ({
  sand_castle: 0,
  beached_whale: 0,
  rainbow_pearl: 0,
  piece_of_driftwood: 0,
  cursed_pirate_gear: 0,
  meteorite_fragment: 0
});
var blank = coordinate => ({
  schema: "don-combo-two-pool-cooldown/v0.1",
  coordinate,
  observations: 0,
  rewarded_pool_1: 0,
  rewarded_pool_2: 0,
  last_reward_kind: null,
  last_reward_at: null,
  interval_samples: [],
  uncertainty: "NO_VERIFIED_COOLDOWN",
  hypothesis: "LONGER_RECOVERY_MAY_MEAN_RARER_REWARD_UNVALIDATED"
});
// Pool 1 sand castles are sightings, not automatic item rewards. Pool 1
// whale gets a separate action record only when the whale square was combed.
// Pool 2 rewards and pool 1 pearls require positive item deltas.
function buildPoolCooldownIndex(events, nowMs, playerId) {
  var byCoordinate = {};
  var byFront = {};
  var observations = [];
  var p1 = emptyCounts(),
    p2 = emptyCounts();
  var byTier = {
    common_rare: 0,
    uncommon_rare: 0,
    rare_rare: 0
  };
  var unclassified = {};
  var seen = new Set();
  var prior = new Map();
  var lastCombed = new Map();
  var rewardedCoords = new Set();
  var matched = 0,
    layoutSightings = 0,
    itemRewards = 0,
    actionRecorded = 0,
    legacy = 0,
    bound = 0;
  // Strict chronological replay preserves valid intervals without depending on
  // file order and prevents an older event overwriting a more recent reward.
  var ordered = events.filter(e => {
    var _e$run_context, _e$run_context2, _e$run_context3;
    if (!Number.isFinite(Date.parse(e.observed_at)) || Date.parse(e.observed_at) > nowMs) return false;
    return ((_e$run_context = e.run_context) === null || _e$run_context === void 0 ? void 0 : _e$run_context.player_id) === null || ((_e$run_context2 = e.run_context) === null || _e$run_context2 === void 0 ? void 0 : _e$run_context2.player_id) === undefined || ((_e$run_context3 = e.run_context) === null || _e$run_context3 === void 0 ? void 0 : _e$run_context3.player_id) === playerId;
  }).slice().sort((a, b) => Date.parse(a.observed_at) - Date.parse(b.observed_at));
  var enrich = (e, c, signal, state) => {
    var _e$run_context4;
    var o = {
      minute: e.minute,
      observed_at: e.observed_at,
      event_id: e.event_id || null,
      coordinate: c,
      pool: signal.pool,
      kind: signal.kind,
      tier: signal.tier,
      certainty: signal.certainty,
      item_name: signal.item_name,
      quantity: signal.quantity,
      route_mode: ((_e$run_context4 = e.run_context) === null || _e$run_context4 === void 0 ? void 0 : _e$run_context4.route_mode) || "legacy-unbound",
      target_preaction_state: state
    };
    observations.push(o);
    (byFront[String(e.minute)] ?? (byFront[String(e.minute)] = emptyCounts()))[signal.kind] += signal.quantity;
    if (signal.pool === "pool_1") p1[signal.kind] += signal.quantity;else p2[signal.kind] += signal.quantity;
    byTier[signal.tier] += signal.quantity;
    if (signal.certainty === "layout-sighting") layoutSightings += signal.quantity;else if (signal.certainty === "action-recorded") actionRecorded += signal.quantity;else itemRewards += signal.quantity;
    if (c && signal.certainty !== "layout-sighting") {
      var cur = byCoordinate[c] ?? (byCoordinate[c] = blank(c));
      cur.observations++;
      var timestamp = Date.parse(e.observed_at);
      // Only positive item deltas plus a whale action on the corresponding W
      // are reward observations; do not infer any sandcastle harvest.
      if (signal.pool === "pool_1") cur.rewarded_pool_1 += signal.quantity;else cur.rewarded_pool_2 += signal.quantity;
      cur.last_reward_kind = signal.kind;
      cur.last_reward_at = e.observed_at;
      rewardedCoords.add(c);
      var previous = prior.get(c);
      if (previous && timestamp > previous.when) {
        var checked = lastCombed.get(c);
        var afterPrevious = checked !== undefined && checked >= previous.when && checked < timestamp ? checked : null;
        var interval = {
          coordinate: c,
          pool: signal.pool,
          rewarded_kind: signal.kind,
          rewarded_tier: signal.tier,
          previous_reward_at: new Date(previous.when).toISOString(),
          new_reward_at: new Date(timestamp).toISOString(),
          last_known_combed_at: afterPrevious === null ? null : new Date(afterPrevious).toISOString(),
          lower_days: afterPrevious === null ? 0 : (afterPrevious - previous.when) / 86400000,
          upper_days: (timestamp - previous.when) / 86400000,
          semantics: "CENSORED_BETWEEN_SAME_COORDINATE_REWARD_EVENTS_NOT_PROVEN_RESPAWN_TIME"
        };
        cur.interval_samples.push(interval);
        cur.uncertainty = "CENSORED_REWARD_INTERVALS_ONLY";
      }
      prior.set(c, {
        when: timestamp,
        kind: signal.kind
      });
      lastCombed.delete(c);
    }
  };
  var _iterator2 = _createForOfIteratorHelper(ordered),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _e$run_context5;
      var e = _step2.value;
      if (e.event_id && seen.has(e.event_id)) continue;
      if (e.event_id) seen.add(e.event_id);
      matched++;
      if ((_e$run_context5 = e.run_context) !== null && _e$run_context5 !== void 0 && _e$run_context5.run_id) bound++;else legacy++;
      // Observe any previously rewarded coordinate in the visible beachfront,
      // not just the planned target. A c is evidence of still-combed state.
      var _iterator3 = _createForOfIteratorHelper(prior.keys()),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var oldKey = _step3.value;
          if (!oldKey.startsWith("".concat(e.minute, ","))) continue;
          var parts = oldKey.split(",").map(Number);
          if (symbolAt(e.layout, parts[1], parts[2]) === "c") lastCombed.set(oldKey, Date.parse(e.observed_at));
        }
        // Record sandcastle and whale sightings only once per event/location.
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var _iterator4 = _createForOfIteratorHelper(layoutSymbols(e.layout, "C")),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var pos = _step4.value;
          enrich(e, key(_objectSpread2({
            minute: e.minute
          }, pos)), tier("pool_1", "sand_castle", "common_rare", "layout-sighting", 1, null), "unknown");
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      var _iterator5 = _createForOfIteratorHelper(layoutSymbols(e.layout, "W")),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _pos = _step5.value;
          enrich(e, key(_objectSpread2({
            minute: e.minute
          }, _pos)), tier("pool_1", "beached_whale", "uncommon_rare", "layout-sighting", 1, null), "unknown");
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      var actual = e.actual_comb;
      var actualKey = (actual === null || actual === void 0 ? void 0 : actual.minute) === e.minute ? key(actual) : null;
      if (e.outcome === "whale" && actualKey && symbolAt(e.layout, actual.row, actual.column) === "W") {
        enrich(e, actualKey, tier("pool_1", "beached_whale", "uncommon_rare", "action-recorded", 1, null), "unknown");
      }
      for (var _i = 0, _Object$entries = Object.entries(e.items || {}); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          name = _Object$entries$_i[0],
          qty = _Object$entries$_i[1];
        if (qty <= 0) continue;
        var signal = poolForItem(name, qty);
        if (!signal) {
          unclassified[name] = (unclassified[name] || 0) + qty;
          continue;
        }
        // Item delta attributed to a known real comb only, no action means
        // unbound item evidence (not a cooldown interval for a guessed tile).
        var state = actual ? symbolAt(e.layout, actual.row, actual.column) : "?";
        enrich(e, actualKey, signal, state === "c" ? "combed" : state === "t" ? "twinkle" : "unknown");
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var summary = {
    schema: "don-combo-two-pool-summary/v0.1",
    scanned_events: events.length,
    matched_events: matched,
    pool_1: p1,
    pool_2: p2,
    by_tier: byTier,
    layout_sightings: layoutSightings,
    item_delta_rewards: itemRewards,
    action_recorded: actionRecorded,
    censored_intervals: Object.values(byCoordinate).reduce((n, v) => n + v.interval_samples.length, 0),
    distinct_reward_coordinates: rewardedCoords.size,
    historical_unbound_events: legacy,
    run_bound_events: bound,
    unclassified_item_deltas: unclassified,
    hypothesis: "User-proposed two-pool rarity ladder: shorter cooldown may correspond to common/rare, longer to uncommon/rare, longest to rare/rare. NOT CALIBRATED. Recorded deltas and sightings are observations, not a demonstrated cooldown-to-loot relationship."
  };
  return {
    summary,
    by_coordinate: byCoordinate,
    by_front: byFront,
    observations
  };
}
function cooldownForTarget(index, minute, row, column) {
  return index.by_coordinate["".concat(minute, ",").concat(row, ",").concat(column)] || blank("".concat(minute, ",").concat(row, ",").concat(column));
}
var makeBin = (key, lower, upper) => ({
  key,
  lower_days_inclusive: lower,
  upper_days_exclusive: upper,
  repeat_attempt_intervals: 0,
  current_observed_rewards: 0,
  pool_1_rewards: 0,
  pool_2_rewards: 0,
  current_reward_tiers: {
    common_rare: 0,
    uncommon_rare: 0,
    rare_rare: 0
  },
  empty_or_unclassified_attempts: 0
});
var gapBin = days => days < 1 ? 0 : days < 3 ? 1 : days < 7 ? 2 : days < 14 ? 3 : 4;

// A catalogue tile is a possible observation site, never a negative example.
// These are INTER-ATTEMPT intervals, not respawn intervals. Pool rewards are
// conditioned on the LATER action's exact coordinate and positive item delta.
function buildHistoricalRareCurve(points, events, poolIndex, nowMs, playerId) {
  var catalogue = new Set();
  var falseExcluded = 0;
  var _iterator6 = _createForOfIteratorHelper(points),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var p = _step6.value;
      if (p.false_rare) {
        falseExcluded++;
        continue;
      }
      catalogue.add(key(p));
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  var bins = [makeBin("under_1_day", 0, 1), makeBin("1_to_3_days", 1, 3), makeBin("3_to_7_days", 3, 7), makeBin("7_to_14_days", 7, 14), makeBin("14_plus_days", 14, null)];
  var eligible = events.filter(e => {
    var _e$run_context6, _e$run_context7, _e$run_context8;
    var t = Date.parse(e.observed_at);
    return Number.isFinite(t) && t <= nowMs && (((_e$run_context6 = e.run_context) === null || _e$run_context6 === void 0 ? void 0 : _e$run_context6.player_id) === null || ((_e$run_context7 = e.run_context) === null || _e$run_context7 === void 0 ? void 0 : _e$run_context7.player_id) === undefined || ((_e$run_context8 = e.run_context) === null || _e$run_context8 === void 0 ? void 0 : _e$run_context8.player_id) === playerId);
  }).slice().sort((a, b) => Date.parse(a.observed_at) - Date.parse(b.observed_at));
  var seen = new Set(),
    previous = new Map();
  var attempted = new Set();
  var touched = 0,
    exact = 0,
    repeat = 0,
    legacy = 0,
    bound = 0,
    standaloneRewards = 0;
  var first = null,
    last = null;
  var _iterator7 = _createForOfIteratorHelper(eligible),
    _step7;
  try {
    var _loop = function _loop() {
        var _e$run_context9;
        var e = _step7.value;
        if (e.event_id && seen.has(e.event_id)) return 0; // continue
        if (e.event_id) seen.add(e.event_id);
        var target = e.planned_target,
          actual = e.actual_comb;
        if (!target || !catalogue.has(key(target)) || target.minute !== e.minute) return 0; // continue
        touched++;
        if (e.outcome !== "rare_target" || !actual || key(actual) !== key(target)) return 0; // continue
        exact++;
        if ((_e$run_context9 = e.run_context) !== null && _e$run_context9 !== void 0 && _e$run_context9.run_id) bound++;else legacy++;
        attempted.add(key(target));
        var when = Date.parse(e.observed_at);
        if (!first || e.observed_at < first) first = e.observed_at;
        if (!last || e.observed_at > last) last = e.observed_at;
        var rewardSignals = (poolIndex.observations || []).filter(o => o.event_id === e.event_id && o.coordinate === key(actual) && o.certainty !== "layout-sighting");
        var currentRewards = rewardSignals.filter(o => o.certainty === "item-delta" || o.certainty === "action-recorded" && o.kind === "beached_whale");
        var previousAt = previous.get(key(target));
        // Same-timestamp events do not become an invented zero-day respawn.
        if (previousAt !== undefined && when > previousAt) {
          repeat++;
          var bin = bins[gapBin((when - previousAt) / 86400000)];
          bin.repeat_attempt_intervals++;
          if (currentRewards.length) {
            var _iterator8 = _createForOfIteratorHelper(currentRewards),
              _step8;
            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                var rw = _step8.value;
                bin.current_observed_rewards += rw.quantity;
                if (rw.pool === "pool_1") bin.pool_1_rewards += rw.quantity;else bin.pool_2_rewards += rw.quantity;
                bin.current_reward_tiers[rw.tier] += rw.quantity;
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }
          } else bin.empty_or_unclassified_attempts++;
        } else standaloneRewards += currentRewards.reduce((n, o) => n + o.quantity, 0);
        previous.set(key(target), when);
      },
      _ret;
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      _ret = _loop();
      if (_ret === 0) continue;
    }
    // Reward-to-reward intervals from the pool index are separately CENSORED.
    // A gap between rare target attempts is not necessarily the cooldown.
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  var censored = Object.entries(poolIndex.by_coordinate).filter(_ref => {
    var _ref2 = _slicedToArray(_ref, 1),
      coord = _ref2[0];
    return catalogue.has(coord);
  }).reduce((n, _ref3) => {
    var _ref4 = _slicedToArray(_ref3, 2),
      value = _ref4[1];
    return n + value.interval_samples.length;
  }, 0);
  return {
    schema: "don-combo-historical-rare-curve/v0.1",
    source: "known-rare-catalogue-cross-indexed-with-dated-ml-events",
    known_rare_coordinates: catalogue.size,
    known_rare_undated_coordinates: catalogue.size - attempted.size,
    false_rare_excluded: falseExcluded,
    events_scanned: events.length,
    events_at_known_rare_coordinates: touched,
    exact_rare_target_attempts: exact,
    distinct_coordinates_attempted: attempted.size,
    repeated_attempt_intervals: repeat,
    historical_unbound_rare_attempts: legacy,
    run_bound_rare_attempts: bound,
    first_attempt_at: first,
    last_attempt_at: last,
    bins,
    censored_same_coordinate_reward_intervals: censored,
    reward_tier_samples_without_repeat_attempt: standaloneRewards,
    verified_respawn_intervals: null,
    inference_kind: "OBSERVED_ATTEMPT_GAPS_NOT_RESPAWN_PROBABILITY",
    note: "Historical known coordinates without timestamps are not training samples. Bins count elapsed time between two recorded rare-target attempts on the SAME exact coordinate, not actual cooldown length. A second positive item is associated with that later attempt; no rarity-to-cooldown law is assumed."
  };
}

var LEDGER_FILE = "don_combo_matrix_ledger.json";
var ML_EVENT_FILE = "don_combo_ml_events.jsonl";
var RECOVERY_FILE = "don_combo_tile_recovery.json";
var SCRATCH_FILE = "don_combo_scratch_observations.json";
// The live scratch ledger is player-scoped. Legacy unbound ML events are kept
// separately by the read-only historical backfill and never rewritten here.
function loadScratchLedger() {
  var player = Number(kolmafia.myId());
  try {
    var raw = String(kolmafia.fileToBuffer(SCRATCH_FILE) || "").trim();
    if (!raw) return emptyScratchLedger(player);
    var parsed = JSON.parse(raw);
    if (parsed.schema !== SCRATCH_LEDGER_SCHEMA || parsed.player_id !== player || !parsed.fronts || typeof parsed.fronts !== "object") return emptyScratchLedger(player);
    return parsed;
  } catch (_unused) {
    return emptyScratchLedger(player);
  }
}
function loadTileRecoveryLedger() {
  try {
    var raw = String(kolmafia.fileToBuffer(RECOVERY_FILE) || "").trim();
    if (!raw) return emptyRecoveryLedger();
    var parsed = JSON.parse(raw);
    if (parsed.schema !== "don-combo-tile-recovery/v0.1" || !parsed.tiles || typeof parsed.tiles !== "object") return emptyRecoveryLedger();
    return parsed;
  } catch (_unused2) {
    return emptyRecoveryLedger();
  }
}
function blankLedger() {
  return {
    schema: "don-combo-observation-ledger/v0.6",
    fronts: {},
    updated_at: null
  };
}
function loadObservationLedger() {
  var raw = String(kolmafia.fileToBuffer(LEDGER_FILE) || "").trim();
  if (!raw) return blankLedger();
  try {
    var parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || typeof parsed.fronts !== "object") {
      return blankLedger();
    }
    parsed.schema = "don-combo-observation-ledger/v0.6";
    return parsed;
  } catch (_unused3) {
    return blankLedger();
  }
}
function loadMlTraceEvents() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  var raw;
  try {
    raw = String(kolmafia.fileToBuffer(ML_EVENT_FILE) || "");
  } catch (_unused4) {
    raw = "";
  }
  var events = [];
  var total = 0;
  var _iterator2 = _createForOfIteratorHelper(raw.split(/\r?\n/)),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var line = _step2.value;
      var trimmed = line.trim();
      if (!trimmed) continue;
      try {
        var parsed = JSON.parse(trimmed);
        if (parsed && parsed.schema === "don-combo-ml-event/v0.1") {
          total++;
          events.push(parsed);
        }
      } catch (_unused5) {
        // Keep a malformed historical line from breaking live Combo.
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return {
    file: ML_EVENT_FILE,
    total,
    events: events.slice(Math.max(0, events.length - limit))
  };
}

var GRID = 1024;
var REAL = 1_000_000;
var LABELS = ["rare", "whale", "sandcastle", "twinkle", "regular", "scratched"];
var MODEL_KEYS = {
  A: "rare",
  B: "whale",
  C: "sandcastle",
  D: "twinkle",
  E: "regular",
  F: "scratched"
};
var WEIGHTS = {
  rare: 1,
  whale: 0.86,
  sandcastle: 0.66,
  twinkle: 0.38,
  regular: 0.1,
  scratched: 0
};
var ENDPOINT = "http://127.0.0.1:8766/v1/kolmafia";
var DESIGN_REFERENCE = {
  repository: "es-3581100/math-by-design",
  commit: "4f3cfebc0bc8f2f243080d9c758290323eeaf595",
  use: "hierarchy, evidence/provenance separation, semantic handoff; reference not template"
};
var TYPE_REFERENCE = {
  repository: "together-science/symtype",
  use: "explicit properties, relations, and indeterminate truth as TypeScript design inspiration only"
};
var REPRESENTATION_REFERENCE = {
  repository: "es-3581100/Kotlin-Studio",
  path: "Sacred-Computations-Map",
  commit: "244b4cf4445abc4026975cdd6d2bbef6ded1591f",
  use: "one semantic dataset projected as linked graph, spatial matrix, inspector, signal profile, and exact readable cross-index"
};
var HILBERT_UI_REFERENCE = {
  source: "user-provided hilbert_hashtable.html",
  sha256: "6d2cb93d716a72789569005e3d41cd4eb3b227602eaace7e96720f45acd9ceac",
  use: "direct cell -> Hilbert d -> bucket -> table inspection and bucket isolation"
};
function unescapeAshField(value) {
  var output = "";
  var escaped = false;
  var _iterator = _createForOfIteratorHelper(value),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var ch = _step.value;
      if (!escaped) {
        if (ch === "\\") escaped = true;else output += ch;
        continue;
      }
      if (ch === "n") output += "\n";else if (ch === "t") output += "\t";else output += ch;
      escaped = false;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (escaped) output += "\\";
  return output;
}
function escapeAshField(value) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
function readFlatAshMap(path) {
  var raw = String(kolmafia.fileToBuffer(path) || "");
  var result = {};
  var _iterator2 = _createForOfIteratorHelper(raw.split(/\r?\n/)),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var line = _step2.value;
      if (!line) continue;
      var tab = line.indexOf("\t");
      if (tab < 0) continue;
      var key = unescapeAshField(line.substring(0, tab));
      var value = unescapeAshField(line.substring(tab + 1));
      result[key] = value;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return result;
}
function writeFlatAshMap(path, values) {
  var lines = Object.keys(values).sort().map(key => "".concat(escapeAshField(key), "\t").concat(escapeAshField(values[key])));
  kolmafia.bufferToFile("".concat(lines.join("\n"), "\n"), path);
}
function n(value) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function round(value) {
  var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  var scale = Math.pow(10, places);
  return Math.round(value * scale) / scale;
}
function dFor(minute, row, column) {
  return (minute - 1) * 100 + (row - 1) * 10 + column;
}
function xyFor(d) {
  var x = 0;
  var y = 0;
  var t = d;
  var s = 1;
  while (s < GRID) {
    var rx = t >> 1 & 1;
    var ry = (t ^ rx) & 1;
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      var temp = x;
      x = y;
      y = temp;
    }
    x += s * rx;
    y += s * ry;
    t >>= 2;
    s <<= 1;
  }
  return [x, y];
}
function parseFalseRares() {
  var result = new Set();
  var _iterator3 = _createForOfIteratorHelper(String(kolmafia.getProperty("combo_false_rares") || "").split(";")),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var raw = _step3.value;
      if (/^\d+,\d+,\d+$/.test(raw)) result.add(raw);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return result;
}
function loadRarePoints() {
  var parsed = JSON.parse(String(kolmafia.fileToBuffer("raretiles.json") || "[]"));
  var falseRares = parseFalseRares();
  return parsed.filter(tile => Number.isInteger(tile.minute) && Number.isInteger(tile.row) && Number.isInteger(tile.column) && tile.minute >= 1 && tile.minute <= 10000 && tile.row >= 1 && tile.row <= 10 && tile.column >= 0 && tile.column <= 9).map(tile => {
    var d = dFor(tile.minute, tile.row, tile.column);
    var _xyFor = xyFor(d),
      _xyFor2 = _slicedToArray(_xyFor, 2),
      x = _xyFor2[0],
      y = _xyFor2[1];
    return _objectSpread2(_objectSpread2({}, tile), {}, {
      d,
      x,
      y,
      false_rare: falseRares.has("".concat(tile.minute, ",").concat(tile.row, ",").concat(tile.column))
    });
  });
}
function comboShuffle(points, player) {
  var work = points.slice();
  var output = [];
  var seed = player;
  while (work.length) {
    seed++;
    var index = Math.floor(Math.sin(seed) * work.length);
    output.push.apply(output, _toConsumableArray(work.splice(index)));
  }
  return output;
}
function comboBaseline(points) {
  if (!points.length) return null;
  var shuffled = comboShuffle(points, n(kolmafia.myId()));
  var day = 1 + kolmafia.gamedayToInt() % 8;
  var rowsHidden = 4 - Math.abs(4 - day);
  var last = n(kolmafia.getProperty("combo_lastTileCombed"), 0);
  for (var step = 1; step <= shuffled.length; step++) {
    var index = (last + step) % shuffled.length;
    var tile = shuffled[index];
    if (tile.row > rowsHidden && !tile.false_rare) {
      return {
        minute: tile.minute,
        row: tile.row,
        column: tile.column,
        d: tile.d,
        x: tile.x,
        y: tile.y,
        shuffled_index: index,
        skipped_inaccessible: step - 1,
        rows_hidden: rowsHidden,
        player: n(kolmafia.myId()),
        gameday: kolmafia.gamedayToInt()
      };
    }
  }
  return null;
}
function loadContext() {
  var map = readFlatAshMap("kol-goblin-docs/runtime.tsv");
  if (map.player_id && map.gameday) {
    return {
      context: {
        player: n(map.player_id),
        player_name: map.player || null,
        gameday: n(map.gameday),
        captured_at: map.generated_at || null,
        source: "kol-goblin-docs"
      },
      file: "kol-goblin-docs/runtime.tsv"
    };
  }
  return {
    context: {
      player: n(kolmafia.myId()),
      gameday: kolmafia.gamedayToInt(),
      captured_at: null,
      source: "kolmafia-native"
    },
    file: "KoLmafia native functions"
  };
}
function symbolRates(entry) {
  var symbols = entry.symbols || {};
  var visible = Math.max(1, n(symbols.visible));
  var result = {};
  for (var _i = 0, _arr = ["whale", "twinkle", "rough", "combed", "other"]; _i < _arr.length; _i++) {
    var key = _arr[_i];
    result[key] = round(n(symbols[key]) / visible);
  }
  return result;
}
function outcomeRates(entry) {
  var outcomes = entry.outcomes || {};
  var events = Math.max(1, n(entry.session_events));
  var result = {};
  for (var _i2 = 0, _arr2 = ["whale", "rare_target", "false_rare_rough", "twinkle_fallback", "rough_fallback", "exhausted_fallback", "unknown"]; _i2 < _arr2.length; _i2++) {
    var key = _arr2[_i2];
    result[key] = round(n(outcomes[key]) / events);
  }
  return result;
}
function evidenceFor(minute, current, ledger, tile, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve) {
  var entry = ledger.fronts[String(minute)] || {};
  var layouts = n(entry.layout_snapshots);
  var events = n(entry.session_events);
  var seen = n(entry.last_seen_epoch, 0);
  var d = dFor(minute, 1, 0);
  var _xyFor3 = xyFor(d),
    _xyFor4 = _slicedToArray(_xyFor3, 2),
    x = _xyFor4[0],
    y = _xyFor4[1];
  return {
    minute_fraction: round((minute - 1) / 9999),
    hilbert_bucket_256: Math.floor(d / 4096),
    distance_from_current: current ? Math.abs(minute - current) : null,
    layout_snapshots: layouts,
    session_events: events,
    observation_count: layouts + events,
    last_seen_age_hours: seen ? round(Math.max(0, Date.now() / 1000 - seen) / 3600, 3) : null,
    last_seen_turn: entry.last_seen_turn == null ? null : n(entry.last_seen_turn),
    cooldown: recoveryFeatures(tile && recoveryLedger ? recoveryLedger.tiles[tileKey(tile.minute, tile.row, tile.column)] : undefined, Date.now() / 1000),
    historical_rare: tile && historicalIndex ? historicalRareForTile(historicalIndex, tile.minute, tile.row, tile.column) : null,
    scratch_interest: evidenceForScratchFront(scratches || emptyScratchLedger(n(kolmafia.myId())), minute),
    historical_rare_curve: historicalCurve || buildHistoricalRareCurve([], [], buildPoolCooldownIndex([], Date.now(), n(kolmafia.myId())), Date.now(), n(kolmafia.myId())),
    pool_cooldown: cooldownForTarget(poolIndex || buildPoolCooldownIndex([], Date.now(), n(kolmafia.myId())), minute, (tile === null || tile === void 0 ? void 0 : tile.row) ?? 0, (tile === null || tile === void 0 ? void 0 : tile.column) ?? -1),
    pool_front_observations: (poolIndex === null || poolIndex === void 0 ? void 0 : poolIndex.by_front[String(minute)]) || {
      sand_castle: 0,
      beached_whale: 0,
      rainbow_pearl: 0,
      piece_of_driftwood: 0,
      cursed_pirate_gear: 0,
      meteorite_fragment: 0
    },
    observed_symbol_rates: symbolRates(entry),
    observed_outcome_rates: outcomeRates(entry),
    sand_per_event: events ? round(n((entry.items || {})["grain of sand"]) / events, 4) : 0,
    representative: {
      d,
      x,
      y,
      row: 1,
      column: 0
    }
  };
}
function observationAtlas(ledger, scratches) {
  return Object.entries(ledger.fronts).map(_ref => {
    var _ref2 = _slicedToArray(_ref, 2),
      minuteText = _ref2[0],
      raw = _ref2[1];
    var minute = n(minuteText);
    var entry = raw;
    var dStart = dFor(minute, 1, 0);
    var dEnd = dFor(minute, 10, 9);
    return {
      minute,
      d_start: dStart,
      d_end: dEnd,
      bucket_start_256: Math.floor(dStart / 4096),
      bucket_end_256: Math.floor(dEnd / 4096),
      layout_snapshots: n(entry.layout_snapshots),
      session_events: n(entry.session_events),
      observation_count: n(entry.layout_snapshots) + n(entry.session_events),
      scratch_interest: evidenceForScratchFront(scratches, minute),
      last_seen_epoch: entry.last_seen_epoch == null ? null : n(entry.last_seen_epoch),
      last_seen_turn: entry.last_seen_turn == null ? null : n(entry.last_seen_turn),
      symbol_counts: entry.symbols || {},
      symbol_rates: symbolRates(entry),
      outcome_counts: entry.outcomes || {},
      outcome_rates: outcomeRates(entry),
      items: entry.items || {},
      sources: Array.isArray(entry.sources) ? entry.sources : [],
      last_layout: entry.last_layout || null
    };
  }).sort((a, b) => a.minute - b.minute);
}
function sampleMinutes(ledger, eligibleMinutes, count, current, exclude, scratches) {
  var allowed = new Set(eligibleMinutes);
  var selected = [];
  var sources = {};
  var add = (minute, source) => {
    if (allowed.has(minute) && !exclude.has(minute) && !sources[String(minute)]) {
      selected.push(minute);
      sources[String(minute)] = source;
    }
  };
  if (current) add(current, "current");
  // Historical scratch-only fronts are eligible for the observed discovery
  // pool even when the native aggregate ledger has been lost or rotated.
  var observedMinutes = new Set([].concat(_toConsumableArray(Object.keys(ledger.fronts)), _toConsumableArray(Object.keys(scratches.fronts))));
  var observed = Array.from(observedMinutes).map(minuteText => {
    var entry = ledger.fronts[minuteText] || {};
    var symbols = entry.symbols || {};
    var outcomes = entry.outcomes || {};
    var visible = Math.max(1, n(symbols.visible));
    var events = Math.max(1, n(entry.session_events));
    return {
      minute: n(minuteText),
      signal: (n(symbols.whale) * 4 + n(symbols.twinkle) * 2) / visible + (n(outcomes.whale) * 4 + n(outcomes.rare_target) * 3) / events + evidenceForScratchFront(scratches, n(minuteText)).interest_score * 2,
      observations: n(entry.layout_snapshots) + n(entry.session_events)
    };
  }).sort((a, b) => b.signal - a.signal || b.observations - a.observations || a.minute - b.minute);
  var observedTarget = Math.max(1, Math.floor(count / 3)) + (current ? 1 : 0);
  var _iterator4 = _createForOfIteratorHelper(observed),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var item = _step4.value;
      if (selected.length >= observedTarget) break;
      add(item.minute, "observed");
    }
    // Explore only tide-visible known-rare beachfronts. The map still shows all
    // 1M cells, but executable suggestions must resolve to real rare coordinates.
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  var seed = n(kolmafia.getProperty("combo_lastTileCombed")) * 2654435761 + current * 2246822519 + Object.keys(ledger.fronts).length * 3266489917 + count >>> 0;
  var target = Math.min(count, eligibleMinutes.length - exclude.size);
  for (var i = 0; i < eligibleMinutes.length * 3 && selected.length < target; i++) {
    seed = Math.imul(1664525, seed) + 1013904223 >>> 0;
    add(eligibleMinutes[seed % eligibleMinutes.length], "explore");
  }
  // Deterministic sequential fallback avoids collisions stalling the pool.
  var _iterator5 = _createForOfIteratorHelper(eligibleMinutes),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var minute = _step5.value;
      if (selected.length >= target) break;
      add(minute, "explore");
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return selected.slice(0, count).map(minute => [minute, sources[String(minute)]]);
}
function candidateFrontier(ledger, baseline, points, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve) {
  var count = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 16;
  var current = n(kolmafia.getProperty("_beachMinutes"));
  var day = 1 + kolmafia.gamedayToInt() % 8;
  var rowsHidden = 4 - Math.abs(4 - day);
  var eligible = points.filter(t => !t.false_rare && t.row > rowsHidden);
  var grouped = new Map();
  var _iterator6 = _createForOfIteratorHelper(eligible),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var tile = _step6.value;
      var list = grouped.get(tile.minute) || [];
      list.push(tile);
      grouped.set(tile.minute, list);
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  var chosen = minute => {
    var list = grouped.get(minute) || [];
    return list.slice().sort((a, b) => {
      var fa = recoveryFeatures(recoveryLedger.tiles[tileKey(a.minute, a.row, a.column)], Date.now() / 1000);
      var fb = recoveryFeatures(recoveryLedger.tiles[tileKey(b.minute, b.row, b.column)], Date.now() / 1000);
      return (fb.revisit_signal ?? -1) - (fa.revisit_signal ?? -1) || a.row - b.row || a.column - b.column;
    })[0];
  };
  var result = [];
  var push = (minute, source, isBaseline) => {
    var tile = isBaseline && baseline ? eligible.find(t => t.minute === baseline.minute && t.row === baseline.row && t.column === baseline.column) : chosen(minute);
    if (!tile) return;
    var evidence = evidenceFor(minute, current, ledger, tile, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve);
    result.push({
      minute,
      source,
      is_combo_baseline: isBaseline,
      evidence,
      representative: {
        d: tile.d,
        x: tile.x,
        y: tile.y,
        row: tile.row,
        column: tile.column
      },
      utility: null,
      utility_components: null,
      watersheep: null
    });
  };
  if (baseline) push(baseline.minute, "combo-baseline", true);
  var exclude = new Set(result.map(x => x.minute));
  var eligibleMinutes = Array.from(grouped.keys()).sort((a, b) => a - b);
  var _iterator7 = _createForOfIteratorHelper(sampleMinutes(ledger, eligibleMinutes, count, current, exclude, scratches)),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var _step7$value = _slicedToArray(_step7.value, 2),
        minute = _step7$value[0],
        source = _step7$value[1];
      push(minute, source, false);
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  return result;
}
function waterSheepPayload(candidate) {
  var evidence = candidate.evidence;
  return {
    state: {
      mode: "shadow-only; no action authorized",
      evidence_contract: WATERSHEEP_EVIDENCE_CONTRACT,
      beach_minute: candidate.minute,
      minute_fraction: evidence.minute_fraction,
      hilbert_bucket_256: evidence.hilbert_bucket_256,
      distance_from_current: evidence.distance_from_current,
      layout_snapshots: evidence.layout_snapshots,
      session_events: evidence.session_events,
      last_seen_age_hours: evidence.last_seen_age_hours,
      tile_recovery: evidence.cooldown,
      historical_rare: evidence.historical_rare,
      scratch_interest: evidence.scratch_interest,
      pool_cooldown: evidence.pool_cooldown,
      historical_rare_curve: evidence.historical_rare_curve,
      pool_front_observations: evidence.pool_front_observations,
      observed_symbol_rates: evidence.observed_symbol_rates,
      sand_per_event: evidence.sand_per_event,
      current_layout_if_same_front: candidate.minute === n(kolmafia.getProperty("_beachMinutes")) ? kolmafia.getProperty("_beachLayout") : "not observed",
      withheld: "Combo target/order, candidate source labels, baseline membership and complete rare-coordinate catalogue are withheld; per-coordinate historical event summaries are evidence, not proven rare respawns or authorization"
    },
    questions: {
      tile_class: {
        type: "choice",
        instructions: "Experimental shadow scoring only. Assign relative score mass to six neutral outcome classes from the supplied weak evidence. Do not choose an action. The class keys are intentionally neutral.",
        criteria: {
          A: "rare tile opportunity",
          B: "whale opportunity",
          C: "sandcastle opportunity",
          D: "twinkle or uncommon opportunity",
          E: "ordinary regular beach opportunity",
          F: "already exhausted, combed, or low-value opportunity"
        }
      }
    }
  };
}
function askWaterSheep(candidate) {
  var _parsed$answers;
  var payload = waterSheepPayload(candidate);
  var started = Date.now();
  var url = "".concat(ENDPOINT, "?request=").concat(kolmafia.urlEncode(JSON.stringify(payload)));
  var raw = String(kolmafia.visitUrl(url, false) || "");
  var parsed = JSON.parse(raw);
  if (parsed.error) throw new Error(parsed.error);
  var probabilities = ((_parsed$answers = parsed.answers) === null || _parsed$answers === void 0 || (_parsed$answers = _parsed$answers.tile_class) === null || _parsed$answers === void 0 ? void 0 : _parsed$answers.probabilities) || {};
  var scores = {};
  for (var _i3 = 0, _Object$entries = Object.entries(MODEL_KEYS); _i3 < _Object$entries.length; _i3++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i3], 2),
      key = _Object$entries$_i[0],
      label = _Object$entries$_i[1];
    scores[label] = n(probabilities[key]);
  }
  var total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    var _iterator8 = _createForOfIteratorHelper(LABELS),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var _label = _step8.value;
        scores[_label] = n(probabilities[_label]);
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  }
  if (total <= 0) throw new Error("WaterSheep returned no tile_class score mass");
  var _iterator9 = _createForOfIteratorHelper(LABELS),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var _label2 = _step9.value;
      scores[_label2] = scores[_label2] / total;
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  return {
    scores,
    ms: Date.now() - started
  };
}
function traceTargetPrediction(minute, row, column) {
  var ledger = loadObservationLedger();
  var current = n(kolmafia.getProperty("_beachMinutes"));
  var recoveryLedger = loadTileRecoveryLedger();
  var tile = row == null || column == null ? undefined : {
    minute,
    row,
    column
  };
  var fullHistory = loadMlTraceEvents(Number.MAX_SAFE_INTEGER);
  var historicalIndex = buildHistoricalRareIndex(loadRarePoints(), fullHistory.events, Date.now());
  var scratches = backfillScratchHistory(loadScratchLedger(), fullHistory.events, Date.now()).ledger;
  var poolIndex = buildPoolCooldownIndex(fullHistory.events, Date.now(), n(kolmafia.myId()));
  var historicalCurve = buildHistoricalRareCurve(loadRarePoints(), fullHistory.events, poolIndex, Date.now(), n(kolmafia.myId()));
  var evidence = evidenceFor(minute, current, ledger, tile, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve);
  var candidate = {
    minute,
    evidence,
    representative: evidence.representative};
  var _askWaterSheep = askWaterSheep(candidate),
    scores = _askWaterSheep.scores,
    ms = _askWaterSheep.ms;
  var scored = scoreCandidate(candidate, scores);
  return {
    schema: "don-combo-target-prediction/v0.1",
    generated_at: new Date().toISOString(),
    evidence_contract: WATERSHEEP_EVIDENCE_CONTRACT,
    minute,
    model_input: {
      minute_fraction: evidence.minute_fraction,
      hilbert_bucket_256: evidence.hilbert_bucket_256,
      distance_from_current: evidence.distance_from_current,
      layout_snapshots: evidence.layout_snapshots,
      session_events: evidence.session_events,
      last_seen_age_hours: evidence.last_seen_age_hours,
      tile_recovery: evidence.cooldown,
      historical_rare: evidence.historical_rare,
      scratch_interest: evidence.scratch_interest,
      pool_cooldown: evidence.pool_cooldown,
      historical_rare_curve: evidence.historical_rare_curve,
      pool_front_observations: evidence.pool_front_observations,
      observed_symbol_rates: evidence.observed_symbol_rates,
      sand_per_event: evidence.sand_per_event,
      current_layout_if_same_front: minute === current ? kolmafia.getProperty("_beachLayout") : "not observed"
    },
    score_mass: scores,
    model_utility: scored.components.model,
    policy_utility: scored.utility,
    policy_components: scored.components,
    ms,
    calibration: "UNVALIDATED_FOR_KOL_BEACH",
    authority: "none"
  };
}
function scoreCandidate(candidate, scores) {
  var evidence = candidate.evidence;
  var rates = evidence.observed_symbol_rates;
  var outcomes = evidence.observed_outcome_rates;
  var model = LABELS.reduce((sum, label) => sum + n(scores[label]) * WEIGHTS[label], 0);
  var exploration = 0.08 / Math.sqrt(1 + evidence.observation_count);
  var observed = n(rates.whale) * 0.16 + n(rates.twinkle) * 0.08 - n(rates.combed) * 0.05 + n(outcomes.whale) * 0.16 + n(outcomes.rare_target) * 0.12 + n(outcomes.twinkle_fallback) * 0.08 - n(outcomes.rough_fallback) * 0.02 - n(outcomes.exhausted_fallback) * 0.05 + (evidence.cooldown.revisit_signal ?? 0) * 0.08 +
  // Bounded exploration preference; not a fitted rare chance and never an
  // action permission. Distinct-day recurrence compounds, same-day revisits do not.
  evidence.scratch_interest.interest_score * 0.06 - (evidence.cooldown.still_combed_after_harvest && (evidence.cooldown.days_since_observed ?? 999) < 1 ? 0.04 : 0);
  return {
    utility: round(model + exploration + observed),
    components: {
      model: round(model),
      exploration: round(exploration),
      observed: round(observed)
    }
  };
}
function comparison(candidates, baseline, fronts) {
  var scored = candidates.filter(candidate => candidate.utility != null);
  var top = scored[0];
  var second = scored[1];
  var margin = top && second ? round(top.utility - second.utility) : null;
  var observedCandidates = scored.filter(candidate => candidate.evidence.observation_count > 0).length;
  var fraction = round(observedCandidates / Math.max(1, scored.length), 4);
  var maturity = observedCandidates === 0 ? "COLD_START" : fraction < 0.5 || fronts < 10 ? "WARMING" : "EVIDENCE_RICH";
  var separation = margin == null || margin < 0.01 ? "LOW" : margin < 0.03 ? "MEDIUM" : "HIGH";
  var baselineIndex = scored.findIndex(candidate => candidate.is_combo_baseline);
  var baselineCandidate = baselineIndex >= 0 ? scored[baselineIndex] : null;
  return {
    combo_baseline: baseline,
    baseline_rank: baselineIndex >= 0 ? baselineIndex + 1 : null,
    pool_size: scored.length,
    shadow_top_minute: (top === null || top === void 0 ? void 0 : top.minute) ?? null,
    shadow_top_source: (top === null || top === void 0 ? void 0 : top.source) ?? null,
    agreement: Boolean(top === null || top === void 0 ? void 0 : top.is_combo_baseline),
    top_vs_second_margin: margin,
    top_vs_baseline_delta: top && baselineCandidate ? round(top.utility - baselineCandidate.utility) : null,
    observed_candidates: observedCandidates,
    observed_candidate_fraction: fraction,
    evidence_maturity: maturity,
    ranking_separation: separation,
    readiness_note: "Ranking separation is descriptive, not calibrated confidence."
  };
}
function layoutCells(minute, raw) {
  if (!minute) return [];
  var result = [];
  var _iterator0 = _createForOfIteratorHelper(String(raw || "").split(",")),
    _step0;
  try {
    for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
      var part = _step0.value;
      var split = part.indexOf(":");
      if (split < 0) continue;
      var row = n(part.substring(0, split));
      if (row < 1 || row > 10) continue;
      var symbols = part.substring(split + 1).slice(0, 10);
      for (var column = 0; column < symbols.length; column++) {
        var d = dFor(minute, row, column);
        var _xyFor5 = xyFor(d),
          _xyFor6 = _slicedToArray(_xyFor5, 2),
          x = _xyFor6[0],
          y = _xyFor6[1];
        result.push({
          d,
          x,
          y,
          row,
          column,
          symbol: symbols[column]
        });
      }
    }
  } catch (err) {
    _iterator0.e(err);
  } finally {
    _iterator0.f();
  }
  return result;
}
function sha256(text) {
  var rightRotate = (value, amount) => value >>> amount | value << 32 - amount;
  var ascii = unescape(encodeURIComponent(text));
  var byteLength = ascii.length;
  var maxWord = Math.pow(2, 32);
  var words = [];
  var hash = [];
  var k = [];
  var primeCounter = 0;
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (var i = 0; i < 313; i += candidate) isComposite[i] = true;
      hash[primeCounter] = Math.pow(candidate, 0.5) * maxWord | 0;
      k[primeCounter++] = Math.pow(candidate, 1 / 3) * maxWord | 0;
    }
  }
  ascii += "\x80";
  while (ascii.length % 64 - 56) ascii += "\x00";
  for (var _i4 = 0; _i4 < ascii.length; _i4++) {
    var code = ascii.charCodeAt(_i4);
    words[_i4 >> 2] |= code << (3 - _i4) % 4 * 8;
  }
  words[words.length] = byteLength * 8 / maxWord | 0;
  words[words.length] = byteLength * 8;
  for (var j = 0; j < words.length;) {
    var w = words.slice(j, j += 16);
    var oldHash = hash.slice(0, 8);
    for (var _i5 = 0; _i5 < 64; _i5++) {
      var w15 = w[_i5 - 15];
      var w2 = w[_i5 - 2];
      var a = hash[0];
      var e = hash[4];
      var temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + (e & hash[5] ^ ~e & hash[6]) + k[_i5] + (w[_i5] = _i5 < 16 ? w[_i5] : w[_i5 - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ w15 >>> 3) + w[_i5 - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ w2 >>> 10) | 0);
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + (a & hash[1] ^ a & hash[2] ^ hash[1] & hash[2]);
      hash.unshift(temp1 + temp2 | 0);
      hash[4] = hash[4] + temp1 | 0;
      hash.pop();
    }
    for (var _i6 = 0; _i6 < 8; _i6++) hash[_i6] = hash[_i6] + oldHash[_i6] | 0;
  }
  return hash.map(value => {
    var hex = "";
    for (var _j = 3; _j + 1; _j--) hex += (value >> _j * 8 & 255).toString(16).padStart(2, "0");
    return hex;
  }).join("");
}
function loadJsonLines(path, limit) {
  var raw = "";
  try {
    raw = String(kolmafia.fileToBuffer(path) || "");
  } catch (_unused) {
    raw = "";
  }
  var rows = [];
  var _iterator1 = _createForOfIteratorHelper(raw.split(/\r?\n/)),
    _step1;
  try {
    for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
      var line = _step1.value;
      var trimmed = line.trim();
      if (!trimmed) continue;
      try {
        var parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === "object") rows.push(parsed);
      } catch (_unused2) {
        // Historical diagnostics must never block live shadow scoring.
      }
    }
  } catch (err) {
    _iterator1.e(err);
  } finally {
    _iterator1.f();
  }
  return rows.slice(Math.max(0, rows.length - limit));
}
function modelUtility(scoreMass) {
  if (!scoreMass) return null;
  return round(LABELS.reduce((sum, label) => sum + n(scoreMass[label]) * WEIGHTS[label], 0));
}
function buildMlLab() {
  var traceLog = loadMlTraceEvents(500);
  var dailyLearningRuns = loadJsonLines("don_combo_daily_shadow_runs.jsonl", 90);
  var tracedEvents = traceLog.events.map((event, index) => {
    var _event$run_context, _event$run_context2, _event$run_context3;
    var prediction = event.pre_action_prediction || null;
    var items = event.items || {};
    var itemNames = Object.keys(items).filter(name => n(items[name]) !== 0);
    return {
      index: traceLog.total - traceLog.events.length + index + 1,
      event_id: event.event_id,
      observed_at: event.observed_at,
      turn: event.turn,
      minute: event.minute,
      run_id: ((_event$run_context = event.run_context) === null || _event$run_context === void 0 ? void 0 : _event$run_context.run_id) || null,
      gameday: ((_event$run_context2 = event.run_context) === null || _event$run_context2 === void 0 ? void 0 : _event$run_context2.gameday) ?? null,
      route_mode: ((_event$run_context3 = event.run_context) === null || _event$run_context3 === void 0 ? void 0 : _event$run_context3.route_mode) || "legacy-unbound",
      outcome: event.outcome,
      planned_target: event.planned_target,
      actual_comb: event.actual_comb,
      items,
      meat: event.meat,
      item_names: itemNames,
      prediction_status: prediction ? prediction.error ? "error" : "ready" : "untraced",
      prediction: prediction ? {
        model_utility: prediction.model_utility ?? null,
        policy_utility: prediction.policy_utility ?? null,
        score_mass: prediction.score_mass ?? null,
        ms: prediction.ms ?? null,
        calibration: prediction.calibration ?? null,
        generated_at: prediction.generated_at ?? null
      } : null
    };
  });
  var predicted = tracedEvents.filter(event => event.prediction_status === "ready");
  var meanLatency = predicted.length > 0 ? round(predicted.reduce((sum, event) => {
    var _event$prediction;
    return sum + n((_event$prediction = event.prediction) === null || _event$prediction === void 0 ? void 0 : _event$prediction.ms);
  }, 0) / predicted.length, 2) : null;
  var receiptRows = loadJsonLines("don_combo_matrix_receipts.jsonl", 250);
  var snapshotHistory = receiptRows.map((receipt, index) => {
    var _receipt$comparison, _receipt$comparison2, _receipt$comparison3, _receipt$comparison4;
    var candidates = Array.isArray(receipt.candidates) ? receipt.candidates : [];
    var modelRanked = candidates.map(candidate => ({
      minute: n(candidate.minute),
      baseline: Boolean(candidate.is_combo_baseline),
      utility: modelUtility(candidate.score_mass)
    })).filter(candidate => candidate.utility != null).sort((a, b) => n(b.utility) - n(a.utility) || a.minute - b.minute);
    var modelBaselineIndex = modelRanked.findIndex(candidate => candidate.baseline);
    return {
      index: index + 1,
      generated_at: receipt.generated_at || null,
      state_sha256: receipt.state_sha256 || null,
      baseline_policy_rank: ((_receipt$comparison = receipt.comparison) === null || _receipt$comparison === void 0 ? void 0 : _receipt$comparison.baseline_rank) ?? null,
      baseline_model_rank: modelBaselineIndex >= 0 ? modelBaselineIndex + 1 : null,
      pool_size: ((_receipt$comparison2 = receipt.comparison) === null || _receipt$comparison2 === void 0 ? void 0 : _receipt$comparison2.pool_size) ?? candidates.length,
      shadow_top_minute: ((_receipt$comparison3 = receipt.comparison) === null || _receipt$comparison3 === void 0 ? void 0 : _receipt$comparison3.shadow_top_minute) ?? null,
      top_vs_baseline_delta: ((_receipt$comparison4 = receipt.comparison) === null || _receipt$comparison4 === void 0 ? void 0 : _receipt$comparison4.top_vs_baseline_delta) ?? null
    };
  });
  var outcomeCounts = {};
  var itemCounts = {};
  var _iterator10 = _createForOfIteratorHelper(tracedEvents),
    _step10;
  try {
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      var event = _step10.value;
      outcomeCounts[event.outcome] = (outcomeCounts[event.outcome] || 0) + 1;
      for (var _i7 = 0, _Object$entries2 = Object.entries(event.items); _i7 < _Object$entries2.length; _i7++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i7], 2),
          name = _Object$entries2$_i[0],
          amount = _Object$entries2$_i[1];
        itemCounts[name] = (itemCounts[name] || 0) + n(amount);
      }
    }
  } catch (err) {
    _iterator10.e(err);
  } finally {
    _iterator10.f();
  }
  return {
    schema: "don-combo-ml-lab/v0.1",
    trace_property: "don_combo_ml_trace",
    routed_auto_trace_enabled: true,
    daily_run_file: "don_combo_daily_shadow_runs.jsonl",
    daily_run_count_in_artifact: dailyLearningRuns.length,
    daily_run_history: dailyLearningRuns.slice(-30),
    last_daily_run: dailyLearningRuns.length ? dailyLearningRuns[dailyLearningRuns.length - 1] : null,
    trace_enabled: ["1", "true", "target", "on"].includes(String(kolmafia.getProperty("don_combo_ml_trace") || "").toLowerCase()),
    event_log_file: traceLog.file,
    events_total: traceLog.total,
    events_in_artifact: tracedEvents.length,
    predicted_events: predicted.length,
    untraced_events: tracedEvents.length - predicted.length,
    mean_prediction_latency_ms: meanLatency,
    outcome_counts: outcomeCounts,
    item_counts: itemCounts,
    events: tracedEvents,
    receipt_log_file: "don_combo_matrix_receipts.jsonl",
    snapshots_in_artifact: snapshotHistory.length,
    snapshot_history: snapshotHistory,
    note: "Per-comb pre-action WaterSheep traces automatically pair with post-action results for WaterSheep-routed runs; ordinary Combo keeps don_combo_ml_trace opt-in. Daily learning receipts distinguish incidental fallback twinkles from verified rare-tile respawns. No online model training or execution authority."
  };
}
function buildRunControl() {
  var status = String(kolmafia.getProperty("don_combo_last_run_status") || "unknown");
  var endReason = String(kolmafia.getProperty("don_combo_last_run_end_reason") || "unknown");
  var running = String(kolmafia.getProperty("don_combo_running") || "").toLowerCase() === "true";
  var interruptRequested = String(kolmafia.getProperty("don_combo_interrupt") || "").toLowerCase() === "true";
  var interruptConsumed = String(kolmafia.getProperty("don_combo_last_run_interrupt_consumed") || "").toLowerCase() === "true";
  var requestedCombs = n(kolmafia.getProperty("don_combo_last_run_requested"));
  var completedCombs = n(kolmafia.getProperty("don_combo_last_run_combs"));
  var mlEventsBefore = n(kolmafia.getProperty("don_combo_last_run_ml_events_before"));
  var mlEventsAfter = n(kolmafia.getProperty("don_combo_last_run_ml_events_after"));
  var mlEventDelta = Math.max(0, mlEventsAfter - mlEventsBefore);
  return {
    schema: "don-combo-run-control/v0.1",
    requested_combs: requestedCombs,
    completed_combs: completedCombs,
    route_mode: kolmafia.getProperty("don_combo_last_run_route_mode") || "combo-default",
    paid_combs_observed: n(kolmafia.getProperty("don_combo_last_run_paid_combs")),
    status,
    end_reason: endReason,
    running,
    interrupt_requested: interruptRequested,
    interrupt_consumed: interruptConsumed,
    clean_early_end: status === "interrupted" && endReason === "user_cooperative_interrupt",
    started_at: kolmafia.getProperty("don_combo_last_run_started_at") || null,
    ended_at: kolmafia.getProperty("don_combo_last_run_ended_at") || null,
    ml_events_before: mlEventsBefore,
    ml_events_after: mlEventsAfter,
    ml_event_delta: mlEventDelta,
    ml_trace_span_complete: mlEventDelta === completedCombs
  };
}
function emitReceipt(result) {
  var _result$ml_lab, _result$ml_lab2;
  var candidates = result.candidates.map(candidate => {
    var _candidate$watersheep;
    return {
      minute: candidate.minute,
      source: candidate.source,
      is_combo_baseline: candidate.is_combo_baseline,
      utility: candidate.utility,
      score_mass: ((_candidate$watersheep = candidate.watersheep) === null || _candidate$watersheep === void 0 ? void 0 : _candidate$watersheep.score_mass) || null,
      layout_snapshots: candidate.evidence.layout_snapshots,
      session_events: candidate.evidence.session_events,
      observation_count: candidate.evidence.observation_count
    };
  });
  var stateBasis = {
    combo_last_tile_index: result.combo.last_tile_index,
    current_minute: result.combo.current_minute,
    context: result.combo.context,
    observation_fronts: result.observations.fronts_recorded,
    ml_trace_events: ((_result$ml_lab = result.ml_lab) === null || _result$ml_lab === void 0 ? void 0 : _result$ml_lab.events_total) ?? 0,
    run_control: result.run_control,
    candidates
  };
  var stateSha = sha256(JSON.stringify(stateBasis));
  var lastFile = "don_combo_matrix_last_receipt.json";
  var logFile = "don_combo_matrix_receipts.jsonl";
  var previous = "";
  try {
    previous = String(kolmafia.fileToBuffer(lastFile) || "");
  } catch (_unused3) {
    previous = "";
  }
  var appended = !previous.includes(stateSha);
  var receipt = {
    schema: "don-combo-shadow-receipt/v0.7",
    generated_at: result.generated_at,
    state_sha256: stateSha,
    authority: "none",
    comparison: result.comparison,
    candidates,
    observation_fronts: result.observations.fronts_recorded,
    ml_trace_events: ((_result$ml_lab2 = result.ml_lab) === null || _result$ml_lab2 === void 0 ? void 0 : _result$ml_lab2.events_total) ?? 0,
    run_control: result.run_control,
    watersheep_calibration: result.watersheep.calibration
  };
  if (appended) {
    kolmafia.appendBufferToFile("".concat(JSON.stringify(receipt), "\n"), logFile);
    kolmafia.bufferToFile("".concat(JSON.stringify(receipt, null, 2), "\n"), lastFile);
  }
  return {
    schema: receipt.schema,
    state_sha256: stateSha,
    appended_this_run: appended,
    last_receipt_file: lastFile,
    jsonl_file: logFile,
    run_control: result.run_control
  };
}
function buildRuntime() {
  var frontierSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  var points = loadRarePoints();
  var baseline = comboBaseline(points);
  var ledger = loadObservationLedger();
  var recoveryLedger = loadTileRecoveryLedger();
  // ALL legacy + run-bound local observations, not just the 500-event UI tail.
  // The historic coordinate catalogue is not assigned invented event dates.
  var fullHistory = loadMlTraceEvents(Number.MAX_SAFE_INTEGER);
  var historicalIndex = buildHistoricalRareIndex(points, fullHistory.events, Date.now());
  var scratchBackfill = backfillScratchHistory(loadScratchLedger(), fullHistory.events, Date.now());
  var scratches = scratchBackfill.ledger;
  var scratchSummary = summarizeScratchLedger(scratches, scratchBackfill.imported);
  var poolIndex = buildPoolCooldownIndex(fullHistory.events, Date.now(), n(kolmafia.myId()));
  var historicalCurve = buildHistoricalRareCurve(points, fullHistory.events, poolIndex, Date.now(), n(kolmafia.myId()));
  var scratchTop = Object.keys(scratches.fronts).map(minute => evidenceForScratchFront(scratches, Number(minute))).filter(x => x.high_scratch_days > 0).sort((a, b) => b.interest_score - a.interest_score || b.very_interesting_days - a.very_interesting_days || b.max_scratch_count - a.max_scratch_count || a.front_minute - b.front_minute).slice(0, 30);
  var candidates = candidateFrontier(ledger, baseline, points, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve, frontierSize);
  var status = "ready";
  var error = null;
  var _iterator11 = _createForOfIteratorHelper(candidates),
    _step11;
  try {
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      var candidate = _step11.value;
      if (error) break;
      try {
        var _askWaterSheep2 = askWaterSheep(candidate),
          scores = _askWaterSheep2.scores,
          ms = _askWaterSheep2.ms;
        candidate.watersheep = {
          score_mass: scores,
          ms,
          calibration: "UNVALIDATED_FOR_KOL_BEACH"
        };
        var scored = scoreCandidate(candidate, scores);
        candidate.utility = scored.utility;
        candidate.utility_components = scored.components;
      } catch (caught) {
        status = "offline";
        error = caught instanceof Error ? caught.message : String(caught);
      }
    }
  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }
  candidates.sort((a, b) => (b.utility == null ? -1 : b.utility) - (a.utility == null ? -1 : a.utility) || a.minute - b.minute);
  var current = n(kolmafia.getProperty("_beachMinutes"));
  var context = loadContext();
  var cmp = comparison(candidates, baseline, Object.keys(ledger.fronts).length);
  var proof = {
    facts: [fact("FACT", "rare-corpus", "known", points.length, "raretiles.json"), fact("FACT", "observation-fronts", "known", Object.keys(ledger.fronts).length, "native ledger"), fact("MODEL", "kol-beach-calibration", "unknown", null, "WaterSheep"), fact("FACT", "baseline-membership-model-input", "withheld", null, "input policy")],
    relations: [relation("member-of", "combo-baseline", "candidate-pool", baseline ? true : null, "runtime construction"), relation("visible-to-model", "baseline-membership", "WaterSheep", false, "blinded input policy"), relation("authorizes", "WaterSheep", "KoL action", false, "authority boundary")],
    design_reference: TYPE_REFERENCE
  };
  var result = {
    schema: "don-combo-matrix-runtime/v0.8-ts",
    generated_at: new Date().toISOString(),
    player_id: n(kolmafia.myId()),
    gameday: kolmafia.gamedayToInt(),
    mode: "shadow-only",
    authority: "none",
    claim: "Score Combo's exact next successful target inside the same blinded WaterSheep pool as dynamic alternatives, without changing KoL state.",
    note: "TypeScript/Libram runtime. WaterSheep score mass is experimental and uncalibrated for KoL beach outcomes. Raw coordinate catalogue, source labels, baseline membership and Combo route identity are withheld from model input; past per-coordinate observed rare attempts (with provenance) are included as uncalibrated history.",
    matrix: {
      order: 10,
      width: GRID,
      height: GRID,
      total_cells: GRID * GRID,
      real_tile_cells: REAL,
      unused_cells: GRID * GRID - REAL,
      address_rule: "d=(minute-1)*100+(row-1)*10+column; (x,y)=HilbertPoint(d,10)"
    },
    combo: {
      rare_tile_records: points.length,
      unique_rare_fronts: new Set(points.filter(point => !point.false_rare).map(point => point.minute)).size,
      false_rare_records: parseFalseRares().size,
      raretiles_file: "raretiles.json",
      prefs_file: "KoLmafia native properties",
      last_tile_index: n(kolmafia.getProperty("combo_lastTileCombed")),
      current_minute: current || null,
      current_layout: kolmafia.getProperty("_beachLayout"),
      free_beach_combs_remaining: Math.max(0, 11 - n(kolmafia.getProperty("_freeBeachWalksUsed"))),
      context: context.context,
      context_file: context.file,
      baseline_in_pool: baseline != null
    },
    observations: {
      ledger_file: "don_combo_matrix_ledger.json",
      tile_recovery_file: "don_combo_tile_recovery.json",
      scratch_ledger_file: "don_combo_scratch_observations.json",
      scratch_summary: scratchSummary,
      scratch_top_fronts: scratchTop,
      tiles_recorded: Object.keys(recoveryLedger.tiles).length,
      historical_rare_baseline: historicalIndex.baseline,
      two_pool_cooldown_summary: poolIndex.summary,
      historical_rare_curve: historicalCurve,
      two_pool_observations_tail: poolIndex.observations.slice(-60),
      recovery_intervals: Object.values(recoveryLedger.tiles).reduce((count, entry) => {
        var _entry$recovery_inter;
        return count + (((_entry$recovery_inter = entry.recovery_intervals) === null || _entry$recovery_inter === void 0 ? void 0 : _entry$recovery_inter.length) || 0);
      }, 0),
      fronts_recorded: Object.keys(ledger.fronts).length,
      fronts: observationAtlas(ledger, scratches),
      ledger_updated_this_run: false,
      session_tail: {
        mode: "native-event",
        events_added: 0,
        offset: 0,
        path: null
      },
      rule: "Combo records beach observations directly into the local evidence ledger; KoLmafia session logs remain recovery evidence, not the hot-path trigger."
    },
    watersheep: {
      endpoint: ENDPOINT,
      evidence_contract: WATERSHEEP_EVIDENCE_CONTRACT,
      status,
      error,
      options: LABELS.slice(),
      weights: WEIGHTS,
      input_policy: "Known tile cooldown evidence and two-pool item/encounter chronology supplied as hypotheses, not calibrated rates; Combo target identity/order, source labels, baseline membership, and Combo-derived outcome labels withheld.",
      calibration: "UNVALIDATED_FOR_KOL_BEACH"
    },
    comparison: cmp,
    run_control: buildRunControl(),
    ml_lab: buildMlLab(),
    proof_graph: proof,
    ui: {
      design_reference: DESIGN_REFERENCE,
      representation_reference: REPRESENTATION_REFERENCE,
      hilbert_ui_reference: HILBERT_UI_REFERENCE,
      type_reference: TYPE_REFERENCE,
      semantic_order: ["claim", "context", "proof", "decision", "metadata", "exit"],
      evidence_kinds: ["FACT", "MODEL", "POLICY"]
    },
    known_rare_points: points,
    current_front_cells: layoutCells(current, kolmafia.getProperty("_beachLayout")),
    candidates
  };
  result.receipt = emitReceipt(result);
  return result;
}

// Explicit CLI execution first prepares a fresh, immutable ranked snapshot.
// The execution owner validates and freezes it before the first KoL action.
// Never quietly fall back to Combo's shuffled route if WaterSheep is offline.
function prepareWaterSheepRoute(requestedCombs) {
  if (!Number.isInteger(requestedCombs) || requestedCombs < 1 || requestedCombs > 100) throw new Error("WaterSheep comb count must be between 1 and 100.");
  var result = buildRuntime(Math.max(16, requestedCombs));
  if (result.watersheep.status !== "ready" || result.candidates.length < requestedCombs || result.candidates.slice(0, requestedCombs).some(candidate => candidate.utility == null || candidate.watersheep == null)) throw new Error("WaterSheep unavailable or insufficient fully scored rare fronts; no combs started.");
  writeRuntime(result);
}
function writeRuntime(result) {
  var _result$ml_lab3, _result$run_control;
  var encoded = JSON.stringify(result);
  kolmafia.bufferToFile(JSON.stringify(result, null, 2) + "\n", "don_combo_matrix_runtime.json");
  kolmafia.bufferToFile("window.DON_COMBO_MATRIX_RUNTIME=" + encoded + ";\n", "relay/don_combo_matrix_runtime.js");
  // Commit marker last. The relay refresh endpoint only acknowledges a newly
  // generated runtime after both local artifacts have been written.
  // Export must subsequently read back the JS artifact and verify this exact
  // generation, event total and run status, never trust browser reload alone.
  kolmafia.setProperty("don_combo_matrix_refresh_generation", String(result.generated_at));
  kolmafia.setProperty("don_combo_matrix_refresh_events", String(((_result$ml_lab3 = result.ml_lab) === null || _result$ml_lab3 === void 0 ? void 0 : _result$ml_lab3.events_total) ?? ""));
  kolmafia.setProperty("don_combo_matrix_refresh_run_status", String(((_result$run_control = result.run_control) === null || _result$run_control === void 0 ? void 0 : _result$run_control.status) ?? ""));
}
function readRequest(path) {
  var raw = readFlatAshMap(path);
  if (!raw.schema) throw new Error("unable to read runtime request map: " + path);
  return decodeRuntimeRequest(raw);
}
function writeResponse(request, response) {
  var wire = {
    schema: response.schema,
    id: response.id,
    status: response.status,
    capability: response.capability,
    detail: response.detail,
    generated_at: response.generated_at
  };
  if (response.runtime_schema != null) wire.runtime_schema = response.runtime_schema;
  if (response.shadow_top_minute != null) {
    wire.shadow_top_minute = String(response.shadow_top_minute);
  }
  if (response.baseline_rank != null) wire.baseline_rank = String(response.baseline_rank);
  writeFlatAshMap("agent-runtime/outbox/".concat(request.id, ".txt"), wire);
}
function processRequest(path) {
  var request;
  try {
    request = readRequest(path);
  } catch (error) {
    kolmafia.print("don_combo runtime: " + String(error), "red");
    return;
  }
  if (request.capability === "excavator-smoke") {
    var excavatorConfigured = kolmafia.getProperty("spadingScript").toLowerCase().includes("excavator");
    var logs = kolmafia.sessionLogs(1);
    var comboMarkerVisible = logs.some(log => String(log).includes("DON_COMBO_OBSERVATION"));
    var ok = request.event != null && request.meta != null && request.page != null;
    var _response = {
      schema: "kol-runtime-response/v1",
      id: request.id,
      status: ok ? "ok" : "invalid",
      capability: request.capability,
      detail: "Excavator-compatible event/meta/page envelope ".concat(ok ? "round-tripped" : "failed", "; configured=").concat(excavatorConfigured, "; sessionLogs=").concat(logs.length, "; comboMarkerVisible=").concat(comboMarkerVisible, "; no spading preference changed and no network request made."),
      generated_at: new Date().toISOString()
    };
    writeResponse(request, _response);
    kolmafia.print("don_combo runtime smoke: " + (ok ? "PASS" : "FAIL") + " · excavator envelope");
    return;
  }
  var runtime = buildRuntime();
  writeRuntime(runtime);
  var response = {
    schema: "kol-runtime-response/v1",
    id: request.id,
    status: runtime.watersheep.status === "ready" ? "ok" : "offline",
    capability: request.capability,
    detail: request.reason,
    generated_at: runtime.generated_at,
    runtime_schema: runtime.schema,
    shadow_top_minute: runtime.comparison.shadow_top_minute,
    baseline_rank: runtime.comparison.baseline_rank
  };
  writeResponse(request, response);
  kolmafia.print("don_combo TS runtime: " + runtime.watersheep.status + " | pool " + runtime.comparison.pool_size + " | baseline rank " + String(runtime.comparison.baseline_rank ?? "n/a") + " | shadow top " + String(runtime.comparison.shadow_top_minute ?? "n/a"));
}
function main(args) {
  var raw = String(args || "").trim();
  if (raw.startsWith("process ")) {
    processRequest(raw.substring(8).trim());
    return;
  }
  if (raw === "--smoke-excavator") {
    var request = {
      schema: "kol-runtime-request/v1",
      id: "smoke-" + Date.now(),
      capability: "excavator-smoke",
      action: "smoke",
      reason: "manual-smoke",
      authority: "none",
      event: "choice",
      meta: "excavator-compatible",
      page: "<html data-smoke='don_combo'></html>"
    };
    var wire = {
      schema: request.schema,
      id: request.id,
      capability: request.capability,
      action: request.action,
      reason: request.reason,
      authority: request.authority,
      event: request.event || "",
      meta: request.meta || "",
      page: request.page || ""
    };
    writeFlatAshMap("agent-runtime/inbox/".concat(request.id, ".txt"), wire);
    processRequest("agent-runtime/inbox/".concat(request.id, ".txt"));
    return;
  }
  var runtime = buildRuntime();
  writeRuntime(runtime);
  kolmafia.print("don_combo TS runtime refreshed.");
}

exports.main = main;
exports.prepareWaterSheepRoute = prepareWaterSheepRoute;
exports.traceTargetPrediction = traceTargetPrediction;
