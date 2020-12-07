"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverName = exports.getTeamName = void 0;
const teamIds = {
    0: "Mercedes",
    1: "Ferrari",
    2: "Red Bull Racing",
    3: "Williams",
    4: "Racing Point",
    5: "Renault",
    6: "Alpha Tauri",
    7: "Haas",
    8: "McLaren",
    9: "Alfa Romeo",
    10: "McLaren 1988",
    11: "McLaren 1991",
    12: "Williams 1992",
    13: "Ferrari 1995",
    14: "Williams 1996",
    15: "McLaren 1998",
    16: "Ferrari 2002",
    17: "Ferrari 2004",
    18: "Renault 2006",
    19: "Ferrari 2007",
    20: "McLaren 2008",
    21: "Red Bull 2010",
    22: "Ferrari 1976",
    23: "ART Grand Prix",
    24: "Campos Vexatec Racing",
    25: "Carlin",
    26: "Charouz Racing System",
    27: "DAMS",
    28: "Russian Time",
    29: "MP Motorsport",
    30: "Pertamina",
    31: "McLaren 1990",
    32: "Trident",
    33: "BWT Arden",
    34: "McLaren 1976",
    35: "Lotus 1972",
    36: "Ferrari 1979",
    37: "McLaren 1982",
    38: "Williams 2003",
    39: "Brawn 2009",
    40: "Lotus 1978",
    41: "F1 Generic car",
    42: "Art GP ’19",
    43: "Campos ’19",
    44: "Carlin ’19",
    45: "Sauber Junior Charouz ’19",
    46: "Dams ’19",
    47: "Uni-Virtuosi ‘19",
    48: "MP Motorsport ‘19",
    49: "Prema ’19",
    50: "Trident ’19",
    51: "Arden ’19",
    53: "Benetton 1994",
    54: "Benetton 1995",
    55: "Ferrari 2000",
    56: "Jordan 1991",
    255: "My Team "
};
const driverIds = {
    0: "Carlos Sainz",
    1: "Daniil Kvyat",
    2: "Daniel Ricciardo",
    6: "Kimi Räikkönen",
    7: "Lewis Hamilton",
    9: "Max Verstappen",
    10: "Nico Hulkenburg",
    11: "Kevin Magnussen",
    12: "Romain Grosjean",
    13: "Sebastian Vettel",
    14: "Sergio Perez",
    15: "Valtteri Bottas",
    17: "Esteban Ocon",
    19: "Lance Stroll",
    20: "Arron Barnes",
    21: "Martin Giles",
    22: "Alex Murray",
    23: "Lucas Roth",
    24: "Igor Correia",
    25: "Sophie Levasseur",
    26: "Jonas Schiffer",
    27: "Alain Forest",
    28: "Jay Letourneau",
    29: "Esto Saari",
    30: "Yasar Atiyeh",
    31: "Callisto Calabresi",
    32: "Naota Izum",
    33: "Howard Clarke",
    34: "Wilheim Kaufmann",
    35: "Marie Laursen",
    36: "Flavio Nieves",
    37: "Peter Belousov",
    38: "Klimek Michalski",
    39: "Santiago Moreno",
    40: "Benjamin Coppens",
    41: "Noah Visser",
    42: "Gert Waldmuller",
    43: "Julian Quesada",
    44: "Daniel Jones",
    45: "Artem Markelov",
    46: "Tadasuke Makino",
    47: "Sean Gelael",
    48: "Nyck De Vries",
    49: "Jack Aitken",
    50: "George Russell",
    51: "Maximilian Günther",
    52: "Nirei Fukuzumi",
    53: "Luca Ghiotto",
    54: "Lando Norris",
    55: "Sérgio Sette Câmara",
    56: "Louis Delétraz",
    57: "Antonio Fuoco",
    58: "Charles Leclerc",
    59: "Pierre Gasly",
    62: "Alexander Albon",
    63: "Nicholas Latifi",
    64: "Dorian Boccolacci",
    65: "Niko Kari",
    66: "Roberto Merhi",
    67: "Arjun Maini",
    68: "Alessio Lorandi",
    69: "Ruben Meijer",
    70: "Rashid Nair",
    71: "Jack Tremblay",
    74: "Antonio Giovinazzi",
    75: "Robert Kubica",
    78: "Nobuharu Matsushita",
    79: "Nikita Mazepin",
    80: "Guanya Zhou",
    81: "Mick Schumacher",
    82: "Callum Ilott",
    83: "Juan Manuel Correa",
    84: "Jordan King",
    85: "Mahaveer Raghunathan",
    86: "Tatiana Calderon",
    87: "Anthoine Hubert",
    88: "Guiliano Alesi",
    89: "Ralph Boschung"
};
function getTeamName(id) {
    return teamIds[id];
}
exports.getTeamName = getTeamName;
function getDriverName(id) {
    return driverIds[id];
}
exports.getDriverName = getDriverName;
