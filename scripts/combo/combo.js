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
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
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
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
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
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _taggedTemplateLiteral(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
    raw: {
      value: Object.freeze(t)
    }
  }));
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
  return (String )(t);
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
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function (t) {
    if (null === t || !_isNativeFunction(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return _construct(t, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), _setPrototypeOf(Wrapper, t);
  }, _wrapNativeSuper(t);
}

/** THIS FILE IS AUTOMATICALLY GENERATED. See tools/parseDefaultProperties.ts for more information */
var booleanProperties = ["abortOnChoiceWhenNotInChoice", "addChatCommandLine", "addCreationQueue", "addStatusBarToFrames", "allowCloseableDesktopTabs", "allowNegativeTally", "allowNonMoodBurning", "allowSummonBurning", "autoHighlightOnFocus", "broadcastEvents", "cacheMallSearches", "chatBeep", "chatLinksUseRelay", "compactChessboard", "copyAsHTML", "customizedTabs", "debugBuy", "debugConsequences", "debugFoxtrotRemoval", "debugPathnames", "debugTopMenuStyle", "gapProtection", "gitInstallDependencies", "gitShowCommitMessages", "gitUpdateOnLogin", "greenScreenProtection", "guiUsesOneWindow", "hideServerDebugText", "logAcquiredItems", "logBattleAction", "logBrowserInteractions", "logChatMessages", "logChatRequests", "logCleanedHTML", "logDecoratedResponses", "logFamiliarActions", "logGainMessages", "logReadableHTML", "logPreferenceChange", "logMonsterHealth", "logReverseOrder", "logStatGains", "logStatusEffects", "logStatusOnLogin", "macroDebug", "macroLens", "mementoListActive", "mergeHobopolisChat", "pingLogin", "pingStealthyTimein", "printStackOnAbort", "proxySet", "relayAddSounds", "relayAddsCustomCombat", "relayAddsDiscoHelper", "relayAddsGraphicalCLI", "relayAddsQuickScripts", "relayAddsRestoreLinks", "relayAddsUpArrowLinks", "relayAddsUseLinks", "relayAddsWikiLinks", "relayAllowRemoteAccess", "relayBrowserOnly", "relayCacheUncacheable", "relayFormatsChatText", "relayHidesJunkMallItems", "relayMaintainsEffects", "relayMaintainsHealth", "relayMaintainsMana", "relayOverridesImages", "relayRunsAfterAdventureScript", "relayRunsBeforeBattleScript", "relayRunsBeforePVPScript", "relayScriptButtonFirst", "relayTextualizesEffects", "relayTrimsZapList", "relayUsesInlineLinks", "relayUsesIntegratedChat", "relayWarnOnRecoverFailure", "removeMalignantEffects", "retryFailedNetworkRequests", "saveSettingsOnSet", "sharePriceData", "showAllRequests", "showExceptionalRequests", "stealthLogin", "svnAlwaysAdd", "svnAlwaysOverwrite", "svnInstallDependencies", "svnShowCommitMessages", "svnUpdateOnLogin", "switchEquipmentForBuffs", "syncAfterSvnUpdate", "useChatToolbar", "useContactsFrame", "useDevServer", "useDockIconBadge", "useHugglerChannel", "useImageCache", "useLastUserAgent", "useSystemTrayIcon", "useTabbedChatFrame", "useToolbars", "useCachedVolcanoMaps", "useZoneComboBox", "verboseSpeakeasy", "verboseFloundry", "wrapLongLines", "_faxDataChanged", "_gitUpdated", "_svnRepoFileFetched", "_svnUpdated", "antagonisticSnowmanKitAvailable", "arcadeGameHints", "armoryUnlocked", "autoForbidIgnoringStores", "autoCraft", "autoQuest", "autoEntangle", "autoGarish", "autoManaRestore", "autoFillMayoMinder", "autoPinkyRing", "autoPlantHardcore", "autoPlantSoftcore", "autoPotionID", "autoRepairBoxServants", "autoSatisfyWithCloset", "autoSatisfyWithCoinmasters", "autoSatisfyWithMall", "autoSatisfyWithNPCs", "autoSatisfyWithStash", "autoSatisfyWithStorage", "autoSatisfyWithShop", "autoSetConditions", "autoSteal", "autoTuxedo", "backupCameraReverserEnabled", "badMoonEncounter01", "badMoonEncounter02", "badMoonEncounter03", "badMoonEncounter04", "badMoonEncounter05", "badMoonEncounter06", "badMoonEncounter07", "badMoonEncounter08", "badMoonEncounter09", "badMoonEncounter10", "badMoonEncounter11", "badMoonEncounter12", "badMoonEncounter13", "badMoonEncounter14", "badMoonEncounter15", "badMoonEncounter16", "badMoonEncounter17", "badMoonEncounter18", "badMoonEncounter19", "badMoonEncounter20", "badMoonEncounter21", "badMoonEncounter22", "badMoonEncounter23", "badMoonEncounter24", "badMoonEncounter25", "badMoonEncounter26", "badMoonEncounter27", "badMoonEncounter28", "badMoonEncounter29", "badMoonEncounter30", "badMoonEncounter31", "badMoonEncounter32", "badMoonEncounter33", "badMoonEncounter34", "badMoonEncounter35", "badMoonEncounter36", "badMoonEncounter37", "badMoonEncounter38", "badMoonEncounter39", "badMoonEncounter40", "badMoonEncounter41", "badMoonEncounter42", "badMoonEncounter43", "badMoonEncounter44", "badMoonEncounter45", "badMoonEncounter46", "badMoonEncounter47", "badMoonEncounter48", "barrelShrineUnlocked", "batWingsBatHoleEntrance", "batWingsBatratBurrow", "batWingsBeanbatChamber", "batWingsGuanoJunction", "bigBrotherRescued", "blackBartsBootyAvailable", "bondAdv", "bondBeach", "bondBeat", "bondBooze", "bondBridge", "bondDesert", "bondDR", "bondDrunk1", "bondDrunk2", "bondHoney", "bondHP", "bondInit", "bondItem1", "bondItem2", "bondItem3", "bondJetpack", "bondMartiniDelivery", "bondMartiniPlus", "bondMartiniTurn", "bondMeat", "bondMox1", "bondMox2", "bondMPregen", "bondMus1", "bondMus2", "bondMys1", "bondMys2", "bondSpleen", "bondStat", "bondStat2", "bondStealth", "bondStealth2", "bondSymbols", "bondWar", "bondWeapon2", "bondWpn", "bookOfIronyAvailable", "booPeakLit", "bootsCharged", "breakfastCompleted", "burlyBodyguardReceivedBonus", "burrowgrubHiveUsed", "calzoneOfLegendEaten", "candyCaneSwordApartmentBuilding", "candyCaneSwordBlackForest", "candyCaneSwordBowlingAlley", "candyCaneSwordCopperheadClub", "candyCaneSwordDailyDungeon", "candyCaneSwordDefiledCranny", "candyCaneSwordFunHouse", "candyCaneSwordShore", "candyCaneSwordWarFratRoom", "candyCaneSwordWarFratZetas", "candyCaneSwordWarHippyBait", "candyCaneSwordWarHippyLine", "canteenUnlocked", "chaosButterflyThrown", "chatbotScriptExecuted", "chateauAvailable", "chatLiterate", "chatServesUpdates", "checkJackassHardcore", "checkJackassSoftcore", "clanAttacksEnabled", "coldAirportAlways", "considerShadowNoodles", "controlRoomUnlock", "concertVisited", "controlPanel1", "controlPanel2", "controlPanel3", "controlPanel4", "controlPanel5", "controlPanel6", "controlPanel7", "controlPanel8", "controlPanel9", "corralUnlocked", "crAlways", "crimbo23ArmoryAtWar", "crimbo23BarAtWar", "crimbo23CafeAtWar", "crimbo23CottageAtWar", "crimbo23FoundryAtWar", "cyberDatastickCollected", "dailyDungeonDone", "dampOldBootPurchased", "daycareOpen", "deepDishOfLegendEaten", "demonSummoned", "dinseyAudienceEngagement", "dinseyGarbagePirate", "dinseyRapidPassEnabled", "dinseyRollercoasterNext", "dinseySafetyProtocolsLoose", "doghouseBoarded", "dontStopForCounters", "drippingHallUnlocked", "drippyShieldUnlocked", "edUsedLash", "eldritchFissureAvailable", "eldritchHorrorAvailable", "enqueueForConsumption", "errorOnAmbiguousFold", "essenceOfAnnoyanceAvailable", "essenceOfBearAvailable", "expressCardUsed", "falloutShelterChronoUsed", "falloutShelterCoolingTankUsed", "fireExtinguisherBatHoleUsed", "fireExtinguisherChasmUsed", "fireExtinguisherCyrptUsed", "fireExtinguisherDesertUsed", "fireExtinguisherHaremUsed", "fistTeachingsHaikuDungeon", "fistTeachingsPokerRoom", "fistTeachingsBarroomBrawl", "fistTeachingsConservatory", "fistTeachingsBatHole", "fistTeachingsFunHouse", "fistTeachingsMenagerie", "fistTeachingsSlums", "fistTeachingsFratHouse", "fistTeachingsRoad", "fistTeachingsNinjaSnowmen", "flickeringPixel1", "flickeringPixel2", "flickeringPixel3", "flickeringPixel4", "flickeringPixel5", "flickeringPixel6", "flickeringPixel7", "flickeringPixel8", "floristFriarAvailable", "floristFriarChecked", "frAlways", "frCemetaryUnlocked", "friarsBlessingReceived", "frMountainsUnlocked", "frSwampUnlocked", "frVillageUnlocked", "frWoodUnlocked", "getawayCampsiteUnlocked", "ghostPencil1", "ghostPencil2", "ghostPencil3", "ghostPencil4", "ghostPencil5", "ghostPencil6", "ghostPencil7", "ghostPencil8", "ghostPencil9", "gingerAdvanceClockUnlocked", "gingerBlackmailAccomplished", "gingerbreadCityAvailable", "gingerExtraAdventures", "gingerNegativesDropped", "gingerSewersUnlocked", "gingerSubwayLineUnlocked", "gingerRetailUnlocked", "glitchItemAvailable", "grabCloversHardcore", "grabCloversSoftcore", "grandpaUnlockedBlankPrescriptionSheet", "grandpaUnlockedEelSauce", "grandpaUnlockedFishyWand", "grandpaUnlockedGlowingSyringe", "grandpaUnlockedGroupieSpangles", "grandpaUnlockedHairOfTheFish", "grandpaUnlockedHalibut", "grandpaUnlockedHeavilyInvestedInPunFutures", "grandpaUnlockedJellyfishGel", "grandpaUnlockedMarineAquamarine", "grandpaUnlockedMidgetClownfish", "grandpaUnlockedSeaRadish", "grandpaUnlockedTrophyFish", "grandpaUnlockedWaterPoloCap", "grandpaUnlockedWaterPoloMitt", "guideToSafariAvailable", "guyMadeOfBeesDefeated", "hallowienerDefiledNook", "hallowienerGuanoJunction", "hallowienerKnollGym", "hallowienerMadnessBakery", "hallowienerMiddleChamber", "hallowienerOvergrownLot", "hallowienerSkeletonStore", "hallowienerSmutOrcs", "hallowienerSonofaBeach", "hallowienerVolcoino", "hardcorePVPWarning", "harvestBatteriesHardcore", "harvestBatteriesSoftcore", "hasAutumnaton", "hasBartender", "hasChef", "hasCocktailKit", "hasCosmicBowlingBall", "hasDetectiveSchool", "hasMaydayContract", "hasOven", "hasRange", "hasShaker", "hasShrunkenHead", "hasSushiMat", "hasTwinkleVision", "haveBoxingDaydreamHardcore", "haveBoxingDaydreamSoftcore", "heartstoneBanishUnlocked", "heartstoneBuffUnlocked", "heartstoneKillUnlocked", "heartstoneLuckUnlocked", "heartstonePalsUnlocked", "heartstoneStunUnlocked", "hermitHax0red", "holidayHalsBookAvailable", "horseryAvailable", "hotAirportAlways", "intenseCurrents", "isMerkinGladiatorChampion", "isMerkinHighPriest", "itemBoughtPerAscension637", "itemBoughtPerAscension8266", "itemBoughtPerAscension10790", "itemBoughtPerAscension10794", "itemBoughtPerAscension10795", "itemBoughtPerCharacter6423", "itemBoughtPerCharacter6428", "itemBoughtPerCharacter6429", "kingLiberated", "lastPirateInsult1", "lastPirateInsult2", "lastPirateInsult3", "lastPirateInsult4", "lastPirateInsult5", "lastPirateInsult6", "lastPirateInsult7", "lastPirateInsult8", "lawOfAveragesAvailable", "leafletCompleted", "ledCandleDropped", "libraryCardUsed", "lockPicked", "logBastilleBattalionBattles", "loginRecoveryHardcore", "loginRecoverySoftcore", "lovebugsUnlocked", "loveTunnelAvailable", "lowerChamberUnlock", "madnessBakeryAvailable", "makeHandheldRadiosHardcore", "makeHandheldRadiosSoftcore", "makePocketWishesHardcore", "makePocketWishesSoftcore", "manualOfNumberologyAvailable", "mappingMonsters", "mapToAnemoneMinePurchased", "mapToKokomoAvailable", "mapToMadnessReefPurchased", "mapToTheDiveBarPurchased", "mapToTheMarinaraTrenchPurchased", "mapToTheSkateParkPurchased", "maraisBeaverUnlock", "maraisCorpseUnlock", "maraisDarkUnlock", "maraisVillageUnlock", "maraisWildlifeUnlock", "maraisWizardUnlock", "maximizerAlwaysCurrent", "maximizerCreateOnHand", "maximizerCurrentMallPrices", "maximizerFoldables", "maximizerIncludeAll", "maximizerNoAdventures", "maximizerUseScope", "merkinElementaryBathroomUnlock", "merkinElementaryJanitorUnlock", "merkinElementaryTeacherUnlock", "middleChamberUnlock", "milkOfMagnesiumActive", "moonTuned", "neverendingPartyAlways", "noncombatForcerActive", "oasisAvailable", "odeBuffbotCheck", "oilPeakLit", "oscusSodaUsed", "outrageousSombreroUsed", "overgrownLotAvailable", "ownsFloristFriar", "ownsSpeakeasy", "pathedSummonsHardcore", "pathedSummonsSoftcore", "pirateRealmUnlockedAnemometer", "pirateRealmUnlockedBlunderbuss", "pirateRealmUnlockedBreastplate", "pirateRealmUnlockedClipper", "pirateRealmUnlockedCrabsicle", "pirateRealmUnlockedFlag", "pirateRealmUnlockedFork", "pirateRealmUnlockedGoldRing", "pirateRealmUnlockedManOWar", "pirateRealmUnlockedPlushie", "pirateRealmUnlockedRadioRing", "pirateRealmUnlockedRhum", "pirateRealmUnlockedScurvySkillbook", "pirateRealmUnlockedShavingCream", "pirateRealmUnlockedSpyglass", "pirateRealmUnlockedTattoo", "pirateRealmUnlockedThirdCrewmate", "pirateRealmUnlockedTikiSkillbook", "pizzaOfLegendEaten", "popularTartUnlocked", "potatoAlarmClockUsed", "prAlways", "prayedForGlamour", "prayedForProtection", "prayedForVigor", "primaryLabCheerCoreGrabbed", "pumpkinSpiceWhorlUsed", "pyramidBombUsed", "rageGlandVented", "readManualHardcore", "readManualSoftcore", "relayDecorateJsCommands", "relayShowSpoilers", "relayShowWarnings", "rememberDesktopSize", "replicaChateauAvailable", "replicaNeverendingPartyAlways", "replicaWitchessSetAvailable", "requireBoxServants", "requireSewerTestItems", "restUsingCampAwayTent", "restUsingChateau", "ROMOfOptimalityAvailable", "safePickpocket", "schoolOfHardKnocksDiplomaAvailable", "scriptCascadingMenus", "serverAddsCustomCombat", "serverAddsBothCombat", "SHAWARMAInitiativeUnlocked", "showForbiddenStores", "showGainsPerUnit", "showIgnoringStorePrices", "showNoSummonOnly", "showTurnFreeOnly", "shubJigguwattDefeated", "skeletonStoreAvailable", "sleazeAirportAlways", "snojoAvailable", "sortByEffect", "sortByRoom", "spacegateAlways", "spacegateVaccine1", "spacegateVaccine2", "spacegateVaccine3", "spaceInvaderDefeated", "spelunkyHints", "spiceMelangeUsed", "spookyAirportAlways", "stenchAirportAlways", "stopForFixedWanderer", "stopForUltraRare", "styxPixieVisited", "superconductorDefeated", "suppressCyberRealmDarkMode", "suppressCyberRealmGreenImages", "suppressInappropriateNags", "suppressPowerPixellation", "suppressMallPriceCacheMessages", "telegraphOfficeAvailable", "telescopeLookedHigh", "timeTowerAvailable", "trackLightsOut", "uneffectWithHotTub", "universalSeasoningActive", "universalSeasoningAvailable", "useBookOfEverySkillHardcore", "useBookOfEverySkillSoftcore", "useCrimboToysHardcore", "useCrimboToysSoftcore", "verboseMaximizer", "visitLoungeHardcore", "visitLoungeSoftcore", "visitRumpusHardcore", "visitRumpusSoftcore", "voteAlways", "wildfireBarrelCaulked", "wildfireDusted", "wildfireFracked", "wildfirePumpGreased", "wildfireSprinkled", "yearbookCameraPending", "yogUrtDefeated", "youRobotScavenged", "_2002MrStoreCreditsCollected", "_affirmationCookieEaten", "_affirmationHateUsed", "_airFryerUsed", "_akgyxothUsed", "_alienAnimalMilkUsed", "_alienPlantPodUsed", "_allYearSucker", "_alliedRadioMaterielIntel", "_alliedRadioWildsunBoon", "_aprilShower", "_aprilShowerGlobsCollected", "_aprilShowerLungingThrustSmack", "_aprilShowerNorthernExplosion", "_aprilShowerSimmer", "_armyToddlerCast", "_aug1Cast", "_aug2Cast", "_aug3Cast", "_aug4Cast", "_aug5Cast", "_aug6Cast", "_aug7Cast", "_aug8Cast", "_aug9Cast", "_aug10Cast", "_aug11Cast", "_aug12Cast", "_aug13Cast", "_aug14Cast", "_aug15Cast", "_aug16Cast", "_aug17Cast", "_aug18Cast", "_aug19Cast", "_aug20Cast", "_aug21Cast", "_aug22Cast", "_aug23Cast", "_aug24Cast", "_aug25Cast", "_aug26Cast", "_aug27Cast", "_aug28Cast", "_aug29Cast", "_aug30Cast", "_aug31Cast", "_augTodayCast", "_authorsInkUsed", "_baconMachineUsed", "_bagOfCandy", "_bagOfCandyUsed", "_bagOTricksUsed", "_ballastTurtleUsed", "_ballInACupUsed", "_ballpit", "_barrelPrayer", "_bastilleLastBattleWon", "_beachCombing", "_bendHellUsed", "_blackMonolithUsed", "_blankoutUsed", "_bloodBagDoctorBag", "_bloodBagCloake", "_bloodBankIntimidated", "_bloodBankVisited", "_bonersSummoned", "_bookOfEverySkillUsed", "_borrowedTimeUsed", "_bowleggedSwaggerUsed", "_bowlFullOfJellyUsed", "_boxOfHammersUsed", "_brainPreservationFluidUsed", "_brassDreadFlaskUsed", "_cameraUsed", "_canSeekBirds", "_candyCaneSwordBackAlley", "_candyCaneSwordHauntedBedroom", "_candyCaneSwordHauntedLibrary", "_candyCaneSwordLyle", "_candyCaneSwordMadnessBakery", "_candyCaneSwordOvergrownLot", "_candyCaneSwordOvergrownShrine", "_candyCaneSwordPalindome", "_candyCaneSwordSouthOfTheBorder", "_candyCaneSwordSpookyForest", "_carboLoaded", "_cargoPocketEmptied", "_ceciHatUsed", "_chateauDeskHarvested", "_chateauMonsterFought", "_chibiChanged", "_chronerCrossUsed", "_chronerTriggerUsed", "_chubbyAndPlumpUsed", "_circadianRhythmsRecalled", "_circleDrumUsed", "_clanFortuneBuffUsed", "_clanRumpusSpot1Visited", "_clanRumpusSpot2Visited", "_clanRumpusSpot3Visited", "_clanRumpusSpot4Visited", "_clanRumpusSpot5Visited", "_clanRumpusSpot7Visited", "_clanRumpusSpot9Visited", "_claraBellUsed", "_coalPaperweightUsed", "_cocoaDispenserUsed", "_cocktailShakerUsed", "_coldAirportToday", "_coldOne", "_communismUsed", "_confusingLEDClockUsed", "_controlPanelUsed", "_cookbookbatRecipeDrops", "_coolerYetiAdventures", "_corruptedStardustUsed", "_cosmicSixPackConjured", "_crappyCameraUsed", "_creepyVoodooDollUsed", "_crimboPastDailySpecial", "_crimboPastMedicalGruel", "_crimboPastPrizeTurkey", "_crimboPastSmokingPope", "_crimboTraining", "_crimboTree", "_crToday", "_cursedKegUsed", "_cursedMicrowaveUsed", "_cyberTrashCollected", "_dailyDungeonMalwareUsed", "_darkChocolateHeart", "_daycareFights", "_daycareNap", "_daycareSpa", "_daycareToday", "_defectiveTokenChecked", "_defectiveTokenUsed", "_dinseyGarbageDisposed", "_discoKnife", "_distentionPillUsed", "_dnaHybrid", "_docClocksThymeCocktailDrunk", "_douseFoeSuccess", "_drippingHallDoor1", "_drippingHallDoor2", "_drippingHallDoor3", "_drippingHallDoor4", "_drippyCaviarUsed", "_drippyNuggetUsed", "_drippyPilsnerUsed", "_drippyPlumUsed", "_drippyWineUsed", "_eldritchHorrorEvoked", "_eldritchTentacleFought", "_eleventRestEffectGained", "_elfGuardHangoverCureUsed", "_emberingHulkFought", "_entauntaunedToday", "_envyfishEggUsed", "_epicMcTwistUsed", "_essentialTofuUsed", "_etchedHourglassUsed", "_eternalCarBatteryUsed", "_everfullGlassUsed", "_extraGreasySliderEaten", "_eyeAndATwistUsed", "_fancyChessSetUsed", "_falloutShelterSpaUsed", "_fancyHotDogEaten", "_faradayCageRestEffectGained", "_farmerItemsCollected", "_favoriteBirdVisited", "_firedJokestersGun", "_fireExtinguisherRefilled", "_fireStartingKitUsed", "_fireworksShop", "_fireworksShopHatBought", "_fireworksShopEquipmentBought", "_fireworkUsed", "_fishyPipeUsed", "_flagellateFlagonUsed", "_fleekMascaraUsed", "_floundryItemCreated", "_floundryItemUsed", "_freePillKeeperUsed", "_frToday", "_frostyMugUsed", "_fudgeSporkUsed", "_garbageItemChanged", "_giantGnawingBoneUsed", "_gingerBiggerAlligators", "_gingerbreadCityToday", "_gingerbreadClockAdvanced", "_gingerbreadClockVisited", "_gingerbreadColumnDestroyed", "_gingerbreadHouseRestEffectGained", "_gingerbreadMobHitUsed", "_glennGoldenDiceUsed", "_glitchItemImplemented", "_gnollEyeUsed", "_gnomePart", "_governmentPerDiemUsed", "_grimBuff", "_guildManualUsed", "_guzzlrQuestAbandoned", "_hardKnocksDiplomaUsed", "_heartstoneLuckUsed", "_hippyMeatCollected", "_hobbyHorseUsed", "_hodgmansBlanketDrunk", "_holidayFunUsed", "_holoWristCrystal", "_hotAirportToday", "_hungerSauceUsed", "_hyperinflatedSealLungUsed", "_iceHotelRoomsRaided", "_iceSculptureUsed", "_incredibleSelfEsteemCast", "_infernoDiscoVisited", "_infiniteJellyUsed", "_internetDailyDungeonMalwareBought", "_internetGallonOfMilkBought", "_internetPlusOneBought", "_internetPrintScreenButtonBought", "_internetViralVideoBought", "_interviewIsabella", "_interviewMasquerade", "_interviewVlad", "_inquisitorsUnidentifiableObjectUsed", "_ironicMoustache", "_jackassPlumberGame", "_jarlsCheeseSummoned", "_jarlsCreamSummoned", "_jarlsDoughSummoned", "_jarlsEggsSummoned", "_jarlsFruitSummoned", "_jarlsMeatSummoned", "_jarlsPotatoSummoned", "_jarlsVeggiesSummoned", "_jingleBellUsed", "_jukebox", "_kgbFlywheelCharged", "_kgbLeftDrawerUsed", "_kgbOpened", "_kgbRightDrawerUsed", "_kolConSixPackUsed", "_kolhsCutButNotDried", "_kolhsIsskayLikeAnAshtray", "_kolhsPoeticallyLicenced", "_kolhsSchoolSpirited", "_kudzuSaladEaten", "_lastCombatLost", "_lastCombatWon", "_latteBanishUsed", "_latteCopyUsed", "_latteDrinkUsed", "_leafAntEggCrafted", "_leafDayShortenerCrafted", "_leafTattooCrafted", "_leavesJumped", "_legendaryBeat", "_legendaryNoodlesSpleen", "_legendaryPastaWaveCast", "_legendarySpiceGhostFood", "_licenseToChillUsed", "_lodestoneUsed", "_lookingGlass", "_loveTunnelToday", "_loveTunnelUsed", "_luckyGoldRingVolcoino", "_lunchBreak", "_lupineHormonesUsed", "_lyleFavored", "_madLiquorDrunk", "_madTeaParty", "_mafiaMiddleFingerRingUsed", "_managerialManipulationUsed", "_mansquitoSerumUsed", "_mapToACandyRichBlockUsed", "_maydayDropped", "_mayoDeviceRented", "_mayoTankSoaked", "_meatballMachineUsed", "_meatifyMatterUsed", "_milkOfMagnesiumUsed", "_mimeArmyShotglassUsed", "_miniKiwiIntoxicatingSpiritsBought", "_miniKiwiTipiDrop", "_missGravesVermouthDrunk", "_missileLauncherUsed", "_mobiusRingPrimed", "_molehillMountainUsed", "_momFoodReceived", "_mrBurnsgerEaten", "_muffinOrderedToday", "_mulliganStewEaten", "_mushroomGardenVisited", "_mushroomHouseRestEffectGained", "_neverendingPartyToday", "_newYouQuestCompleted", "_olympicSwimmingPool", "_olympicSwimmingPoolItemFound", "_overflowingGiftBasketUsed", "_partyHard", "_pastaAdditive", "_perfectFreezeUsed", "_perfectlyFairCoinUsed", "_petePartyThrown", "_peteRiotIncited", "_photocopyUsed", "_pickyTweezersUsed", "_pickleJuiceDrunk", "_pingPongGame", "_pirateBellowUsed", "_pirateDinghyUsed", "_pirateForkUsed", "_pirateRealmSoldCompass", "_pirateRealmWindicleUsed", "_pixelOrbUsed", "_plumbersMushroomStewEaten", "_pneumaticityPotionUsed", "_porkElfMedicineCabinetUsed", "_porkElfNetiPotUsed", "_porkElfSinkUsed", "_porkElfToiletriesKitUsed", "_porkElfToiletUsed", "_portableSteamUnitUsed", "_pottedTeaTreeUsed", "_prToday", "_psychoJarFilled", "_psychoJarUsed", "_psychokineticHugUsed", "_pumpkinRestEffectGained", "_punchingMirrorUsed", "_rainStickUsed", "_redwoodRainStickUsed", "_replicaSnowconeTomeUsed", "_replicaResolutionLibramUsed", "_replicaSmithsTomeUsed", "_requestSandwichSucceeded", "_residenceCubeRestEffectGained", "_rhinestonesAcquired", "_saladForkUsed", "_seadentWaveUsed", "_seaJellyHarvested", "_septEmberBalanceChecked", "_setOfJacksUsed", "_sewingKitUsed", "_sexChanged", "_shadowAffinityToday", "_shadowForestLooted", "_shrubDecorated", "_silverDreadFlaskUsed", "_sitCourseCompleted", "_skateBuff1", "_skateBuff2", "_skateBuff3", "_skateBuff4", "_skateBuff5", "_sleazeAirportToday", "_snowballFactoryUsed", "_snowFortRestEffectGained", "_sobrieTeaUsed", "_softwareGlitchTurnReceived", "_sotParcelReturned", "_spacegateMurderbot", "_spacegateRuins", "_spacegateSpant", "_spacegateToday", "_spacegateVaccine", "_spaghettiBreakfast", "_spaghettiBreakfastEaten", "_spinmasterLatheVisited", "_spinningWheel", "_spookyAirportToday", "_stabonicScrollUsed", "_steelyEyedSquintUsed", "_stenchAirportToday", "_stinkyCheeseBanisherUsed", "_strangeStalagmiteUsed", "_streamsCrossed", "_structuralEmberUsed", "_stuffedPocketwatchUsed", "_styxSprayUsed", "_summonAnnoyanceUsed", "_summonCarrotUsed", "_summonResortPassUsed", "_sweetToothUsed", "_syntheticDogHairPillUsed", "_tacoFlierUsed", "_takerSpaceSuppliesDelivered", "_telegraphOfficeToday", "_templeHiddenPower", "_tempuraAirUsed", "_thesisDelivered", "_tiedUpFlamingLeafletFought", "_tiedUpFlamingMonsteraFought", "_tiedUpLeaviathanFought", "_timeSpinnerReplicatorUsed", "_toastSummoned", "_tonicDjinn", "_treasuryEliteMeatCollected", "_treasuryHaremMeatCollected", "_trivialAvocationsGame", "_tryptophanDartUsed", "_turtlePowerCast", "_twelveNightEnergyUsed", "_ultraMegaSourBallUsed", "_unblemishedPearlAnemoneMine", "_unblemishedPearlDiveBar", "_unblemishedPearlMadnessReef", "_unblemishedPearlMarinaraTrench", "_unblemishedPearlTheBriniestDeepests", "_victorSpoilsUsed", "_villainLairCanLidUsed", "_villainLairColorChoiceUsed", "_villainLairDoorChoiceUsed", "_villainLairFirecrackerUsed", "_villainLairSymbologyChoiceUsed", "_villainLairWebUsed", "_vmaskBanisherUsed", "_voraciTeaUsed", "_volcanoItemRedeemed", "_volcanoSuperduperheatedMetal", "_voodooSnuffUsed", "_voteToday", "_VYKEACafeteriaRaided", "_VYKEALoungeRaided", "_walfordQuestStartedToday", "_warbearBankUsed", "_warbearBreakfastMachineUsed", "_warbearGyrocopterUsed", "_warbearSodaMachineUsed", "_wildfireBarrelHarvested", "_witchessBuff", "_workshedItemUsed", "_yamBatteryUsed", "_zombieClover", "_preventScurvy", "lockedItem4637", "lockedItem4638", "lockedItem4639", "lockedItem4646", "lockedItem4647", "unknownRecipe3542", "unknownRecipe3543", "unknownRecipe3544", "unknownRecipe3545", "unknownRecipe3546", "unknownRecipe3547", "unknownRecipe3548", "unknownRecipe3749", "unknownRecipe3751", "unknownRecipe4172", "unknownRecipe4173", "unknownRecipe4174", "unknownRecipe5060", "unknownRecipe5061", "unknownRecipe5062", "unknownRecipe5063", "unknownRecipe5064", "unknownRecipe5066", "unknownRecipe5067", "unknownRecipe5069", "unknownRecipe5070", "unknownRecipe5072", "unknownRecipe5073", "unknownRecipe5670", "unknownRecipe5671", "unknownRecipe6501", "unknownRecipe6564", "unknownRecipe6565", "unknownRecipe6566", "unknownRecipe6567", "unknownRecipe6568", "unknownRecipe6569", "unknownRecipe6570", "unknownRecipe6571", "unknownRecipe6572", "unknownRecipe6573", "unknownRecipe6574", "unknownRecipe6575", "unknownRecipe6576", "unknownRecipe6577", "unknownRecipe6578", "unknownRecipe7752", "unknownRecipe7753", "unknownRecipe7754", "unknownRecipe7755", "unknownRecipe7756", "unknownRecipe7757", "unknownRecipe7758", "unknownRecipe10970", "unknownRecipe10971", "unknownRecipe10972", "unknownRecipe10973", "unknownRecipe10974", "unknownRecipe10975", "unknownRecipe10976", "unknownRecipe10977", "unknownRecipe10978", "unknownRecipe10988", "unknownRecipe10989", "unknownRecipe10990", "unknownRecipe10991", "unknownRecipe10992", "unknownRecipe11000"];
var numericProperties = ["coinMasterIndex", "dailyDeedsVersion", "defaultDropdown1", "defaultDropdown2", "defaultDropdownSplit", "defaultLimit", "fixedThreadPoolSize", "itemManagerIndex", "lastBuffRequestType", "lastGlobalCounterDay", "lastImageCacheClear", "pingDefaultTestPings", "pingLoginCount", "pingLoginGoal", "pingLoginThreshold", "pingTestPings", "previousUpdateRevision", "relayDelayForSVN", "relaySkillButtonCount", "scriptButtonPosition", "statusDropdown", "svnThreadPoolSize", "toolbarPosition", "_beachTides", "_g9Effect", "8BitBonusTurns", "8BitScore", "addingScrolls", "adventurerMeatsWorldPoints", "affirmationCookiesEaten", "aminoAcidsUsed", "antagonisticSnowmanKitCost", "ascensionsToday", "asolDeferredPoints", "asolPointsPigSkinner", "asolPointsCheeseWizard", "asolPointsJazzAgent", "autoAbortThreshold", "autoAntidote", "autoBuyPriceLimit", "autopsyTweezersUsed", "autumnatonQuestTurn", "availableCandyCredits", "availableDimes", "availableFunPoints", "availableMrStore2002Credits", "availableQuarters", "availableSeptEmbers", "availableStoreCredits", "availableSwagger", "avantGuardPoints", "averageSwagger", "awolMedicine", "awolPointsBeanslinger", "awolPointsCowpuncher", "awolPointsSnakeoiler", "awolDeferredPointsBeanslinger", "awolDeferredPointsCowpuncher", "awolDeferredPointsSnakeoiler", "awolVenom", "bagOTricksCharges", "ballpitBonus", "bankedKarma", "bartenderTurnsUsed", "basementMallPrices", "basementSafetyMargin", "batmanFundsAvailable", "batmanBonusInitialFunds", "batmanTimeLeft", "bearSwagger", "beeCounter", "beGregariousCharges", "beGregariousFightsLeft", "birdformCold", "birdformHot", "birdformRoc", "birdformSleaze", "birdformSpooky", "birdformStench", "blackBartsBootyCost", "blackPuddingsDefeated", "blackForestProgress", "blankOutUsed", "bloodweiserDrunk", "bodyguardCharge", "bondPoints", "bondVillainsDefeated", "boneAbacusVictories", "bookOfFactsGummi", "bookOfFactsPinata", "bookOfIronyCost", "booPeakProgress", "borisPoints", "breakableHandling", "breakableHandling1964", "breakableHandling9691", "breakableHandling9692", "breakableHandling9699", "breathitinCharges", "brodenBacteria", "brodenSprinkles", "buffBotMessageDisposal", "buffBotPhilanthropyType", "buffJimmyIngredients", "burnoutsDefeated", "burrowgrubSummonsRemaining", "bwApronMealsEaten", "camelSpit", "camerasUsed", "campAwayDecoration", "candyWitchTurnsUsed", "candyWitchCandyTotal", "carboLoading", "catBurglarBankHeists", "cellarLayout", "charitableDonations", "chasmBridgeProgress", "chefTurnsUsed", "chessboardsCleared", "chibiAlignment", "chibiBirthday", "chibiFitness", "chibiIntelligence", "chibiLastVisit", "chibiSocialization", "chilledToTheBone", "cinchoSaltAndLime", "cinderellaMinutesToMidnight", "cinderellaScore", "clubEmNextWeekMonsterTurn", "cocktailSummons", "commerceGhostCombats", "cookbookbatIngredientsCharge", "controlPanelOmega", "cornucopiasOpened", "cosmicBowlingBallReturnCombats", "cozyCounter6332", "cozyCounter6333", "cozyCounter6334", "craftingClay", "craftingLeather", "craftingPlansCharges", "craftingStraw", "crimbo16BeardChakraCleanliness", "crimbo16BootsChakraCleanliness", "crimbo16BungChakraCleanliness", "crimbo16CrimboHatChakraCleanliness", "crimbo16GutsChakraCleanliness", "crimbo16HatChakraCleanliness", "crimbo16JellyChakraCleanliness", "crimbo16LiverChakraCleanliness", "crimbo16NippleChakraCleanliness", "crimbo16NoseChakraCleanliness", "crimbo16ReindeerChakraCleanliness", "crimbo16SackChakraCleanliness", "crimboTrainingSkill", "crimboTreeDays", "cubelingProgress", "cupidBowFights", "currentExtremity", "currentHedgeMazeRoom", "currentMojoFilters", "currentNunneryMeat", "currentPortalEnergy", "currentReplicaStoreYear", "cursedMagnifyingGlassCount", "cyrptAlcoveEvilness", "cyrptCrannyEvilness", "cyrptNicheEvilness", "cyrptNookEvilness", "cyrptTotalEvilness", "darkGyfftePoints", "dartsThrown", "daycareEquipment", "daycareInstructorItemQuantity", "daycareInstructors", "daycareLastScavenge", "daycareToddlers", "dbNemesisSkill1", "dbNemesisSkill2", "dbNemesisSkill3", "desertExploration", "desktopHeight", "desktopWidth", "dinseyFilthLevel", "dinseyFunProgress", "dinseyNastyBearsDefeated", "dinseySocialJusticeIProgress", "dinseySocialJusticeIIProgress", "dinseyTouristsFed", "dinseyToxicMultiplier", "doctorBagQuestLights", "doctorBagUpgrades", "dreadScroll1", "dreadScroll2", "dreadScroll3", "dreadScroll4", "dreadScroll5", "dreadScroll6", "dreadScroll7", "dreadScroll8", "dripAdventuresSinceAscension", "drippingHallAdventuresSinceAscension", "drippingTreesAdventuresSinceAscension", "drippyBatsUnlocked", "drippyJuice", "drippyOrbsClaimed", "droneSelfDestructChipsUsed", "drunkenSwagger", "edDefeatAbort", "edPoints", "eldritchTentaclesFought", "electricKoolAidEaten", "elfGratitude", "encountersUntilDMTChoice", "encountersUntilYachtzeeChoice", "encountersUntilNEPChoice", "encountersUntilSRChoice", "ensorceleeLevel", "entauntaunedColdRes", "essenceOfAnnoyanceCost", "essenceOfBearCost", "extraRolloverAdventures", "falloutShelterLevel", "familiarSweat", "fingernailsClipped", "fistSkillsKnown", "flyeredML", "fossilB", "fossilD", "fossilN", "fossilP", "fossilS", "fossilW", "fratboysDefeated", "frenchGuardTurtlesFreed", "funGuyMansionKills", "garbageChampagneCharge", "garbageFireProgress", "garbageShirtCharge", "garbageTreeCharge", "garlandUpgrades", "getsYouDrunkTurnsLeft", "ghostPepperTurnsLeft", "gingerDigCount", "gingerLawChoice", "gingerMuscleChoice", "gingerTrainScheduleStudies", "gladiatorBallMovesKnown", "gladiatorBladeMovesKnown", "gladiatorNetMovesKnown", "glitchItemCost", "glitchItemImplementationCount", "glitchItemImplementationLevel", "glitchSwagger", "gloverPoints", "gnasirProgress", "goldenMrAccessories", "gongPath", "gooseDronesRemaining", "goreCollected", "gourdItemCount", "greyYouPoints", "grimoire1Summons", "grimoire2Summons", "grimoire3Summons", "grimstoneCharge", "guardTurtlesFreed", "guideToSafariCost", "guyMadeOfBeesCount", "guzzlrBronzeDeliveries", "guzzlrDeliveryProgress", "guzzlrGoldDeliveries", "guzzlrPlatinumDeliveries", "haciendaLayout", "hallowiener8BitRealm", "hallowienerCoinspiracy", "handfulOfTipsMeat", "hareMillisecondsSaved", "hareTurnsUsed", "heavyRainsStartingThunder", "heavyRainsStartingRain", "heavyRainsStartingLightning", "heroDonationBoris", "heroDonationJarlsberg", "heroDonationSneakyPete", "hiddenApartmentProgress", "hiddenBowlingAlleyProgress", "hiddenHospitalProgress", "hiddenOfficeProgress", "hiddenTavernUnlock", "highTopPumped", "hippiesDefeated", "holidayHalsBookCost", "holidaySwagger", "homemadeRobotUpgrades", "homebodylCharges", "hpAutoRecovery", "hpAutoRecoveryTarget", "iceSwagger", "ironicSwagger", "jarlsbergPoints", "juicyGarbageUsed", "jungCharge", "junglePuns", "knownAscensions", "kolhsTotalSchoolSpirited", "lassoTrainingCount", "lastAnticheeseDay", "lastArcadeAscension", "lastBadMoonReset", "lastBangPotionReset", "lastBattlefieldReset", "lastBeardBuff", "lastBreakfast", "lastCartographyBooPeak", "lastCartographyCastleTop", "lastCartographyDarkNeck", "lastCartographyDefiledNook", "lastCartographyFratHouse", "lastCartographyFratHouseVerge", "lastCartographyGuanoJunction", "lastCartographyHauntedBilliards", "lastCartographyHippyCampVerge", "lastCartographyZeppelinProtesters", "lastCastleGroundUnlock", "lastCastleTopUnlock", "lastCellarReset", "lastChanceThreshold", "lastChasmReset", "lastColosseumRoundWon", "lastCouncilVisit", "lastCounterDay", "lastDesertUnlock", "lastDispensaryOpen", "lastDMTDuplication", "lastDwarfFactoryReset", "lastEVHelmetValue", "lastEVHelmetReset", "lastEmptiedStorage", "lastFilthClearance", "lastGoofballBuy", "lastGuildStoreOpen", "lastGuyMadeOfBeesReset", "lastFratboyCall", "lastFriarCeremonyAscension", "lastFriarsElbowNC", "lastFriarsHeartNC", "lastFriarsNeckNC", "lastHippyCall", "lastIslandUnlock", "lastKeyotronUse", "lastKingLiberation", "lastLightsOutTurn", "lastMushroomPlot", "lastMiningReset", "lastNemesisReset", "lastPaperStripReset", "lastPirateEphemeraReset", "lastPirateInsultReset", "lastPlusSignUnlock", "lastQuartetAscension", "lastQuartetRequest", "lastSecondFloorUnlock", "lastShadowForgeUnlockAdventure", "lastKOLHSArtClassUnlockAdventure", "lastKOLHSChemClassUnlockAdventure", "lastKOLHSShopClassUnlockAdventure", "lastSkateParkReset", "lastStillBeatingSpleen", "lastTavernAscension", "lastTavernSquare", "lastTelescopeReset", "lastTempleAdventures", "lastTempleButtonsUnlock", "lastTempleUnlock", "lastThingWithNoNameDefeated", "lastTowelAscension", "lastTr4pz0rQuest", "lastTrainsetConfiguration", "lastVioletFogMap", "lastVoteMonsterTurn", "lastWartDinseyDefeated", "lastWuTangDefeated", "lastYearbookCameraAscension", "lastZapperWand", "lastZapperWandExplosionDay", "lawOfAveragesCost", "legacyPoints", "legendaryNoodlesAmygdala", "legendaryNoodlesSkin", "legendaryNoodlesStomach", "leprecondoLastNeedChange", "libramSummons", "lightsOutAutomation", "louvreDesiredGoal", "louvreGoal", "lovebugsAridDesert", "lovebugsBeachBuck", "lovebugsBooze", "lovebugsChroner", "lovebugsCoinspiracy", "lovebugsCyrpt", "lovebugsFreddy", "lovebugsFunFunds", "lovebugsHoboNickel", "lovebugsItemDrop", "lovebugsMeat", "lovebugsMeatDrop", "lovebugsMoxie", "lovebugsMuscle", "lovebugsMysticality", "lovebugsOilPeak", "lovebugsOrcChasm", "lovebugsPowder", "lovebugsWalmart", "lttQuestDifficulty", "lttQuestStageCount", "manaBurnSummonThreshold", "manaBurningThreshold", "manaBurningTrigger", "manorDrawerCount", "manualOfNumberologyCost", "mapToKokomoCost", "markYourTerritoryCharges", "masksUnlocked", "maximizerMRUSize", "maximizerCombinationLimit", "maximizerEquipmentLevel", "maximizerEquipmentScope", "maximizerMaxPrice", "maximizerPriceLevel", "maxManaBurn", "mayflyExperience", "mayoLevel", "meansuckerPrice", "mechanicalSongbirdProgress", "merkinVocabularyMastery", "miniAdvClass", "miniKiwiAiolisUsed", "miniMartinisDrunk", "mixedBerryJellyUses", "moleTunnelLevel", "momSeaMonkeeProgress", "mothershipProgress", "mpAutoRecovery", "mpAutoRecoveryTarget", "munchiesPillsUsed", "mushroomGardenCropLevel", "nanopolymerSpiderWebsUsed", "nextAprilBandTurn", "nextParanormalActivity", "nextQuantumFamiliarOwnerId", "nextQuantumFamiliarTurn", "noobPoints", "noobDeferredPoints", "noodleSummons", "nsContestants1", "nsContestants2", "nsContestants3", "nuclearAutumnPoints", "numericSwagger", "nunsVisits", "oilPeakProgress", "optimalSwagger", "optimisticCandleProgress", "palindomeDudesDefeated", "parasolUsed", "peaceTurkeyIndex", "pendingMapReflections", "phosphorTracesUses", "pingpongSkill", "pirateRealmPlasticPiratesDefeated", "pirateRealmShipsDestroyed", "pirateRealmStormsEscaped", "pirateSwagger", "plantingDay", "plumberBadgeCost", "plumberCostumeCost", "plumberPoints", "pokefamPoints", "poolSharkCount", "poolSkill", "powerPillProgress", "preworkoutPowderUses", "primaryLabGooIntensity", "prismaticSummons", "procrastinatorLanguageFluency", "promptAboutCrafting", "puzzleChampBonus", "pyramidPosition", "quantumPoints", "reagentSummons", "reanimatorArms", "reanimatorLegs", "reanimatorSkulls", "reanimatorWeirdParts", "reanimatorWings", "recentLocations", "redSnapperProgress", "relayPort", "relocatePygmyJanitor", "relocatePygmyLawyer", "rockinRobinProgress", "romanCandelabraRedCasts", "romanCandelabraBlueCasts", "romanCandelabraYellowCasts", "romanCandelabraGreenCasts", "romanCandelabraPurpleCasts", "ROMOfOptimalityCost", "rumpelstiltskinKidsRescued", "rumpelstiltskinTurnsUsed", "rwbMonsterCount", "safariSwagger", "sausageGrinderUnits", "schoolOfHardKnocksDiplomaCost", "schoolSwagger", "scrapbookCharges", "screechCombats", "scriptMRULength", "seadentConstructKills", "seadentLevel", "seaodesFound", "seaPoints", "SeasoningSwagger", "sexChanges", "shenInitiationDay", "shockingLickCharges", "shrunkenHeadZombieHP", "singleFamiliarRun", "skillBurn3", "skillBurn90", "skillBurn153", "skillBurn154", "skillBurn155", "skillBurn236", "skillBurn237", "skillBurn1019", "skillBurn5017", "skillBurn6014", "skillBurn6015", "skillBurn6016", "skillBurn6020", "skillBurn6021", "skillBurn6022", "skillBurn6023", "skillBurn6024", "skillBurn6026", "skillBurn6028", "skillBurn7323", "skillBurn14008", "skillBurn14028", "skillBurn14038", "skillBurn15011", "skillBurn15028", "skillBurn17005", "skillBurn22034", "skillBurn22035", "skillBurn23301", "skillBurn23302", "skillBurn23303", "skillBurn23304", "skillBurn23305", "skillBurn23306", "skillLevel46", "skillLevel47", "skillLevel48", "skillLevel117", "skillLevel118", "skillLevel121", "skillLevel128", "skillLevel134", "skillLevel135", "skillLevel144", "skillLevel180", "skillLevel188", "skillLevel227", "skillLevel245", "skillLevel7254", "slimelingFullness", "slimelingStacksDropped", "slimelingStacksDue", "smoresEaten", "smutOrcNoncombatProgress", "sneakyPetePoints", "snojoMoxieWins", "snojoMuscleWins", "snojoMysticalityWins", "sourceAgentsDefeated", "sourceEnlightenment", "sourceInterval", "sourcePoints", "sourceTerminalGram", "sourceTerminalPram", "sourceTerminalSpam", "spaceBabyLanguageFluency", "spacePirateLanguageFluency", "spelunkyNextNoncombat", "spelunkySacrifices", "spelunkyWinCount", "spookyPuttyCopiesMade", "spookyVHSTapeMonsterTurn", "statbotUses", "stockCertificateTurn", "sugarCounter4178", "sugarCounter4179", "sugarCounter4180", "sugarCounter4181", "sugarCounter4182", "sugarCounter4183", "sugarCounter4191", "summonAnnoyanceCost", "sweat", "tacoDanCocktailSauce", "tacoDanFishMeat", "takerSpaceAnchor", "takerSpaceGold", "takerSpaceMast", "takerSpaceRum", "takerSpaceSilk", "takerSpaceSpice", "tavernLayout", "telescopeUpgrades", "tempuraSummons", "timeposedTopHats", "timeSpinnerMedals", "timesRested", "tomeSummons", "totalCharitableDonations", "trainsetPosition", "tryToRememberCharges", "turtleBlessingTurns", "twinPeakProgress", "twoCRSPoints", "unicornHornInflation", "universalSeasoningCost", "usable1HWeapons", "usable1xAccs", "usable2HWeapons", "usable3HWeapons", "usableAccessories", "usableHats", "usableOffhands", "usableOther", "usablePants", "usableShirts", "valueOfAdventure", "valueOfInventory", "valueOfStill", "valueOfTome", "vintnerCharge", "vintnerWineLevel", "violetFogGoal", "walfordBucketProgress", "warehouseProgress", "welcomeBackAdv", "wereProfessorBite", "wereProfessorKick", "wereProfessorLiver", "wereProfessorPoints", "wereProfessorRend", "wereProfessorResearchPoints", "wereProfessorStomach", "wereProfessorTransformTurns", "whetstonesUsed", "wolfPigsEvicted", "wolfTurnsUsed", "writingDesksDefeated", "xoSkeleltonXProgress", "xoSkeleltonOProgress", "yearbookCameraAscensions", "yearbookCameraUpgrades", "youRobotBody", "youRobotBottom", "youRobotLeft", "youRobotPoints", "youRobotRight", "youRobotTop", "zeppelinProgress", "zeppelinProtestors", "zigguratLianas", "zombiePoints", "zootSpecimensPrepared", "zootomistPoints", "_absintheDrops", "_abstractionDropsCrown", "_aguaDrops", "_xenomorphCharge", "_alliedRadioDropsUsed", "_ancestralRecallCasts", "_antihangoverBonus", "_aprilShowerDiscoNap", "_aprilBandInstruments", "_aprilBandSaxophoneUses", "_aprilBandTomUses", "_aprilBandTubaUses", "_aprilBandStaffUses", "_aprilBandPiccoloUses", "_archSpadeDigs", "_astralDrops", "_augSkillsCast", "_assertYourAuthorityCast", "_automatedFutureManufactures", "_autumnatonQuests", "_backUpUses", "_badlyRomanticArrows", "_badgerCharge", "_balefulHowlUses", "_banderRunaways", "_baseballInnings", "_bastilleCheese", "_bastilleGames", "_bastilleGameTurn", "_bastilleLastCheese", "_batWingsCauldronUsed", "_batWingsFreeFights", "_batWingsRestUsed", "_batWingsSwoopUsed", "_bczBloodGeyserCasts", "_bczRefractedGazeCasts", "_bczSweatBulletsCasts", "_bczBloodBathCasts", "_bczDialitupCasts", "_bczSweatEquityCasts", "_bczBloodThinnerCasts", "_bczSpinalTapasCasts", "_bczPheromoneCocktailCasts", "_beanCannonUses", "_bearHugs", "_beerLensDrops", "_bellydancerPickpockets", "_benettonsCasts", "_beretBlastUses", "_beretBoastUses", "_beretBuskingUses", "_birdsSoughtToday", "_bookOfFactsWishes", "_bookOfFactsTatters", "_boomBoxFights", "_boomBoxSongsLeft", "_bootStomps", "_boxingGloveArrows", "_brickoEyeSummons", "_brickoFights", "_campAwayCloudBuffs", "_campAwaySmileBuffs", "_candyEggsDeviled", "_candySummons", "_captainHagnkUsed", "_carnieCandyDrops", "_carnivorousPottedPlantWins", "_carrotNoseDrops", "_catBurglarCharge", "_catBurglarHeistsComplete", "_cheerleaderSteam", "_chestXRayUsed", "_chibiAdventures", "_chipBags", "_chocolateCigarsUsed", "_chocolateCoveredPingPongBallsUsed", "_chocolateSculpturesUsed", "_chocolatesUsed", "_chronolithActivations", "_chronolithNextCost", "_cinchUsed", "_cinchoRests", "_circadianRhythmsAdventures", "_clanFortuneConsultUses", "_clipartSummons", "_clocksUsed", "_cloversPurchased", "_clubEmBattlefieldUsed", "_clubEmNextWeekUsed", "_clubEmTimeUsed", "_coldMedicineConsults", "_coldMedicineEquipmentTaken", "_companionshipCasts", "_concoctionDatabaseRefreshes", "_cookbookbatCrafting", "_cookbookbatCombatsUntilNewQuest", "_cosmicBowlingSkillsUsed", "_crimbo21ColdResistance", "_crimboPastDailySpecialPrice", "_cyberFreeFights", "_cyberZone1Turns", "_cyberZone2Turns", "_cyberZone3Turns", "_dailySpecialPrice", "_dartsLeft", "_daycareGymScavenges", "_daycareRecruits", "_deckCardsDrawn", "_deluxeKlawSummons", "_demandSandwich", "_detectiveCasesCompleted", "_disavowed", "_dnaPotionsMade", "_donhosCasts", "_douseFoeUses", "_dreamJarDrops", "_drunkPygmyBanishes", "_durableDolphinWhistleUsed", "_edDefeats", "_edLashCount", "_eldritchTentaclesFoughtToday", "_elfGuardCookingUsed", "_elronsCasts", "_enamorangs", "_energyCollected", "_expertCornerCutterUsed", "_extraTimeUsed", "_favorRareSummons", "_feastUsed", "_feelinTheRhythm", "_feelPrideUsed", "_feelExcitementUsed", "_feelHatredUsed", "_feelLonelyUsed", "_feelNervousUsed", "_feelEnvyUsed", "_feelDisappointedUsed", "_feelSuperiorUsed", "_feelLostUsed", "_feelNostalgicUsed", "_feelPeacefulUsed", "_fingertrapArrows", "_fireExtinguisherCharge", "_fitnessTrackingSteps", "_fragrantHerbsUsed", "_freeBeachWalksUsed", "_frButtonsPressed", "_fudgeWaspFights", "_gapBuffs", "_garbageFireDrops", "_garbageFireDropsCrown", "_generateIronyUsed", "_genieFightsUsed", "_genieWishesUsed", "_gibbererAdv", "_gibbererCharge", "_gingerbreadCityTurns", "_glarkCableUses", "_glitchMonsterFights", "_gnomeAdv", "_godLobsterFights", "_goldenMoneyCharge", "_gongDrops", "_gothKidCharge", "_gothKidFights", "_greyYouAdventures", "_grimBrotherCharge", "_grimFairyTaleDrops", "_grimFairyTaleDropsCrown", "_grimoireConfiscatorSummons", "_grimoireGeekySummons", "_grimstoneMaskDrops", "_grimstoneMaskDropsCrown", "_grooseCharge", "_grooseDrops", "_grubbyWoolDrops", "_guzzlrDeliveries", "_guzzlrGoldDeliveries", "_guzzlrPlatinumDeliveries", "_hareAdv", "_hareCharge", "_heartstoneBanishUsed", "_heartstoneBuffUsed", "_heartstoneKillUsed", "_heartstonePalsUsed", "_heartstoneStunUsed", "_highTopPumps", "_hipsterAdv", "_hoardedCandyDropsCrown", "_hoboUnderlingSummons", "_holidayMultitaskingUsed", "_holoWristDrops", "_holoWristProgress", "_hoboFortRestEffectsGained", "_hotAshesDrops", "_hotJellyUses", "_hotTubSoaks", "_humanMuskUses", "_iceballUses", "_inigosCasts", "_ironTricornHeadbuttUsed", "_jerksHealthMagazinesUsed", "_jiggleCheese", "_jiggleCream", "_jiggleLife", "_jiggleSteak", "_jitbCharge", "_juneCleaverAdvs", "_juneCleaverFightsLeft", "_juneCleaverEncounters", "_juneCleaverStench", "_juneCleaverSpooky", "_juneCleaverSleaze", "_juneCleaverHot", "_juneCleaverCold", "_juneCleaverSkips", "_jungDrops", "_kgbClicksUsed", "_kgbDispenserUses", "_kgbTranquilizerDartUses", "_klawSummons", "_kloopCharge", "_kloopDrops", "_knuckleboneDrops", "_knuckleboneRests", "_kolhsAdventures", "_kolhsSavedByTheBell", "_lastDailyDungeonRoom", "_lastFitzsimmonsHatch", "_lastMobiusStripTurn", "_lastSausageMonsterTurn", "_lastZomboEye", "_latteRefillsUsed", "_lawOfAveragesUsed", "_leafblowerML", "_leafLassosCrafted", "_leafMonstersFought", "_leavesBurned", "_legendaryLasagmbieMana", "_legendaryVermincelliFreeRats", "_legionJackhammerCrafting", "_leprecondoRearrangements", "_leprecondoFurniture", "_llamaCharge", "_longConUsed", "_lovebugsBeachBuck", "_lovebugsChroner", "_lovebugsCoinspiracy", "_lovebugsFreddy", "_lovebugsFunFunds", "_lovebugsHoboNickel", "_lovebugsWalmart", "_loveChocolatesUsed", "_lynyrdSnareUses", "_machineTunnelsAdv", "_macrometeoriteUses", "_mafiaThumbRingAdvs", "_mapToACandyRichBlockDrops", "_mayamRests", "_mayflowerDrops", "_mayflySummons", "_mcHugeLargeAvalancheUses", "_mcHugeLargeSkiPlowUses", "_mcHugeLargeSlashUses", "_meatCuteUsed", "_meatLoafUsed", "_mediumSiphons", "_meteoriteAdesUsed", "_meteorShowerUses", "_micrometeoriteUses", "_mildEvilPerpetrated", "_mimicEggsDonated", "_mimicEggsObtained", "_miniKiwiDrops", "_miniMartiniDrops", "_mobiusRingPrimedTurn", "_mobiusStripEncounters", "_monkeyPawWishesUsed", "_monsterHabitatsFightsLeft", "_monsterHabitatsRecalled", "_monstersMapped", "_mushroomGardenFights", "_nanorhinoCharge", "_navelRunaways", "_neverendingPartyFreeTurns", "_newYouQuestSharpensDone", "_newYouQuestSharpensToDo", "_nextColdMedicineConsult", "_nextQuantumAlignment", "_nightmareFuelCharges", "_noobSkillCount", "_nuclearStockpileUsed", "_oilExtracted", "_oldSchoolCocktailCraftingUsed", "_olfactionsUsed", "_optimisticCandleDropsCrown", "_oreDropsCrown", "_otoscopeUsed", "_oysterEggsFound", "_pantsgivingBanish", "_pantsgivingCount", "_pantsgivingCrumbs", "_pantsgivingFullness", "_pasteDrops", "_perilsForeseen", "_peteJukeboxFixed", "_peteJumpedShark", "_petePeeledOut", "_photoBoothEffects", "_photoBoothEquipment", "_pieDrops", "_piePartsCount", "_pirateRealmGold", "_pirateRealmGlue", "_pirateRealmGrog", "_pirateRealmGrub", "_pirateRealmGuns", "_pirateRealmIslandMonstersDefeated", "_pirateRealmSailingTurns", "_pirateRealmShipSpeed", "_pixieCharge", "_pocketProfessorLectures", "_poisonArrows", "_pokeGrowFertilizerDrops", "_poolGames", "_powderedGoldDrops", "_powderedMadnessUses", "_powerfulGloveBatteryPowerUsed", "_powerPillDrops", "_powerPillUses", "_precisionCasts", "_pyramidRestEffectsGained", "_questPartyFairItemsOpened", "_radlibSummons", "_raindohCopiesMade", "_rapidPrototypingUsed", "_raveStealCount", "_reflexHammerUsed", "_resolutionAdv", "_resolutionRareSummons", "_riftletAdv", "_robinEggDrops", "_roboDrops", "_rogueProgramCharge", "_romanticFightsLeft", "_saberForceMonsterCount", "_saberForceUses", "_saberMod", "_saltGrainsConsumed", "_sandwormCharge", "_saplingsPlanted", "_sausageFights", "_sausagesEaten", "_sausagesMade", "_seadentLightningUsed", "_sealFigurineUses", "_sealScreeches", "_sealsSummoned", "_shadowBricksUsed", "_shadowRiftCombats", "_shatteringPunchUsed", "_shortOrderCookCharge", "_shrubCharge", "_slimeVialsHarvested", "_sloppyDinerBeachBucks", "_smilesOfMrA", "_smithsnessSummons", "_smolderingSkeletonsDefeated", "_smoochArmyHQCombats", "_snojoFreeFights", "_snojoParts", "_snokebombUsed", "_snowconeSummons", "_snowglobeDrops", "_snowmanHatPlaceUsed", "_snowSuitCount", "_sourceTerminalDigitizeMonsterCount", "_sourceTerminalDigitizeUses", "_sourceTerminalDuplicateUses", "_sourceTerminalEnhanceUses", "_sourceTerminalExtrudes", "_sourceTerminalPortscanUses", "_spaceFurDropsCrown", "_spacegatePlanetIndex", "_spacegateTurnsLeft", "_spaceJellyfishDrops", "_speakeasyDrinksDrunk", "_speakeasyFreeFights", "_spelunkerCharges", "_spelunkingTalesDrops", "_spikolodonSpikeUses", "_spiritOfTheMountainsAdvs", "_spookyJellyUses", "_stackLumpsUses", "_steamCardDrops", "_stickerSummons", "_stinkyCheeseCount", "_stressBallSqueezes", "_sugarSummons", "_summonResortPassesUsed", "_surprisinglySweetSlashUsed", "_surprisinglySweetStabUsed", "_sweatOutSomeBoozeUsed", "_swordOfSWordsKills", "_swordOfSWordsMonsterChanged", "_taffyRareSummons", "_taffyYellowSummons", "_tearawayPantsAdvs", "_thanksgettingFoodsEaten", "_thingfinderCasts", "_thinknerdPackageDrops", "_thorsPliersCrafting", "_timeHelmetAdv", "_timeCopsFoughtToday", "_timeSpinnerMinutesUsed", "_tokenDrops", "_transponderDrops", "_turkeyBlastersUsed", "_turkeyBooze", "_turkeyMuscle", "_turkeyMyst", "_turkeyMoxie", "_unaccompaniedMinerUsed", "_unblemishedPearlAnemoneMineProgress", "_unblemishedPearlDiveBarProgress", "_unblemishedPearlMadnessReefProgress", "_unblemishedPearlMarinaraTrenchProgress", "_unblemishedPearlTheBriniestDeepestsProgress", "_unconsciousCollectiveCharge", "_universalSeasoningsUsed", "_universeCalculated", "_universeImploded", "_usedReplicaBatoomerang", "_vampyreCloakeFormUses", "_villainLairProgress", "_vitachocCapsulesUsed", "_vmaskAdv", "_voidFreeFights", "_volcanoItem1", "_volcanoItem2", "_volcanoItem3", "_volcanoItemCount1", "_volcanoItemCount2", "_volcanoItemCount3", "_voteFreeFights", "_VYKEACompanionLevel", "_wandOfPigificationUsed", "_warbearAutoAnvilCrafting", "_waxGlobDrops", "_whiteRiceDrops", "_witchessFights", "_xoHugsUsed", "_yellowPixelDropsCrown", "_zapCount", "_zombieSmashPocketsUsed", "lastNoncombat15", "lastNoncombat257", "lastNoncombat270", "lastNoncombat273", "lastNoncombat280", "lastNoncombat283", "lastNoncombat297", "lastNoncombat322", "lastNoncombat323", "lastNoncombat324", "lastNoncombat341", "lastNoncombat343", "lastNoncombat384", "lastNoncombat386", "lastNoncombat391", "lastNoncombat392", "lastNoncombat394", "lastNoncombat405", "lastNoncombat406", "lastNoncombat408", "lastNoncombat439", "lastNoncombat440", "lastNoncombat441", "lastNoncombat450", "lastNoncombat528", "lastNoncombat533", "lastNoncombat539", "lastNoncombat540", "lastNoncombat541", "lastNoncombat588", "lastNoncombat589", "lastNoncombat590", "lastNoncombat591", "lastNoncombat592"];
var monsterProperties = ["beGregariousMonster", "bodyguardChatMonster", "cameraMonster", "chateauMonster", "clubEmNextWeekMonster", "clumsinessGroveBoss", "crappyCameraMonster", "crudeMonster", "enamorangMonster", "envyfishMonster", "glacierOfJerksBoss", "holdHandsMonster", "iceSculptureMonster", "lastCopyableMonster", "longConMonster", "maelstromOfLoversBoss", "makeFriendsMonster", "merkinLockkeyMonster", "monkeyPointMonster", "motifMonster", "nosyNoseMonster", "olfactedMonster", "photocopyMonster", "rainDohMonster", "romanticTarget", "rufusDesiredEntity", "rwbMonster", "screencappedMonster", "shrunkenHeadZombieMonster", "spookyPuttyMonster", "spookyVHSTapeMonster", "stenchCursedMonster", "superficiallyInterestedMonster", "swordOfSWordsMonster", "waxMonster", "yearbookCameraTarget", "_afterimageMonster", "_beanballMonster", "_chainedRelativityMonster", "_chainedPurpleCandleMonster", "_chainedAfterimageMonster", "_cookbookbatQuestMonster", "_curveballMonster", "_gallapagosMonster", "_jiggleCreamedMonster", "_latteMonster", "_monsterHabitatsMonster", "_nanorhinoBanishedMonster", "_newYouQuestMonster", "_prankCardMonster", "_relativityMonster", "_saberForceMonster", "_screwballMonster", "_skullballMonster", "_sourceTerminalDigitizeMonster", "_trickCoinMonster", "_voteMonster"];
var monsterNumericProperties = ["swordOfSWordsMonster"];
var locationProperties = ["autumnatonQuestLocation", "currentJunkyardLocation", "doctorBagQuestLocation", "ghostLocation", "guzzlrQuestLocation", "holdHandsLocation", "lastAdventure", "nextAdventure", "nextSpookyravenElizabethRoom", "nextSpookyravenStephenRoom", "rwbLocation", "sourceOracleTarget", "_cookbookbatQuestLastLocation", "_floundryBassLocation", "_floundryCarpLocation", "_floundryCodLocation", "_floundryHatchetfishLocation", "_floundryTroutLocation", "_floundryTunaLocation", "_lastPirateRealmIsland", "_sotParcelLocation"];
var stringProperties = ["autoLogin", "browserBookmarks", "chatFontSize", "combatHotkey0", "combatHotkey1", "combatHotkey2", "combatHotkey3", "combatHotkey4", "combatHotkey5", "combatHotkey6", "combatHotkey7", "combatHotkey8", "combatHotkey9", "commandBufferGCLI", "commandBufferTabbedChat", "commandLineNamespace", "dailyDeedsOptions", "defaultBorderColor", "displayName", "externalEditor", "getBreakfast", "headerStates", "highlightList", "http.proxyHost", "http.proxyPassword", "http.proxyPort", "http.proxyUser", "https.proxyHost", "https.proxyPassword", "https.proxyPort", "https.proxyUser", "initialDesktop", "initialFrames", "lastRelayUpdate", "lastUserAgent", "lastUsername", "logPreferenceChangeFilter", "loginScript", "loginServerName", "loginWindowLogo", "logoutScript", "pingDefaultTestPage", "pingLatest", "pingLoginAbort", "pingLoginCheck", "pingLoginFail", "pingLongest", "pingShortest", "pingTestPage", "previousNotifyList", "previousUpdateVersion", "saveState", "saveStateActive", "scriptList", "swingLookAndFeel", "userAgent", "8BitColor", "afterAdventureScript", "antiScientificMethod", "autoOlfact", "autoPutty", "autumnatonUpgrades", "backupCameraMode", "banishedMonsters", "banishedPhyla", "banishingShoutMonsters", "baseballTeam", "batmanStats", "batmanZone", "batmanUpgrades", "battleAction", "beachHeadsUnlocked", "beastSkillsAvailable", "beastSkillsKnown", "beforePVPScript", "betweenBattleScript", "boomBoxSong", "breakfastAlways", "breakfastHardcore", "breakfastSoftcore", "buffBotCasting", "buyScript", "cargoPocketsEmptied", "cargoPocketScraps", "chatbotScript", "chatPlayerScript", "chibiName", "choiceAdventureScript", "chosenTrip", "clanFortuneReply1", "clanFortuneReply2", "clanFortuneReply3", "clanFortuneWord1", "clanFortuneWord2", "clanFortuneWord3", "coolerYetiMode", "counterScript", "copperheadClubHazard", "crimbo23ArmoryControl", "crimbo23BarControl", "crimbo23CafeControl", "crimbo23CottageControl", "crimbo23FoundryControl", "crimbotChassis", "crimbotArm", "crimbotPropulsion", "crystalBallPredictions", "csServicesPerformed", "currentAstralTrip", "currentDistillateMods", "currentEasyBountyItem", "currentHardBountyItem", "currentHippyStore", "currentJunkyardTool", "currentLlamaForm", "currentMood", "currentPVPSeason", "currentPvpVictories", "currentSpecialBountyItem", "currentSITSkill", "customCombatScript", "cyrusAdjectives", "defaultFlowerLossMessage", "defaultFlowerWinMessage", "demonName1", "demonName2", "demonName3", "demonName4", "demonName5", "demonName6", "demonName7", "demonName8", "demonName9", "demonName10", "demonName11", "demonName12", "demonName13", "demonName14", "demonName14Segments", "dinseyGatorStenchDamage", "dinseyRollercoasterStats", "dreadScrollGuesses", "duckAreasCleared", "duckAreasSelected", "edPiece", "enamorangMonsterTurn", "ensorcelee", "EVEDirections", "everfullDartPerks", "extraCosmeticModifiers", "familiarScript", "flagellateFlagonsActive", "forbiddenStores", "gameProBossSpecialPower", "gooseReprocessed", "grimoireSkillsHardcore", "grimoireSkillsSoftcore", "grimstoneMaskPath", "guzzlrQuestClient", "guzzlrQuestTier", "harvestGardenHardcore", "harvestGardenSoftcore", "heartstoneAttunementMods", "heartstoneAttunementWord", "heartstoneLetters", "holdHandsMonsterCount", "hpAutoRecoveryItems", "invalidBuffMessage", "jickSwordModifier", "juneCleaverQueue", "kingLiberatedScript", "lassoTraining", "lastAdventureContainer", "lastAdventureTrail", "lastBangPotion819", "lastBangPotion820", "lastBangPotion821", "lastBangPotion822", "lastBangPotion823", "lastBangPotion824", "lastBangPotion825", "lastBangPotion826", "lastBangPotion827", "lastChanceBurn", "lastChessboard", "lastCombatEnvironments", "lastDwarfDiceRolls", "lastDwarfDigitRunes", "lastDwarfEquipmentRunes", "lastDwarfFactoryItem118", "lastDwarfFactoryItem119", "lastDwarfFactoryItem120", "lastDwarfFactoryItem360", "lastDwarfFactoryItem361", "lastDwarfFactoryItem362", "lastDwarfFactoryItem363", "lastDwarfFactoryItem364", "lastDwarfFactoryItem365", "lastDwarfFactoryItem910", "lastDwarfFactoryItem3199", "lastDwarfOfficeItem3208", "lastDwarfOfficeItem3209", "lastDwarfOfficeItem3210", "lastDwarfOfficeItem3211", "lastDwarfOfficeItem3212", "lastDwarfOfficeItem3213", "lastDwarfOfficeItem3214", "lastDwarfOreRunes", "lastDwarfHopper1", "lastDwarfHopper2", "lastDwarfHopper3", "lastDwarfHopper4", "lastEncounter", "lastMacroError", "lastMessageId", "lastPaperStrip3144", "lastPaperStrip4138", "lastPaperStrip4139", "lastPaperStrip4140", "lastPaperStrip4141", "lastPaperStrip4142", "lastPaperStrip4143", "lastPaperStrip4144", "lastPirateEphemera", "lastPorkoBoard", "lastPorkoPayouts", "lastPorkoExpected", "lastSlimeVial3885", "lastSlimeVial3886", "lastSlimeVial3887", "lastSlimeVial3888", "lastSlimeVial3889", "lastSlimeVial3890", "lastSlimeVial3891", "lastSlimeVial3892", "lastSlimeVial3893", "lastSlimeVial3894", "lastSlimeVial3895", "lastSlimeVial3896", "lastSelectedFaxbot", "lastSuccessfulFaxbot", "latteIngredients", "latteModifier", "latteUnlocks", "ledCandleMode", "leprecondoCurrentNeed", "leprecondoDiscovered", "leprecondoInstalled", "leprecondoNeedOrder", "libramSkillsHardcore", "libramSkillsSoftcore", "louvreOverride", "lovePotion", "lttQuestName", "maximizerList", "maximizerMRUList", "maximizerLastFilters", "mayoInMouth", "mayoMinderSetting", "merkinCatalogChoices", "merkinQuestPath", "mimicEggMonsters", "mineLayout1", "mineLayout2", "mineLayout3", "mineLayout4", "mineLayout5", "mineLayout6", "mineState1", "mineState2", "mineState3", "mineState4", "mineState5", "mineState6", "mpAutoRecoveryItems", "nextDistillateMods", "nextQuantumFamiliarName", "nextQuantumFamiliarOwner", "noncombatForcers", "nsChallenge2", "nsChallenge3", "nsChallenge4", "nsChallenge5", "nsTowerDoorKeysUsed", "oceanAction", "oceanDestination", "parkaMode", "pastaThrall1", "pastaThrall2", "pastaThrall3", "pastaThrall4", "pastaThrall5", "pastaThrall6", "pastaThrall7", "pastaThrall8", "peteMotorbikeTires", "peteMotorbikeGasTank", "peteMotorbikeHeadlight", "peteMotorbikeCowling", "peteMotorbikeMuffler", "peteMotorbikeSeat", "pieStuffing", "plantingDate", "plantingLength", "plantingScript", "plumberCostumeWorn", "pokefamBoosts", "postAscensionScript", "preAscensionScript", "questClumsinessGrove", "questDoctorBag", "questECoBucket", "questESlAudit", "questESlBacteria", "questESlCheeseburger", "questESlCocktail", "questESlDebt", "questESlFish", "questESlMushStash", "questESlSalt", "questESlSprinkles", "questESpClipper", "questESpEVE", "questESpFakeMedium", "questESpGore", "questESpJunglePun", "questESpOutOfOrder", "questESpSerum", "questESpSmokes", "questEStFishTrash", "questEStGiveMeFuel", "questEStNastyBears", "questEStSocialJusticeI", "questEStSocialJusticeII", "questEStSuperLuber", "questEStWorkWithFood", "questEStZippityDooDah", "questEUNewYou", "questF01Primordial", "questF02Hyboria", "questF03Future", "questF04Elves", "questF05Clancy", "questG01Meatcar", "questG02Whitecastle", "questG03Ego", "questG04Nemesis", "questG05Dark", "questG06Delivery", "questG07Myst", "questG08Moxie", "questG09Muscle", "questGlacierOfJerks", "questGuzzlr", "questI01Scapegoat", "questI02Beat", "questL02Larva", "questL03Rat", "questL04Bat", "questL05Goblin", "questL06Friar", "questL07Cyrptic", "questL08Trapper", "questL09Topping", "questL10Garbage", "questL11Black", "questL11Business", "questL11Curses", "questL11Desert", "questL11Doctor", "questL11MacGuffin", "questL11Manor", "questL11Palindome", "questL11Pyramid", "questL11Ron", "questL11Shen", "questL11Spare", "questL11Worship", "questL12HippyFrat", "questL12War", "questL13Final", "questL13Warehouse", "questLTTQuestByWire", "questM01Untinker", "questM02Artist", "questM03Bugbear", "questM05Toot", "questM06Gourd", "questM07Hammer", "questM08Baker", "questM09Rocks", "questM10Azazel", "questM11Postal", "questM12Pirate", "questM13Escape", "questM14Bounty", "questM15Lol", "questM16Temple", "questM17Babies", "questM18Swamp", "questM19Hippy", "questM20Necklace", "questM21Dance", "questM22Shirt", "questM23Meatsmith", "questM24Doc", "questM25Armorer", "questM26Oracle", "questMaelstromOfLovers", "questPAGhost", "questRufus", "questS01OldGuy", "questS02Monkees", "raveCombo1", "raveCombo2", "raveCombo3", "raveCombo4", "raveCombo5", "raveCombo6", "recoveryScript", "relayChatCLITrigger", "relayCounters", "retroCapeSuperhero", "retroCapeWashingInstructions", "royalty", "rufusQuestTarget", "rufusQuestType", "scriptMRUList", "seahorseName", "shadowLabyrinthGoal", "shadowRiftIngress", "shrubGarland", "shrubGifts", "shrubLights", "shrubTopper", "shrunkenHeadZombieAbilities", "sideDefeated", "sidequestArenaCompleted", "sidequestFarmCompleted", "sidequestJunkyardCompleted", "sidequestLighthouseCompleted", "sidequestNunsCompleted", "sidequestOrchardCompleted", "skateParkStatus", "snowsuit", "sourceTerminalChips", "sourceTerminalEducate1", "sourceTerminalEducate2", "sourceTerminalEnquiry", "sourceTerminalEducateKnown", "sourceTerminalEnhanceKnown", "sourceTerminalEnquiryKnown", "sourceTerminalExtrudeKnown", "spadingData", "spadingScript", "speakeasyName", "spelunkyStatus", "spelunkyUpgrades", "spookyravenRecipeUsed", "stationaryButton1", "stationaryButton2", "stationaryButton3", "stationaryButton4", "stationaryButton5", "stockCertificateTurns", "streamCrossDefaultTarget", "sweetSynthesisBlacklist", "telescope1", "telescope2", "telescope3", "telescope4", "telescope5", "testudinalTeachings", "textColors", "thanksMessage", "tomeSkillsHardcore", "tomeSkillsSoftcore", "trackVoteMonster", "trackedMonsters", "trackedPhyla", "trainsetConfiguration", "umbrellaState", "umdLastObtained", "vintnerWineEffect", "vintnerWineName", "vintnerWineType", "violetFogLayout", "volcanoMaze1", "volcanoMaze2", "volcanoMaze3", "volcanoMaze4", "volcanoMaze5", "warProgress", "watchedPreferences", "wereProfessorAdvancedResearch", "workteaClue", "yourFavoriteBird", "yourFavoriteBirdMods", "youRobotCPUUpgrades", "zootGraftedMods", "zootMilkCrueltyMods", "zootMilkKindnessMods", "_automatedFutureSide", "_bastilleBoosts", "_bastilleChoice1", "_bastilleChoice2", "_bastilleChoice3", "_bastilleCurrentStyles", "_bastilleEnemyCastle", "_bastilleEnemyName", "_bastilleLastBattleResults", "_bastilleLastEncounter", "_bastilleStats", "_beachHeadsUsed", "_beachLayout", "_beachMinutes", "_birdOfTheDay", "_birdOfTheDayMods", "_bittycar", "_campAwaySmileBuffSign", "_citizenZone", "_citizenZoneMods", "_cloudTalkMessage", "_cloudTalkSmoker", "_coatOfPaintModifier", "_cupidBowFamiliars", "_currentDartboard", "_curveballFightsLeft", "_cyberZone1Defense", "_cyberZone1Hacker", "_cyberZone1Owner", "_cyberZone2Defense", "_cyberZone2Hacker", "_cyberZone2Owner", "_cyberZone3Defense", "_cyberZone3Hacker", "_cyberZone3Owner", "_deckCardsSeen", "_feastedFamiliars", "_floristPlantsUsed", "_frAreasUnlocked", "_frHoursLeft", "_frMonstersKilled", "_futuristicCollarModifier", "_futuristicHatModifier", "_futuristicShirtModifier", "_horsery", "_horseryCrazyMox", "_horseryCrazyMus", "_horseryCrazyMys", "_horseryCrazyName", "_horseryCurrentName", "_horseryDarkName", "_horseryNormalName", "_horseryPaleName", "_jickJarAvailable", "_jiggleCheesedMonsters", "_lastCombatActions", "_lastCombatStarted", "_locketMonstersFought", "_mayamSymbolsUsed", "_mummeryMods", "_mummeryUses", "_newYouQuestSkill", "_noHatModifier", "_pantogramModifier", "_perilLocations", "_pirateRealmCrewmate", "_pirateRealmCrewmate1", "_pirateRealmCrewmate2", "_pirateRealmCrewmate3", "_pirateRealmShip", "_pottedPowerPlant", "_questESp", "_questPartyFair", "_questPartyFairProgress", "_questPartyFairQuest", "_questPirateRealm", "_roboDrinks", "_roninStoragePulls", "_savageBeastMods", "_seadentWaveZone", "_spacegateAnimalLife", "_spacegateCoordinates", "_spacegateGear", "_spacegateHazards", "_spacegateIntelligentLife", "_spacegatePlanetName", "_spacegatePlantLife", "_stolenAccordions", "_tempRelayCounters", "_timeSpinnerFoodAvailable", "_trickOrTreatBlock", "_unknownEasyBountyItem", "_unknownHardBountyItem", "_unknownSpecialBountyItem", "_untakenEasyBountyItem", "_untakenHardBountyItem", "_untakenSpecialBountyItem", "_userMods", "_villainLairColor", "_villainLairKey", "_voteLocal1", "_voteLocal2", "_voteLocal3", "_voteLocal4", "_voteMonster1", "_voteMonster2", "_voteModifier", "_VYKEACompanionType", "_VYKEACompanionRune", "_VYKEACompanionName"];
var numericOrStringProperties = ["statusEngineering", "statusGalley", "statusMedbay", "statusMorgue", "statusNavigation", "statusScienceLab", "statusSonar", "statusSpecialOps", "statusWasteProcessing", "choiceAdventure2", "choiceAdventure3", "choiceAdventure4", "choiceAdventure5", "choiceAdventure6", "choiceAdventure7", "choiceAdventure8", "choiceAdventure9", "choiceAdventure10", "choiceAdventure11", "choiceAdventure12", "choiceAdventure14", "choiceAdventure15", "choiceAdventure16", "choiceAdventure17", "choiceAdventure18", "choiceAdventure19", "choiceAdventure20", "choiceAdventure21", "choiceAdventure22", "choiceAdventure23", "choiceAdventure24", "choiceAdventure25", "choiceAdventure26", "choiceAdventure27", "choiceAdventure28", "choiceAdventure29", "choiceAdventure40", "choiceAdventure41", "choiceAdventure42", "choiceAdventure45", "choiceAdventure46", "choiceAdventure47", "choiceAdventure71", "choiceAdventure72", "choiceAdventure73", "choiceAdventure74", "choiceAdventure75", "choiceAdventure76", "choiceAdventure77", "choiceAdventure86", "choiceAdventure87", "choiceAdventure88", "choiceAdventure89", "choiceAdventure90", "choiceAdventure91", "choiceAdventure105", "choiceAdventure106", "choiceAdventure107", "choiceAdventure108", "choiceAdventure109", "choiceAdventure110", "choiceAdventure111", "choiceAdventure112", "choiceAdventure113", "choiceAdventure114", "choiceAdventure115", "choiceAdventure116", "choiceAdventure117", "choiceAdventure118", "choiceAdventure120", "choiceAdventure123", "choiceAdventure125", "choiceAdventure126", "choiceAdventure127", "choiceAdventure129", "choiceAdventure131", "choiceAdventure132", "choiceAdventure135", "choiceAdventure136", "choiceAdventure137", "choiceAdventure138", "choiceAdventure139", "choiceAdventure140", "choiceAdventure141", "choiceAdventure142", "choiceAdventure143", "choiceAdventure144", "choiceAdventure145", "choiceAdventure146", "choiceAdventure147", "choiceAdventure148", "choiceAdventure149", "choiceAdventure151", "choiceAdventure152", "choiceAdventure153", "choiceAdventure154", "choiceAdventure155", "choiceAdventure156", "choiceAdventure157", "choiceAdventure158", "choiceAdventure159", "choiceAdventure160", "choiceAdventure161", "choiceAdventure162", "choiceAdventure163", "choiceAdventure164", "choiceAdventure165", "choiceAdventure166", "choiceAdventure167", "choiceAdventure168", "choiceAdventure169", "choiceAdventure170", "choiceAdventure171", "choiceAdventure172", "choiceAdventure177", "choiceAdventure178", "choiceAdventure180", "choiceAdventure181", "choiceAdventure182", "choiceAdventure184", "choiceAdventure185", "choiceAdventure186", "choiceAdventure187", "choiceAdventure188", "choiceAdventure189", "choiceAdventure191", "choiceAdventure197", "choiceAdventure198", "choiceAdventure199", "choiceAdventure200", "choiceAdventure201", "choiceAdventure202", "choiceAdventure203", "choiceAdventure204", "choiceAdventure205", "choiceAdventure206", "choiceAdventure207", "choiceAdventure208", "choiceAdventure211", "choiceAdventure212", "choiceAdventure213", "choiceAdventure214", "choiceAdventure215", "choiceAdventure216", "choiceAdventure217", "choiceAdventure218", "choiceAdventure219", "choiceAdventure220", "choiceAdventure221", "choiceAdventure222", "choiceAdventure223", "choiceAdventure224", "choiceAdventure225", "choiceAdventure230", "choiceAdventure272", "choiceAdventure273", "choiceAdventure276", "choiceAdventure277", "choiceAdventure278", "choiceAdventure279", "choiceAdventure280", "choiceAdventure281", "choiceAdventure282", "choiceAdventure283", "choiceAdventure284", "choiceAdventure285", "choiceAdventure286", "choiceAdventure287", "choiceAdventure288", "choiceAdventure289", "choiceAdventure290", "choiceAdventure291", "choiceAdventure292", "choiceAdventure293", "choiceAdventure294", "choiceAdventure295", "choiceAdventure296", "choiceAdventure297", "choiceAdventure298", "choiceAdventure299", "choiceAdventure302", "choiceAdventure303", "choiceAdventure304", "choiceAdventure305", "choiceAdventure306", "choiceAdventure307", "choiceAdventure308", "choiceAdventure309", "choiceAdventure310", "choiceAdventure311", "choiceAdventure317", "choiceAdventure318", "choiceAdventure319", "choiceAdventure320", "choiceAdventure321", "choiceAdventure322", "choiceAdventure326", "choiceAdventure327", "choiceAdventure328", "choiceAdventure329", "choiceAdventure330", "choiceAdventure331", "choiceAdventure332", "choiceAdventure333", "choiceAdventure334", "choiceAdventure335", "choiceAdventure336", "choiceAdventure337", "choiceAdventure338", "choiceAdventure339", "choiceAdventure340", "choiceAdventure341", "choiceAdventure342", "choiceAdventure343", "choiceAdventure344", "choiceAdventure345", "choiceAdventure346", "choiceAdventure347", "choiceAdventure348", "choiceAdventure349", "choiceAdventure350", "choiceAdventure351", "choiceAdventure352", "choiceAdventure353", "choiceAdventure354", "choiceAdventure355", "choiceAdventure356", "choiceAdventure357", "choiceAdventure358", "choiceAdventure360", "choiceAdventure361", "choiceAdventure362", "choiceAdventure363", "choiceAdventure364", "choiceAdventure365", "choiceAdventure366", "choiceAdventure367", "choiceAdventure372", "choiceAdventure376", "choiceAdventure387", "choiceAdventure388", "choiceAdventure389", "choiceAdventure390", "choiceAdventure391", "choiceAdventure392", "choiceAdventure393", "choiceAdventure395", "choiceAdventure396", "choiceAdventure397", "choiceAdventure398", "choiceAdventure399", "choiceAdventure400", "choiceAdventure401", "choiceAdventure402", "choiceAdventure403", "choiceAdventure423", "choiceAdventure424", "choiceAdventure425", "choiceAdventure426", "choiceAdventure427", "choiceAdventure428", "choiceAdventure429", "choiceAdventure430", "choiceAdventure431", "choiceAdventure432", "choiceAdventure433", "choiceAdventure435", "choiceAdventure438", "choiceAdventure439", "choiceAdventure442", "choiceAdventure444", "choiceAdventure445", "choiceAdventure446", "choiceAdventure447", "choiceAdventure448", "choiceAdventure449", "choiceAdventure451", "choiceAdventure452", "choiceAdventure453", "choiceAdventure454", "choiceAdventure455", "choiceAdventure456", "choiceAdventure457", "choiceAdventure458", "choiceAdventure460", "choiceAdventure461", "choiceAdventure462", "choiceAdventure463", "choiceAdventure464", "choiceAdventure465", "choiceAdventure467", "choiceAdventure468", "choiceAdventure469", "choiceAdventure470", "choiceAdventure471", "choiceAdventure472", "choiceAdventure473", "choiceAdventure474", "choiceAdventure475", "choiceAdventure477", "choiceAdventure478", "choiceAdventure480", "choiceAdventure483", "choiceAdventure484", "choiceAdventure485", "choiceAdventure486", "choiceAdventure488", "choiceAdventure489", "choiceAdventure490", "choiceAdventure491", "choiceAdventure496", "choiceAdventure497", "choiceAdventure502", "choiceAdventure503", "choiceAdventure504", "choiceAdventure505", "choiceAdventure506", "choiceAdventure507", "choiceAdventure509", "choiceAdventure510", "choiceAdventure511", "choiceAdventure512", "choiceAdventure513", "choiceAdventure514", "choiceAdventure515", "choiceAdventure517", "choiceAdventure518", "choiceAdventure519", "choiceAdventure521", "choiceAdventure522", "choiceAdventure523", "choiceAdventure527", "choiceAdventure528", "choiceAdventure529", "choiceAdventure530", "choiceAdventure531", "choiceAdventure532", "choiceAdventure533", "choiceAdventure534", "choiceAdventure535", "choiceAdventure536", "choiceAdventure538", "choiceAdventure539", "choiceAdventure542", "choiceAdventure543", "choiceAdventure544", "choiceAdventure546", "choiceAdventure548", "choiceAdventure549", "choiceAdventure550", "choiceAdventure551", "choiceAdventure552", "choiceAdventure553", "choiceAdventure554", "choiceAdventure556", "choiceAdventure557", "choiceAdventure558", "choiceAdventure559", "choiceAdventure560", "choiceAdventure561", "choiceAdventure562", "choiceAdventure563", "choiceAdventure564", "choiceAdventure565", "choiceAdventure566", "choiceAdventure567", "choiceAdventure568", "choiceAdventure569", "choiceAdventure571", "choiceAdventure572", "choiceAdventure573", "choiceAdventure574", "choiceAdventure575", "choiceAdventure576", "choiceAdventure577", "choiceAdventure578", "choiceAdventure579", "choiceAdventure581", "choiceAdventure582", "choiceAdventure583", "choiceAdventure584", "choiceAdventure594", "choiceAdventure595", "choiceAdventure596", "choiceAdventure597", "choiceAdventure598", "choiceAdventure599", "choiceAdventure600", "choiceAdventure603", "choiceAdventure604", "choiceAdventure616", "choiceAdventure634", "choiceAdventure640", "choiceAdventure654", "choiceAdventure655", "choiceAdventure656", "choiceAdventure657", "choiceAdventure658", "choiceAdventure664", "choiceAdventure669", "choiceAdventure670", "choiceAdventure671", "choiceAdventure672", "choiceAdventure673", "choiceAdventure674", "choiceAdventure675", "choiceAdventure676", "choiceAdventure677", "choiceAdventure678", "choiceAdventure679", "choiceAdventure681", "choiceAdventure683", "choiceAdventure684", "choiceAdventure685", "choiceAdventure686", "choiceAdventure687", "choiceAdventure688", "choiceAdventure689", "choiceAdventure690", "choiceAdventure691", "choiceAdventure692", "choiceAdventure693", "choiceAdventure694", "choiceAdventure695", "choiceAdventure696", "choiceAdventure697", "choiceAdventure698", "choiceAdventure700", "choiceAdventure701", "choiceAdventure705", "choiceAdventure706", "choiceAdventure707", "choiceAdventure708", "choiceAdventure709", "choiceAdventure710", "choiceAdventure711", "choiceAdventure712", "choiceAdventure713", "choiceAdventure714", "choiceAdventure715", "choiceAdventure716", "choiceAdventure717", "choiceAdventure721", "choiceAdventure725", "choiceAdventure729", "choiceAdventure733", "choiceAdventure737", "choiceAdventure741", "choiceAdventure745", "choiceAdventure749", "choiceAdventure753", "choiceAdventure771", "choiceAdventure778", "choiceAdventure780", "choiceAdventure781", "choiceAdventure783", "choiceAdventure784", "choiceAdventure785", "choiceAdventure786", "choiceAdventure787", "choiceAdventure788", "choiceAdventure789", "choiceAdventure791", "choiceAdventure793", "choiceAdventure794", "choiceAdventure795", "choiceAdventure796", "choiceAdventure797", "choiceAdventure803", "choiceAdventure805", "choiceAdventure808", "choiceAdventure809", "choiceAdventure813", "choiceAdventure815", "choiceAdventure830", "choiceAdventure832", "choiceAdventure833", "choiceAdventure834", "choiceAdventure835", "choiceAdventure837", "choiceAdventure838", "choiceAdventure839", "choiceAdventure840", "choiceAdventure841", "choiceAdventure842", "choiceAdventure851", "choiceAdventure852", "choiceAdventure853", "choiceAdventure854", "choiceAdventure855", "choiceAdventure856", "choiceAdventure857", "choiceAdventure858", "choiceAdventure866", "choiceAdventure873", "choiceAdventure875", "choiceAdventure876", "choiceAdventure877", "choiceAdventure878", "choiceAdventure879", "choiceAdventure880", "choiceAdventure881", "choiceAdventure882", "choiceAdventure888", "choiceAdventure889", "choiceAdventure918", "choiceAdventure919", "choiceAdventure920", "choiceAdventure921", "choiceAdventure923", "choiceAdventure924", "choiceAdventure925", "choiceAdventure926", "choiceAdventure927", "choiceAdventure928", "choiceAdventure929", "choiceAdventure930", "choiceAdventure931", "choiceAdventure932", "choiceAdventure940", "choiceAdventure941", "choiceAdventure942", "choiceAdventure943", "choiceAdventure944", "choiceAdventure945", "choiceAdventure946", "choiceAdventure950", "choiceAdventure955", "choiceAdventure957", "choiceAdventure958", "choiceAdventure959", "choiceAdventure960", "choiceAdventure961", "choiceAdventure962", "choiceAdventure963", "choiceAdventure964", "choiceAdventure965", "choiceAdventure966", "choiceAdventure970", "choiceAdventure973", "choiceAdventure974", "choiceAdventure975", "choiceAdventure976", "choiceAdventure977", "choiceAdventure979", "choiceAdventure980", "choiceAdventure981", "choiceAdventure982", "choiceAdventure983", "choiceAdventure988", "choiceAdventure989", "choiceAdventure993", "choiceAdventure998", "choiceAdventure1000", "choiceAdventure1003", "choiceAdventure1005", "choiceAdventure1006", "choiceAdventure1007", "choiceAdventure1008", "choiceAdventure1009", "choiceAdventure1010", "choiceAdventure1011", "choiceAdventure1012", "choiceAdventure1013", "choiceAdventure1015", "choiceAdventure1016", "choiceAdventure1017", "choiceAdventure1018", "choiceAdventure1019", "choiceAdventure1020", "choiceAdventure1021", "choiceAdventure1022", "choiceAdventure1023", "choiceAdventure1026", "choiceAdventure1027", "choiceAdventure1028", "choiceAdventure1029", "choiceAdventure1030", "choiceAdventure1031", "choiceAdventure1032", "choiceAdventure1033", "choiceAdventure1034", "choiceAdventure1035", "choiceAdventure1036", "choiceAdventure1037", "choiceAdventure1038", "choiceAdventure1039", "choiceAdventure1040", "choiceAdventure1041", "choiceAdventure1042", "choiceAdventure1044", "choiceAdventure1045", "choiceAdventure1046", "choiceAdventure1048", "choiceAdventure1051", "choiceAdventure1052", "choiceAdventure1053", "choiceAdventure1054", "choiceAdventure1055", "choiceAdventure1056", "choiceAdventure1057", "choiceAdventure1059", "choiceAdventure1060", "choiceAdventure1061", "choiceAdventure1062", "choiceAdventure1065", "choiceAdventure1067", "choiceAdventure1068", "choiceAdventure1069", "choiceAdventure1070", "choiceAdventure1071", "choiceAdventure1073", "choiceAdventure1077", "choiceAdventure1080", "choiceAdventure1081", "choiceAdventure1082", "choiceAdventure1083", "choiceAdventure1084", "choiceAdventure1085", "choiceAdventure1091", "choiceAdventure1094", "choiceAdventure1095", "choiceAdventure1096", "choiceAdventure1097", "choiceAdventure1102", "choiceAdventure1106", "choiceAdventure1107", "choiceAdventure1108", "choiceAdventure1110", "choiceAdventure1114", "choiceAdventure1115", "choiceAdventure1116", "choiceAdventure1118", "choiceAdventure1119", "choiceAdventure1120", "choiceAdventure1121", "choiceAdventure1122", "choiceAdventure1123", "choiceAdventure1171", "choiceAdventure1172", "choiceAdventure1173", "choiceAdventure1174", "choiceAdventure1175", "choiceAdventure1193", "choiceAdventure1195", "choiceAdventure1196", "choiceAdventure1197", "choiceAdventure1198", "choiceAdventure1199", "choiceAdventure1202", "choiceAdventure1203", "choiceAdventure1204", "choiceAdventure1205", "choiceAdventure1206", "choiceAdventure1207", "choiceAdventure1208", "choiceAdventure1209", "choiceAdventure1210", "choiceAdventure1211", "choiceAdventure1212", "choiceAdventure1213", "choiceAdventure1214", "choiceAdventure1215", "choiceAdventure1219", "choiceAdventure1222", "choiceAdventure1223", "choiceAdventure1224", "choiceAdventure1225", "choiceAdventure1226", "choiceAdventure1227", "choiceAdventure1228", "choiceAdventure1229", "choiceAdventure1236", "choiceAdventure1237", "choiceAdventure1238", "choiceAdventure1239", "choiceAdventure1240", "choiceAdventure1241", "choiceAdventure1242", "choiceAdventure1243", "choiceAdventure1244", "choiceAdventure1245", "choiceAdventure1246", "choiceAdventure1247", "choiceAdventure1248", "choiceAdventure1249", "choiceAdventure1250", "choiceAdventure1251", "choiceAdventure1252", "choiceAdventure1253", "choiceAdventure1254", "choiceAdventure1255", "choiceAdventure1256", "choiceAdventure1266", "choiceAdventure1280", "choiceAdventure1281", "choiceAdventure1282", "choiceAdventure1283", "choiceAdventure1284", "choiceAdventure1285", "choiceAdventure1286", "choiceAdventure1287", "choiceAdventure1288", "choiceAdventure1289", "choiceAdventure1290", "choiceAdventure1291", "choiceAdventure1292", "choiceAdventure1293", "choiceAdventure1294", "choiceAdventure1295", "choiceAdventure1296", "choiceAdventure1297", "choiceAdventure1298", "choiceAdventure1299", "choiceAdventure1300", "choiceAdventure1301", "choiceAdventure1302", "choiceAdventure1303", "choiceAdventure1304", "choiceAdventure1305", "choiceAdventure1307", "choiceAdventure1310", "choiceAdventure1312", "choiceAdventure1313", "choiceAdventure1314", "choiceAdventure1315", "choiceAdventure1316", "choiceAdventure1317", "choiceAdventure1318", "choiceAdventure1319", "choiceAdventure1321", "choiceAdventure1322", "choiceAdventure1323", "choiceAdventure1324", "choiceAdventure1325", "choiceAdventure1326", "choiceAdventure1327", "choiceAdventure1328", "choiceAdventure1332", "choiceAdventure1333", "choiceAdventure1335", "choiceAdventure1340", "choiceAdventure1341", "choiceAdventure1345", "choiceAdventure1389", "choiceAdventure1392", "choiceAdventure1397", "choiceAdventure1399", "choiceAdventure1405", "choiceAdventure1411", "choiceAdventure1415", "choiceAdventure1427", "choiceAdventure1428", "choiceAdventure1429", "choiceAdventure1430", "choiceAdventure1431", "choiceAdventure1432", "choiceAdventure1433", "choiceAdventure1434", "choiceAdventure1436", "choiceAdventure1460", "choiceAdventure1461", "choiceAdventure1467", "choiceAdventure1468", "choiceAdventure1469", "choiceAdventure1470", "choiceAdventure1471", "choiceAdventure1472", "choiceAdventure1473", "choiceAdventure1474", "choiceAdventure1475", "choiceAdventure1486", "choiceAdventure1487", "choiceAdventure1488", "choiceAdventure1489", "choiceAdventure1491", "choiceAdventure1494", "choiceAdventure1505", "choiceAdventure1528", "choiceAdventure1534", "choiceAdventure1538", "choiceAdventure1539", "choiceAdventure1540", "choiceAdventure1541", "choiceAdventure1542", "choiceAdventure1545", "choiceAdventure1546", "choiceAdventure1547", "choiceAdventure1548", "choiceAdventure1549", "choiceAdventure1550", "choiceAdventure1591"];
var familiarProperties = ["commaFamiliar", "cupidBowLastFamiliar", "nextQuantumFamiliar", "stillsuitFamiliar", "zootGraftedButtCheekLeftFamiliar", "zootGraftedButtCheekRightFamiliar", "zootGraftedFootLeftFamiliar", "zootGraftedFootRightFamiliar", "zootGraftedHandLeftFamiliar", "zootGraftedHandRightFamiliar", "zootGraftedHeadFamiliar", "zootGraftedNippleLeftFamiliar", "zootGraftedNippleRightFamiliar", "zootGraftedShoulderLeftFamiliar", "zootGraftedShoulderRightFamiliar"];
var familiarNumericProperties = ["cupidBowLastFamiliar", "zootGraftedButtCheekLeftFamiliar", "zootGraftedButtCheekRightFamiliar", "zootGraftedFootLeftFamiliar", "zootGraftedFootRightFamiliar", "zootGraftedHandLeftFamiliar", "zootGraftedHandRightFamiliar", "zootGraftedHeadFamiliar", "zootGraftedNippleLeftFamiliar", "zootGraftedNippleRightFamiliar", "zootGraftedShoulderLeftFamiliar", "zootGraftedShoulderRightFamiliar"];
var statProperties = ["nsChallenge1", "snojoSetting"];
var phylumProperties = ["dnaSyringe", "locketPhylum", "redSnapperPhylum", "_circadianRhythmsPhylum"];
var itemProperties = ["commerceGhostItem", "daycareInstructorItem", "doctorBagQuestItem", "dolphinItem", "eweItem", "guzzlrQuestBooze", "implementGlitchItem", "muffinOnOrder", "rufusDesiredArtifact", "rufusDesiredItems", "shenQuestItem", "trapperOre", "walfordBucketItem", "_cookbookbatQuestIngredient", "_crimboPastDailySpecialItem", "_dailySpecial", "_pirateRealmCurio"];
var itemNumericProperties = ["daycareInstructorItem", "_crimboPastDailySpecialItem"];

var booleanPropertiesSet = new Set(booleanProperties);
var numericPropertiesSet = new Set(numericProperties);
var numericOrStringPropertiesSet = new Set(numericOrStringProperties);
var stringPropertiesSet = new Set(stringProperties);
var locationPropertiesSet = new Set(locationProperties);
var monsterPropertiesSet = new Set(monsterProperties);
var familiarPropertiesSet = new Set(familiarProperties);
var statPropertiesSet = new Set(statProperties);
var phylumPropertiesSet = new Set(phylumProperties);
var itemPropertiesSet = new Set(itemProperties);
/**
 * Determine whether a property has a boolean value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a boolean value
 */
function isBooleanProperty(property) {
  return booleanPropertiesSet.has(property);
}
/**
 * Determine whether a property has a numeric value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a numeric value
 */
function isNumericProperty(property) {
  return numericPropertiesSet.has(property);
}
/**
 * Determine whether a property has a numeric or string value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a numeric or string value
 */
function isNumericOrStringProperty(property) {
  return numericOrStringPropertiesSet.has(property);
}
/**
 * Determine whether a property has a string value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a string value
 */
function isStringProperty(property) {
  return stringPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Location value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Location value
 */
function isLocationProperty(property) {
  return locationPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Monster value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Monster value
 */
function isMonsterProperty(property) {
  return monsterPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Familiar value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Familiar value
 */
function isFamiliarProperty(property) {
  return familiarPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Stat value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Stat value
 */
function isStatProperty(property) {
  return statPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Phylum value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Phylum value
 */
function isPhylumProperty(property) {
  return phylumPropertiesSet.has(property);
}
/**
 * Determine whether a property has an Item value
 *
 * @param property Property to check
 * @returns Whether the supplied property has an Item value
 */
function isItemProperty(property) {
  return itemPropertiesSet.has(property);
}

var createPropertyGetter = transform => (property, default_) => {
  var value = kolmafia.getProperty(property);
  if (default_ !== undefined && value === "") {
    return default_;
  }
  return transform(value, property);
};
function createMafiaClassPropertyGetter(Type,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
toType) {
  var numericPropertyNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return createPropertyGetter((value, property) => {
    if (value === "") return null;
    var v = numericPropertyNames.includes(property) ? value.match(/^[0-9]+$/) ? toType(parseInt(value)) : null : toType(value);
    return v === Type.none ? null : v;
  });
}
var getString = createPropertyGetter(value => value);
var getBoolean = createPropertyGetter(value => value === "true");
var getNumber = createPropertyGetter(value => Number(value));
var getFamiliar = createMafiaClassPropertyGetter(kolmafia.Familiar, kolmafia.toFamiliar, familiarNumericProperties);
var getItem = createMafiaClassPropertyGetter(kolmafia.Item, kolmafia.toItem, itemNumericProperties);
var getLocation = createMafiaClassPropertyGetter(kolmafia.Location, kolmafia.toLocation);
var getMonster = createMafiaClassPropertyGetter(kolmafia.Monster, kolmafia.toMonster, monsterNumericProperties);
var getPhylum = createMafiaClassPropertyGetter(kolmafia.Phylum, kolmafia.toPhylum);
var getStat = createMafiaClassPropertyGetter(kolmafia.Stat, kolmafia.toStat);
/**
 * Gets the value of a mafia property, either built in or custom
 *
 * @param property Name of the property
 * @param _default Default value for the property to take if not set
 * @returns Value of the mafia property
 */
function get(property, _default) {
  var value = getString(property);
  // Handle known properties.
  if (isBooleanProperty(property)) {
    return getBoolean(property, _default) ?? false;
  } else if (isNumericProperty(property)) {
    return getNumber(property, _default) ?? 0;
  } else if (isNumericOrStringProperty(property)) {
    return value.match(/^\d+$/) ? parseInt(value) : value;
  } else if (isLocationProperty(property)) {
    return getLocation(property, _default);
  } else if (isMonsterProperty(property)) {
    return getMonster(property, _default);
  } else if (isFamiliarProperty(property)) {
    return getFamiliar(property, _default);
  } else if (isStatProperty(property)) {
    return getStat(property, _default);
  } else if (isPhylumProperty(property)) {
    return getPhylum(property, _default);
  } else if (isItemProperty(property)) {
    return getItem(property, _default);
  } else if (isStringProperty(property)) {
    return value === "" && _default !== undefined ? _default : value;
  }
  // Not a KnownProperty from here on out.
  if (_default instanceof kolmafia.Location) {
    return getLocation(property, _default);
  } else if (_default instanceof kolmafia.Monster) {
    return getMonster(property, _default);
  } else if (_default instanceof kolmafia.Familiar) {
    return getFamiliar(property, _default);
  } else if (_default instanceof kolmafia.Stat) {
    return getStat(property, _default);
  } else if (_default instanceof kolmafia.Phylum) {
    return getPhylum(property, _default);
  } else if (_default instanceof kolmafia.Item) {
    return getItem(property, _default);
  } else if (typeof _default === "boolean") {
    return value === "true" ? true : value === "false" ? false : _default;
  } else if (typeof _default === "number") {
    return value === "" ? _default : parseInt(value);
  } else if (value === "") {
    return _default === undefined ? "" : _default;
  } else {
    return value;
  }
}
/**
 * Sets the value of a mafia property, either built in or custom
 *
 * @param property Name of the property
 * @param value Value to give the property
 * @returns Value that was set
 */
function _set(property, value) {
  var stringValue = value === null ? "" : value.toString();
  kolmafia.setProperty(property, stringValue);
  return value;
}
var PropertiesManager = /*#__PURE__*/function () {
  function PropertiesManager() {
    _classCallCheck(this, PropertiesManager);
    _defineProperty(this, "properties", {});
  }
  return _createClass(PropertiesManager, [{
    key: "storedValues",
    get: function get() {
      return this.properties;
    }
    /**
     * Sets a collection of properties to the given values, storing the old values.
     *
     * @param propertiesToSet A Properties object, keyed by property name.
     */
  }, {
    key: "set",
    value: function set(propertiesToSet) {
      for (var _i2 = 0, _Object$entries2 = Object.entries(propertiesToSet); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          propertyName = _Object$entries2$_i[0],
          propertyValue = _Object$entries2$_i[1];
        if (!(propertyName in this.properties)) {
          this.properties[propertyName] = kolmafia.propertyExists(propertyName) ? get(propertyName) : PropertiesManager.EMPTY_PREFERENCE;
        }
        _set(propertyName, propertyValue);
      }
    }
    /**
     * Sets a collection of choice adventure properties to the given values, storing the old values.
     *
     * @param choicesToSet An object keyed by choice adventure number.
     */
  }, {
    key: "setChoices",
    value: function setChoices(choicesToSet) {
      this.set(Object.fromEntries(Object.entries(choicesToSet).map(_ref5 => {
        var _ref6 = _slicedToArray(_ref5, 2),
          choiceNumber = _ref6[0],
          choiceValue = _ref6[1];
        return ["choiceAdventure".concat(choiceNumber), choiceValue];
      })));
    }
    /**
     * Sets a single choice adventure property to the given value, storing the old value.
     *
     * @param choiceToSet The number of the choice adventure to set the property for.
     * @param value The value to assign to that choice adventure.
     */
  }, {
    key: "setChoice",
    value: function setChoice(choiceToSet, value) {
      this.setChoices({
        [choiceToSet]: value
      });
    }
    /**
     * Resets the given properties to their original stored value. Does not delete entries from the manager.
     *
     * @param properties Collection of properties to reset.
     */
  }, {
    key: "reset",
    value: function reset() {
      for (var _len = arguments.length, properties = new Array(_len), _key = 0; _key < _len; _key++) {
        properties[_key] = arguments[_key];
      }
      for (var _i3 = 0, _properties = properties; _i3 < _properties.length; _i3++) {
        var property = _properties[_i3];
        if (!(property in this.properties)) continue;
        var value = this.properties[property];
        if (value === PropertiesManager.EMPTY_PREFERENCE) {
          kolmafia.removeProperty(property);
        } else {
          _set(property, value);
        }
      }
    }
    /**
     * Iterates over all stored values, setting each property back to its original stored value. Does not delete entries from the manager.
     */
  }, {
    key: "resetAll",
    value: function resetAll() {
      this.reset.apply(this, _toConsumableArray(Object.keys(this.properties)));
    }
    /**
     * Stops storing the original values of inputted properties.
     *
     * @param properties Properties for the manager to forget.
     */
  }, {
    key: "clear",
    value: function clear() {
      for (var _len2 = arguments.length, properties = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        properties[_key2] = arguments[_key2];
      }
      for (var _i4 = 0, _properties2 = properties; _i4 < _properties2.length; _i4++) {
        var property = _properties2[_i4];
        if (this.properties[property]) {
          delete this.properties[property];
        }
      }
    }
    /**
     * Clears all properties.
     */
  }, {
    key: "clearAll",
    value: function clearAll() {
      this.properties = {};
    }
    /**
     * Increases a numeric property to the given value if necessary.
     *
     * @param property The numeric property we want to potentially raise.
     * @param value The minimum value we want that property to have.
     * @returns Whether we needed to change the property.
     */
  }, {
    key: "setMinimumValue",
    value: function setMinimumValue(property, value) {
      if (get(property, 0) < value) {
        this.set({
          [property]: value
        });
        return true;
      }
      return false;
    }
    /**
     * Decrease a numeric property to the given value if necessary.
     *
     * @param property The numeric property we want to potentially lower.
     * @param value The maximum value we want that property to have.
     * @returns Whether we needed to change the property.
     */
  }, {
    key: "setMaximumValue",
    value: function setMaximumValue(property, value) {
      if (get(property, 0) > value) {
        this.set({
          [property]: value
        });
        return true;
      }
      return false;
    }
    /**
     * Creates a new PropertiesManager with identical stored values to this one.
     *
     * @returns A new PropertiesManager, with identical stored values to this one.
     */
  }, {
    key: "clone",
    value: function clone() {
      var newGuy = new PropertiesManager();
      newGuy.properties = this.storedValues;
      return newGuy;
    }
    /**
     * Clamps a numeric property, modulating it up or down to fit within a specified range
     *
     * @param property The numeric property to clamp
     * @param min The lower bound for what we want the property to be allowed to be.
     * @param max The upper bound for what we want the property to be allowed to be.
     * @returns Whether we ended up changing the property or not.
     */
  }, {
    key: "clamp",
    value: function clamp(property, min, max) {
      if (max < min) return false;
      var start = get(property);
      this.setMinimumValue(property, min);
      this.setMaximumValue(property, max);
      return start !== get(property);
    }
    /**
     * Determines whether this PropertiesManager has identical stored values to another.
     *
     * @param other The PropertiesManager to compare to this one.
     * @returns Whether their StoredValues are identical.
     */
  }, {
    key: "equals",
    value: function equals(other) {
      var thisProps = Object.entries(this.storedValues);
      var otherProps = new Map(Object.entries(other.storedValues));
      if (thisProps.length !== otherProps.size) return false;
      for (var _i5 = 0, _thisProps = thisProps; _i5 < _thisProps.length; _i5++) {
        var _thisProps$_i = _slicedToArray(_thisProps[_i5], 2),
          propertyName = _thisProps$_i[0],
          propertyValue = _thisProps$_i[1];
        if (otherProps.get(propertyName) === propertyValue) return false;
      }
      return true;
    }
    /**
     * Merges a PropertiesManager onto this one, letting the input win in the event that both PropertiesManagers have a value stored.
     *
     * @param other The PropertiesManager to be merged onto this one.
     * @returns A new PropertiesManager with stored values from both its parents.
     */
  }, {
    key: "merge",
    value: function merge(other) {
      var newGuy = new PropertiesManager();
      newGuy.properties = _objectSpread2(_objectSpread2({}, this.properties), other.properties);
      return newGuy;
    }
    /**
     * Merges an arbitrary collection of PropertiesManagers, letting the rightmost PropertiesManager win in the event of verlap.
     *
     * @param mergees The PropertiesManagers to merge together.
     * @returns A PropertiesManager that is just an amalgam of all the constituents.
     */
  }], [{
    key: "merge",
    value: function merge() {
      for (var _len3 = arguments.length, mergees = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        mergees[_key3] = arguments[_key3];
      }
      if (mergees.length === 0) return new PropertiesManager();
      return mergees.reduce((a, b) => a.merge(b));
    }
  }]);
}();
_defineProperty(PropertiesManager, "EMPTY_PREFERENCE", Symbol("empty preference"));

/**
 * Sum an array of numbers.
 *
 * @param addends Addends to sum.
 * @param x Property or mapping function of addends to sum
 * @returns Sum of numbers
 */
function sum(addends, x) {
  return addends.reduce((subtotal, element) => subtotal + (typeof x === "function" ? x(element) : element[x]), 0);
}
/**
 * Splits a string by commas while also respecting escaping commas with a backslash
 *
 * @param str String to split
 * @returns List of tokens
 */
function splitByCommasWithEscapes(str) {
  var returnValue = [];
  var ignoreNext = false;
  var currentString = "";
  var _iterator2 = _createForOfIteratorHelper(str.split("")),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var char = _step2.value;
      if (char === "\\") {
        ignoreNext = true;
      } else {
        if (char == "," && !ignoreNext) {
          returnValue.push(currentString.trim());
          currentString = "";
        } else {
          currentString += char;
        }
        ignoreNext = false;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  returnValue.push(currentString.trim());
  return returnValue;
}

var concatTemplateString = function concatTemplateString(literals) {
  for (var _len = arguments.length, placeholders = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    placeholders[_key - 1] = arguments[_key];
  }
  return literals.raw.reduce((acc, literal, i) => acc + literal + (placeholders[i] ?? ""), "");
};
var handleTypeGetError = (Type, error) => {
  var message = "".concat(error);
  var match = message.match(RegExp("Bad ".concat(Type.name.toLowerCase(), " value: .*")));
  if (match) {
    kolmafia.print("".concat(match[0], "; if you're certain that this ").concat(Type.name, " exists and is spelled correctly, please update KoLMafia"), "red");
  } else {
    kolmafia.print(message);
  }
};
var createSingleConstant = (Type, converter) => {
  var tagFunction = function tagFunction(literals) {
    for (var _len2 = arguments.length, placeholders = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      placeholders[_key2 - 1] = arguments[_key2];
    }
    var input = concatTemplateString.apply(void 0, [literals].concat(placeholders));
    try {
      return Type.get(input);
    } catch (error) {
      handleTypeGetError(Type, error);
    }
    kolmafia.abort();
  };
  tagFunction.cls = Type;
  tagFunction.none = Type.none;
  tagFunction.get = name => {
    var value = converter(name);
    return value === Type.none ? null : value;
  };
  return tagFunction;
};
var createPluralConstant = Type => {
  var tagFunction = function tagFunction(literals) {
    for (var _len3 = arguments.length, placeholders = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      placeholders[_key3 - 1] = arguments[_key3];
    }
    var input = concatTemplateString.apply(void 0, [literals].concat(placeholders));
    if (input === "") {
      return Type.all();
    }
    try {
      return Type.get(splitByCommasWithEscapes(input));
    } catch (error) {
      handleTypeGetError(Type, error);
    }
    kolmafia.abort();
  };
  tagFunction.all = () => Type.all();
  return tagFunction;
};
/**
 * A Bounty specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Bounty, kolmafia.toBounty);
/**
 * A list of Bounties specified by a comma-separated list of names.
 * For a list of all possible Bounties, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Bounty);
/**
 * A Class specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Class, kolmafia.toClass);
/**
 * A list of Classes specified by a comma-separated list of names.
 * For a list of all possible Classes, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Class);
/**
 * A Coinmaster specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Coinmaster, kolmafia.toCoinmaster);
/**
 * A list of Coinmasters specified by a comma-separated list of names.
 * For a list of all possible Coinmasters, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Coinmaster);
/**
 * An Effect specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Effect, kolmafia.toEffect);
/**
 * A list of Effects specified by a comma-separated list of names.
 * For a list of all possible Effects, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Effect);
/**
 * An Element specified by name.
 *
 * @category In-game constant
 */
var $element = createSingleConstant(kolmafia.Element, kolmafia.toElement);
/**
 * A list of Elements specified by a comma-separated list of names.
 * For a list of all possible Elements, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Element);
/**
 * A Familiar specified by name.
 *
 * @category In-game constant
 */
var $familiar = createSingleConstant(kolmafia.Familiar, kolmafia.toFamiliar);
/**
 * A list of Familiars specified by a comma-separated list of names.
 * For a list of all possible Familiars, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Familiar);
/**
 * An Item specified by name.
 *
 * @category In-game constant
 */
var $item = createSingleConstant(kolmafia.Item, kolmafia.toItem);
/**
 * A list of Items specified by a comma-separated list of names.
 * For a list of all possible Items, leave the template string blank.
 *
 * @category In-game constant
 */
var $items = createPluralConstant(kolmafia.Item);
/**
 * A Location specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Location, kolmafia.toLocation);
/**
 * A list of Locations specified by a comma-separated list of names.
 * For a list of all possible Locations, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Location);
/**
 * A Modifier specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Modifier, kolmafia.toModifier);
/**
 * A list of Modifiers specified by a comma-separated list of names.
 * For a list of all possible Modifiers, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Modifier);
/**
 * A Monster specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Monster, kolmafia.toMonster);
/**
 * A list of Monsters specified by a comma-separated list of names.
 * For a list of all possible Monsters, leave the template string blank.
 *
 * @category In-game constant
 */
var $monsters = createPluralConstant(kolmafia.Monster);
/**
 * A Path specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Path, kolmafia.toPath);
/**
 * A list of Paths specified by a comma-separated list of names.
 * For a list of all possible Paths, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Path);
/**
 * A Phylum specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Phylum, kolmafia.toPhylum);
/**
 * A list of Phyla specified by a comma-separated list of names.
 * For a list of all possible Phyla, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Phylum);
/**
 * A Servant specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Servant, kolmafia.toServant);
/**
 * A list of Servants specified by a comma-separated list of names.
 * For a list of all possible Servants, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Servant);
/**
 * A Skill specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Skill, kolmafia.toSkill);
/**
 * A list of Skills specified by a comma-separated list of names.
 * For a list of all possible Skills, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Skill);
/**
 * A Slot specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Slot, kolmafia.toSlot);
/**
 * A list of Slots specified by a comma-separated list of names.
 * For a list of all possible Slots, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Slot);
/**
 * A Stat specified by name.
 *
 * @category In-game constant
 */
var $stat = createSingleConstant(kolmafia.Stat, kolmafia.toStat);
/**
 * A list of Stats specified by a comma-separated list of names.
 * For a list of all possible Stats, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Stat);
/**
 * A Thrall specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Thrall, kolmafia.toThrall);
/**
 * A list of Thralls specified by a comma-separated list of names.
 * For a list of all possible Thralls, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Thrall);

var _templateObject10$1, _templateObject11$1, _templateObject12$1, _templateObject13$1, _templateObject14$1, _templateObject15$1, _templateObject16$1, _templateObject17$1, _templateObject18$1, _templateObject19$1, _templateObject20$1, _templateObject21$1, _templateObject22$1, _templateObject23$1, _templateObject24$1, _templateObject25$1, _templateObject26$1, _templateObject27$1, _templateObject28$1, _templateObject29$1, _templateObject30$1, _templateObject31$1, _templateObject32, _templateObject33, _templateObject34, _templateObject35, _templateObject48, _templateObject49, _templateObject50, _templateObject51, _templateObject52, _templateObject53;
var Wanderer;
(function (Wanderer) {
  Wanderer["Digitize"] = "Digitize Monster";
  Wanderer["Enamorang"] = "Enamorang Monster";
  Wanderer["Familiar"] = "Familiar";
  Wanderer["Holiday"] = "Holiday Monster";
  Wanderer["Kramco"] = "Kramco";
  Wanderer["Nemesis"] = "Nemesis Assassin";
  Wanderer["Portscan"] = "portscan.edu";
  Wanderer["Romantic"] = "Romantic Monster";
  Wanderer["Vote"] = "Vote Monster";
})(Wanderer || (Wanderer = {}));
[Wanderer.Digitize, Wanderer.Portscan];
var foldGroupCache = new Map();
/**
 * Determines the fold group (if any) of which the given item is a part
 *
 * @category General
 * @param item Item that is part of the required fold group
 * @param cache Whether to query the fold group cache
 * @returns List of items in the fold group
 */
function getFoldGroup(item) {
  var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (cache) {
    var cached = foldGroupCache.get(item);
    if (cached !== undefined) return cached;
  }
  var result = Object.entries(kolmafia.getRelated(item, "fold")).sort((_ref, _ref2) => {
    var _ref3 = _slicedToArray(_ref, 2),
      a = _ref3[1];
    var _ref4 = _slicedToArray(_ref2, 2),
      b = _ref4[1];
    return a - b;
  }).map(_ref5 => {
    var _ref6 = _slicedToArray(_ref5, 1),
      i = _ref6[0];
    return kolmafia.Item.get(i);
  });
  var _iterator = _createForOfIteratorHelper(result),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var fold = _step.value;
      foldGroupCache.set(fold, result);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return result;
}
new Map([["El Dia De Los Muertos Borrachos", $monsters(_templateObject10$1 || (_templateObject10$1 = _taggedTemplateLiteral(["Novia Cad\xE1ver, Novio Cad\xE1ver, Padre Cad\xE1ver, Persona Inocente Cad\xE1ver"])))], ["Feast of Boris", $monsters(_templateObject11$1 || (_templateObject11$1 = _taggedTemplateLiteral(["Candied Yam Golem, Malevolent Tofurkey, Possessed Can of Cranberry Sauce, Stuffing Golem"])))], ["Talk Like a Pirate Day", $monsters(_templateObject12$1 || (_templateObject12$1 = _taggedTemplateLiteral(["ambulatory pirate, migratory pirate, peripatetic pirate"])))]]);
new Map([["standing around flexing their muscles and using grip exercisers", $stat(_templateObject13$1 || (_templateObject13$1 = _taggedTemplateLiteral(["Muscle"])))], ["sitting around playing chess and solving complicated-looking logic puzzles", $stat(_templateObject14$1 || (_templateObject14$1 = _taggedTemplateLiteral(["Mysticality"])))], ["all wearing sunglasses and dancing", $stat(_templateObject15$1 || (_templateObject15$1 = _taggedTemplateLiteral(["Moxie"])))]]);
new Map([["people, all of whom appear to be on fire", $element(_templateObject16$1 || (_templateObject16$1 = _taggedTemplateLiteral(["hot"])))], ["people, surrounded by a cloud of eldritch mist", $element(_templateObject17$1 || (_templateObject17$1 = _taggedTemplateLiteral(["spooky"])))], ["greasy-looking people furtively skulking around", $element(_templateObject18$1 || (_templateObject18$1 = _taggedTemplateLiteral(["sleaze"])))], ["people, surrounded by garbage and clouds of flies", $element(_templateObject19$1 || (_templateObject19$1 = _taggedTemplateLiteral(["stench"])))], ["people, clustered around a group of igloos", $element(_templateObject20$1 || (_templateObject20$1 = _taggedTemplateLiteral(["cold"])))]]);
new Map([["smoldering bushes on the outskirts of a hedge maze", $element(_templateObject21$1 || (_templateObject21$1 = _taggedTemplateLiteral(["hot"])))], ["creepy-looking black bushes on the outskirts of a hedge maze", $element(_templateObject22$1 || (_templateObject22$1 = _taggedTemplateLiteral(["spooky"])))], ["purplish, greasy-looking hedges", $element(_templateObject23$1 || (_templateObject23$1 = _taggedTemplateLiteral(["sleaze"])))], ["nasty-looking, dripping green bushes on the outskirts of a hedge maze", $element(_templateObject24$1 || (_templateObject24$1 = _taggedTemplateLiteral(["stench"])))], ["frost-rimed bushes on the outskirts of a hedge maze", $element(_templateObject25$1 || (_templateObject25$1 = _taggedTemplateLiteral(["cold"])))]]);
new Map([["smoke rising from deeper within the maze", $element(_templateObject26$1 || (_templateObject26$1 = _taggedTemplateLiteral(["hot"])))], ["a miasma of eldritch vapors rising from deeper within the maze", $element(_templateObject27$1 || (_templateObject27$1 = _taggedTemplateLiteral(["spooky"])))], ["a greasy purple cloud hanging over the center of the maze", $element(_templateObject28$1 || (_templateObject28$1 = _taggedTemplateLiteral(["sleaze"])))], ["a cloud of green gas hovering over the maze", $element(_templateObject29$1 || (_templateObject29$1 = _taggedTemplateLiteral(["stench"])))], ["wintry mists rising from deeper within the maze", $element(_templateObject30$1 || (_templateObject30$1 = _taggedTemplateLiteral(["cold"])))]]);
new Map([["with lava slowly oozing out of it", $element(_templateObject31$1 || (_templateObject31$1 = _taggedTemplateLiteral(["hot"])))], ["surrounded by creepy black mist", $element(_templateObject32 || (_templateObject32 = _taggedTemplateLiteral(["spooky"])))], ["that occasionally vomits out a greasy ball of hair", $element(_templateObject33 || (_templateObject33 = _taggedTemplateLiteral(["sleaze"])))], ["disgorging a really surprising amount of sewage", $element(_templateObject34 || (_templateObject34 = _taggedTemplateLiteral(["stench"])))], ["occasionally disgorging a bunch of ice cubes", $element(_templateObject35 || (_templateObject35 = _taggedTemplateLiteral(["cold"])))]]);
var regularFamiliarTags = Object.freeze(["animal", "insect", "haseyes", "haswings", "fast", "bite", "flies", "hashands", "wearsclothes", "organic", "vegetable", "hovers", "edible", "food", "sentient", "cute", "mineral", "polygonal", "object", "undead", "cantalk", "evil", "orb", "spooky", "sleaze", "aquatic", "swims", "isclothes", "phallic", "stench", "hot", "hasbeak", "haslegs", "robot", "technological", "hard", "cold", "hasbones", "hasclaws", "reallyevil", "good", "person", "humanoid", "animatedart", "software", "hasshell", "hasstinger"]);
new Set(regularFamiliarTags);
new Map([[$familiar(_templateObject48 || (_templateObject48 = _taggedTemplateLiteral(["Nursine"]))), ["ult_bearhug"]], [$familiar(_templateObject49 || (_templateObject49 = _taggedTemplateLiteral(["Caramel"]))), ["ult_sticktreats"]], [$familiar(_templateObject50 || (_templateObject50 = _taggedTemplateLiteral(["Smashmoth"]))), ["ult_owlstare"]], [$familiar(_templateObject51 || (_templateObject51 = _taggedTemplateLiteral(["Slotter"]))), ["ult_bloodbath"]], [$familiar(_templateObject52 || (_templateObject52 = _taggedTemplateLiteral(["Cornbeefadon"]))), ["ult_pepperscorn"]], [$familiar(_templateObject53 || (_templateObject53 = _taggedTemplateLiteral(["Mu"]))), ["ult_rainbowstorm"]]]);

/**
 * Represents an exception thrown when the current KoLmafia version does not
 * match an expected condition.
 */
var KolmafiaVersionError = /*#__PURE__*/function (_Error) {
  function KolmafiaVersionError(message) {
    var _this;
    _classCallCheck(this, KolmafiaVersionError);
    _this = _callSuper(this, KolmafiaVersionError, [message]);
    // Explicitly set the prototype, so that 'instanceof' still works in Node.js
    // even when the class is transpiled down to ES5
    // See: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Note that this code isn't needed for Rhino.
    Object.setPrototypeOf(_this, KolmafiaVersionError.prototype);
    return _this;
  }
  _inherits(KolmafiaVersionError, _Error);
  return _createClass(KolmafiaVersionError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
// Manually set class name, so that the stack trace shows proper name in Rhino
KolmafiaVersionError.prototype.name = "KolmafiaVersionError";
/**
 * Returns the currently executing script name, suitable for embedding in an
 * error message.
 *
 * @returns Path of the main script wrapped in single-quotes, or `"This script"`
 *    if the path cannot be determined
 */
function getScriptName() {
  var _require$main;
  // In Rhino, the current script name is available in require.main.id
  var scriptName = (_require$main = require.main) === null || _require$main === void 0 ? void 0 : _require$main.id;
  return scriptName ? "'".concat(scriptName, "'") : "This script";
}
/**
 * If KoLmafia's revision number is less than `revision`, throws an exception.
 * Otherwise, does nothing.
 *
 * This behaves like the `since rXXX;` statement in ASH.
 *
 * @param revision Revision number
 * @throws {KolmafiaVersionError}
 *    If KoLmafia's revision number is less than `revision`.
 * @throws {TypeError} If `revision` is not an integer
 * @example
 * ```ts
 * // Throws if KoLmafia revision is less than r20500
 * sinceKolmafiaRevision(20500);
 * ```
 */
function sinceKolmafiaRevision(revision) {
  if (!Number.isInteger(revision)) {
    throw new TypeError("Invalid revision number ".concat(revision, " (must be an integer)"));
  }
  // Based on net.sourceforge.kolmafia.textui.Parser.sinceException()
  var currentRevision = kolmafia.getRevision();
  if (currentRevision > 0 && currentRevision < revision) {
    throw new KolmafiaVersionError("".concat(getScriptName(), " requires revision r").concat(revision, " of kolmafia or higher (current: ").concat(kolmafia.getRevision(), "). Up-to-date builds can be found at https://ci.kolmafia.us/."));
  }
}

var _templateObject$1, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject0, _templateObject1, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20, _templateObject21, _templateObject22, _templateObject23, _templateObject24, _templateObject25, _templateObject26, _templateObject27, _templateObject28, _templateObject29, _templateObject30, _templateObject31;
/**
 * Return a mapping of the session items, mapping foldable items to a single of their forms
 *
 * @param sessionOnly should closet, DC, and storage be ignored for the session calculation
 * @returns the item session results, with foldables mapped to a single of their folding forms
 */
function mySessionItemsWrapper() {
  var sessionOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var manyToOne = (primary, mapped) => mapped.map(target => [target, primary]);
  var foldable = item => manyToOne(item, getFoldGroup(item));
  var itemMappings = new Map([].concat(_toConsumableArray(foldable($item(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["liar's pants"]))))), _toConsumableArray(foldable($item(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["ice pick"]))))), _toConsumableArray(manyToOne($item(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["Spooky Putty sheet"]))), [$item(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["Spooky Putty monster"])))].concat(_toConsumableArray(getFoldGroup($item(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["Spooky Putty sheet"])))))))), _toConsumableArray(foldable($item(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["stinky cheese sword"]))))), _toConsumableArray(foldable($item(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["naughty paper shuriken"]))))), _toConsumableArray(foldable($item(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["Loathing Legion knife"]))))), _toConsumableArray(foldable($item(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["deceased crimbo tree"]))))), _toConsumableArray(foldable($item(_templateObject0 || (_templateObject0 = _taggedTemplateLiteral(["makeshift turban"]))))), _toConsumableArray(foldable($item(_templateObject1 || (_templateObject1 = _taggedTemplateLiteral(["turtle wax shield"]))))), _toConsumableArray(foldable($item(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["metallic foil bow"]))))), _toConsumableArray(foldable($item(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["ironic moustache"]))))), _toConsumableArray(foldable($item(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["bugged balaclava"]))))), _toConsumableArray(foldable($item(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["toggle switch (Bartend)"]))))), _toConsumableArray(foldable($item(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["mushroom cap"]))))), _toConsumableArray(manyToOne($item(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["can of Rain-Doh"]))), $items(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["empty Rain-Doh can"]))))), _toConsumableArray(manyToOne($item(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["meteorite fragment"]))), $items(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["meteorite earring, meteorite necklace, meteorite ring"]))))), _toConsumableArray(manyToOne($item(_templateObject19 || (_templateObject19 = _taggedTemplateLiteral(["Sneaky Pete's leather jacket"]))), $items(_templateObject20 || (_templateObject20 = _taggedTemplateLiteral(["Sneaky Pete's leather jacket (collar popped)"]))))), _toConsumableArray(manyToOne($item(_templateObject21 || (_templateObject21 = _taggedTemplateLiteral(["Boris's Helm"]))), $items(_templateObject22 || (_templateObject22 = _taggedTemplateLiteral(["Boris's Helm (askew)"]))))), _toConsumableArray(manyToOne($item(_templateObject23 || (_templateObject23 = _taggedTemplateLiteral(["Jarlsberg's pan"]))), $items(_templateObject24 || (_templateObject24 = _taggedTemplateLiteral(["Jarlsberg's pan (Cosmic portal mode)"]))))), _toConsumableArray(manyToOne($item(_templateObject25 || (_templateObject25 = _taggedTemplateLiteral(["tiny plastic sword"]))), $items(_templateObject26 || (_templateObject26 = _taggedTemplateLiteral(["grogtini, bodyslam, dirty martini, vesper, cherry bomb, sangria del diablo"]))))), _toConsumableArray(manyToOne($item(_templateObject27 || (_templateObject27 = _taggedTemplateLiteral(["earthenware muffin tin"]))), $items(_templateObject28 || (_templateObject28 = _taggedTemplateLiteral(["blueberry muffin, bran muffin, chocolate chip muffin"]))))), _toConsumableArray(manyToOne($item(_templateObject29 || (_templateObject29 = _taggedTemplateLiteral(["ChibiBuddy\u2122 (on)"]))), $items(_templateObject30 || (_templateObject30 = _taggedTemplateLiteral(["ChibiBuddy\u2122 (off)"])))))));
  var inventory = new Map();
  var invLocations = sessionOnly ? [kolmafia.mySessionItems] : [kolmafia.mySessionItems, kolmafia.getCloset, kolmafia.getDisplay, kolmafia.getStorage];
  if (!sessionOnly) {
    for (var _i = 0, _Object$entries = Object.entries(kolmafia.getCampground()); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        itemStr = _Object$entries$_i[0],
        quantity = _Object$entries$_i[1];
      if (!quantity) continue;
      var item = kolmafia.toItem(itemStr);
      if (item === $item(_templateObject31 || (_templateObject31 = _taggedTemplateLiteral(["big rock"])))) continue; // Used to represent an empty house slot
      var mappedItem = itemMappings.get(item) ?? item;
      inventory.set(mappedItem, quantity + (inventory.get(mappedItem) ?? 0));
    }
  }
  for (var _i2 = 0, _invLocations = invLocations; _i2 < _invLocations.length; _i2++) {
    var inventoryFunc = _invLocations[_i2];
    for (var _i3 = 0, _Object$entries2 = Object.entries(inventoryFunc()); _i3 < _Object$entries2.length; _i3++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
        _itemStr = _Object$entries2$_i[0],
        _quantity = _Object$entries2$_i[1];
      if (!_quantity) continue;
      var _item = kolmafia.toItem(_itemStr);
      var _mappedItem = itemMappings.get(_item) ?? _item;
      inventory.set(_mappedItem, _quantity + (inventory.get(_mappedItem) ?? 0));
      if (inventory.get(_mappedItem) === 0) inventory.delete(_mappedItem);
    }
  }
  return inventory;
}
/**
 * Perform a binary element-wise operation on two inventories
 *
 * @param a The LHS inventory to perform the operation on
 * @param b The RHS inventory to perform the operation on
 * @param op an operator to compute between the sets
 * @returns a new map representing the combined inventories
 */
function inventoryOperation(a, b, op) {
  // return every entry that is in a and not in b
  var difference = new Map();
  var _iterator = _createForOfIteratorHelper(new Set([].concat(_toConsumableArray(a.keys()), _toConsumableArray(b.keys())))),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      difference.set(item, op(a.get(item) ?? 0, b.get(item) ?? 0));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var diffEntries = _toConsumableArray(difference.entries());
  return new Map(diffEntries.filter(_ref => {
    var _ref2 = _slicedToArray(_ref, 2),
      value = _ref2[1];
    return value !== 0;
  }));
}
/**
 * A wrapper around tracking items and meat gained from this session
 * Smartly handles foldables being added/removed based on their state
 * Provides operations to add sessions and subtract Sessions so you can isolate the value of each Session using a baseline
 *
 * @member meat the raw meat associated with this Session
 * @member items a map representing the items gained/lost during this Session
 */
var Session = /*#__PURE__*/function () {
  /**
   * Construct a new session
   *
   * @param meat the amount of meat associated with this session
   * @param items the items associated with this session
   * @param totalTurns the number of turns associated with this session
   */
  function Session(meat, items, totalTurns) {
    _classCallCheck(this, Session);
    _defineProperty(this, "meat", void 0);
    _defineProperty(this, "items", void 0);
    _defineProperty(this, "totalTurns", void 0);
    this.meat = meat;
    this.items = items;
    this.totalTurns = totalTurns;
  }
  /**
   * Register session results that do not get tracked natively
   *
   * @param target either the Item or a string saying "meat" of what quantity to modify
   * @param quantity How much to modify the tracked amount by
   */
  return _createClass(Session, [{
    key: "register",
    value: function register(target, quantity) {
      if (target === "meat") {
        this.meat += quantity;
      } else {
        this.items.set(target, (this.items.get(target) ?? 0) + quantity);
      }
    }
    /**
     * Value this session
     *
     * @param itemValue a function that, when given an item, will give a meat value of the item
     * @returns ItemResult with the full value of this session given the input function
     */
  }, {
    key: "value",
    value: function value(itemValue) {
      // TODO: add garbo specific pricing (sugar equipment for synth, etc.)
      var turns = this.totalTurns;
      var meat = Math.floor(this.meat);
      var itemDetails = _toConsumableArray(this.items.entries()).map(_ref3 => {
        var _ref4 = _slicedToArray(_ref3, 2),
          item = _ref4[0],
          quantity = _ref4[1];
        return {
          item,
          quantity,
          // only run itemValue if quantity is nonzero
          value: quantity ? itemValue(item) * quantity : 0
        };
      });
      var items = Math.floor(sum(itemDetails, "value"));
      return {
        meat,
        items,
        total: meat + items,
        itemDetails,
        turns
      };
    }
    /**
     * Subtract the contents of another session from this one, removing any items that have a resulting quantity of 0
     *  (this will ignore elements in b but not in a)
     *
     * @param other the session from which to pull values to remove from this session
     * @returns a new session representing the difference between this session and the other session
     */
  }, {
    key: "diff",
    value: function diff(other) {
      return new Session(this.meat - other.meat, inventoryOperation(this.items, other.items, (a, b) => a - b), this.totalTurns - other.totalTurns);
    }
    /**
     * Subtract the contents of snasphot b from session a, removing any items that have a resulting quantity of 0
     *  (this will ignore elements in b but not in a)
     *
     * @param a the session from which to subtract elements
     * @param b the session from which to add elements
     * @returns a new session representing the difference between a and b
     */
  }, {
    key: "add",
    value:
    /**
     * Generate a new session combining multiple sessions together
     *
     * @param other the session from which to add elements to this set
     * @returns a new session representing the addition of other to this
     */
    function add(other) {
      return new Session(this.meat + other.meat, inventoryOperation(this.items, other.items, (a, b) => a + b), this.totalTurns + other.totalTurns);
    }
    /**
     * Combine the contents of sessions
     *
     * @param sessions the set of sessions to combine together
     * @returns a new session representing the difference between a and b
     */
  }, {
    key: "toFile",
    value:
    /**
     * Export this session to a file in the data/ directory. Conventionally this file should end in ".json"
     *
     * @param filename The file into which to export
     */
    function toFile(filename) {
      var val = {
        meat: this.meat,
        items: Object.fromEntries(_toConsumableArray(this.items.entries()).sort((_ref5, _ref6) => {
          var _ref7 = _slicedToArray(_ref5, 1),
            a = _ref7[0];
          var _ref8 = _slicedToArray(_ref6, 1),
            b = _ref8[0];
          return a.id - b.id;
        })),
        totalTurns: this.totalTurns
      };
      kolmafia.bufferToFile(JSON.stringify(val, null, 2), Session.getFilepath(filename));
    }
    /**
     * Import a session from a file in the data/ directory. Conventionally the file should end in ".json"
     *
     * @param filename The file from which to import
     * @returns the session represented by the file
     */
  }, {
    key: "computeMPA",
    value:
    /**
     * @param other the session to diff against this session when computing MPA
     * @param options options for computing MPA
     * @param options.value a function to compute the meat value of a given item
     * @param options.isOutlier a function to compute if an item is considered an outlier. By default, no items are outliers
     * @param options.excludeValue meat values to exclude when calculating specific portions of the MPA
     * @param options.excludeValue.meat how much meat to exclude when calculating the meat portion of MPA
     * @param options.excludeValue.item how much meat to exclude when calculating hte item portion of MPA
     * @returns an analysis of the effective MPA for the given session
     */
    function computeMPA(other, options) {
      return Session.computeMPA(this, other, options);
    }
  }], [{
    key: "diff",
    value: function diff(a, b) {
      return a.diff(b);
    }
  }, {
    key: "add",
    value: function add() {
      for (var _len = arguments.length, sessions = new Array(_len), _key = 0; _key < _len; _key++) {
        sessions[_key] = arguments[_key];
      }
      return sessions.reduce((previousSession, currentSession) => previousSession.add(currentSession));
    }
  }, {
    key: "getFilepath",
    value: function getFilepath(filename) {
      return filename.endsWith(".json") ? filename : "snapshots/".concat(kolmafia.myName(), "/").concat(kolmafia.todayToString(), "_").concat(filename, ".json");
    }
  }, {
    key: "fromFile",
    value: function fromFile(filename) {
      var fileValue = kolmafia.fileToBuffer(Session.getFilepath(filename));
      // fileToBuffer returns empty string for files that don't exist
      if (fileValue.length > 0) {
        var val = JSON.parse(fileValue);
        var parsedItems = Object.entries(val.items).map(_ref9 => {
          var _ref0 = _slicedToArray(_ref9, 2),
            itemStr = _ref0[0],
            quantity = _ref0[1];
          return [kolmafia.toItem(itemStr), quantity];
        });
        return new Session(val.meat, new Map(parsedItems), val.totalTurns ?? 0);
      } else {
        // if the file does not exist, return an empty session
        return new Session(0, new Map(), 0);
      }
    }
    /**
     * Return the meat and items for the current session
     *
     * @param sessionOnly should closet, DC, and storage be ignored for the session calculation
     * @returns current session
     */
  }, {
    key: "current",
    value: function current() {
      var sessionOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var meat = sessionOnly ? [kolmafia.mySessionMeat] : [kolmafia.mySessionMeat, kolmafia.myClosetMeat, kolmafia.myStorageMeat];
      return new Session(sum(meat, f => f()), mySessionItemsWrapper(sessionOnly), kolmafia.totalTurnsPlayed());
    }
    /**
     * @param baseline the base session to use when computing MPA
     * @param full the full session to use when computing MPA
     * @param options options for computing MPA
     * @param options.value a function to compute the meat value of a given item
     * @param options.isOutlier a function to compute if an item is considered an outlier. By default, no items are outliers
     * @param options.excludeValue meat values to exclude when calculating specific portions of the MPA
     * @param options.excludeValue.meat how much meat to exclude when calculating the meat portion of MPA
     * @param options.excludeValue.item how much meat to exclude when calculating hte item portion of MPA
     * @returns an analysis of the effective MPA for the given session
     */
  }, {
    key: "computeMPA",
    value: function computeMPA(baseline, full, options) {
      var value = options.value;
      var excludeValue = options.excludeValue ?? {
        meat: 0,
        item: 0
      };
      var isOutlier = options.isOutlier;
      var result = full.diff(baseline).value(value);
      var meatValue = result.meat - (excludeValue.meat ?? 0);
      var outlierItems = isOutlier ? result.itemDetails.filter(isOutlier) : [];
      var outliersValue = sum(outlierItems, detail => detail.value);
      var itemValue = result.items - outliersValue - (excludeValue.item ?? 0);
      var turns = result.turns;
      return {
        mpa: {
          effective: (meatValue + itemValue) / turns,
          total: (meatValue + itemValue + outliersValue) / turns,
          meat: meatValue / turns,
          items: itemValue / turns
        },
        values: {
          effective: meatValue + itemValue,
          total: meatValue + itemValue + outliersValue,
          meat: meatValue,
          items: itemValue
        },
        outlierItems: outlierItems,
        turns: turns
      };
    }
  }]);
}();

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

// Beach scarce-tile message is a NON-INVENTORY encounter, not a
// KoL item delta. Keep it pool-unassigned pending empirical identification.
// r28508 logs: "> You found a message in a bottle!"
var BOTTLE_SCHEMA = "don-combo-beach-bottle/v0.1";
function parseBottleOutput(output) {
  // Match the standalone observed success line, not a string describing a
  // failure or the command used. Do not confuse Ocean City fishing items.
  var found = String(output || "").split(/\r?\n/).some(line => /^\s*(?:>\s*)?You found a message in a bottle!\s*$/i.test(line.trim()));
  return found ? [{
    schema: BOTTLE_SCHEMA,
    kind: "message_in_a_bottle",
    source: "native-cli-command-output",
    evidence_text: "You found a message in a bottle!",
    pool: "unassigned",
    tier: "unassigned",
    attribution: "actual-comb-coordinate",
    weak_pool_context: {
      pool_1: 0.1,
      pool_2: 0.1
    }
  }] : [];
}

/* eslint-disable eqeqeq */
// Evidence is per coordinate, not per beachfront. Unknown is not a successful harvest.

function tileKey(minute, row, column) {
  return "".concat(minute, ",").concat(row, ",").concat(column);
}
function emptyTileRecovery() {
  return {
    observations: 0,
    harvests: 0,
    last_seen_epoch: null,
    last_state: "unknown",
    last_combed_epoch: null,
    last_harvest_epoch: null,
    last_harvest_item: null,
    last_harvest_provenance: null,
    last_available_epoch: null,
    recovery_intervals: []
  };
}
function emptyRecoveryLedger() {
  return {
    schema: "don-combo-tile-recovery/v0.1",
    tiles: {},
    updated_at: null
  };
}
// KoLmafia's _beachLayout is pre-action. An 'r' without TwinkleVision
// is ambiguous: do not call it a confirmed rare or a confirmed cooldown.
function stateAt(layout, row, column, twinkleVision) {
  if (!Number.isInteger(row) || row < 1 || row > 10 || !Number.isInteger(column) || column < 0 || column > 9) return "unknown";
  var _iterator = _createForOfIteratorHelper(layout.split(",")),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var part = _step.value;
      var colon = part.indexOf(":");
      if (colon < 0 || Number(part.slice(0, colon)) !== row) continue;
      var symbol = part.slice(colon + 1).charAt(column);
      if (symbol === "c") return "combed";
      if (symbol === "t") return "twinkle";
      if (symbol === "W") return "whale";
      if (symbol === "r" && twinkleVision) return "rough";
      return "unknown";
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return "unknown";
}
function observeTile(existing, atEpoch, state, harvestedItem) {
  var entry = existing ? _objectSpread2(_objectSpread2({}, existing), {}, {
    recovery_intervals: (existing.recovery_intervals || []).slice(-40)
  }) : emptyTileRecovery();
  if (!Number.isFinite(atEpoch) || atEpoch <= 0) return entry;
  // Do not overwrite a newer observation with an older, imported one.
  if (entry.last_seen_epoch != null && atEpoch < entry.last_seen_epoch) return entry;
  var previousCombed = entry.last_combed_epoch;
  var previousHarvest = entry.last_harvest_epoch;
  entry.observations++;
  entry.last_seen_epoch = atEpoch;
  entry.last_state = state;
  if (state === "combed") entry.last_combed_epoch = atEpoch;
  if (state === "twinkle") {
    entry.last_available_epoch = atEpoch;
    if (previousHarvest != null && previousCombed != null && previousCombed >= previousHarvest && atEpoch > previousCombed) {
      var last = entry.recovery_intervals[entry.recovery_intervals.length - 1];
      // Record one interval per harvest, rather than recounting every twinkle.
      if (!last || last.first_available_epoch < previousHarvest) {
        entry.recovery_intervals.push({
          last_combed_epoch: previousCombed,
          first_available_epoch: atEpoch,
          lower_days: Math.max(0, (previousCombed - previousHarvest) / 86400),
          upper_days: (atEpoch - previousHarvest) / 86400
        });
      }
    }
  }
  if (harvestedItem) {
    entry.harvests++;
    entry.last_harvest_epoch = atEpoch;
    entry.last_harvest_item = harvestedItem;
    entry.last_harvest_provenance = "loot-inferred";
    // A verified positive item delta is stronger than a 'rare_target' attempt,
    // but not an independently game-verified spawn timestamp.
    entry.last_combed_epoch = atEpoch;
    entry.last_state = "combed";
  }
  entry.recovery_intervals = entry.recovery_intervals.slice(-40);
  return entry;
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
function scratchCount$1(layout) {
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
  var observation = scratchCount$1(layout);
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
      var preAction = event.pre_action_observed_at || event.observed_at;
      var date = Date.parse(preAction);
      if (!Number.isFinite(date) || date > nowMs) continue;
      if (addScratchVisit(ledger, event.minute, event.layout, preAction, "historical")) imported++;
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
  var bottleByCoordinate = {};
  var bottleEvents = [];
  var bottleUnbound = 0;
  var captureCovered = 0,
    captureEmpty = 0,
    captureLegacy = 0;
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
      var _e$run_context5, _e$special_events;
      var e = _step2.value;
      if (e.event_id && seen.has(e.event_id)) continue;
      if (e.event_id) seen.add(e.event_id);
      matched++;
      if (e.action_output_capture === "captured") captureCovered++;else if (e.action_output_capture === "empty") captureEmpty++;else captureLegacy++;
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
      // Count a genuine beach-result message once, even if its text appears
      // more than once in the command output. No synthetic inventory delta.
      if ((_e$special_events = e.special_events) !== null && _e$special_events !== void 0 && _e$special_events.some(x => x.kind === "message_in_a_bottle" && x.source === "native-cli-command-output" && x.pool === "unassigned")) {
        if (actualKey) {
          var _e$run_context6;
          var bottle = bottleByCoordinate[actualKey] ?? (bottleByCoordinate[actualKey] = {
            observed_events: 0,
            last_observed_at: null,
            classification: "POOL_UNKNOWN",
            weak_context_weight: {
              pool_1: 0.1,
              pool_2: 0.1
            },
            interpretation: "EXPLORATION_HINT_NOT_POOL_MEMBERSHIP_OR_DROP_PROBABILITY"
          });
          bottle.observed_events++;
          bottle.last_observed_at = e.observed_at;
          bottleEvents.push({
            kind: "message_in_a_bottle",
            coordinate: actualKey,
            observed_at: e.observed_at,
            event_id: e.event_id || null,
            route_mode: ((_e$run_context6 = e.run_context) === null || _e$run_context6 === void 0 ? void 0 : _e$run_context6.route_mode) || "legacy-unbound",
            source: "native-cli-command-output"
          });
        } else {
          bottleUnbound++;
        }
      }
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
    message_bottle_events: bottleEvents.length,
    message_bottle_unbound: bottleUnbound,
    bottle_detection_output_captured: captureCovered,
    bottle_detection_output_empty: captureEmpty,
    bottle_detection_legacy_unavailable: captureLegacy,
    unclassified_item_deltas: unclassified,
    hypothesis: "User-proposed two-pool rarity ladder: shorter cooldown may correspond to common/rare, longer to uncommon/rare, longest to rare/rare. NOT CALIBRATED. Recorded deltas and sightings are observations, not a demonstrated cooldown-to-loot relationship."
  };
  return {
    summary,
    by_coordinate: byCoordinate,
    bottle_by_coordinate: bottleByCoordinate,
    bottle_events: bottleEvents,
    by_front: byFront,
    observations
  };
}
function cooldownForTarget(index, minute, row, column) {
  return index.by_coordinate["".concat(minute, ",").concat(row, ",").concat(column)] || blank("".concat(minute, ",").concat(row, ",").concat(column));
}

// One-event decoration makes both live and routed ML JSONL entries explicitly
// inspectable. Complete historical replay still uses original raw fields.
function recordPoolLabels(event, playerId) {
  return buildPoolCooldownIndex([event], Date.parse(event.observed_at), playerId).observations;
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
// Long-tail resolution preserves the circa two-year hypothesis instead of
// hiding every 14+ day observation in a single short/long confounded bin.
var gapBin = days => days < 1 ? 0 : days < 3 ? 1 : days < 7 ? 2 : days < 14 ? 3 : days < 30 ? 4 : days < 90 ? 5 : days < 180 ? 6 : days < 365 ? 7 : days < 730 ? 8 : 9;

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
  var bins = [makeBin("under_1_day", 0, 1), makeBin("1_to_3_days", 1, 3), makeBin("3_to_7_days", 3, 7), makeBin("7_to_14_days", 7, 14), makeBin("14_to_30_days", 14, 30), makeBin("30_to_90_days", 30, 90), makeBin("90_to_180_days", 90, 180), makeBin("180_to_365_days", 180, 365), makeBin("365_to_730_days", 365, 730), makeBin("730_plus_days", 730, null)];
  var eligible = events.filter(e => {
    var _e$run_context7, _e$run_context8, _e$run_context9;
    var t = Date.parse(e.observed_at);
    return Number.isFinite(t) && t <= nowMs && (((_e$run_context7 = e.run_context) === null || _e$run_context7 === void 0 ? void 0 : _e$run_context7.player_id) === null || ((_e$run_context8 = e.run_context) === null || _e$run_context8 === void 0 ? void 0 : _e$run_context8.player_id) === undefined || ((_e$run_context9 = e.run_context) === null || _e$run_context9 === void 0 ? void 0 : _e$run_context9.player_id) === playerId);
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
        var _e$run_context0;
        var e = _step7.value;
        if (e.event_id && seen.has(e.event_id)) return 0; // continue
        if (e.event_id) seen.add(e.event_id);
        var target = e.planned_target,
          actual = e.actual_comb;
        if (!target || !catalogue.has(key(target)) || target.minute !== e.minute) return 0; // continue
        touched++;
        if (e.outcome !== "rare_target" || !actual || key(actual) !== key(target)) return 0; // continue
        exact++;
        if ((_e$run_context0 = e.run_context) !== null && _e$run_context0 !== void 0 && _e$run_context0.run_id) bound++;else legacy++;
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
function bottleForTarget(index, minute, row, column) {
  return index.bottle_by_coordinate["".concat(minute, ",").concat(row, ",").concat(column)] || {
    observed_events: 0,
    last_observed_at: null,
    classification: "POOL_UNKNOWN",
    weak_context_weight: {
      pool_1: 0.1,
      pool_2: 0.1
    },
    interpretation: "EXPLORATION_HINT_NOT_POOL_MEMBERSHIP_OR_DROP_PROBABILITY"
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
function recordScratchObservation(minute, layout, observedAt) {
  var ledger = loadScratchLedger();
  if (!addScratchVisit(ledger, minute, layout, observedAt, "live")) return;
  kolmafia.bufferToFile("".concat(JSON.stringify(ledger), "\n"), SCRATCH_FILE);
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
function captureTileRecovery(minute, layout, outcome, detail, atEpoch) {
  var corpus = JSON.parse(String(kolmafia.fileToBuffer("raretiles.json") || "[]"));
  var matches = corpus.filter(tile => tile.minute === minute);
  if (!matches.length) return;
  var ledger = loadTileRecoveryLedger();
  var actual = detail.actual_comb;
  // Only explicitly classified rare reward deltas may mark a known tile as
  // harvested for cooldown calculations. Many ordinary beach items were not
  // included in the old generic exclusion list, causing false harvests.
  // Unclassified deltas are still preserved in the immutable ML event log.
  var positiveItems = Object.entries(detail.items || {}).filter(_ref => {
    var _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      quantity = _ref2[1];
    return quantity > 0 && poolForItem(name, quantity) !== null;
  }).sort((_ref3, _ref4) => {
    var _ref5 = _slicedToArray(_ref3, 1),
      a = _ref5[0];
    var _ref6 = _slicedToArray(_ref4, 1),
      b = _ref6[0];
    return a.localeCompare(b);
  });
  var twinkleVision = kolmafia.getProperty("hasTwinkleVision") === "true";
  var _iterator = _createForOfIteratorHelper(matches),
    _step;
  try {
    var _loop = function _loop() {
      var tile = _step.value;
      // A submerged row absent from the layout is not an observation.
      if (!layout.split(",").some(part => part.startsWith("".concat(tile.row, ":")))) return 1; // continue
      var key = tileKey(tile.minute, tile.row, tile.column);
      var selected = !!actual && actual.minute === tile.minute && actual.row === tile.row && actual.column === tile.column;
      // A rare_target is an ATTEMPT, never sufficient for a harvest event alone.
      var harvested = selected && outcome === "rare_target" && positiveItems.length > 0 ? positiveItems[0][0] : null;
      ledger.tiles[key] = observeTile(ledger.tiles[key], atEpoch, stateAt(layout, tile.row, tile.column, twinkleVision), harvested);
    };
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      if (_loop()) continue;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  ledger.updated_at = new Date(atEpoch * 1000).toISOString();
  kolmafia.bufferToFile("".concat(JSON.stringify(ledger), "\n"), RECOVERY_FILE);
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
function ensureEntry(ledger, minute) {
  var key = String(minute);
  if (!ledger.fronts[key]) {
    ledger.fronts[key] = {
      layout_snapshots: 0,
      session_events: 0,
      symbols: {
        whale: 0,
        twinkle: 0,
        rough: 0,
        combed: 0,
        other: 0,
        visible: 0
      },
      outcomes: {},
      items: {},
      last_seen_epoch: null,
      last_seen_turn: null,
      sources: [],
      last_layout: null
    };
  }
  var entry = ledger.fronts[key];
  entry.symbols ?? (entry.symbols = {
    whale: 0,
    twinkle: 0,
    rough: 0,
    combed: 0,
    other: 0,
    visible: 0
  });
  entry.outcomes ?? (entry.outcomes = {});
  entry.items ?? (entry.items = {});
  entry.sources ?? (entry.sources = []);
  return entry;
}
function add(map, key) {
  var amount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  map[key] = (map[key] || 0) + amount;
}
function countLayout(layout) {
  var counts = {
    whale: 0,
    twinkle: 0,
    rough: 0,
    combed: 0,
    other: 0,
    visible: 0
  };
  var _iterator3 = _createForOfIteratorHelper(String(layout || "").split(",")),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var part = _step3.value;
      var split = part.indexOf(":");
      if (split < 0) continue;
      var symbols = part.substring(split + 1).slice(0, 10);
      var _iterator4 = _createForOfIteratorHelper(symbols),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var symbol = _step4.value;
          counts.visible++;
          if (symbol === "W") counts.whale++;else if (symbol === "t") counts.twinkle++;else if (symbol === "r") counts.rough++;else if (symbol === "c") counts.combed++;else counts.other++;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return counts;
}
function recordBeachObservation(minute, layout, outcome) {
  var detail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (!Number.isInteger(minute) || minute < 1 || minute > 10000 || !layout) return;
  var ledger = loadObservationLedger();
  var entry = ensureEntry(ledger, minute);
  entry.session_events = (entry.session_events || 0) + 1;
  entry.layout_snapshots = (entry.layout_snapshots || 0) + 1;
  var counts = countLayout(layout);
  for (var _i = 0, _Object$entries = Object.entries(counts); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      name = _Object$entries$_i[0],
      amount = _Object$entries$_i[1];
    add(entry.symbols, name, amount);
  }
  add(entry.outcomes, outcome);
  for (var _i2 = 0, _Object$entries2 = Object.entries(detail.items || {}); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
      _name = _Object$entries2$_i[0],
      _amount = _Object$entries2$_i[1];
    if (_amount) add(entry.items, _name, _amount);
  }
  if (!entry.sources.includes("combo-native")) entry.sources.push("combo-native");
  var now = new Date();
  entry.last_seen_epoch = Math.floor(now.getTime() / 1000);
  entry.last_seen_turn = kolmafia.turnsPlayed();
  entry.last_layout = layout;
  ledger.updated_at = now.toISOString();
  kolmafia.bufferToFile("".concat(JSON.stringify(ledger, null, 2), "\n"), LEDGER_FILE);
  var actual = detail.actual_comb || null;
  var event = {
    schema: "don-combo-ml-event/v0.1",
    event_id: "".concat(now.getTime(), "-").concat(kolmafia.turnsPlayed(), "-").concat(minute, "-").concat(actual ? "".concat(actual.row, "-").concat(actual.column) : "na"),
    observed_at: now.toISOString(),
    pre_action_observed_at: detail.pre_action_observed_at || undefined,
    turn: kolmafia.turnsPlayed(),
    minute,
    outcome,
    planned_target: detail.planned_target || null,
    actual_comb: actual,
    items: detail.items || {},
    meat: detail.meat || 0,
    special_events: parseBottleOutput(detail.action_output || ""),
    action_output_capture: detail.action_output === undefined ? "legacy-unavailable" : detail.action_output.length ? "captured" : "empty",
    layout,
    layout_symbols: counts,
    pre_action_prediction: detail.pre_action_prediction || null,
    run_context: detail.run_context || null
  };
  // Explicit structured pool labels in EVERY ordinary, shadow, free and paid
  // routed event; original deltas/layout are preserved for historical replay.
  try {
    event.pool_observations = recordPoolLabels(event, Number(kolmafia.myId()));
  } catch (_unused6) {
    event.pool_observations = [];
  }
  kolmafia.appendBufferToFile("".concat(JSON.stringify(event), "\n"), ML_EVENT_FILE);
  try {
    recordScratchObservation(minute, layout, detail.pre_action_observed_at || now.toISOString());
  } catch (_unused7) {
    // Scratch evidence is supplemental; original ML event log is a durable
    // backfill source, and errors cannot cause duplicate beach actions.
  }
  try {
    captureTileRecovery(minute, layout, outcome, detail, Math.floor(now.getTime() / 1000));
  } catch (_unused8) {
    // Recovery indexing is supplemental; never break the existing Combo path.
  }
}

// Three proposed category timescales, not three pre-fitted peaks.
// This reader is deliberately pure: no KoL calls, no writes, no action authority.
// Separate physical *reward events* from beach-layout sightings and item quantities.

var TIME_BUCKETS = [{
  key: "under_1_day",
  min_days: 0,
  max_days: 1
}, {
  key: "1_to_3_days",
  min_days: 1,
  max_days: 3
}, {
  key: "3_to_7_days",
  min_days: 3,
  max_days: 7
}, {
  key: "7_to_14_days",
  min_days: 7,
  max_days: 14
}, {
  key: "14_to_30_days",
  min_days: 14,
  max_days: 30
}, {
  key: "30_to_90_days",
  min_days: 30,
  max_days: 90
}, {
  key: "90_to_180_days",
  min_days: 90,
  max_days: 180
}, {
  key: "180_to_365_days",
  min_days: 180,
  max_days: 365
}, {
  key: "365_to_730_days",
  min_days: 365,
  max_days: 730
}, {
  key: "730_plus_days",
  min_days: 730,
  max_days: null
}];
var findBucket = days => TIME_BUCKETS.find(b => days >= b.min_days && (b.max_days === null || days < b.max_days)).key;
function cleanEventId(o) {
  return o.event_id || [o.observed_at, o.coordinate, o.pool, o.kind].join("|");
}
function compareTime(a, b) {
  return Date.parse(a.observed_at) - Date.parse(b.observed_at) || a.coordinate.localeCompare(b.coordinate) || a.kind.localeCompare(b.kind);
}
function blankBins() {
  return Object.fromEntries(TIME_BUCKETS.map(b => [b.key, 0]));
}
function buildPoolTimeScaleAudit(index) {
  // The same comb may award all three cursed equipment pieces. That is one
  // pirate-hoard reward event, not three independent respawn/cooldown samples.
  var byEvent = new Map();
  var collapsed = 0,
    layout = 0,
    rawQty = 0;
  var _iterator = _createForOfIteratorHelper(index.observations),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var o = _step.value;
      if (o.certainty === "layout-sighting") {
        layout += o.quantity;
        continue;
      }
      if (o.certainty !== "item-delta" && o.certainty !== "action-recorded") continue;
      if (o.certainty === "item-delta") rawQty += o.quantity;
      if (!o.coordinate || !Number.isFinite(Date.parse(o.observed_at))) continue;
      var identity = "".concat(cleanEventId(o), "|").concat(o.pool, "|").concat(o.kind, "|").concat(o.coordinate);
      var prior = byEvent.get(identity);
      if (prior) {
        prior.item_quantity += o.quantity;
        collapsed++;
        continue;
      }
      byEvent.set(identity, {
        observed_at: o.observed_at,
        minute: o.minute,
        coordinate: o.coordinate,
        pool: o.pool,
        kind: o.kind,
        tier: o.tier,
        observation_kind: o.certainty,
        item_quantity: o.quantity,
        route_mode: o.route_mode,
        event_id: o.event_id
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var events = _toConsumableArray(byEvent.values()).sort(compareTime);
  var gaps = [];
  // Calculate both within-category and across-coordinate sequences. A moved
  // observation is not evidence of transferring a hidden timer between tiles.
  var groups = new Map();
  var _iterator2 = _createForOfIteratorHelper(events),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var e = _step2.value;
      (groups.get(e.kind) || (groups.set(e.kind, []), groups.get(e.kind))).push(e);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var _iterator3 = _createForOfIteratorHelper(groups.values()),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var stream = _step3.value;
      stream.sort(compareTime);
      for (var j = 1; j < stream.length; j++) {
        var prev = stream[j - 1],
          cur = stream[j];
        var delta = Date.parse(cur.observed_at) - Date.parse(prev.observed_at);
        if (delta <= 0) continue;
        var days = delta / 86400000;
        gaps.push({
          pool: cur.pool,
          tier: cur.tier,
          kind: cur.kind,
          previous_at: prev.observed_at,
          current_at: cur.observed_at,
          previous_coordinate: prev.coordinate,
          current_coordinate: cur.coordinate,
          gap_days: days,
          bucket: findBucket(days),
          moved_coordinate: prev.coordinate !== cur.coordinate,
          interpretation: "INTER_REWARD_OBSERVATION_GAP_NOT_PROVEN_TRANSFER_OR_COOLDOWN"
        });
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  var tiers = [["common_rare", "short"], ["uncommon_rare", "middle"], ["rare_rare", "long"]];
  // Each pool gets three independent hypothesis lanes. Pool 1 whale actions
  // and Pool 2 item drops must never be merged into one fitted cooldown.
  var tier_hypotheses = ["pool_1", "pool_2"].flatMap(pool => tiers.map(_ref => {
    var _ref2 = _slicedToArray(_ref, 2),
      tier = _ref2[0],
      conceptual_peak = _ref2[1];
    var e = events.filter(q => q.pool === pool && q.tier === tier);
    var g = gaps.filter(q => q.pool === pool && q.tier === tier);
    var bins = blankBins();
    var _iterator4 = _createForOfIteratorHelper(g),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var v = _step4.value;
        bins[v.bucket]++;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    var ordered = g.map(v => v.gap_days).sort((a, b) => a - b);
    var median = ordered.length ? (ordered[Math.floor((ordered.length - 1) / 2)] + ordered[Math.floor(ordered.length / 2)]) / 2 : null;
    var modal = TIME_BUCKETS.slice().sort((a, b) => bins[b.key] - bins[a.key])[0];
    var credible = g.length >= 5 && new Set(e.map(v => v.observed_at.slice(0, 10))).size >= 3 && new Set(e.map(v => v.coordinate)).size >= 3;
    return {
      pool,
      tier,
      conceptual_peak,
      event_count: e.length,
      category_interval_count: g.length,
      cross_coordinate_interval_count: g.filter(v => v.moved_coordinate).length,
      median_observed_gap_days: median,
      modal_gap_bucket: g.length ? modal.key : null,
      // A sample median cannot itself establish a real cooldown mode.
      detected_peak_days: null,
      peak_status: credible ? "OBSERVATIONAL_MODE_ONLY_NOT_COOLDOWN_PEAK" : "INSUFFICIENT_DATED_EVENTS",
      observation_count_by_bucket: bins
    };
  }));
  return {
    schema: "don-combo-pool-timescales/v0.1",
    total_layout_sightings: layout,
    raw_item_delta_quantity: rawQty,
    unassigned_message_bottle_events: index.bottle_events.length,
    unassigned_bottle_category_gaps: Math.max(0, index.bottle_events.length - 1),
    unassigned_bottle_weak_pool_context: {
      pool_1: 0.1,
      pool_2: 0.1
    },
    distinct_reward_events: events.length,
    collapsed_simultaneous_gear_items: collapsed,
    global_interreward_intervals: gaps.length,
    same_coordinate_intervals: gaps.filter(v => !v.moved_coordinate).length,
    cross_coordinate_intervals: gaps.filter(v => v.moved_coordinate).length,
    events,
    gaps,
    tier_hypotheses,
    prior: "THREE_PROPOSED_TIMESCALES_NOT_THREE_MEASURED_PEAKS",
    transport_hypothesis: "POSSIBLE_CROSS_COORDINATE_CATEGORY_TRANSFER_UNVALIDATED",
    note: "Chronological category inter-reward gaps, not observed spawn timers. Sightings are excluded from reward intervals. Multiple pirate items from one comb form one reward event. Short/middle/long are hypotheses; empirical modes are withheld when sample support is weak. Cross-coordinate gaps do not prove timer transport."
  };
}
function compactPoolTimeScales(index) {
  return {
    schema: index.schema,
    total_layout_sightings: index.total_layout_sightings,
    raw_item_delta_quantity: index.raw_item_delta_quantity,
    unassigned_message_bottle_events: index.unassigned_message_bottle_events,
    unassigned_bottle_category_gaps: index.unassigned_bottle_category_gaps,
    unassigned_bottle_weak_pool_context: index.unassigned_bottle_weak_pool_context,
    distinct_reward_events: index.distinct_reward_events,
    collapsed_simultaneous_gear_items: index.collapsed_simultaneous_gear_items,
    global_interreward_intervals: index.global_interreward_intervals,
    same_coordinate_intervals: index.same_coordinate_intervals,
    cross_coordinate_intervals: index.cross_coordinate_intervals,
    tier_hypotheses: index.tier_hypotheses,
    prior: index.prior,
    transport_hypothesis: index.transport_hypothesis,
    note: index.note
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
function parseFalseRares$1() {
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
  var falseRares = parseFalseRares$1();
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
function evidenceFor(minute, current, ledger, tile, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve, timescales) {
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
    pool_timescales: timescales ? compactPoolTimeScales(timescales) : null,
    bottle_unknown_pool: bottleForTarget(poolIndex || buildPoolCooldownIndex([], Date.now(), n(kolmafia.myId())), minute, (tile === null || tile === void 0 ? void 0 : tile.row) ?? 0, (tile === null || tile === void 0 ? void 0 : tile.column) ?? -1),
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
function candidateFrontier(ledger, baseline, points, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve, timescales) {
  var count = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 16;
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
    var evidence = evidenceFor(minute, current, ledger, tile, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve, timescales);
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
      bottle_unknown_pool: evidence.bottle_unknown_pool,
      pool_timescales: evidence.pool_timescales,
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
  var timescales = buildPoolTimeScaleAudit(poolIndex);
  var evidence = evidenceFor(minute, current, ledger, tile, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve, timescales);
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
  // A single low-amplitude exploration hint, NOT 2 fake pool rewards.
  Math.min(1, evidence.bottle_unknown_pool.observed_events) * 0.004 +
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
  var timescales = buildPoolTimeScaleAudit(poolIndex);
  var scratchTop = Object.keys(scratches.fronts).map(minute => evidenceForScratchFront(scratches, Number(minute))).filter(x => x.high_scratch_days > 0).sort((a, b) => b.interest_score - a.interest_score || b.very_interesting_days - a.very_interesting_days || b.max_scratch_count - a.max_scratch_count || a.front_minute - b.front_minute).slice(0, 30);
  var candidates = candidateFrontier(ledger, baseline, points, recoveryLedger, historicalIndex, scratches, poolIndex, historicalCurve, timescales, frontierSize);
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
      false_rare_records: parseFalseRares$1().size,
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
      bottle_observations_tail: poolIndex.bottle_events.slice(-60),
      pool_timescales: compactPoolTimeScales(timescales),
      pool_recent_transitions: timescales.gaps.slice(-40),
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

// Run-cohort counting stays self-contained for direct Node regression tests.
function scratchCount(layout) {
  var seen = new Set();
  var scratches = 0;
  var _iterator = _createForOfIteratorHelper(layout.split(",")),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var part = _step.value;
      var colon = part.indexOf(":");
      if (colon < 1) return null;
      var row = Number(part.slice(0, colon));
      var symbols = part.slice(colon + 1);
      if (!Number.isInteger(row) || row < 1 || row > 10 || seen.has(row) || symbols.length !== 10 || !/^[A-Za-z?]+$/.test(symbols)) return null;
      seen.add(row);
      scratches += (symbols.match(/[cC]/g) || []).length;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return seen.size ? {
    scratches,
    visible: seen.size * 10
  } : null;
}

// Pure, passive evidence accounting: no model training or KoL actions.
// A run's front-level prediction must not be mistaken for a verified rare
// coordinate respawn when Combo falls back to an unrelated twinkle.
function plannedWasPreviouslyCombed(layout, target) {
  var _iterator2 = _createForOfIteratorHelper(String(layout || "").split(",")),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var part = _step2.value;
      var colon = part.indexOf(":");
      if (colon < 0 || Number(part.slice(0, colon)) !== target.row) continue;
      return part.slice(colon + 1).charAt(target.column) === "c";
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return false;
}
function summarizeShadowRun(source, context, endedAt, result, requested, completed, freeUsed, paidObserved) {
  // Exact-run identity avoids accidentally attributing a previous day's
  // final observation to this run after a midnight / rollover transition.
  var events = source.filter(event => {
    var _event$run_context;
    return ((_event$run_context = event.run_context) === null || _event$run_context === void 0 ? void 0 : _event$run_context.run_id) === context.run_id && event.run_context.gameday === context.gameday && event.run_context.player_id === context.player_id;
  });
  var outcomeCounts = {};
  var itemCounts = {};
  var poolCounts = {};
  var fronts = new Set();
  var ready = 0;
  var error = 0;
  var untraced = 0;
  var previouslyCombed = 0;
  var matched = 0;
  var highScratchEvents = 0;
  var veryScratchEvents = 0;
  var highScratchFronts = new Set();
  var veryScratchFronts = new Set();
  var _iterator3 = _createForOfIteratorHelper(events),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _event$pre_action_pre, _event$pre_action_pre2;
      var event = _step3.value;
      fronts.add(event.minute);
      var scratch = scratchCount(event.layout);
      if (scratch && scratch.scratches >= 6) {
        highScratchEvents++;
        highScratchFronts.add(event.minute);
      }
      if (scratch && scratch.scratches >= 11) {
        veryScratchEvents++;
        veryScratchFronts.add(event.minute);
      }
      outcomeCounts[event.outcome] = (outcomeCounts[event.outcome] || 0) + 1;
      var _iterator4 = _createForOfIteratorHelper(event.pool_observations || []),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var pool = _step4.value;
          if (pool.quantity > 0 && (pool.pool === "pool_1" || pool.pool === "pool_2")) {
            var key = "".concat(pool.pool, "/").concat(pool.kind, "/").concat(pool.certainty);
            poolCounts[key] = (poolCounts[key] || 0) + pool.quantity;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      for (var _i = 0, _Object$entries = Object.entries(event.items || {}); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          name = _Object$entries$_i[0],
          quantity = _Object$entries$_i[1];
        itemCounts[name] = (itemCounts[name] || 0) + quantity;
      }
      if ((_event$pre_action_pre = event.pre_action_prediction) !== null && _event$pre_action_pre !== void 0 && _event$pre_action_pre.error) error++;else if ((_event$pre_action_pre2 = event.pre_action_prediction) !== null && _event$pre_action_pre2 !== void 0 && _event$pre_action_pre2.score_mass) ready++;else untraced++;
      var target = event.planned_target;
      var actual = event.actual_comb;
      if (target && plannedWasPreviouslyCombed(event.layout, target)) previouslyCombed++;
      if (target && actual && target.minute === actual.minute && target.row === actual.row && target.column === actual.column) matched++;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return {
    schema: "don-combo-shadow-learning-run/v0.1",
    context,
    ended_at: endedAt,
    result,
    requested_combs: requested,
    completed_combs: completed,
    free_combs_observed: Math.max(0, freeUsed),
    paid_combs_observed: Math.max(0, paidObserved),
    recorded_events: events.length,
    events_match_completed: events.length === completed,
    prediction_ready: ready,
    prediction_error: error,
    prediction_untraced: untraced,
    planned_rare_previously_combed: previouslyCombed,
    incidental_fallback_twinkles: outcomeCounts.twinkle_fallback || 0,
    incidental_fallback_rough: outcomeCounts.rough_fallback || 0,
    planned_and_actual_match: matched,
    rare_target_attempts: outcomeCounts.rare_target || 0,
    two_pool_observation_counts: poolCounts,
    high_scratch_observations: highScratchEvents,
    very_interesting_scratch_observations: veryScratchEvents,
    high_scratch_fronts: highScratchFronts.size,
    very_interesting_scratch_fronts: veryScratchFronts.size,
    // A positive inventory change alone is insufficient to certify rare-spawn
    // recovery; see the separate per-coordinate recovery index for provenance.
    verified_rare_harvests: null,
    outcome_counts: outcomeCounts,
    item_counts: itemCounts,
    distinct_fronts_observed: fronts.size,
    note: "Passive daily cohort; fallback twinkles are not confirmed rare-tile respawns. WaterSheep scores are uncalibrated and do not update model weights."
  };
}

/* eslint-disable eqeqeq */
// Pure offline route compiler. The MODEL contributes rankings, never coordinates
// or direct KoL actions. Only listed, tide-visible corpus tiles can be executed.

var MAX_WATERSHEEP_ROUTE_COMBS = 100;

// Compiles an *already-scored* snapshot. Never requests model output or
// executes game actions here. A caller opts into paid combs explicitly.
function compileWaterSheepRoute(snapshot, corpus, falseRares, playerId, gameday, usedFree, nowEpoch, requestedCombs, freeOnly) {
  var _snapshot$watersheep;
  if (snapshot.schema !== "don-combo-matrix-runtime/v0.8-ts" || snapshot.player_id !== playerId || snapshot.gameday !== gameday || ((_snapshot$watersheep = snapshot.watersheep) === null || _snapshot$watersheep === void 0 ? void 0 : _snapshot$watersheep.status) !== "ready") throw new Error("Shadow snapshot identity, day, or WaterSheep status invalid; refresh first.");
  var stamped = Date.parse(snapshot.generated_at) / 1000;
  if (!Number.isFinite(stamped) || stamped > nowEpoch + 30 || nowEpoch - stamped > 1200) throw new Error("Shadow snapshot expired (20 minutes); refresh the relay first.");
  if (!Number.isInteger(usedFree) || usedFree < 0) throw new Error("Invalid KoLmafia free beach counter.");
  if (!Number.isInteger(requestedCombs) || requestedCombs < 1 || requestedCombs > MAX_WATERSHEEP_ROUTE_COMBS) throw new Error("WaterSheep route count must be an integer from 1 to 100.");
  var remainingFree = Math.max(0, 11 - usedFree);
  if (freeOnly && (remainingFree === 0 || requestedCombs > remainingFree)) throw new Error("Requested route exceeds available free beach combs.");
  var count = requestedCombs;
  if (!Array.isArray(snapshot.candidates) || snapshot.candidates.length < count) throw new Error("Insufficient scored candidate fronts for free-turn route.");
  var day = 1 + gameday % 8;
  var hidden = 4 - Math.abs(4 - day);
  var known = new Set(corpus.filter(t => Number.isInteger(t.minute) && t.minute >= 1 && t.minute <= 10000 && Number.isInteger(t.row) && t.row > hidden && t.row <= 10 && Number.isInteger(t.column) && t.column >= 0 && t.column <= 9 && !falseRares.has("".concat(t.minute, ",").concat(t.row, ",").concat(t.column))).map(t => "".concat(t.minute, ",").concat(t.row, ",").concat(t.column)));
  var selected = [];
  var seen = new Set();
  var previousUtility = Infinity;
  var _iterator = _createForOfIteratorHelper(snapshot.candidates),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var candidate = _step.value;
      if (selected.length === count) break;
      if (!Number.isFinite(candidate.utility) || candidate.utility == null || !candidate.watersheep || !candidate.representative) throw new Error("Unscored or invalid shadow candidate; refresh first.");
      if (candidate.utility > previousUtility + 1e-9) throw new Error("Shadow candidates are not in saved descending rank order.");
      previousUtility = candidate.utility;
      var t = candidate.representative;
      // The actual scorer emits { candidate.minute, representative:{d,x,y,row,column} }.
      // Never interpret an absent representative.minute as an invalid tile; bind
      // its row/column to the authoritative candidate.minute instead.
      if (t.minute !== undefined && t.minute !== candidate.minute) throw new Error("Shadow rank ".concat(selected.length + 1, ": representative minute conflicts with candidate front ").concat(candidate.minute, "."));
      var key = "".concat(candidate.minute, ",").concat(t.row, ",").concat(t.column);
      if (!known.has(key)) throw new Error("Shadow rank ".concat(selected.length + 1, ": front ").concat(candidate.minute, " tile ").concat(t.row, ",").concat(t.column, " is not a tide-accessible, non-false coordinate from raretiles.json."));
      if (seen.has(candidate.minute)) throw new Error("Shadow rank ".concat(selected.length + 1, ": duplicate front ").concat(candidate.minute, "."));
      seen.add(candidate.minute);
      selected.push({
        minute: candidate.minute,
        row: t.row,
        column: t.column
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (selected.length !== count) throw new Error("Not enough usable ranked candidates.");
  return selected;
}

// Backward-compatible legacy frozen relay route. It never authorizes paid combs.
function compileShadowTop11(snapshot, corpus, falseRares, playerId, gameday, usedFree, nowEpoch) {
  if (!Number.isInteger(usedFree) || usedFree < 0 || usedFree >= 11) throw new Error("No unused free beach combs remain.");
  return compileWaterSheepRoute(snapshot, corpus, falseRares, playerId, gameday, usedFree, nowEpoch, 11 - usedFree, true);
}

var _templateObject;

// Gotta print in a legible colour.
var HIGHLIGHT = kolmafia.isDarkMode() ? "yellow" : "blue";
// This is too big a data set to cram into a file
// JSON or "JavaScript Object Notation" is a way of storing JS objects in strings
// fileToBuffer is a mafia ASH function that reads .txt files into a "buffer"
// JS doesn't have buffers, so this is coered into a string
// We assert that rareTiles will be an array of BeachTiles, because this script doesn't otherwise know.
// If we didn't make this assertion, a lot of things would explode.
// Unfortunately, this can mean some bad things could happen were our data file to get messed up
var rareTiles = JSON.parse(kolmafia.fileToBuffer("raretiles.json"));

// A list of all the common items found in infreqeunt twinkles to detect when we actually combed an infrequent tile instead of a rare
var infrequentItemNames = $items(_templateObject || (_templateObject = _taggedTemplateLiteral(["sand dollar, dull fish scale, rough fish scale, lucky rabbitfish fin, spearfish fishing spear, waders, pristine fish scale, piece of coral"]))).map(item => item.name.toLowerCase());
function parseFalseRares() {
  // Get the property and split it by the divider of ;
  var knownFalseRares = kolmafia.getProperty("combo_false_rares").split(";").filter(s => s.length > 0);
  var beachTiles = knownFalseRares.map(s => {
    var _s$split$map = s.split(",").map(Number),
      _s$split$map2 = _slicedToArray(_s$split$map, 3),
      minute = _s$split$map2[0],
      row = _s$split$map2[1],
      column = _s$split$map2[2];
    return {
      minute,
      row,
      column
    };
  });
  return beachTiles;
}
var falseRares;
function getFalseRares() {
  if (!falseRares) falseRares = parseFalseRares();
  return falseRares;
}
function isFalseRare(tile) {
  return getFalseRares().some(t => tile.minute === t.minute && tile.row === t.row && tile.column === t.column);
}

// Invoked when a tile is actually an infrequent tile instead of a rare as expected
function addFalseRare(tile) {
  // If we already knew this was a false rare, skip it
  if (isFalseRare(tile)) {
    return;
  }
  var knownFalseRares = getFalseRares();

  // Push it to the list of known false rares
  knownFalseRares.push(tile);

  // Save the property
  kolmafia.setProperty("combo_false_rares", knownFalseRares.map(tile => "".concat(tile.minute, ",").concat(tile.row, ",").concat(tile.column)).join(";"));
}

// We precede the function name with an underscore to show that it's not a front, user-facing function
// In this script, really only main is, but we may port this code into libram at some point
// We'd want to export the comb function, but not _comb
var activeShadowRun = null;
var autoTraceWaterSheepRun = false;
function mlTraceEnabled() {
  return ["1", "true", "target", "on"].includes(String(kolmafia.getProperty("don_combo_ml_trace") || "").toLowerCase());
}
function captureTargetPrediction(minute, row, column) {
  if (!mlTraceEnabled() && !autoTraceWaterSheepRun) return null;
  try {
    return traceTargetPrediction(minute, row, column);
  } catch (error) {
    var message = error instanceof Error ? error.message : String(error);
    kolmafia.print("don_combo ML trace unavailable: ".concat(message, " \xB7 Combo continues normally."), "gray");
    return {
      schema: "don-combo-target-prediction/v0.1",
      generated_at: new Date().toISOString(),
      minute,
      error: message,
      authority: "none"
    };
  }
}
function sessionDelta(before) {
  var delta = Session.current().diff(before);
  var items = {};
  var _iterator = _createForOfIteratorHelper(delta.items),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        item = _step$value[0],
        quantity = _step$value[1];
      if (quantity) items[item.name] = quantity;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return {
    meat: delta.meat,
    items
  };
}
function consumeInterruptRequest() {
  if (!get("don_combo_interrupt", false)) return false;
  _set("don_combo_interrupt", false);
  _set("don_combo_last_run_interrupt_consumed", true);
  return true;
}
function _comb(tile) {
  // Here, we destructure the BeachTile object into three separate variables
  // It's going to be really tedious to write tile.minute and tile.row all the time
  // So this is nice looking
  var minute = tile.minute,
    row = tile.row,
    column = tile.column;
  if (!kolmafia.cliExecute("beach wander ".concat(minute, ";"))) throw new Error("Could not visit beach minute ".concat(minute, "; route stopped."));
  var layoutString = getString("_beachLayout");
  var preActionObservedAt = new Date().toISOString();
  kolmafia.print("DON_COMBO_OBSERVATION minute=".concat(minute, " layout=").concat(layoutString), "gray");

  // Mafia's _beachLayout property generates strings that look like
  // 4:rrrrrrrrrr,5:rrrrrrrrrr,6:rrcrrrrrcr,7:crrrrrrrrr,8:rrrrrrrrrr,9:rrrrrrrrrr,10:rrrrrrcrrr
  // We start by turning this into a multidimensional array, and then parse it as a map
  // We use maps because we want to be able to "look up" a row using its index
  var layout = new Map(layoutString.split(",").map(element => element.split(":"))
  // While you and I both know, looking at the property, that every element at this point will look like [3, ["r","r","r","r","r","r","r","r","r","r"]]
  // TypeScript doesn't know that! the "as" called a "Type Assertion", which is exactly what it sounds like
  // This way, our compiler and our IDE don't start shouting at us for things that we, the reader, know are fine.
  .map(rowLayout => [parseInt(rowLayout[0]), rowLayout[1].split("")]));
  var preActionPrediction = captureTargetPrediction(minute, row, column);
  var finishObservation = (outcome, actualRow, actualColumn, before, actionOutput) => {
    var delta = sessionDelta(before);
    recordBeachObservation(minute, layoutString, outcome, {
      planned_target: {
        minute,
        row,
        column
      },
      actual_comb: {
        minute,
        row: actualRow,
        column: actualColumn
      },
      items: delta.items,
      meat: delta.meat,
      action_output: actionOutput,
      pre_action_prediction: preActionPrediction,
      pre_action_observed_at: preActionObservedAt,
      run_context: activeShadowRun
    });
  };

  // the Array.find() method returnns either an element of the array that fits, or undefined
  // We convert our Map to an Array here to use the .find() method
  // We check for a whale here just because wouldn't it be neat if we had a whale?
  var whaleRow = Array.from(layout.entries()).find(rowLayout => rowLayout[1].includes("W"));
  if (whaleRow) {
    // Mafia inexplicably indexes columns starting at 0, and rows starting at 1
    // This is beneficial to us! Arrays are indexed starting at 1, so .findIndex() gets us just what we want
    var whaleColumn = whaleRow[1].findIndex(x => x === "W");
    kolmafia.print("We found a whale. To hey deze's heart, we'll stab at it.", "red");
    var _before = Session.current();
    var _output = kolmafia.cliExecuteOutput("beach comb ".concat(whaleRow[0], " ").concat(whaleColumn));
    finishObservation("whale", whaleRow[0], whaleColumn, _before, _output);
    // By returning partway through, we avoid needing to use "else"
    // With the exception of try...finally shenanigans, using the return keyword will just immediately terminate the function
    return;
  }
  var rareRow = layout.get(row);
  if (rareRow) {
    var falseRareRough = false;
    // Here we make sure that the tile we were going to comb wasn't actually rough sand
    // This uses `hasTwinkleVision` which was added in r27618, but this is not required.
    if (get("hasTwinkleVision", false) && rareRow[column] === "r") {
      kolmafia.print("Although our rare tile was uncombed, it is actually rough sand. Lets avoid this tile in the future.", HIGHLIGHT);
      // Note that it is not a rare tile, then invoke a function to add it to the false rares
      addFalseRare(tile);
      falseRareRough = true;
    }

    // Here we make sure that the tile we were going to comb wasn't already combed
    if (rareRow[column] !== "c") {
      kolmafia.print("Our rare tile is uncombed, so let's go ahead and change that.", "red");
      // Grab the output of our comb and lowercase the resulting text
      var _before2 = Session.current();
      var actionOutput = kolmafia.cliExecuteOutput("beach comb ".concat(row, " ").concat(column));
      var _output2 = actionOutput.toLowerCase();

      // We exclude grain of sand as it means we didn't comb a twinkle as expected
      // We check if the output contained an item only found in infrequent twinkles
      // If it did contain such an item, it means this tile was not actually a rare
      var hasCommonItem = !_output2.includes("grain of sand") && infrequentItemNames.some(name => _output2.includes(name));

      // If it was not actually a rare, invoke a function to add it to a list of known false rares
      if (hasCommonItem) {
        addFalseRare(tile);
      }
      finishObservation(falseRareRough ? "false_rare_rough" : hasCommonItem ? "false_rare_item" : "rare_target", row, column, _before2, actionOutput);
      return;
    }
  }
  var firstTwinkleRow = Array.from(layout.entries()).find(rowLayout => rowLayout[1].includes("t"));
  if (firstTwinkleRow) {
    kolmafia.print("Our rare tile is combed, but we found a twinkle!", HIGHLIGHT);
    var twinkleColumn = firstTwinkleRow[1].findIndex(x => x === "t");
    var _before3 = Session.current();
    var _output3 = kolmafia.cliExecuteOutput("beach comb ".concat(firstTwinkleRow[0], " ").concat(twinkleColumn));
    finishObservation("twinkle_fallback", firstTwinkleRow[0], twinkleColumn, _before3, _output3);
    return;
  }
  var firstRoughRow = Array.from(layout.entries()).find(rowLayout => rowLayout[1].includes("r"));
  if (firstRoughRow) {
    kolmafia.print("Our rare tile is combed, but we found some rough sand. So I guess there's that.", HIGHLIGHT);
    var roughcolumn = firstRoughRow[1].findIndex(x => x === "r");
    var _before4 = Session.current();
    var _output4 = kolmafia.cliExecuteOutput("beach comb ".concat(firstRoughRow[0], " ").concat(roughcolumn));
    finishObservation("rough_fallback", firstRoughRow[0], roughcolumn, _before4, _output4);
    return;
  }
  kolmafia.print("We've exhausted all other options, so we're combing an already-combed tile.", HIGHLIGHT);
  var before = Session.current();
  var output = kolmafia.cliExecuteOutput("beach comb ".concat(row, " ").concat(column));
  finishObservation("exhausted_fallback", row, column, before, output);
}

// Alright now this is pretty cool
// We need a way to shuffle the array deterministically--we want it to have the same order for every player every time
// Obviously what that means is that we seed it by player id.
// Have you ever shoved an integer into the sine function? It's nasty
// This isn't super duper random. But it's random enough!
var seed = parseInt(kolmafia.myId());
function deterministicRandom() {
  seed++;
  return Math.sin(seed);
}

// Here, we disassemble the old array while constructing a new one.
// We pull a random card from the deck, put it on top of the new stack.
// Repeat ad infinitum
// If this was a more rigorous script, maybe we'd want to copy the input array so we don't destroy it
// For this script, meh
function deterministicShuffle(array) {
  var returnValue = [];
  while (array.length > 0) {
    var index = Math.floor(deterministicRandom() * array.length);
    returnValue.push.apply(returnValue, _toConsumableArray(array.splice(index)));
  }
  return returnValue;
}
var shuffledArray;
function getShuffledArray() {
  if (!shuffledArray) {
    shuffledArray = deterministicShuffle(rareTiles);
  }
  return shuffledArray;
}

// This comb function returns a boolean value based on whether we actually end up coming
// We predict whether the tile in question will be hidden by the tides, and if it will, we just don't go!
function comb() {
  var tileList = getShuffledArray();
  var index = (get("combo_lastTileCombed", 0) + 1) % tileList.length;
  var tile = tileList[index];

  // This little bit of tech comes from SSBBHax
  // The tides are on an 8-day cycle
  // We have 8-day months on the in-game calendar
  // Turns out to work out nicely!
  var dayOfMonth = 1 + kolmafia.gamedayToInt() % 8;
  var rowsHidden = 4 - Math.abs(4 - dayOfMonth);
  var rowVisible = tile.row > rowsHidden;

  // If the row is visible and this has not been observed as a false rare
  var shouldComb = rowVisible && !isFalseRare(tile);
  if (shouldComb) _comb(tile);

  // We increment our lastTileCombed regardless of whether we actually comb it
  // This isn't best beheavior, but it isn't worst!
  _set("combo_lastTileCombed", index);
  return shouldComb;
}

// A relay confirmation selects a pre-scored local same-player/day snapshot.
// No model inference runs during execution, and the model cannot supply coordinates.
function loadShadowTop11Route(requestedCombs) {
  var freeOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var raw = String(kolmafia.fileToBuffer("don_combo_matrix_runtime.json") || "");
  if (!raw) kolmafia.abort("No frozen Shadow Route Lab snapshot; refresh first.");
  var snapshot = JSON.parse(raw);
  var invalid = new Set(getFalseRares().map(tile => "".concat(tile.minute, ",").concat(tile.row, ",").concat(tile.column)));
  var parameters = [snapshot, rareTiles, invalid, Number(kolmafia.myId()), kolmafia.gamedayToInt(), get("_freeBeachWalksUsed", 0), Date.now() / 1000];
  return requestedCombs === undefined ? compileShadowTop11.apply(void 0, parameters) : compileWaterSheepRoute.apply(void 0, parameters.concat([requestedCombs, freeOnly]));
}
function printSession(session) {
  var items = _toConsumableArray(session.items);

  // Sorts the items to be printed from most profitable, to least
  items.sort((_ref, _ref2) => {
    var _ref3 = _slicedToArray(_ref, 2),
      item1 = _ref3[0],
      amount1 = _ref3[1];
    var _ref4 = _slicedToArray(_ref2, 2),
      item2 = _ref4[0],
      amount2 = _ref4[1];
    return kolmafia.historicalPrice(item2) * amount2 - kolmafia.historicalPrice(item1) * amount1;
  });
  kolmafia.print("-Found ".concat(session.meat, " meat"));
  var _iterator2 = _createForOfIteratorHelper(items),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = _slicedToArray(_step2.value, 2),
        item = _step2$value[0],
        quantity = _step2$value[1];
      kolmafia.print("-Found ".concat(quantity, " ").concat(item));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

// When called from the CLI, this will only ever have string inputs
// We use string | number so that people can call this directly from other scripts, should they so desire
// Realistically, everyone will do the CLI option. But it costs us nothing!
function main(args) {
  // Sometimes people try to run things with insanely old mafia versions and run into problems
  // Think of this as babyproofing
  sinceKolmafiaRevision(26118);
  if (args === "lifetime") {
    var _lifetime = Session.fromFile("combo_results.json");
    kolmafia.print("===LIFETIME RESULTS ===");
    printSession(_lifetime);
    return;
  }
  if (args === "watersheep-preview") {
    // Read-only relay validation. It cannot wander, comb or request paid actions.
    kolmafia.setProperty("don_combo_shadow11_preview_status", "blocked");
    kolmafia.setProperty("don_combo_shadow11_preview_snapshot", "");
    try {
      if (get("don_combo_running", false)) throw new Error("Combo is already running.");
      var route = loadShadowTop11Route();
      var snapshot = JSON.parse(String(kolmafia.fileToBuffer("don_combo_matrix_runtime.json")));
      kolmafia.setProperty("don_combo_shadow11_preview_status", "ready");
      kolmafia.setProperty("don_combo_shadow11_preview_snapshot", snapshot.generated_at);
      kolmafia.setProperty("don_combo_shadow11_preview_message", "Ready: ".concat(route.length, " free-only WaterSheep targets from snapshot ").concat(snapshot.generated_at, "."));
      kolmafia.print("WaterSheep preview: ".concat(route.length, " ranked free combs available; no KoL actions taken."));
    } catch (error) {
      var message = error instanceof Error ? error.message : String(error);
      kolmafia.setProperty("don_combo_shadow11_preview_message", message);
      kolmafia.print("WaterSheep preview blocked: ".concat(message), "red");
    }
    return;
  }

  // Use a wrapper around session tracking to record our results
  // We do this by first tracking what the session results are right now
  // Later, we will subtract these items and meat from our final results
  if (get("don_combo_running", false)) kolmafia.abort("Another Combo run is already active.");
  var rawArg = typeof args === "string" ? args.trim() : args;
  var shadow11 = rawArg === "shadow11";
  var wsFree = rawArg === "watersheep-free";
  var wsPaidMatch = typeof rawArg === "string" ? /^watersheep-([1-9][0-9]*)$/.exec(rawArg) : null;
  var wsPaid = wsPaidMatch !== null;
  if (typeof rawArg === "string" && rawArg.startsWith("watersheep-") && !wsFree && !wsPaid) kolmafia.abort("Expected 'watersheep-free' or 'watersheep-<positive count>'.");
  var freeRemaining = Math.max(0, 11 - get("_freeBeachWalksUsed", 0));
  var wsCount = wsFree ? freeRemaining : wsPaid ? Number(wsPaidMatch[1]) : 0;
  if ((wsFree || wsPaid) && (!Number.isInteger(wsCount) || wsCount < 1 || wsCount > MAX_WATERSHEEP_ROUTE_COMBS)) kolmafia.abort(wsFree ? "No free beach combs remain." : "WaterSheep route must request 1–100 combs.");
  if (wsPaid && wsCount > freeRemaining + kolmafia.myAdventures()) kolmafia.abort("Insufficient remaining free combs and adventures for this explicit paid route.");
  if (wsFree || wsPaid) {
    kolmafia.print("WaterSheep: pre-scoring ".concat(wsCount, " rare-front targets (").concat(wsFree ? "free-only" : "adventure-cost allowed", ")..."), HIGHLIGHT);
    prepareWaterSheepRoute(wsCount);
  }
  var frozenRoute = shadow11 ? loadShadowTop11Route() : wsFree || wsPaid ? loadShadowTop11Route(wsCount, wsFree) : null;
  var routeMode = wsPaid ? "watersheep-paid" : wsFree || shadow11 ? "watersheep-free" : "combo-default";
  var freeOnly = wsFree || shadow11;
  var baseline = Session.current();

  // Here we collapse our two possibilities into one
  // If args is already a number, combs is a number
  // If args is a string, we convert it to a number
  var combs = frozenRoute ? frozenRoute.length : typeof args === "string" ? parseInt(args) : args ?? 11 - get("_freeBeachWalksUsed");
  if (!Number.isInteger(combs) || isNaN(combs)) kolmafia.abort("Invalid argument!");
  if (combs <= 0) return;
  var oldFilter = get("logPreferenceChangeFilter");
  _set("don_combo_interrupt", false);
  _set("don_combo_running", true);
  _set("don_combo_last_run_status", "running");
  _set("don_combo_last_run_requested", combs);
  _set("don_combo_last_run_route_mode", routeMode);
  _set("don_combo_last_run_paid_combs", 0);
  _set("don_combo_last_run_combs", 0);
  _set("don_combo_last_run_end_reason", "running");
  _set("don_combo_last_run_interrupt_consumed", false);
  _set("don_combo_last_run_started_at", new Date().toISOString());
  _set("don_combo_last_run_ended_at", "");
  _set("don_combo_last_run_ml_events_before", loadMlTraceEvents(0).total);
  _set("don_combo_last_run_ml_events_after", loadMlTraceEvents(0).total);
  _set("logPreferenceChangeFilter", _toConsumableArray(new Set([].concat(_toConsumableArray(oldFilter.split(",")), ["spadingData", "combo_lastTileCombed", "_beachLayout", "_beachMinutes", "_beachCombing", "don_combo_interrupt", "don_combo_running", "don_combo_last_run_status", "don_combo_last_run_requested", "don_combo_last_run_route_mode", "don_combo_last_run_paid_combs", "don_combo_last_run_combs", "don_combo_last_run_end_reason", "don_combo_last_run_interrupt_consumed", "don_combo_last_run_started_at", "don_combo_last_run_ended_at", "don_combo_last_run_ml_events_before", "don_combo_last_run_ml_events_after"]))).filter(x => x).join(","));
  var frozenPlayer = Number(kolmafia.myId());
  var frozenGameday = kolmafia.gamedayToInt();
  var runContext = {
    run_id: "".concat(frozenGameday, "-").concat(frozenPlayer, "-").concat(Date.now()),
    gameday: frozenGameday,
    player_id: frozenPlayer,
    route_mode: routeMode,
    started_at: kolmafia.getProperty("don_combo_last_run_started_at")
  };
  var freeBefore = get("_freeBeachWalksUsed", 0);
  activeShadowRun = runContext;
  // Routed WaterSheep gets a pre-action prediction per target automatically;
  // vanilla Combo keeps the existing opt-in don_combo_ml_trace property.
  autoTraceWaterSheepRun = shadow11 || wsFree || wsPaid;
  var completedCombs = 0;
  var interrupted = false;
  var cleanFinish = false;
  try {
    while (completedCombs < combs) {
      // A relay interrupt is cooperative: never cut through an in-flight comb.
      // If the request arrives between combs, stop before starting another one.
      if (consumeInterruptRequest()) {
        interrupted = true;
        break;
      }
      if (frozenRoute) {
        // Free-only guard at the exact action boundary. A changed counter
        // can never authorize paid turns or an unplanned tile.
        var before = get("_freeBeachWalksUsed", 0);
        var beforeAdventures = kolmafia.myAdventures();
        if (freeOnly && (before < 0 || before >= 11)) throw new Error("No free combs remain; paid comb prevented.");
        if (!freeOnly && before >= 11 && beforeAdventures < 1) throw new Error("No adventures remain for a paid beach comb.");
        var target = frozenRoute[completedCombs];
        if (!target || kolmafia.gamedayToInt() !== frozenGameday || Number(kolmafia.myId()) !== frozenPlayer) throw new Error("Shadow route day/player changed during execution.");
        _comb(target);
        var after = get("_freeBeachWalksUsed", 0);
        var afterAdventures = kolmafia.myAdventures();
        var freeSpent = after === before + 1;
        var paidSpent = afterAdventures < beforeAdventures;
        if (freeOnly && (!freeSpent || paidSpent)) throw new Error("Free-only action could not be verified; stopping.");
        if (!freeOnly && !freeSpent && !paidSpent) throw new Error("No verified beach comb or adventure spend; stopping.");
        if (paidSpent) _set("don_combo_last_run_paid_combs", get("don_combo_last_run_paid_combs", 0) + 1);
        completedCombs++;
      } else {
        // Preserve normal Combo's deterministic shuffled rare route.
        if (comb()) completedCombs++;
      }

      // If the request arrived during the comb, the observation/loot trace has
      // already been finalized. Stop here before beginning the next target.
      if (consumeInterruptRequest()) {
        interrupted = true;
        break;
      }
    }
    if (interrupted) {
      kolmafia.print("don_combo: interrupt received; ending cleanly after ".concat(completedCombs, " completed comb").concat(completedCombs === 1 ? "" : "s", "."), HIGHLIGHT);
    }

    // Always leave the Beach choice cleanly, including cooperative interrupts.
    if (kolmafia.handlingChoice()) kolmafia.runChoice(5);
    if (get("spadingScript").toLowerCase().includes("excavator")) kolmafia.cliExecute("spade autoconfirm");
    cleanFinish = true;
  } finally {
    _set("logPreferenceChangeFilter", oldFilter);
    _set("don_combo_running", false);
    _set("don_combo_interrupt", false);
    _set("don_combo_last_run_combs", completedCombs);
    _set("don_combo_last_run_status", cleanFinish ? interrupted ? "interrupted" : "completed" : "failed");
    _set("don_combo_last_run_end_reason", cleanFinish ? interrupted ? "user_cooperative_interrupt" : "requested_combs_completed" : "runtime_failure");
    _set("don_combo_last_run_ended_at", new Date().toISOString());
    _set("don_combo_last_run_ml_events_after", loadMlTraceEvents(0).total);
    try {
      var tail = loadMlTraceEvents(Math.max(100, completedCombs + 12)).events;
      var learned = summarizeShadowRun(tail, runContext, kolmafia.getProperty("don_combo_last_run_ended_at"), cleanFinish ? interrupted ? "interrupted" : "completed" : "failed", combs, completedCombs, get("_freeBeachWalksUsed", 0) - freeBefore, get("don_combo_last_run_paid_combs", 0));
      kolmafia.appendBufferToFile("".concat(JSON.stringify(learned), "\n"), "don_combo_daily_shadow_runs.jsonl");
      kolmafia.setProperty("don_combo_last_learning_run_id", runContext.run_id);
      kolmafia.setProperty("don_combo_last_learning_traced", String(learned.prediction_ready));
      kolmafia.setProperty("don_combo_last_learning_events", String(learned.recorded_events));
      kolmafia.print("Shadow learning: ".concat(learned.recorded_events, "/").concat(completedCombs, " events, ").concat(learned.prediction_ready, " pre-action predictions, ").concat(learned.incidental_fallback_twinkles, " incidental twinkle fallbacks, ").concat(learned.planned_rare_previously_combed, " previously-combed rare targets (no model training or extra beach turns)."), "gray");
    } catch (error) {
      kolmafia.print("don_combo: daily shadow learning summary unavailable: ".concat(error instanceof Error ? error.message : String(error)), "gray");
    } finally {
      autoTraceWaterSheepRun = false;
      activeShadowRun = null;
    }
  }

  // Subtract the original session from our current session
  // the resulting session will only have what we found during combo
  var final = Session.current().diff(baseline);
  if (interrupted) kolmafia.print("=== INTERRUPTED CLEANLY ===", HIGHLIGHT);
  kolmafia.print("=== RESULTS ===");
  printSession(final);
  var lifetime = Session.add(final, Session.fromFile("combo_results.json"));
  lifetime.toFile("combo_results.json");
}

exports.main = main;
