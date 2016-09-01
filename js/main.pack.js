/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _game = __webpack_require__(1);
	
	var _theme = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	(function () {
		var app = angular.module('CodeGoblins', ['ui.router']);
	
		app.config(function ($stateProvider, $urlRouterProvider) {
	
			$urlRouterProvider.otherwise('/');
	
			$stateProvider.state('app', {
				abstract: true,
				views: {
					'footer': {
						templateUrl: 'game/footer.html'
					}
				}
			}).state('app.select', {
				url: '/',
				views: {
					'content@': {
						templateUrl: 'game/select.html'
					}
				}
			}).state('app.spy-master', {
				url: '/sm',
				views: {
					'content@': {
						templateUrl: 'game/spy-master.html',
						controller: SpyMasterController
					}
				}
			}).state('app.game-board', {
				url: '/game',
				views: {
					'content@': {
						templateUrl: 'game/game.html',
						controller: GameController
					}
				}
			}).state('app.instructions', {
				url: '/instructions',
				views: {
					'content@': {
						templateUrl: 'game/instructions.html'
					}
				}
			});
		});
	})();
	
	var GameController = function GameController($scope) {
		_classCallCheck(this, GameController);
	
		$scope.game = new _game.Game();
		$scope.showMasterCode = true;
	
		$scope.newGame = function () {
			$scope.game = new _game.Game();
			$scope.showMasterCode = true;
		};
	
		$scope.hideMasterCode = function () {
			$scope.showMasterCode = false;
		};
	};
	
	var SpyMasterController = function SpyMasterController($scope) {
		_classCallCheck(this, SpyMasterController);
	
		$scope.loadGame = function () {
			$scope.error = '';
			$scope.master = new _game.MasterGrid($scope.masterCode);
			if (!$scope.master.valid) {
				$scope.error = 'Invalid Game Code';
			} else {
				$scope.initialized = true;
			}
		};
	
		$scope.newGame = function () {
			$scope.master = null;
			$scope.masterCode = '';
			$scope.error = '';
			$scope.initialized = false;
		};
	
		$scope.newGame();
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MasterGrid = exports.Game = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _words = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var total_grid_items = 25;
	var grid_height = 5;
	var grid_width = 5;
	var total_red_needs_to_win = 8;
	var total_blue_needs_to_win = 7;
	var total_greys = 9;
	var total_blacks = 1;
	
	var codex = {
		'grey': 0,
		'red': 1,
		'blue': 2,
		'black': 3
	};
	
	var codex_key = ['grey', 'red', 'blue', 'black'];
	
	var Game = exports.Game = function () {
		function Game() {
			_classCallCheck(this, Game);
	
			this.grid = new GameGrid();
			this.rows = this.grid.getRows();
	
			this.gameOver = false;
			this.remainingReds = total_red_needs_to_win;
			this.remainingBlues = total_blue_needs_to_win;
	
			this.keyUrl = this.grid.encode();
		}
	
		_createClass(Game, [{
			key: 'select',
			value: function select(x, y) {
				var tile = this.grid.at(x, y);
	
				if (!this.gameOver && !tile.chosen) {
					var team = tile.team;
					tile.chosen = true;
	
					if (team == 'black') {
						this.gameOver = true;
						this.winner = 'black';
					} else {
	
						if (team == 'red') {
							this.remainingReds--;
							if (this.remainingReds == 0) {
								this.winner = 'red';
								this.gameOver = true;
							}
						} else if (team == 'blue') {
							this.remainingBlues--;
							if (this.remainingBlues == 0) {
								this.winner = 'blue';
								this.gameOver = true;
							}
						}
					}
				}
			}
		}]);
	
		return Game;
	}();
	
	var GameGrid = function () {
		function GameGrid() {
			_classCallCheck(this, GameGrid);
	
			var grid = new Array(5);
	
			var words = GameGrid.generateWords();
			words = GameGrid.shuffle(words);
	
			var position = 0;
			for (var x = 0; x < grid_width; x++) {
				grid[x] = new Array(grid_height);
	
				for (var y = 0; y < 5; y++) {
					grid[x][y] = {
						word: words[position],
						chosen: false
					};
					position++;
				}
			}
	
			grid = GameGrid.assignWordsToTeams(grid);
	
			this._grid = grid;
		}
	
		_createClass(GameGrid, [{
			key: 'at',
			value: function at(x, y) {
				return this._grid[x][y];
			}
		}, {
			key: 'getRows',
			value: function getRows() {
				return this._grid;
			}
	
			// Encodes the team for each tile (4 possible "teams" -> 2 bits needed)
			// we need 50 bits total for a 5x5 grid (so 2 32-bit integers)
			// avoid the top 2 bits since JS uses signed integers
			// encoded_hi will have the first 3 rows (30 bits), and encoded_lo the bottom 2 (20 bits)
			// the result is 2 base-36 strings separated by a '.' to have the smallest character representation
	
		}, {
			key: 'encode',
			value: function encode() {
				var encoded_hi = 0;
				var encoded_lo = 0;
				var total = 0;
	
				for (var x = 0; x < grid_width; x++) {
					var row = this._grid[x];
					row.forEach(function (item) {
						if (total < 30) {
							encoded_hi = encoded_hi << 2 | codex[item.team];
						} else {
							encoded_lo = encoded_lo << 2 | codex[item.team];
						}
						total += 2;
					});
				}
				return encoded_hi.toString(36) + '.' + encoded_lo.toString(36);
			}
		}], [{
			key: 'assignWordsToTeams',
			value: function assignWordsToTeams(grid) {
				var reds = total_red_needs_to_win,
				    blues = total_blue_needs_to_win,
				    greys = total_greys,
				    blacks = total_blacks;
	
				var positionsList = [];
				for (var i = 0; i < total_grid_items; i++) {
					positionsList[i] = i;
				}
	
				positionsList = GameGrid.shuffle(positionsList);
	
				var assignTeam = function assignTeam(team, start, total) {
					for (var i = start; i < total + start; i++) {
						var pos = positionsList[i];
	
						var x = Math.floor(pos / grid_width);
						var y = pos % grid_width;
	
						grid[x][y].team = team;
					}
				};
	
				assignTeam('red', 0, reds);
				assignTeam('blue', reds, blues);
				assignTeam('grey', reds + blues, greys);
				assignTeam('black', reds + blues + greys, blacks);
	
				return grid;
			}
		}, {
			key: 'generateWords',
			value: function generateWords() {
				var total = 0;
				var words = [];
	
				var indices = [];
				while (indices.length < total_grid_items) {
					var randomnumber = Math.floor(Math.random() * _words.words.length);
					var found = false;
					for (var i = 0; i < indices.length; i++) {
						if (indices[i] == randomnumber) {
							found = true;
							break;
						}
					}
					if (!found) indices.push(randomnumber);
				}
	
				indices.forEach(function (i) {
					words.push(_words.words[i]);
				});
	
				return words;
			}
	
			// Durstenfeld Shuffle
	
		}, {
			key: 'shuffle',
			value: function shuffle(array) {
				for (var i = array.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var temp = array[i];
					array[i] = array[j];
					array[j] = temp;
				}
				return array;
			}
		}]);
	
		return GameGrid;
	}();
	
	var MasterGrid = exports.MasterGrid = function () {
		function MasterGrid(encoded) {
			_classCallCheck(this, MasterGrid);
	
			this.rows = MasterGrid.decodeGrid(encoded);
			this.valid = !!this.rows;
		}
	
		_createClass(MasterGrid, null, [{
			key: 'decodeGrid',
			value: function decodeGrid(encoded) {
				if (encoded && typeof encoded == 'string') {
					var encoded_parts = encoded.split('.');
					var encoded_hi = encoded_parts[0],
					    encoded_lo = encoded_parts[1];
	
					// Encoded Hi: the top 30 bits (first 15 cards - [0,0]-[2,4])
					// Encoded Lo: the bottom 20 bits (last 9 cards - [3,0]-[4,4])
					encoded_hi = parseInt(encoded_hi, 36);
					encoded_lo = parseInt(encoded_lo, 36);
	
					var teams = [],
					    teams_hi = [],
					    teams_lo = [];
	
					for (var i = 0; i < total_grid_items; i++) {
						var bits = 0;
	
						if (i < 15) {
							bits = encoded_hi & 3;
							encoded_hi = encoded_hi >>> 2;
							teams_hi.push(codex_key[bits]);
						} else {
							bits = encoded_lo & 3;
							encoded_lo = encoded_lo >>> 2;
							teams_lo.push(codex_key[bits]);
						}
					}
					teams = teams.concat(teams_hi.reverse());
					teams = teams.concat(teams_lo.reverse());
	
					var _grid = new Array(5);
	
					var _position = 0;
					var teamTotals = {
						'red': 0,
						'blue': 0,
						'grey': 0,
						'black': 0
					};
	
					for (var x = 0; x < grid_height; x++) {
						_grid[x] = new Array(grid_width);
	
						for (var y = 0; y < grid_width; y++) {
							var team = teams[_position];
	
							_grid[x][y] = {
								team: team
							};
							teamTotals[team]++;
							_position++;
						}
					}
	
					if (MasterGrid.verifyGameTotals(teamTotals)) {
						return _grid;
					} else {
						return null;
					}
				} else {
					return null;
				}
			}
		}, {
			key: 'verifyGameTotals',
			value: function verifyGameTotals(totals) {
				return totals['red'] == total_red_needs_to_win && totals['blue'] == total_blue_needs_to_win && totals['grey'] == total_greys && totals['black'] == total_blacks;
			}
		}]);

		return MasterGrid;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
		"words": [
			"AFRICA",
			"AGENT",
			"AIR",
			"ALIEN",
			"ALPS",
			"AMAZON",
			"AMBULANCE",
			"AMERICA",
			"ANGEL",
			"ANTARCTICA",
			"APPLE",
			"ARM",
			"ATLANTIS",
			"AUSTRALIA",
			"AZTEC",
			"BACK",
			"BALL",
			"BAND",
			"BANK",
			"BAR",
			"BARK",
			"BAT",
			"BATTERY",
			"BEACH",
			"BEAR",
			"BEAT",
			"BED",
			"BEIJING",
			"BELL",
			"BELT",
			"BERLIN",
			"BERMUDA",
			"BERRY",
			"BILL",
			"BLOCK",
			"BOARD",
			"BOLT",
			"BOMB",
			"BOND",
			"BOOM",
			"BOOT",
			"BOTTLE",
			"BOW",
			"BOX",
			"BRIDGE",
			"BRUSH",
			"BUCK",
			"BUFFALO",
			"BUG",
			"BUGLE",
			"BUTTON",
			"CALF",
			"CANADA",
			"CAP",
			"CAPITAL",
			"CAR",
			"CARD",
			"CARROT",
			"CASINO",
			"CAST",
			"CAT",
			"CELL",
			"CENTAUR",
			"CENTER",
			"CHAIR",
			"CHANGE",
			"CHARGE",
			"CHECK",
			"CHEST",
			"CHICK",
			"CHINA",
			"CHOCOLATE",
			"CHURCH",
			"CIRCLE",
			"CLIFF",
			"CLOAK",
			"CLUB",
			"CODE",
			"COLD",
			"COMIC",
			"COMPOUND",
			"CONCERT",
			"CONDUCTOR",
			"CONTRACT",
			"COOK",
			"COPPER",
			"COTTON",
			"COURT",
			"COVER",
			"CRANE",
			"CRASH",
			"CRICKET",
			"CROSS",
			"CROWN",
			"CYCLE",
			"CZECH",
			"DANCE",
			"DATE",
			"DAY",
			"DEATH",
			"DECK",
			"DEGREE",
			"DIAMOND",
			"DICE",
			"DINOSAUR",
			"DISEASE",
			"DOCTOR",
			"DOG",
			"DRAFT",
			"DRAGON",
			"DRESS",
			"DRILL",
			"DROP",
			"DUCK",
			"DWARF",
			"EAGLE",
			"EGYPT",
			"EMBASSY",
			"ENGINE",
			"ENGLAND",
			"EUROPE",
			"EYE",
			"FACE",
			"FAIR",
			"FALL",
			"FAN",
			"FENCE",
			"FIELD",
			"FIGHTER",
			"FIGURE",
			"FILE",
			"FILM",
			"FIRE",
			"FISH",
			"FLUTE",
			"FLY",
			"FOOT",
			"FORCE",
			"FOREST",
			"FORK",
			"FRANCE",
			"GAME",
			"GAS",
			"GENIUS",
			"GERMANY",
			"GHOST",
			"GIANT",
			"GLASS",
			"GLOVE",
			"GOLD",
			"GRACE",
			"GRASS",
			"GREECE",
			"GREEN",
			"GROUND",
			"HAM",
			"HAND",
			"HAWK",
			"HEAD",
			"HEART",
			"HELICOPTER",
			"HIMALAYAS",
			"HOLE",
			"HOLLYWOOD",
			"HONEY",
			"HOOD",
			"HOOK",
			"HORN",
			"HORSE",
			"HORSESHOE",
			"HOSPITAL",
			"HOTEL",
			"ICE",
			"ICE CREAM",
			"INDIA",
			"IRON",
			"IVORY",
			"JACK",
			"JAM",
			"JET",
			"JUPITER",
			"KANGAROO",
			"KETCHUP",
			"KEY",
			"KID",
			"KING",
			"KIWI",
			"KNIFE",
			"KNIGHT",
			"LAB",
			"LAP",
			"LASER",
			"LAWYER",
			"LEAD",
			"LEMON",
			"LEPRECHAUN",
			"LIFE",
			"LIGHT",
			"LIMOUSINE",
			"LINE",
			"LINK",
			"LION",
			"LITTER",
			"LOCH NESS",
			"LOCK",
			"LOG",
			"LONDON",
			"LUCK",
			"MAIL",
			"MAMMOTH",
			"MAPLE",
			"MARBLE",
			"MARCH",
			"MASS",
			"MATCH",
			"MERCURY",
			"MEXICO",
			"MICROSCOPE",
			"MILLIONAIRE",
			"MINE",
			"MINT",
			"MISSILE",
			"MODEL",
			"MOLE",
			"MOON",
			"MOSCOW",
			"MOUNT",
			"MOUSE",
			"MOUTH",
			"MUG",
			"NAIL",
			"NEEDLE",
			"NET",
			"NEW YORK",
			"NIGHT",
			"NINJA",
			"NOTE",
			"NOVEL",
			"NURSE",
			"NUT",
			"OCTOPUS",
			"OIL",
			"OLIVE",
			"OLYMPUS",
			"OPERA",
			"ORANGE",
			"ORGAN",
			"PALM",
			"PAN",
			"PANTS",
			"PAPER",
			"PARACHUTE",
			"PARK",
			"PART",
			"PASS",
			"PASTE",
			"PENGUIN",
			"PHOENIX",
			"PIANO",
			"PIE",
			"PILOT",
			"PIN",
			"PIPE",
			"PIRATE",
			"PISTOL",
			"PIT",
			"PITCH",
			"PLANE",
			"PLASTIC",
			"PLATE",
			"PLATYPUS",
			"PLAY",
			"PLOT",
			"POINT",
			"POISON",
			"POLE",
			"POLICE",
			"POOL",
			"PORT",
			"POST",
			"POUND",
			"PRESS",
			"PRINCESS",
			"PUMPKIN",
			"PUPIL",
			"PYRAMID",
			"QUEEN",
			"RABBIT",
			"RACKET",
			"RAY",
			"REVOLUTION",
			"RING",
			"ROBIN",
			"ROBOT",
			"ROCK",
			"ROME",
			"ROOT",
			"ROSE",
			"ROULETTE",
			"ROUND",
			"ROW",
			"RULER",
			"SATELLITE",
			"SATURN",
			"SCALE",
			"SCHOOL",
			"SCIENTIST",
			"SCORPION",
			"SCREEN",
			"SCUBA DIVER",
			"SEAL",
			"SERVER",
			"SHADOW",
			"SHAKESPEARE",
			"SHARK",
			"SHIP",
			"SHOE",
			"SHOP",
			"SHOT",
			"SINK",
			"SKYSCRAPER",
			"SLIP",
			"SLUG",
			"SMUGGLER",
			"SNOW",
			"SNOWMAN",
			"SOCK",
			"SOLDIER",
			"SOUL",
			"SOUND",
			"SPACE",
			"SPELL",
			"SPIDER",
			"SPIKE",
			"SPINE",
			"SPOT",
			"SPRING",
			"SPY",
			"SQUARE",
			"STADIUM",
			"STAFF",
			"STAR",
			"STATE",
			"STICK",
			"STOCK",
			"STRAW",
			"STREAM",
			"STRIKE",
			"STRING",
			"SUB",
			"SUIT",
			"SUPERHERO",
			"SWING",
			"SWITCH",
			"TABLE",
			"TABLET",
			"TAG",
			"TAIL",
			"TAP",
			"TEACHER",
			"TELESCOPE",
			"TEMPLE",
			"THEATER",
			"THIEF",
			"THUMB",
			"TICK",
			"TIE",
			"TIME",
			"TOKYO",
			"TOOTH",
			"TORCH",
			"TOWER",
			"TRACK",
			"TRAIN",
			"TRIANGLE",
			"TRIP",
			"TRUNK",
			"TUBE",
			"TURKEY",
			"UNDERTAKER",
			"UNICORN",
			"VACUUM",
			"VAN",
			"VET",
			"WAKE",
			"WALL",
			"WAR",
			"WASHER",
			"WASHINGTON",
			"WATCH",
			"WATER",
			"WAVE",
			"WEB",
			"WELL",
			"WHALE",
			"WHIP",
			"WIND",
			"WITCH",
			"WORM",
			"YARD"
		]
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Theme = exports.Theme = function () {
		function Theme() {
			_classCallCheck(this, Theme);
		}
	
		_createClass(Theme, null, [{
			key: 'configure',
			value: function configure($mdThemingProvider) {
				var customPrimary = {
					'50': '#528ebb',
					'100': '#4581af',
					'200': '#3e739d',
					'300': '#36668b',
					'400': '#2f5878',
					'500': '#284B66',
					'600': '#213e54',
					'700': '#1a3041',
					'800': '#12232f',
					'900': '#0b151d',
					'A100': '#659ac2',
					'A200': '#77a6ca',
					'A400': '#89b2d1',
					'A700': '#04080a'
				};
				$mdThemingProvider.definePalette('customPrimary', customPrimary);
	
				var customAccent = {
					'50': '#2d1010',
					'100': '#401616',
					'200': '#531d1d',
					'300': '#662323',
					'400': '#792a2a',
					'500': '#8c3030',
					'600': '#b23e3e',
					'700': '#c04949',
					'800': '#c75c5c',
					'900': '#cd6f6f',
					'A100': '#b23e3e',
					'A200': '#9F3737',
					'A400': '#8c3030',
					'A700': '#d48282'
				};
				$mdThemingProvider.definePalette('customAccent', customAccent);
	
				var customWarn = {
					'50': '#a251be',
					'100': '#9643b3',
					'200': '#873ca1',
					'300': '#77358e',
					'400': '#682e7c',
					'500': '#582769',
					'600': '#482056',
					'700': '#391944',
					'800': '#291231',
					'900': '#1a0b1f',
					'A100': '#ac64c5',
					'A200': '#b676cc',
					'A400': '#c089d3',
					'A700': '#0a040c'
				};
				$mdThemingProvider.definePalette('customWarn', customWarn);
	
				var customBackground = {
					'50': '#737373',
					'100': '#666666',
					'200': '#595959',
					'300': '#4d4d4d',
					'400': '#404040',
					'500': '#333',
					'600': '#262626',
					'700': '#1a1a1a',
					'800': '#0d0d0d',
					'900': '#000000',
					'A100': '#808080',
					'A200': '#8c8c8c',
					'A400': '#999999',
					'A700': '#000000'
				};
				$mdThemingProvider.definePalette('customBackground', customBackground);
	
				$mdThemingProvider.theme('default').primaryPalette('customPrimary').accentPalette('customAccent').warnPalette('customWarn').backgroundPalette('customBackground');
			}
		}]);

		return Theme;
	}();

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGRiNzJmYTMzYzNhNzA1NjJkMTIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGEvd29yZHMuanNvbiIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdGhlbWUuanMiXSwibmFtZXMiOlsiYXBwIiwiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlclByb3ZpZGVyIiwib3RoZXJ3aXNlIiwic3RhdGUiLCJhYnN0cmFjdCIsInZpZXdzIiwidGVtcGxhdGVVcmwiLCJ1cmwiLCJjb250cm9sbGVyIiwiU3B5TWFzdGVyQ29udHJvbGxlciIsIkdhbWVDb250cm9sbGVyIiwiJHNjb3BlIiwiZ2FtZSIsInNob3dNYXN0ZXJDb2RlIiwibmV3R2FtZSIsImhpZGVNYXN0ZXJDb2RlIiwibG9hZEdhbWUiLCJlcnJvciIsIm1hc3RlciIsIm1hc3RlckNvZGUiLCJ2YWxpZCIsImluaXRpYWxpemVkIiwidG90YWxfZ3JpZF9pdGVtcyIsImdyaWRfaGVpZ2h0IiwiZ3JpZF93aWR0aCIsInRvdGFsX3JlZF9uZWVkc190b193aW4iLCJ0b3RhbF9ibHVlX25lZWRzX3RvX3dpbiIsInRvdGFsX2dyZXlzIiwidG90YWxfYmxhY2tzIiwiY29kZXgiLCJjb2RleF9rZXkiLCJHYW1lIiwiZ3JpZCIsIkdhbWVHcmlkIiwicm93cyIsImdldFJvd3MiLCJnYW1lT3ZlciIsInJlbWFpbmluZ1JlZHMiLCJyZW1haW5pbmdCbHVlcyIsImtleVVybCIsImVuY29kZSIsIngiLCJ5IiwidGlsZSIsImF0IiwiY2hvc2VuIiwidGVhbSIsIndpbm5lciIsIkFycmF5Iiwid29yZHMiLCJnZW5lcmF0ZVdvcmRzIiwic2h1ZmZsZSIsInBvc2l0aW9uIiwid29yZCIsImFzc2lnbldvcmRzVG9UZWFtcyIsIl9ncmlkIiwiZW5jb2RlZF9oaSIsImVuY29kZWRfbG8iLCJ0b3RhbCIsInJvdyIsImZvckVhY2giLCJpdGVtIiwidG9TdHJpbmciLCJyZWRzIiwiYmx1ZXMiLCJncmV5cyIsImJsYWNrcyIsInBvc2l0aW9uc0xpc3QiLCJpIiwiYXNzaWduVGVhbSIsInN0YXJ0IiwicG9zIiwiTWF0aCIsImZsb29yIiwiaW5kaWNlcyIsImxlbmd0aCIsInJhbmRvbW51bWJlciIsInJhbmRvbSIsImZvdW5kIiwicHVzaCIsImFycmF5IiwiaiIsInRlbXAiLCJNYXN0ZXJHcmlkIiwiZW5jb2RlZCIsImRlY29kZUdyaWQiLCJlbmNvZGVkX3BhcnRzIiwic3BsaXQiLCJwYXJzZUludCIsInRlYW1zIiwidGVhbXNfaGkiLCJ0ZWFtc19sbyIsImJpdHMiLCJjb25jYXQiLCJyZXZlcnNlIiwidGVhbVRvdGFscyIsInZlcmlmeUdhbWVUb3RhbHMiLCJ0b3RhbHMiLCJUaGVtZSIsIiRtZFRoZW1pbmdQcm92aWRlciIsImN1c3RvbVByaW1hcnkiLCJkZWZpbmVQYWxldHRlIiwiY3VzdG9tQWNjZW50IiwiY3VzdG9tV2FybiIsImN1c3RvbUJhY2tncm91bmQiLCJ0aGVtZSIsInByaW1hcnlQYWxldHRlIiwiYWNjZW50UGFsZXR0ZSIsIndhcm5QYWxldHRlIiwiYmFja2dyb3VuZFBhbGV0dGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7O0FBRUE7Ozs7QUFFQSxFQUFDLFlBQVc7QUFDWCxNQUFJQSxNQUFNQyxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QixDQUFDLFdBQUQsQ0FBOUIsQ0FBVjs7QUFFQUYsTUFBSUcsTUFBSixDQUFXLFVBQUNDLGNBQUQs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7Ozs7Ozs7Ozs7OztLQ25aYXNFLEssV0FBQUEsSztBQUVaLG1CQUFjO0FBQUE7QUFBRTs7Ozs2QkFFQ0Msa0IsRUFBb0I7QUFDcEMsUUFBSUMsZ0JBQWdCO0FBQ25CLFdBQU0sU0FEYTtBQUVuQixZQUFPLFNBRlk7QUFHbkIsWUFBTyxTQUhZO0FBSW5CLFlBQU8sU0FKWTtBQUtuQixZQUFPLFNBTFk7QUFNbkIsWUFBTyxTQU5ZO0FBT25CLFlBQU8sU0FQWTtBQVFuQixZQUFPLFNBUlk7QUFTbkIsWUFBTyxTQVRZO0FBVW5CLFlBQU8sU0FWWTtBQVduQixhQUFRLFNBWFc7QUFZbkIsYUFBUSxTQVpXO0FBYW5CLGFBQVEsU0FiVztBQWNuQixhQUFRO0FBZFcsS0FBcEI7QUFnQkFELHVCQUNFRSxhQURGLENBQ2dCLGVBRGhCLEVBRUtELGFBRkw7O0FBSUEsUUFBSUUsZUFBZTtBQUNsQixXQUFNLFNBRFk7QUFFbEIsWUFBTyxTQUZXO0FBR2xCLFlBQU8sU0FIVztBQUlsQixZQUFPLFNBSlc7QUFLbEIsWUFBTyxTQUxXO0FBTWxCLFlBQU8sU0FOVztBQU9sQixZQUFPLFNBUFc7QUFRbEIsWUFBTyxTQVJXO0FBU2xCLFlBQU8sU0FUVztBQVVsQixZQUFPLFNBVlc7QUFXbEIsYUFBUSxTQVhVO0FBWWxCLGFBQVEsU0FaVTtBQWFsQixhQUFRLFNBYlU7QUFjbEIsYUFBUTtBQWRVLEtBQW5CO0FBZ0JBSCx1QkFDRUUsYUFERixDQUNnQixjQURoQixFQUVLQyxZQUZMOztBQUlBLFFBQUlDLGFBQWE7QUFDaEIsV0FBTSxTQURVO0FBRWhCLFlBQU8sU0FGUztBQUdoQixZQUFPLFNBSFM7QUFJaEIsWUFBTyxTQUpTO0FBS2hCLFlBQU8sU0FMUztBQU1oQixZQUFPLFNBTlM7QUFPaEIsWUFBTyxTQVBTO0FBUWhCLFlBQU8sU0FSUztBQVNoQixZQUFPLFNBVFM7QUFVaEIsWUFBTyxTQVZTO0FBV2hCLGFBQVEsU0FYUTtBQVloQixhQUFRLFNBWlE7QUFhaEIsYUFBUSxTQWJRO0FBY2hCLGFBQVE7QUFkUSxLQUFqQjtBQWdCQUosdUJBQ0VFLGFBREYsQ0FDZ0IsWUFEaEIsRUFFS0UsVUFGTDs7QUFJQSxRQUFJQyxtQkFBbUI7QUFDdEIsV0FBTSxTQURnQjtBQUV0QixZQUFPLFNBRmU7QUFHdEIsWUFBTyxTQUhlO0FBSXRCLFlBQU8sU0FKZTtBQUt0QixZQUFPLFNBTGU7QUFNdEIsWUFBTyxNQU5lO0FBT3RCLFlBQU8sU0FQZTtBQVF0QixZQUFPLFNBUmU7QUFTdEIsWUFBTyxTQVRlO0FBVXRCLFlBQU8sU0FWZTtBQVd0QixhQUFRLFNBWGM7QUFZdEIsYUFBUSxTQVpjO0FBYXRCLGFBQVEsU0FiYztBQWN0QixhQUFRO0FBZGMsS0FBdkI7QUFnQkFMLHVCQUNFRSxhQURGLENBQ2dCLGtCQURoQixFQUVLRyxnQkFGTDs7QUFJRUwsdUJBQW1CTSxLQUFuQixDQUF5QixTQUF6QixFQUNFQyxjQURGLENBQ2lCLGVBRGpCLEVBRUVDLGFBRkYsQ0FFZ0IsY0FGaEIsRUFHRUMsV0FIRixDQUdjLFlBSGQsRUFJRUMsaUJBSkYsQ0FJb0Isa0JBSnBCO0FBS0EiLCJmaWxlIjoibWFpbi5wYWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA4ZGI3MmZhMzNjM2E3MDU2MmQxMlxuICoqLyIsImltcG9ydCB7R2FtZX0gZnJvbSAnZ2FtZSc7XG5pbXBvcnQge01hc3RlckdyaWR9IGZyb20gJ2dhbWUnO1xuaW1wb3J0IHtUaGVtZX0gZnJvbSAndGhlbWUnO1xuXG4oZnVuY3Rpb24oKSB7XG5cdGxldCBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnQ29kZUdvYmxpbnMnLCBbJ3VpLnJvdXRlciddKTtcblxuXHRhcHAuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG5cdFx0XG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG5cdFx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FwcCcsIHtcblx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0dmlld3M6IHtcblx0XHRcdFx0J2Zvb3Rlcic6IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2dhbWUvZm9vdGVyLmh0bWwnXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5zdGF0ZSgnYXBwLnNlbGVjdCcsIHtcblx0XHRcdHVybDogJy8nLFxuXHRcdFx0dmlld3M6IHtcblx0XHRcdFx0J2NvbnRlbnRAJzoge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnZ2FtZS9zZWxlY3QuaHRtbCdcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5zdGF0ZSgnYXBwLnNweS1tYXN0ZXInLCB7XG5cdFx0XHR1cmw6ICcvc20nLFxuXHRcdFx0dmlld3M6IHtcblx0XHRcdFx0J2NvbnRlbnRAJzoge1xuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnZ2FtZS9zcHktbWFzdGVyLmh0bWwnLFxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6IFNweU1hc3RlckNvbnRyb2xsZXJcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LnN0YXRlKCdhcHAuZ2FtZS1ib2FyZCcsIHtcblx0XHRcdHVybDogJy9nYW1lJyxcblx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdCdjb250ZW50QCc6IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2dhbWUvZ2FtZS5odG1sJyxcblx0XHRcdFx0XHRjb250cm9sbGVyOiBHYW1lQ29udHJvbGxlclxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuc3RhdGUoJ2FwcC5pbnN0cnVjdGlvbnMnLCB7XG5cdFx0XHR1cmw6ICcvaW5zdHJ1Y3Rpb25zJyxcblx0XHRcdHZpZXdzOiB7XG5cdFx0XHRcdCdjb250ZW50QCc6IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2dhbWUvaW5zdHJ1Y3Rpb25zLmh0bWwnXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cbn0pKCk7XG5cbmNsYXNzIEdhbWVDb250cm9sbGVyIHtcblx0Y29uc3RydWN0b3IoJHNjb3BlKSB7XG5cdFx0JHNjb3BlLmdhbWUgPSBuZXcgR2FtZSgpO1xuXHRcdCRzY29wZS5zaG93TWFzdGVyQ29kZSA9IHRydWU7XG5cblx0XHQkc2NvcGUubmV3R2FtZSA9ICgpID0+IHsgXG5cdFx0XHQkc2NvcGUuZ2FtZSA9IG5ldyBHYW1lKCk7IFxuXHRcdFx0JHNjb3BlLnNob3dNYXN0ZXJDb2RlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQkc2NvcGUuaGlkZU1hc3RlckNvZGUgPSAoKSA9PiB7XG5cdFx0XHQkc2NvcGUuc2hvd01hc3RlckNvZGUgPSBmYWxzZTtcblx0XHR9XG5cdH1cbn1cblxuY2xhc3MgU3B5TWFzdGVyQ29udHJvbGxlciB7XG5cdGNvbnN0cnVjdG9yKCRzY29wZSkge1xuXHRcdCRzY29wZS5sb2FkR2FtZSA9ICgpID0+IHtcblx0XHRcdCRzY29wZS5lcnJvciA9ICcnO1xuXHRcdFx0JHNjb3BlLm1hc3RlciA9IG5ldyBNYXN0ZXJHcmlkKCRzY29wZS5tYXN0ZXJDb2RlKTtcblx0XHRcdGlmICghJHNjb3BlLm1hc3Rlci52YWxpZCkge1xuXHRcdFx0XHQkc2NvcGUuZXJyb3IgPSAnSW52YWxpZCBHYW1lIENvZGUnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNjb3BlLmluaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkc2NvcGUubmV3R2FtZSA9ICgpID0+IHtcblx0XHRcdCRzY29wZS5tYXN0ZXIgPSBudWxsO1xuXHRcdFx0JHNjb3BlLm1hc3RlckNvZGUgPSAnJztcblx0XHRcdCRzY29wZS5lcnJvciA9ICcnO1xuXHRcdFx0JHNjb3BlLmluaXRpYWxpemVkID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0JHNjb3BlLm5ld0dhbWUoKTtcblx0fVxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2pzL21haW4uanNcbiAqKi8iLCJpbXBvcnQge3dvcmRzIGFzIGxpc3Rfb2Zfd29yZHN9IGZyb20gJy4uL2RhdGEvd29yZHMnO1xuXG5jb25zdCB0b3RhbF9ncmlkX2l0ZW1zID0gMjU7XG5jb25zdCBncmlkX2hlaWdodCA9IDU7XG5jb25zdCBncmlkX3dpZHRoID0gNTtcbmNvbnN0IHRvdGFsX3JlZF9uZWVkc190b193aW4gPSA4O1xuY29uc3QgdG90YWxfYmx1ZV9uZWVkc190b193aW4gPSA3O1xuY29uc3QgdG90YWxfZ3JleXMgPSA5O1xuY29uc3QgdG90YWxfYmxhY2tzID0gMTtcblxuXG5jb25zdCBjb2RleCA9IHtcblx0J2dyZXknOiAwLFxuXHQncmVkJzogMSxcblx0J2JsdWUnOiAyLFxuXHQnYmxhY2snOiAzXG59O1xuXG5jb25zdCBjb2RleF9rZXkgPSBbJ2dyZXknLCAncmVkJywgJ2JsdWUnLCAnYmxhY2snXTtcblxuZXhwb3J0IGNsYXNzIEdhbWUge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0dGhpcy5ncmlkID0gbmV3IEdhbWVHcmlkKCk7XG5cdFx0dGhpcy5yb3dzID0gdGhpcy5ncmlkLmdldFJvd3MoKTtcblxuXHRcdHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcblx0XHR0aGlzLnJlbWFpbmluZ1JlZHMgPSB0b3RhbF9yZWRfbmVlZHNfdG9fd2luO1xuXHRcdHRoaXMucmVtYWluaW5nQmx1ZXMgPSB0b3RhbF9ibHVlX25lZWRzX3RvX3dpbjtcblxuXHRcdHRoaXMua2V5VXJsID0gdGhpcy5ncmlkLmVuY29kZSgpO1xuXHR9XG5cblx0c2VsZWN0KHgsIHkpIHtcblx0XHRsZXQgdGlsZSA9IHRoaXMuZ3JpZC5hdCh4LHkpO1xuXG5cdFx0aWYgKCF0aGlzLmdhbWVPdmVyICYmICF0aWxlLmNob3Nlbikge1xuXHRcdFx0bGV0IHRlYW0gPSB0aWxlLnRlYW07XG5cdFx0XHR0aWxlLmNob3NlbiA9IHRydWU7XG5cblx0XHRcdGlmICh0ZWFtID09ICdibGFjaycpIHtcblx0XHRcdFx0dGhpcy5nYW1lT3ZlciA9IHRydWU7XG5cdFx0XHRcdHRoaXMud2lubmVyID0gJ2JsYWNrJztcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKHRlYW0gPT0gJ3JlZCcpIHtcblx0XHRcdFx0XHR0aGlzLnJlbWFpbmluZ1JlZHMtLTtcblx0XHRcdFx0XHRpZiAodGhpcy5yZW1haW5pbmdSZWRzID09IDApIHtcblx0XHRcdFx0XHRcdHRoaXMud2lubmVyID0gJ3JlZCc7XG5cdFx0XHRcdFx0XHR0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAodGVhbSA9PSAnYmx1ZScpIHtcblx0XHRcdFx0XHR0aGlzLnJlbWFpbmluZ0JsdWVzLS07XG5cdFx0XHRcdFx0aWYgKHRoaXMucmVtYWluaW5nQmx1ZXMgPT0gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy53aW5uZXIgPSAnYmx1ZSc7XG5cdFx0XHRcdFx0XHR0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuY2xhc3MgR2FtZUdyaWQgeyBcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0bGV0IGdyaWQgPSBuZXcgQXJyYXkoNSk7XG5cdFx0XG5cdFx0bGV0IHdvcmRzID0gR2FtZUdyaWQuZ2VuZXJhdGVXb3JkcygpO1xuXHRcdHdvcmRzID0gR2FtZUdyaWQuc2h1ZmZsZSh3b3Jkcyk7XG5cblx0XHRsZXQgcG9zaXRpb24gPSAwO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgZ3JpZF93aWR0aDsgeCsrKSB7XG5cdFx0XHRncmlkW3hdID0gbmV3IEFycmF5KGdyaWRfaGVpZ2h0KTtcblxuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCA1OyB5KyspIHtcblx0XHRcdFx0Z3JpZFt4XVt5XSA9IHsgXG5cdFx0XHRcdFx0d29yZDogd29yZHNbcG9zaXRpb25dLFxuXHRcdFx0XHRcdGNob3NlbjogZmFsc2Vcblx0XHRcdFx0fTtcblx0XHRcdFx0cG9zaXRpb24rKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRncmlkID0gR2FtZUdyaWQuYXNzaWduV29yZHNUb1RlYW1zKGdyaWQpO1xuXG5cdFx0dGhpcy5fZ3JpZCA9IGdyaWQ7XG5cdH1cblxuXHRhdCh4LHkpIHtcblx0XHRyZXR1cm4gdGhpcy5fZ3JpZFt4XVt5XTtcblx0fVxuXG5cdGdldFJvd3MoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2dyaWQ7XG5cdH1cblxuXHQvLyBFbmNvZGVzIHRoZSB0ZWFtIGZvciBlYWNoIHRpbGUgKDQgcG9zc2libGUgXCJ0ZWFtc1wiIC0+IDIgYml0cyBuZWVkZWQpXG5cdC8vIHdlIG5lZWQgNTAgYml0cyB0b3RhbCBmb3IgYSA1eDUgZ3JpZCAoc28gMiAzMi1iaXQgaW50ZWdlcnMpXG5cdC8vIGF2b2lkIHRoZSB0b3AgMiBiaXRzIHNpbmNlIEpTIHVzZXMgc2lnbmVkIGludGVnZXJzXG5cdC8vIGVuY29kZWRfaGkgd2lsbCBoYXZlIHRoZSBmaXJzdCAzIHJvd3MgKDMwIGJpdHMpLCBhbmQgZW5jb2RlZF9sbyB0aGUgYm90dG9tIDIgKDIwIGJpdHMpXG5cdC8vIHRoZSByZXN1bHQgaXMgMiBiYXNlLTM2IHN0cmluZ3Mgc2VwYXJhdGVkIGJ5IGEgJy4nIHRvIGhhdmUgdGhlIHNtYWxsZXN0IGNoYXJhY3RlciByZXByZXNlbnRhdGlvblxuXHRlbmNvZGUoKSB7XG5cdFx0bGV0IGVuY29kZWRfaGkgPSAwO1xuXHRcdGxldCBlbmNvZGVkX2xvID0gMDtcblx0XHRsZXQgdG90YWwgPSAwO1xuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBncmlkX3dpZHRoOyB4KyspIHtcblx0XHRcdGxldCByb3cgPSB0aGlzLl9ncmlkW3hdO1xuXHRcdFx0cm93LmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdFx0aWYgKHRvdGFsIDwgMzApIHtcblx0XHRcdFx0XHRlbmNvZGVkX2hpID0gKGVuY29kZWRfaGkgPDwgMikgfCBjb2RleFtpdGVtLnRlYW1dO1x0XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZW5jb2RlZF9sbyA9IChlbmNvZGVkX2xvIDw8IDIpIHwgY29kZXhbaXRlbS50ZWFtXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0b3RhbCArPSAyO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBgJHtlbmNvZGVkX2hpLnRvU3RyaW5nKDM2KX0uJHtlbmNvZGVkX2xvLnRvU3RyaW5nKDM2KX1gO1xuXHR9XG5cblx0c3RhdGljIGFzc2lnbldvcmRzVG9UZWFtcyhncmlkKSB7XG5cdFx0dmFyIHJlZHMgPSB0b3RhbF9yZWRfbmVlZHNfdG9fd2luLFxuXHRcdFx0Ymx1ZXMgPSB0b3RhbF9ibHVlX25lZWRzX3RvX3dpbixcblx0XHRcdGdyZXlzID0gdG90YWxfZ3JleXMsXG5cdFx0XHRibGFja3MgPSB0b3RhbF9ibGFja3M7XG5cblx0XHR2YXIgcG9zaXRpb25zTGlzdCA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG90YWxfZ3JpZF9pdGVtczsgaSsrKSB7IHBvc2l0aW9uc0xpc3RbaV0gPSBpOyB9XG5cblx0XHRwb3NpdGlvbnNMaXN0ID0gR2FtZUdyaWQuc2h1ZmZsZShwb3NpdGlvbnNMaXN0KTtcblxuXHRcdGxldCBhc3NpZ25UZWFtID0gKHRlYW0sIHN0YXJ0LCB0b3RhbCkgPT4ge1xuXHRcdFx0Zm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgdG90YWwgKyBzdGFydDsgaSsrKSB7XG5cdFx0XHRcdGxldCBwb3MgPSBwb3NpdGlvbnNMaXN0W2ldO1xuXG5cdFx0XHRcdGxldCB4ID0gTWF0aC5mbG9vcihwb3MgLyBncmlkX3dpZHRoKTtcblx0XHRcdFx0bGV0IHkgPSBwb3MgJSBncmlkX3dpZHRoO1xuXG5cdFx0XHRcdGdyaWRbeF1beV0udGVhbSA9IHRlYW07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0YXNzaWduVGVhbSgncmVkJywgMCwgcmVkcyk7XG5cdFx0YXNzaWduVGVhbSgnYmx1ZScsIHJlZHMsIGJsdWVzKTtcblx0XHRhc3NpZ25UZWFtKCdncmV5JywgcmVkcyArIGJsdWVzLCBncmV5cyk7XG5cdFx0YXNzaWduVGVhbSgnYmxhY2snLCByZWRzICsgYmx1ZXMgKyBncmV5cywgYmxhY2tzKTtcblxuXHRcdHJldHVybiBncmlkO1xuXHR9XG5cblx0c3RhdGljIGdlbmVyYXRlV29yZHMoKSB7XG5cdFx0bGV0IHRvdGFsID0gMDtcblx0XHRsZXQgd29yZHMgPSBbXTtcblxuXHRcdHZhciBpbmRpY2VzID0gW107XG5cdFx0d2hpbGUgKGluZGljZXMubGVuZ3RoIDwgdG90YWxfZ3JpZF9pdGVtcykge1xuXHRcdFx0bGV0IHJhbmRvbW51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxpc3Rfb2Zfd29yZHMubGVuZ3RoKVxuXHRcdFx0bGV0IGZvdW5kID0gZmFsc2U7XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8aW5kaWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoaW5kaWNlc1tpXSA9PSByYW5kb21udW1iZXIpIHsgXG5cdFx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICghZm91bmQpIGluZGljZXMucHVzaChyYW5kb21udW1iZXIpO1xuXHRcdH1cblxuXHRcdGluZGljZXMuZm9yRWFjaCgoaSkgPT4geyB3b3Jkcy5wdXNoKGxpc3Rfb2Zfd29yZHNbaV0pOyB9KVxuXG5cdFx0cmV0dXJuIHdvcmRzO1xuXHR9XG5cblx0Ly8gRHVyc3RlbmZlbGQgU2h1ZmZsZVxuXHRzdGF0aWMgc2h1ZmZsZShhcnJheSkge1xuXHRcdGZvciAodmFyIGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG5cdFx0XHRsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuXHRcdFx0bGV0IHRlbXAgPSBhcnJheVtpXTtcblx0XHRcdGFycmF5W2ldID0gYXJyYXlbal07XG5cdFx0XHRhcnJheVtqXSA9IHRlbXA7XG4gICAgXHR9XG4gICAgXHRyZXR1cm4gYXJyYXk7XG5cdH1cblx0XG59XG5cbmV4cG9ydCBjbGFzcyBNYXN0ZXJHcmlkIHtcblx0Y29uc3RydWN0b3IoZW5jb2RlZCkge1xuXHRcdHRoaXMucm93cyA9IE1hc3RlckdyaWQuZGVjb2RlR3JpZChlbmNvZGVkKTtcblx0XHR0aGlzLnZhbGlkID0gISF0aGlzLnJvd3M7XG5cdH1cblxuXHRzdGF0aWMgZGVjb2RlR3JpZChlbmNvZGVkKSB7XG5cdFx0aWYgKGVuY29kZWQgJiYgdHlwZW9mKGVuY29kZWQpID09ICdzdHJpbmcnKSB7XG5cdFx0XHRsZXQgZW5jb2RlZF9wYXJ0cyA9IGVuY29kZWQuc3BsaXQoJy4nKTtcblx0XHRcdGxldCBlbmNvZGVkX2hpID0gZW5jb2RlZF9wYXJ0c1swXSxcblx0XHRcdFx0ZW5jb2RlZF9sbyA9IGVuY29kZWRfcGFydHNbMV07XG5cblx0XHRcdC8vIEVuY29kZWQgSGk6IHRoZSB0b3AgMzAgYml0cyAoZmlyc3QgMTUgY2FyZHMgLSBbMCwwXS1bMiw0XSlcblx0XHRcdC8vIEVuY29kZWQgTG86IHRoZSBib3R0b20gMjAgYml0cyAobGFzdCA5IGNhcmRzIC0gWzMsMF0tWzQsNF0pXG5cdFx0XHRlbmNvZGVkX2hpID0gcGFyc2VJbnQoZW5jb2RlZF9oaSwgMzYpO1xuXHRcdFx0ZW5jb2RlZF9sbyA9IHBhcnNlSW50KGVuY29kZWRfbG8sIDM2KTtcblxuXHRcdFx0bGV0IHRlYW1zID0gW10sXG5cdFx0XHRcdHRlYW1zX2hpID0gW10sXG5cdFx0XHRcdHRlYW1zX2xvID0gW107XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG90YWxfZ3JpZF9pdGVtczsgaSsrKSB7XG5cdFx0XHRcdGxldCBiaXRzID0gMDtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpIDwgMTUpIHtcblx0XHRcdFx0XHRiaXRzID0gZW5jb2RlZF9oaSAmIDBiMTE7XG5cdFx0XHRcdFx0ZW5jb2RlZF9oaSA9IGVuY29kZWRfaGkgPj4+IDI7XG5cdFx0XHRcdFx0dGVhbXNfaGkucHVzaChjb2RleF9rZXlbYml0c10pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGJpdHMgPSBlbmNvZGVkX2xvICYgMGIxMTtcblx0XHRcdFx0XHRlbmNvZGVkX2xvID0gZW5jb2RlZF9sbyA+Pj4gMjtcblx0XHRcdFx0XHR0ZWFtc19sby5wdXNoKGNvZGV4X2tleVtiaXRzXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRlYW1zID0gdGVhbXMuY29uY2F0KHRlYW1zX2hpLnJldmVyc2UoKSk7XG5cdFx0XHR0ZWFtcyA9IHRlYW1zLmNvbmNhdCh0ZWFtc19sby5yZXZlcnNlKCkpO1xuXG5cdFx0XHRsZXQgZ3JpZCA9IG5ldyBBcnJheSg1KTtcblxuXHRcdFx0bGV0IHBvc2l0aW9uID0gMDtcblx0XHRcdGxldCB0ZWFtVG90YWxzID0ge1xuXHRcdFx0XHQncmVkJzogMCxcblx0XHRcdFx0J2JsdWUnOiAwLFxuXHRcdFx0XHQnZ3JleSc6IDAsXG5cdFx0XHRcdCdibGFjayc6IDBcblx0XHRcdH07XG5cblx0XHRcdGZvciAodmFyIHggPSAwOyB4IDwgZ3JpZF9oZWlnaHQ7IHgrKykge1xuXHRcdFx0XHRncmlkW3hdID0gbmV3IEFycmF5KGdyaWRfd2lkdGgpO1xuXG5cdFx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgZ3JpZF93aWR0aDsgeSsrKSB7XG5cdFx0XHRcdFx0bGV0IHRlYW0gPSB0ZWFtc1twb3NpdGlvbl07XG5cblx0XHRcdFx0XHRncmlkW3hdW3ldID0geyBcblx0XHRcdFx0XHRcdHRlYW06IHRlYW1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHRlYW1Ub3RhbHNbdGVhbV0rKztcblx0XHRcdFx0XHRwb3NpdGlvbisrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChNYXN0ZXJHcmlkLnZlcmlmeUdhbWVUb3RhbHModGVhbVRvdGFscykpIHtcblx0XHRcdFx0cmV0dXJuIGdyaWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIHZlcmlmeUdhbWVUb3RhbHModG90YWxzKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdHRvdGFsc1sncmVkJ10gPT0gdG90YWxfcmVkX25lZWRzX3RvX3dpbiAmJlxuXHRcdFx0dG90YWxzWydibHVlJ10gPT0gdG90YWxfYmx1ZV9uZWVkc190b193aW4gJiZcblx0XHRcdHRvdGFsc1snZ3JleSddID09IHRvdGFsX2dyZXlzICYmXG5cdFx0XHR0b3RhbHNbJ2JsYWNrJ10gPT0gdG90YWxfYmxhY2tzXG5cdFx0KTtcblx0fVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvanMvZ2FtZS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndvcmRzXCI6IFtcblx0XHRcIkFGUklDQVwiLFxuXHRcdFwiQUdFTlRcIixcblx0XHRcIkFJUlwiLFxuXHRcdFwiQUxJRU5cIixcblx0XHRcIkFMUFNcIixcblx0XHRcIkFNQVpPTlwiLFxuXHRcdFwiQU1CVUxBTkNFXCIsXG5cdFx0XCJBTUVSSUNBXCIsXG5cdFx0XCJBTkdFTFwiLFxuXHRcdFwiQU5UQVJDVElDQVwiLFxuXHRcdFwiQVBQTEVcIixcblx0XHRcIkFSTVwiLFxuXHRcdFwiQVRMQU5USVNcIixcblx0XHRcIkFVU1RSQUxJQVwiLFxuXHRcdFwiQVpURUNcIixcblx0XHRcIkJBQ0tcIixcblx0XHRcIkJBTExcIixcblx0XHRcIkJBTkRcIixcblx0XHRcIkJBTktcIixcblx0XHRcIkJBUlwiLFxuXHRcdFwiQkFSS1wiLFxuXHRcdFwiQkFUXCIsXG5cdFx0XCJCQVRURVJZXCIsXG5cdFx0XCJCRUFDSFwiLFxuXHRcdFwiQkVBUlwiLFxuXHRcdFwiQkVBVFwiLFxuXHRcdFwiQkVEXCIsXG5cdFx0XCJCRUlKSU5HXCIsXG5cdFx0XCJCRUxMXCIsXG5cdFx0XCJCRUxUXCIsXG5cdFx0XCJCRVJMSU5cIixcblx0XHRcIkJFUk1VREFcIixcblx0XHRcIkJFUlJZXCIsXG5cdFx0XCJCSUxMXCIsXG5cdFx0XCJCTE9DS1wiLFxuXHRcdFwiQk9BUkRcIixcblx0XHRcIkJPTFRcIixcblx0XHRcIkJPTUJcIixcblx0XHRcIkJPTkRcIixcblx0XHRcIkJPT01cIixcblx0XHRcIkJPT1RcIixcblx0XHRcIkJPVFRMRVwiLFxuXHRcdFwiQk9XXCIsXG5cdFx0XCJCT1hcIixcblx0XHRcIkJSSURHRVwiLFxuXHRcdFwiQlJVU0hcIixcblx0XHRcIkJVQ0tcIixcblx0XHRcIkJVRkZBTE9cIixcblx0XHRcIkJVR1wiLFxuXHRcdFwiQlVHTEVcIixcblx0XHRcIkJVVFRPTlwiLFxuXHRcdFwiQ0FMRlwiLFxuXHRcdFwiQ0FOQURBXCIsXG5cdFx0XCJDQVBcIixcblx0XHRcIkNBUElUQUxcIixcblx0XHRcIkNBUlwiLFxuXHRcdFwiQ0FSRFwiLFxuXHRcdFwiQ0FSUk9UXCIsXG5cdFx0XCJDQVNJTk9cIixcblx0XHRcIkNBU1RcIixcblx0XHRcIkNBVFwiLFxuXHRcdFwiQ0VMTFwiLFxuXHRcdFwiQ0VOVEFVUlwiLFxuXHRcdFwiQ0VOVEVSXCIsXG5cdFx0XCJDSEFJUlwiLFxuXHRcdFwiQ0hBTkdFXCIsXG5cdFx0XCJDSEFSR0VcIixcblx0XHRcIkNIRUNLXCIsXG5cdFx0XCJDSEVTVFwiLFxuXHRcdFwiQ0hJQ0tcIixcblx0XHRcIkNISU5BXCIsXG5cdFx0XCJDSE9DT0xBVEVcIixcblx0XHRcIkNIVVJDSFwiLFxuXHRcdFwiQ0lSQ0xFXCIsXG5cdFx0XCJDTElGRlwiLFxuXHRcdFwiQ0xPQUtcIixcblx0XHRcIkNMVUJcIixcblx0XHRcIkNPREVcIixcblx0XHRcIkNPTERcIixcblx0XHRcIkNPTUlDXCIsXG5cdFx0XCJDT01QT1VORFwiLFxuXHRcdFwiQ09OQ0VSVFwiLFxuXHRcdFwiQ09ORFVDVE9SXCIsXG5cdFx0XCJDT05UUkFDVFwiLFxuXHRcdFwiQ09PS1wiLFxuXHRcdFwiQ09QUEVSXCIsXG5cdFx0XCJDT1RUT05cIixcblx0XHRcIkNPVVJUXCIsXG5cdFx0XCJDT1ZFUlwiLFxuXHRcdFwiQ1JBTkVcIixcblx0XHRcIkNSQVNIXCIsXG5cdFx0XCJDUklDS0VUXCIsXG5cdFx0XCJDUk9TU1wiLFxuXHRcdFwiQ1JPV05cIixcblx0XHRcIkNZQ0xFXCIsXG5cdFx0XCJDWkVDSFwiLFxuXHRcdFwiREFOQ0VcIixcblx0XHRcIkRBVEVcIixcblx0XHRcIkRBWVwiLFxuXHRcdFwiREVBVEhcIixcblx0XHRcIkRFQ0tcIixcblx0XHRcIkRFR1JFRVwiLFxuXHRcdFwiRElBTU9ORFwiLFxuXHRcdFwiRElDRVwiLFxuXHRcdFwiRElOT1NBVVJcIixcblx0XHRcIkRJU0VBU0VcIixcblx0XHRcIkRPQ1RPUlwiLFxuXHRcdFwiRE9HXCIsXG5cdFx0XCJEUkFGVFwiLFxuXHRcdFwiRFJBR09OXCIsXG5cdFx0XCJEUkVTU1wiLFxuXHRcdFwiRFJJTExcIixcblx0XHRcIkRST1BcIixcblx0XHRcIkRVQ0tcIixcblx0XHRcIkRXQVJGXCIsXG5cdFx0XCJFQUdMRVwiLFxuXHRcdFwiRUdZUFRcIixcblx0XHRcIkVNQkFTU1lcIixcblx0XHRcIkVOR0lORVwiLFxuXHRcdFwiRU5HTEFORFwiLFxuXHRcdFwiRVVST1BFXCIsXG5cdFx0XCJFWUVcIixcblx0XHRcIkZBQ0VcIixcblx0XHRcIkZBSVJcIixcblx0XHRcIkZBTExcIixcblx0XHRcIkZBTlwiLFxuXHRcdFwiRkVOQ0VcIixcblx0XHRcIkZJRUxEXCIsXG5cdFx0XCJGSUdIVEVSXCIsXG5cdFx0XCJGSUdVUkVcIixcblx0XHRcIkZJTEVcIixcblx0XHRcIkZJTE1cIixcblx0XHRcIkZJUkVcIixcblx0XHRcIkZJU0hcIixcblx0XHRcIkZMVVRFXCIsXG5cdFx0XCJGTFlcIixcblx0XHRcIkZPT1RcIixcblx0XHRcIkZPUkNFXCIsXG5cdFx0XCJGT1JFU1RcIixcblx0XHRcIkZPUktcIixcblx0XHRcIkZSQU5DRVwiLFxuXHRcdFwiR0FNRVwiLFxuXHRcdFwiR0FTXCIsXG5cdFx0XCJHRU5JVVNcIixcblx0XHRcIkdFUk1BTllcIixcblx0XHRcIkdIT1NUXCIsXG5cdFx0XCJHSUFOVFwiLFxuXHRcdFwiR0xBU1NcIixcblx0XHRcIkdMT1ZFXCIsXG5cdFx0XCJHT0xEXCIsXG5cdFx0XCJHUkFDRVwiLFxuXHRcdFwiR1JBU1NcIixcblx0XHRcIkdSRUVDRVwiLFxuXHRcdFwiR1JFRU5cIixcblx0XHRcIkdST1VORFwiLFxuXHRcdFwiSEFNXCIsXG5cdFx0XCJIQU5EXCIsXG5cdFx0XCJIQVdLXCIsXG5cdFx0XCJIRUFEXCIsXG5cdFx0XCJIRUFSVFwiLFxuXHRcdFwiSEVMSUNPUFRFUlwiLFxuXHRcdFwiSElNQUxBWUFTXCIsXG5cdFx0XCJIT0xFXCIsXG5cdFx0XCJIT0xMWVdPT0RcIixcblx0XHRcIkhPTkVZXCIsXG5cdFx0XCJIT09EXCIsXG5cdFx0XCJIT09LXCIsXG5cdFx0XCJIT1JOXCIsXG5cdFx0XCJIT1JTRVwiLFxuXHRcdFwiSE9SU0VTSE9FXCIsXG5cdFx0XCJIT1NQSVRBTFwiLFxuXHRcdFwiSE9URUxcIixcblx0XHRcIklDRVwiLFxuXHRcdFwiSUNFIENSRUFNXCIsXG5cdFx0XCJJTkRJQVwiLFxuXHRcdFwiSVJPTlwiLFxuXHRcdFwiSVZPUllcIixcblx0XHRcIkpBQ0tcIixcblx0XHRcIkpBTVwiLFxuXHRcdFwiSkVUXCIsXG5cdFx0XCJKVVBJVEVSXCIsXG5cdFx0XCJLQU5HQVJPT1wiLFxuXHRcdFwiS0VUQ0hVUFwiLFxuXHRcdFwiS0VZXCIsXG5cdFx0XCJLSURcIixcblx0XHRcIktJTkdcIixcblx0XHRcIktJV0lcIixcblx0XHRcIktOSUZFXCIsXG5cdFx0XCJLTklHSFRcIixcblx0XHRcIkxBQlwiLFxuXHRcdFwiTEFQXCIsXG5cdFx0XCJMQVNFUlwiLFxuXHRcdFwiTEFXWUVSXCIsXG5cdFx0XCJMRUFEXCIsXG5cdFx0XCJMRU1PTlwiLFxuXHRcdFwiTEVQUkVDSEFVTlwiLFxuXHRcdFwiTElGRVwiLFxuXHRcdFwiTElHSFRcIixcblx0XHRcIkxJTU9VU0lORVwiLFxuXHRcdFwiTElORVwiLFxuXHRcdFwiTElOS1wiLFxuXHRcdFwiTElPTlwiLFxuXHRcdFwiTElUVEVSXCIsXG5cdFx0XCJMT0NIIE5FU1NcIixcblx0XHRcIkxPQ0tcIixcblx0XHRcIkxPR1wiLFxuXHRcdFwiTE9ORE9OXCIsXG5cdFx0XCJMVUNLXCIsXG5cdFx0XCJNQUlMXCIsXG5cdFx0XCJNQU1NT1RIXCIsXG5cdFx0XCJNQVBMRVwiLFxuXHRcdFwiTUFSQkxFXCIsXG5cdFx0XCJNQVJDSFwiLFxuXHRcdFwiTUFTU1wiLFxuXHRcdFwiTUFUQ0hcIixcblx0XHRcIk1FUkNVUllcIixcblx0XHRcIk1FWElDT1wiLFxuXHRcdFwiTUlDUk9TQ09QRVwiLFxuXHRcdFwiTUlMTElPTkFJUkVcIixcblx0XHRcIk1JTkVcIixcblx0XHRcIk1JTlRcIixcblx0XHRcIk1JU1NJTEVcIixcblx0XHRcIk1PREVMXCIsXG5cdFx0XCJNT0xFXCIsXG5cdFx0XCJNT09OXCIsXG5cdFx0XCJNT1NDT1dcIixcblx0XHRcIk1PVU5UXCIsXG5cdFx0XCJNT1VTRVwiLFxuXHRcdFwiTU9VVEhcIixcblx0XHRcIk1VR1wiLFxuXHRcdFwiTkFJTFwiLFxuXHRcdFwiTkVFRExFXCIsXG5cdFx0XCJORVRcIixcblx0XHRcIk5FVyBZT1JLXCIsXG5cdFx0XCJOSUdIVFwiLFxuXHRcdFwiTklOSkFcIixcblx0XHRcIk5PVEVcIixcblx0XHRcIk5PVkVMXCIsXG5cdFx0XCJOVVJTRVwiLFxuXHRcdFwiTlVUXCIsXG5cdFx0XCJPQ1RPUFVTXCIsXG5cdFx0XCJPSUxcIixcblx0XHRcIk9MSVZFXCIsXG5cdFx0XCJPTFlNUFVTXCIsXG5cdFx0XCJPUEVSQVwiLFxuXHRcdFwiT1JBTkdFXCIsXG5cdFx0XCJPUkdBTlwiLFxuXHRcdFwiUEFMTVwiLFxuXHRcdFwiUEFOXCIsXG5cdFx0XCJQQU5UU1wiLFxuXHRcdFwiUEFQRVJcIixcblx0XHRcIlBBUkFDSFVURVwiLFxuXHRcdFwiUEFSS1wiLFxuXHRcdFwiUEFSVFwiLFxuXHRcdFwiUEFTU1wiLFxuXHRcdFwiUEFTVEVcIixcblx0XHRcIlBFTkdVSU5cIixcblx0XHRcIlBIT0VOSVhcIixcblx0XHRcIlBJQU5PXCIsXG5cdFx0XCJQSUVcIixcblx0XHRcIlBJTE9UXCIsXG5cdFx0XCJQSU5cIixcblx0XHRcIlBJUEVcIixcblx0XHRcIlBJUkFURVwiLFxuXHRcdFwiUElTVE9MXCIsXG5cdFx0XCJQSVRcIixcblx0XHRcIlBJVENIXCIsXG5cdFx0XCJQTEFORVwiLFxuXHRcdFwiUExBU1RJQ1wiLFxuXHRcdFwiUExBVEVcIixcblx0XHRcIlBMQVRZUFVTXCIsXG5cdFx0XCJQTEFZXCIsXG5cdFx0XCJQTE9UXCIsXG5cdFx0XCJQT0lOVFwiLFxuXHRcdFwiUE9JU09OXCIsXG5cdFx0XCJQT0xFXCIsXG5cdFx0XCJQT0xJQ0VcIixcblx0XHRcIlBPT0xcIixcblx0XHRcIlBPUlRcIixcblx0XHRcIlBPU1RcIixcblx0XHRcIlBPVU5EXCIsXG5cdFx0XCJQUkVTU1wiLFxuXHRcdFwiUFJJTkNFU1NcIixcblx0XHRcIlBVTVBLSU5cIixcblx0XHRcIlBVUElMXCIsXG5cdFx0XCJQWVJBTUlEXCIsXG5cdFx0XCJRVUVFTlwiLFxuXHRcdFwiUkFCQklUXCIsXG5cdFx0XCJSQUNLRVRcIixcblx0XHRcIlJBWVwiLFxuXHRcdFwiUkVWT0xVVElPTlwiLFxuXHRcdFwiUklOR1wiLFxuXHRcdFwiUk9CSU5cIixcblx0XHRcIlJPQk9UXCIsXG5cdFx0XCJST0NLXCIsXG5cdFx0XCJST01FXCIsXG5cdFx0XCJST09UXCIsXG5cdFx0XCJST1NFXCIsXG5cdFx0XCJST1VMRVRURVwiLFxuXHRcdFwiUk9VTkRcIixcblx0XHRcIlJPV1wiLFxuXHRcdFwiUlVMRVJcIixcblx0XHRcIlNBVEVMTElURVwiLFxuXHRcdFwiU0FUVVJOXCIsXG5cdFx0XCJTQ0FMRVwiLFxuXHRcdFwiU0NIT09MXCIsXG5cdFx0XCJTQ0lFTlRJU1RcIixcblx0XHRcIlNDT1JQSU9OXCIsXG5cdFx0XCJTQ1JFRU5cIixcblx0XHRcIlNDVUJBIERJVkVSXCIsXG5cdFx0XCJTRUFMXCIsXG5cdFx0XCJTRVJWRVJcIixcblx0XHRcIlNIQURPV1wiLFxuXHRcdFwiU0hBS0VTUEVBUkVcIixcblx0XHRcIlNIQVJLXCIsXG5cdFx0XCJTSElQXCIsXG5cdFx0XCJTSE9FXCIsXG5cdFx0XCJTSE9QXCIsXG5cdFx0XCJTSE9UXCIsXG5cdFx0XCJTSU5LXCIsXG5cdFx0XCJTS1lTQ1JBUEVSXCIsXG5cdFx0XCJTTElQXCIsXG5cdFx0XCJTTFVHXCIsXG5cdFx0XCJTTVVHR0xFUlwiLFxuXHRcdFwiU05PV1wiLFxuXHRcdFwiU05PV01BTlwiLFxuXHRcdFwiU09DS1wiLFxuXHRcdFwiU09MRElFUlwiLFxuXHRcdFwiU09VTFwiLFxuXHRcdFwiU09VTkRcIixcblx0XHRcIlNQQUNFXCIsXG5cdFx0XCJTUEVMTFwiLFxuXHRcdFwiU1BJREVSXCIsXG5cdFx0XCJTUElLRVwiLFxuXHRcdFwiU1BJTkVcIixcblx0XHRcIlNQT1RcIixcblx0XHRcIlNQUklOR1wiLFxuXHRcdFwiU1BZXCIsXG5cdFx0XCJTUVVBUkVcIixcblx0XHRcIlNUQURJVU1cIixcblx0XHRcIlNUQUZGXCIsXG5cdFx0XCJTVEFSXCIsXG5cdFx0XCJTVEFURVwiLFxuXHRcdFwiU1RJQ0tcIixcblx0XHRcIlNUT0NLXCIsXG5cdFx0XCJTVFJBV1wiLFxuXHRcdFwiU1RSRUFNXCIsXG5cdFx0XCJTVFJJS0VcIixcblx0XHRcIlNUUklOR1wiLFxuXHRcdFwiU1VCXCIsXG5cdFx0XCJTVUlUXCIsXG5cdFx0XCJTVVBFUkhFUk9cIixcblx0XHRcIlNXSU5HXCIsXG5cdFx0XCJTV0lUQ0hcIixcblx0XHRcIlRBQkxFXCIsXG5cdFx0XCJUQUJMRVRcIixcblx0XHRcIlRBR1wiLFxuXHRcdFwiVEFJTFwiLFxuXHRcdFwiVEFQXCIsXG5cdFx0XCJURUFDSEVSXCIsXG5cdFx0XCJURUxFU0NPUEVcIixcblx0XHRcIlRFTVBMRVwiLFxuXHRcdFwiVEhFQVRFUlwiLFxuXHRcdFwiVEhJRUZcIixcblx0XHRcIlRIVU1CXCIsXG5cdFx0XCJUSUNLXCIsXG5cdFx0XCJUSUVcIixcblx0XHRcIlRJTUVcIixcblx0XHRcIlRPS1lPXCIsXG5cdFx0XCJUT09USFwiLFxuXHRcdFwiVE9SQ0hcIixcblx0XHRcIlRPV0VSXCIsXG5cdFx0XCJUUkFDS1wiLFxuXHRcdFwiVFJBSU5cIixcblx0XHRcIlRSSUFOR0xFXCIsXG5cdFx0XCJUUklQXCIsXG5cdFx0XCJUUlVOS1wiLFxuXHRcdFwiVFVCRVwiLFxuXHRcdFwiVFVSS0VZXCIsXG5cdFx0XCJVTkRFUlRBS0VSXCIsXG5cdFx0XCJVTklDT1JOXCIsXG5cdFx0XCJWQUNVVU1cIixcblx0XHRcIlZBTlwiLFxuXHRcdFwiVkVUXCIsXG5cdFx0XCJXQUtFXCIsXG5cdFx0XCJXQUxMXCIsXG5cdFx0XCJXQVJcIixcblx0XHRcIldBU0hFUlwiLFxuXHRcdFwiV0FTSElOR1RPTlwiLFxuXHRcdFwiV0FUQ0hcIixcblx0XHRcIldBVEVSXCIsXG5cdFx0XCJXQVZFXCIsXG5cdFx0XCJXRUJcIixcblx0XHRcIldFTExcIixcblx0XHRcIldIQUxFXCIsXG5cdFx0XCJXSElQXCIsXG5cdFx0XCJXSU5EXCIsXG5cdFx0XCJXSVRDSFwiLFxuXHRcdFwiV09STVwiLFxuXHRcdFwiWUFSRFwiXG5cdF1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9kYXRhL3dvcmRzLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnQgY2xhc3MgVGhlbWUge1xuXG5cdGNvbnN0cnVjdG9yKCkge31cblxuXHRzdGF0aWMgY29uZmlndXJlKCRtZFRoZW1pbmdQcm92aWRlcikge1xuXHRcdHZhciBjdXN0b21QcmltYXJ5ID0ge1xuXHRcdFx0JzUwJzogJyM1MjhlYmInLFxuXHRcdFx0JzEwMCc6ICcjNDU4MWFmJyxcblx0XHRcdCcyMDAnOiAnIzNlNzM5ZCcsXG5cdFx0XHQnMzAwJzogJyMzNjY2OGInLFxuXHRcdFx0JzQwMCc6ICcjMmY1ODc4Jyxcblx0XHRcdCc1MDAnOiAnIzI4NEI2NicsXG5cdFx0XHQnNjAwJzogJyMyMTNlNTQnLFxuXHRcdFx0JzcwMCc6ICcjMWEzMDQxJyxcblx0XHRcdCc4MDAnOiAnIzEyMjMyZicsXG5cdFx0XHQnOTAwJzogJyMwYjE1MWQnLFxuXHRcdFx0J0ExMDAnOiAnIzY1OWFjMicsXG5cdFx0XHQnQTIwMCc6ICcjNzdhNmNhJyxcblx0XHRcdCdBNDAwJzogJyM4OWIyZDEnLFxuXHRcdFx0J0E3MDAnOiAnIzA0MDgwYSdcblx0XHR9O1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlclxuXHRcdFx0LmRlZmluZVBhbGV0dGUoJ2N1c3RvbVByaW1hcnknLCBcblx0XHRcdFx0XHRcdFx0Y3VzdG9tUHJpbWFyeSk7XG5cblx0XHR2YXIgY3VzdG9tQWNjZW50ID0ge1xuXHRcdFx0JzUwJzogJyMyZDEwMTAnLFxuXHRcdFx0JzEwMCc6ICcjNDAxNjE2Jyxcblx0XHRcdCcyMDAnOiAnIzUzMWQxZCcsXG5cdFx0XHQnMzAwJzogJyM2NjIzMjMnLFxuXHRcdFx0JzQwMCc6ICcjNzkyYTJhJyxcblx0XHRcdCc1MDAnOiAnIzhjMzAzMCcsXG5cdFx0XHQnNjAwJzogJyNiMjNlM2UnLFxuXHRcdFx0JzcwMCc6ICcjYzA0OTQ5Jyxcblx0XHRcdCc4MDAnOiAnI2M3NWM1YycsXG5cdFx0XHQnOTAwJzogJyNjZDZmNmYnLFxuXHRcdFx0J0ExMDAnOiAnI2IyM2UzZScsXG5cdFx0XHQnQTIwMCc6ICcjOUYzNzM3Jyxcblx0XHRcdCdBNDAwJzogJyM4YzMwMzAnLFxuXHRcdFx0J0E3MDAnOiAnI2Q0ODI4Midcblx0XHR9O1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlclxuXHRcdFx0LmRlZmluZVBhbGV0dGUoJ2N1c3RvbUFjY2VudCcsIFxuXHRcdFx0XHRcdFx0XHRjdXN0b21BY2NlbnQpO1xuXG5cdFx0dmFyIGN1c3RvbVdhcm4gPSB7XG5cdFx0XHQnNTAnOiAnI2EyNTFiZScsXG5cdFx0XHQnMTAwJzogJyM5NjQzYjMnLFxuXHRcdFx0JzIwMCc6ICcjODczY2ExJyxcblx0XHRcdCczMDAnOiAnIzc3MzU4ZScsXG5cdFx0XHQnNDAwJzogJyM2ODJlN2MnLFxuXHRcdFx0JzUwMCc6ICcjNTgyNzY5Jyxcblx0XHRcdCc2MDAnOiAnIzQ4MjA1NicsXG5cdFx0XHQnNzAwJzogJyMzOTE5NDQnLFxuXHRcdFx0JzgwMCc6ICcjMjkxMjMxJyxcblx0XHRcdCc5MDAnOiAnIzFhMGIxZicsXG5cdFx0XHQnQTEwMCc6ICcjYWM2NGM1Jyxcblx0XHRcdCdBMjAwJzogJyNiNjc2Y2MnLFxuXHRcdFx0J0E0MDAnOiAnI2MwODlkMycsXG5cdFx0XHQnQTcwMCc6ICcjMGEwNDBjJ1xuXHRcdH07XG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyXG5cdFx0XHQuZGVmaW5lUGFsZXR0ZSgnY3VzdG9tV2FybicsIFxuXHRcdFx0XHRcdFx0XHRjdXN0b21XYXJuKTtcblxuXHRcdHZhciBjdXN0b21CYWNrZ3JvdW5kID0ge1xuXHRcdFx0JzUwJzogJyM3MzczNzMnLFxuXHRcdFx0JzEwMCc6ICcjNjY2NjY2Jyxcblx0XHRcdCcyMDAnOiAnIzU5NTk1OScsXG5cdFx0XHQnMzAwJzogJyM0ZDRkNGQnLFxuXHRcdFx0JzQwMCc6ICcjNDA0MDQwJyxcblx0XHRcdCc1MDAnOiAnIzMzMycsXG5cdFx0XHQnNjAwJzogJyMyNjI2MjYnLFxuXHRcdFx0JzcwMCc6ICcjMWExYTFhJyxcblx0XHRcdCc4MDAnOiAnIzBkMGQwZCcsXG5cdFx0XHQnOTAwJzogJyMwMDAwMDAnLFxuXHRcdFx0J0ExMDAnOiAnIzgwODA4MCcsXG5cdFx0XHQnQTIwMCc6ICcjOGM4YzhjJyxcblx0XHRcdCdBNDAwJzogJyM5OTk5OTknLFxuXHRcdFx0J0E3MDAnOiAnIzAwMDAwMCdcblx0XHR9O1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlclxuXHRcdFx0LmRlZmluZVBhbGV0dGUoJ2N1c3RvbUJhY2tncm91bmQnLCBcblx0XHRcdFx0XHRcdFx0Y3VzdG9tQmFja2dyb3VuZCk7XG5cblx0ICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0Jylcblx0XHQgICAucHJpbWFyeVBhbGV0dGUoJ2N1c3RvbVByaW1hcnknKVxuXHRcdCAgIC5hY2NlbnRQYWxldHRlKCdjdXN0b21BY2NlbnQnKVxuXHRcdCAgIC53YXJuUGFsZXR0ZSgnY3VzdG9tV2FybicpXG5cdFx0ICAgLmJhY2tncm91bmRQYWxldHRlKCdjdXN0b21CYWNrZ3JvdW5kJyk7XG4gICB9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvanMvdGhlbWUuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9