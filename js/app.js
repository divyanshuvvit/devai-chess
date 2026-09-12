/*
 * =========================================
 * DEV CHESS
 * APPLICATION ENTRY POINT (v2)
 * =========================================
 */

/* =========================================
   SCREEN ELEMENTS
========================================= */

const landingScreen = document.getElementById("landing-screen");
const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");

/* =========================================
   LANDING BUTTONS
========================================= */

const aiModeButton = document.getElementById("ai-mode-btn");
const localModeButton = document.getElementById("local-mode-btn");

/* =========================================
   SETUP ELEMENTS
========================================= */

const setupTitle = document.getElementById("setup-title");
const setupSubtitle = document.getElementById("setup-subtitle");
const aiSettings = document.getElementById("ai-settings");
const localSettings = document.getElementById("local-settings");
const setupBackButton = document.getElementById("setup-back-btn");
const startGameButton = document.getElementById("start-game-btn");

/* =========================================
   GAME SCREEN ELEMENTS
========================================= */

const chessBoardEl = document.getElementById("chess-board");
const opponentNameEl = document.getElementById("opponent-name");
const playerNameEl = document.getElementById("player-name");
const opponentStatusEl = document.getElementById("opponent-status");
const playerStatusEl = document.getElementById("player-status");
const opponentClockEl = document.getElementById("opponent-clock");
const playerClockEl = document.getElementById("player-clock");
const movesListEl = document.getElementById("moves-list");
const moveCountEl = document.getElementById("move-count");
const evalDisplayEl = document.getElementById("eval-display");
const opponentCapturedEl = document.getElementById("opponent-captured");
const playerCapturedEl = document.getElementById("player-captured");
const materialDiffEl = document.getElementById("material-diff");

const undoBtn = document.getElementById("undo-btn");
const restartBtn = document.getElementById("restart-btn");
const hintBtn = document.getElementById("hint-btn");
const analysisBtn = document.getElementById("analysis-btn");
const flipBtn = document.getElementById("flip-btn");
const pgnBtn = document.getElementById("pgn-btn");
const drawBtn = document.getElementById("draw-btn");
const resignBtn = document.getElementById("resign-btn");
const menuBtn = document.getElementById("menu-btn");
const soundButton = document.getElementById("sound-btn");

const reviewBar = document.getElementById("review-bar");
const reviewLabel = document.getElementById("review-label");
const reviewLiveBtn = document.getElementById("review-live-btn");

const promotionModal = document.getElementById("promotion-modal");
const promotionChoicesEl = document.getElementById("promotion-choices");

const confirmModal = document.getElementById("confirm-modal");
const confirmTitleEl = document.getElementById("confirm-title");
const confirmMessageEl = document.getElementById("confirm-message");
const confirmYesBtn = document.getElementById("confirm-yes-btn");
const confirmNoBtn = document.getElementById("confirm-no-btn");

const gameOverModal = document.getElementById("game-over-modal");
const resultIconEl = document.getElementById("result-icon");
const resultTitleEl = document.getElementById("result-title");
const resultMessageEl = document.getElementById("result-message");
const newGameBtn = document.getElementById("new-game-btn");
const reviewGameBtn = document.getElementById("review-game-btn");

const toastEl = document.getElementById("toast");

/* =========================================
   GAME CONFIGURATION
========================================= */

const gameConfig = {
    mode: "AI",
    playerColor: "white",
    difficulty: "intermediate",
    time: 0,
    orientation: "auto"
};

/* =========================================
   CHESS CONSTANTS
========================================= */

const PIECE_UNICODE = {
    wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
    bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟"
};

const PIECE_VALUE = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };
const DISPLAY_VALUE = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };

// A large-but-finite sentinel used for alpha/beta bounds instead of
// JS Infinity — using real Infinity breaks null-move pruning's window
// arithmetic (-Infinity + 1 === -Infinity collapses the window).
const INF = 10000000;

const PAWN_TABLE = [
    0, 0, 0, 0, 0, 0, 0, 0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5, 5, 10, 25, 25, 10, 5, 5,
    0, 0, 0, 20, 20, 0, 0, 0,
    5, -5, -10, 0, 0, -10, -5, 5,
    5, 10, 10, -20, -20, 10, 10, 5,
    0, 0, 0, 0, 0, 0, 0, 0
];

const KNIGHT_TABLE = [
    -50, -40, -30, -30, -30, -30, -40, -50,
    -40, -20, 0, 0, 0, 0, -20, -40,
    -30, 0, 10, 15, 15, 10, 0, -30,
    -30, 5, 15, 20, 20, 15, 5, -30,
    -30, 0, 15, 20, 20, 15, 0, -30,
    -30, 5, 10, 15, 15, 10, 5, -30,
    -40, -20, 0, 5, 5, 0, -20, -40,
    -50, -40, -30, -30, -30, -30, -40, -50
];

const BISHOP_TABLE = [
    -20, -10, -10, -10, -10, -10, -10, -20,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -10, 0, 5, 10, 10, 5, 0, -10,
    -10, 5, 5, 10, 10, 5, 5, -10,
    -10, 0, 10, 10, 10, 10, 0, -10,
    -10, 10, 10, 10, 10, 10, 10, -10,
    -10, 5, 0, 0, 0, 0, 5, -10,
    -20, -10, -10, -10, -10, -10, -10, -20
];

const ROOK_TABLE = [
    0, 0, 0, 0, 0, 0, 0, 0,
    5, 10, 10, 10, 10, 10, 10, 5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    0, 0, 0, 5, 5, 0, 0, 0
];

const QUEEN_TABLE = [
    -20, -10, -10, -5, -5, -10, -10, -20,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -10, 0, 5, 5, 5, 5, 0, -10,
    -5, 0, 5, 5, 5, 5, 0, -5,
    0, 0, 5, 5, 5, 5, 0, -5,
    -10, 5, 5, 5, 5, 5, 0, -10,
    -10, 0, 5, 0, 0, 0, 0, -10,
    -20, -10, -10, -5, -5, -10, -10, -20
];

const KING_TABLE = [
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -20, -30, -30, -40, -40, -30, -30, -20,
    -10, -20, -20, -20, -20, -20, -20, -10,
    20, 20, 0, 0, 0, 0, 20, 20,
    20, 30, 10, 0, 0, 10, 30, 20
];

const PST = { P: PAWN_TABLE, N: KNIGHT_TABLE, B: BISHOP_TABLE, R: ROOK_TABLE, Q: QUEEN_TABLE, K: KING_TABLE };

const DIFFICULTY_SETTINGS = {
    beginner: { maxDepth: 2, noise: 200, timeLimit: 200 },
    casual: { maxDepth: 3, noise: 120, timeLimit: 400 },
    intermediate: { maxDepth: 4, noise: 60, timeLimit: 700 },
    advanced: { maxDepth: 5, noise: 25, timeLimit: 1200 },
    expert: { maxDepth: 6, noise: 10, timeLimit: 2000 },
    master: { maxDepth: 7, noise: 0, timeLimit: 3000 },
    "dev-ai": { maxDepth: 9, noise: 0, timeLimit: 4500 }
};

/* =========================================
   GAME STATE
========================================= */

let state = null;          // { board, turn, castling, enPassant, halfmove, fullmove }
let moveLog = [];          // [{ san, color, stateAfter, clocks:{w,b}, captured, from, to }]
let selectedSquare = null; // { row, col }
let legalMovesForSelected = [];
let lastMove = null;       // { from, to }
let playerColor = "w";
let aiColor = "b";
let isGameOver = false;
let boardFlipped = false;
let clocks = { w: 0, b: 0 };
let timerInterval = null;
let analysisOn = false;
let aiThinking = false;
let reviewIndex = null;    // null = live. otherwise number of half-moves shown.
let lastPGNResult = "*";
let dragState = null;

const transpositionTable = new Map();

/* =========================================
   BOARD / STATE HELPERS
========================================= */

function createInitialBoard() {
    return [
        ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
        ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
        ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
    ];
}

function createInitialState() {
    return {
        board: createInitialBoard(),
        turn: "w",
        castling: { wK: true, wQ: true, bK: true, bQ: true },
        enPassant: null,
        halfmove: 0,
        fullmove: 1
    };
}

function cloneState(s) {
    return {
        board: s.board.map(row => row.slice()),
        turn: s.turn,
        castling: { ...s.castling },
        enPassant: s.enPassant ? { ...s.enPassant } : null,
        halfmove: s.halfmove,
        fullmove: s.fullmove
    };
}

function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function opponentOf(color) {
    return color === "w" ? "b" : "w";
}

function colToFile(c) {
    return String.fromCharCode(97 + c);
}

function rowToRank(r) {
    return String(8 - r);
}

/* =========================================
   ATTACK DETECTION
========================================= */

function isSquareAttacked(board, row, col, byColor) {
    const pawnDir = byColor === "w" ? 1 : -1;
    for (const dc of [-1, 1]) {
        const pr = row + pawnDir;
        const pc = col + dc;
        if (inBounds(pr, pc) && board[pr][pc] === byColor + "P") return true;
    }

    const knightOffsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (const [dr, dc] of knightOffsets) {
        const nr = row + dr, nc = col + dc;
        if (inBounds(nr, nc) && board[nr][nc] === byColor + "N") return true;
    }

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr, nc = col + dc;
            if (inBounds(nr, nc) && board[nr][nc] === byColor + "K") return true;
        }
    }

    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagDirs) {
        let nr = row + dr, nc = col + dc;
        while (inBounds(nr, nc)) {
            const p = board[nr][nc];
            if (p) {
                if (p[0] === byColor && (p[1] === "B" || p[1] === "Q")) return true;
                break;
            }
            nr += dr; nc += dc;
        }
    }

    const straightDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of straightDirs) {
        let nr = row + dr, nc = col + dc;
        while (inBounds(nr, nc)) {
            const p = board[nr][nc];
            if (p) {
                if (p[0] === byColor && (p[1] === "R" || p[1] === "Q")) return true;
                break;
            }
            nr += dr; nc += dc;
        }
    }

    return false;
}

function findKing(board, color) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === color + "K") return { row: r, col: c };
        }
    }
    return null;
}

function isInCheck(s, color) {
    const kingPos = findKing(s.board, color);
    if (!kingPos) return false;
    return isSquareAttacked(s.board, kingPos.row, kingPos.col, opponentOf(color));
}

/* =========================================
   MOVE GENERATION
========================================= */

function addPawnMove(moves, from, to, piece, captured, isEnPassant, promoRow) {
    if (to.row === promoRow) {
        for (const promo of ["Q", "R", "B", "N"]) {
            moves.push({ from, to, piece, captured, isEnPassant: !!isEnPassant, isCastle: null, promotion: promo });
        }
    } else {
        moves.push({ from, to, piece, captured, isEnPassant: !!isEnPassant, isCastle: null, promotion: null });
    }
}

function generatePseudoMoves(s, row, col) {
    const board = s.board;
    const piece = board[row][col];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];
    const moves = [];
    const from = { row, col };

    if (type === "P") {
        const dir = color === "w" ? -1 : 1;
        const startRow = color === "w" ? 6 : 1;
        const promoRow = color === "w" ? 0 : 7;

        const oneRow = row + dir;
        if (inBounds(oneRow, col) && !board[oneRow][col]) {
            addPawnMove(moves, from, { row: oneRow, col }, piece, null, false, promoRow);
            const twoRow = row + 2 * dir;
            if (row === startRow && !board[twoRow][col]) {
                moves.push({ from, to: { row: twoRow, col }, piece, captured: null, isEnPassant: false, isCastle: null, promotion: null });
            }
        }

        for (const dc of [-1, 1]) {
            const nr = row + dir, nc = col + dc;
            if (!inBounds(nr, nc)) continue;
            const target = board[nr][nc];
            if (target && target[0] !== color) {
                addPawnMove(moves, from, { row: nr, col: nc }, piece, target, false, promoRow);
            } else if (!target && s.enPassant && s.enPassant.row === nr && s.enPassant.col === nc) {
                moves.push({ from, to: { row: nr, col: nc }, piece, captured: opponentOf(color) + "P", isEnPassant: true, isCastle: null, promotion: null });
            }
        }
    } else if (type === "N") {
        const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        for (const [dr, dc] of offsets) {
            const nr = row + dr, nc = col + dc;
            if (!inBounds(nr, nc)) continue;
            const target = board[nr][nc];
            if (!target || target[0] !== color) {
                moves.push({ from, to: { row: nr, col: nc }, piece, captured: target, isEnPassant: false, isCastle: null, promotion: null });
            }
        }
    } else if (type === "B" || type === "R" || type === "Q") {
        const dirs = [];
        if (type === "B" || type === "Q") dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
        if (type === "R" || type === "Q") dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
        for (const [dr, dc] of dirs) {
            let nr = row + dr, nc = col + dc;
            while (inBounds(nr, nc)) {
                const target = board[nr][nc];
                if (!target) {
                    moves.push({ from, to: { row: nr, col: nc }, piece, captured: null, isEnPassant: false, isCastle: null, promotion: null });
                } else {
                    if (target[0] !== color) {
                        moves.push({ from, to: { row: nr, col: nc }, piece, captured: target, isEnPassant: false, isCastle: null, promotion: null });
                    }
                    break;
                }
                nr += dr; nc += dc;
            }
        }
    } else if (type === "K") {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr, nc = col + dc;
                if (!inBounds(nr, nc)) continue;
                const target = board[nr][nc];
                if (!target || target[0] !== color) {
                    moves.push({ from, to: { row: nr, col: nc }, piece, captured: target, isEnPassant: false, isCastle: null, promotion: null });
                }
            }
        }

        const homeRow = color === "w" ? 7 : 0;
        if (row === homeRow && col === 4) {
            const opp = opponentOf(color);
            if (s.castling[color + "K"] && !board[homeRow][5] && !board[homeRow][6] &&
                board[homeRow][7] === color + "R" &&
                !isSquareAttacked(board, homeRow, 4, opp) &&
                !isSquareAttacked(board, homeRow, 5, opp) &&
                !isSquareAttacked(board, homeRow, 6, opp)) {
                moves.push({ from, to: { row: homeRow, col: 6 }, piece, captured: null, isEnPassant: false, isCastle: "K", promotion: null });
            }
            if (s.castling[color + "Q"] && !board[homeRow][1] && !board[homeRow][2] && !board[homeRow][3] &&
                board[homeRow][0] === color + "R" &&
                !isSquareAttacked(board, homeRow, 4, opp) &&
                !isSquareAttacked(board, homeRow, 3, opp) &&
                !isSquareAttacked(board, homeRow, 2, opp)) {
                moves.push({ from, to: { row: homeRow, col: 2 }, piece, captured: null, isEnPassant: false, isCastle: "Q", promotion: null });
            }
        }
    }

    return moves;
}

function applyMove(s, move) {
    const ns = cloneState(s);
    const { from, to, piece } = move;
    const color = piece[0];
    const type = piece[1];

    if (move.isEnPassant) {
        ns.board[from.row][to.col] = null;
    }

    ns.board[from.row][from.col] = null;
    let placedPiece = piece;
    if (move.promotion) placedPiece = color + move.promotion;
    ns.board[to.row][to.col] = placedPiece;

    if (move.isCastle === "K") {
        const row = from.row;
        ns.board[row][5] = ns.board[row][7];
        ns.board[row][7] = null;
    } else if (move.isCastle === "Q") {
        const row = from.row;
        ns.board[row][3] = ns.board[row][0];
        ns.board[row][0] = null;
    }

    let newEnPassant = null;
    if (type === "P" && Math.abs(to.row - from.row) === 2) {
        newEnPassant = { row: (to.row + from.row) / 2, col: from.col };
    }
    ns.enPassant = newEnPassant;

    if (type === "K") {
        ns.castling[color + "K"] = false;
        ns.castling[color + "Q"] = false;
    }
    if (type === "R") {
        const homeRow = color === "w" ? 7 : 0;
        if (from.row === homeRow && from.col === 0) ns.castling[color + "Q"] = false;
        if (from.row === homeRow && from.col === 7) ns.castling[color + "K"] = false;
    }
    if (move.captured && move.captured[1] === "R") {
        const oc = move.captured[0];
        const homeRow = oc === "w" ? 7 : 0;
        if (to.row === homeRow && to.col === 0) ns.castling[oc + "Q"] = false;
        if (to.row === homeRow && to.col === 7) ns.castling[oc + "K"] = false;
    }

    if (type === "P" || move.captured) {
        ns.halfmove = 0;
    } else {
        ns.halfmove = ns.halfmove + 1;
    }
    if (color === "b") ns.fullmove = ns.fullmove + 1;

    ns.turn = opponentOf(color);
    return ns;
}

function wouldLeaveKingInCheck(s, move, color) {
    const ns = applyMove(s, move);
    return isInCheck(ns, color);
}

function getAllLegalMoves(s, color) {
    const all = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = s.board[r][c];
            if (p && p[0] === color) {
                const pseudo = generatePseudoMoves(s, r, c);
                for (const m of pseudo) {
                    if (!wouldLeaveKingInCheck(s, m, color)) all.push(m);
                }
            }
        }
    }
    return all;
}

function getLegalMovesFrom(s, row, col) {
    const piece = s.board[row][col];
    if (!piece) return [];
    const pseudo = generatePseudoMoves(s, row, col);
    return pseudo.filter(m => !wouldLeaveKingInCheck(s, m, piece[0]));
}

/* =========================================
   GAME END DETECTION
========================================= */

function hasInsufficientMaterial(board) {
    const pieces = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c]) pieces.push(board[r][c]);
        }
    }
    if (pieces.length > 4) return false;
    const nonKings = pieces.filter(p => p[1] !== "K");
    if (nonKings.length === 0) return true;
    if (nonKings.length === 1 && (nonKings[0][1] === "B" || nonKings[0][1] === "N")) return true;
    return false;
}

function evaluateGameStatus(s) {
    const legalMoves = getAllLegalMoves(s, s.turn);
    const inCheck = isInCheck(s, s.turn);

    if (legalMoves.length === 0) {
        if (inCheck) return { over: true, result: "checkmate", winner: opponentOf(s.turn) };
        return { over: true, result: "stalemate", winner: null };
    }
    if (s.halfmove >= 100) return { over: true, result: "fifty-move", winner: null };
    if (hasInsufficientMaterial(s.board)) return { over: true, result: "insufficient-material", winner: null };

    return { over: false, inCheck };
}

/* =========================================
   REPETITION TRACKING
========================================= */

function encodePosition(s) {
    let key = "";
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            key += s.board[r][c] || "--";
        }
    }
    key += "_" + s.turn;
    key += "_" + (s.castling.wK ? 1 : 0) + (s.castling.wQ ? 1 : 0) + (s.castling.bK ? 1 : 0) + (s.castling.bQ ? 1 : 0);
    key += "_" + (s.enPassant ? s.enPassant.row + "," + s.enPassant.col : "x");
    return key;
}

function getPositionKeysUpTo(count) {
    const keys = [encodePosition(createInitialState())];
    for (let i = 0; i < count; i++) keys.push(encodePosition(moveLog[i].stateAfter));
    return keys;
}

function repetitionCount(count) {
    const keys = getPositionKeysUpTo(count);
    const current = keys[keys.length - 1];
    return keys.filter(k => k === current).length;
}

/* =========================================
   FAST SEARCH ENGINE (make/unmake, no cloning)
   Used only inside the AI search — the slower
   immutable helpers above remain the source of
   truth for game rules, SAN, and the UI.
========================================= */

function hasNonPawnMaterial(s, color) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = s.board[r][c];
            if (p && p[0] === color && p[1] !== "P" && p[1] !== "K") return true;
        }
    }
    return false;
}

function makeMove(s, move) {
    const { from, to, piece, captured, isEnPassant, isCastle, promotion } = move;
    const color = piece[0];
    const type = piece[1];

    const undo = {
        move,
        prevCastling: { ...s.castling },
        prevEnPassant: s.enPassant,
        prevHalfmove: s.halfmove,
        prevFullmove: s.fullmove,
        capturedSquare: null,
        capturedPiece: null
    };

    if (isEnPassant) {
        undo.capturedSquare = { row: from.row, col: to.col };
        undo.capturedPiece = s.board[from.row][to.col];
        s.board[from.row][to.col] = null;
    } else if (captured) {
        undo.capturedSquare = { row: to.row, col: to.col };
        undo.capturedPiece = captured;
    }

    s.board[from.row][from.col] = null;
    s.board[to.row][to.col] = promotion ? color + promotion : piece;

    if (isCastle === "K") {
        const row = from.row;
        s.board[row][5] = s.board[row][7];
        s.board[row][7] = null;
    } else if (isCastle === "Q") {
        const row = from.row;
        s.board[row][3] = s.board[row][0];
        s.board[row][0] = null;
    }

    s.enPassant = (type === "P" && Math.abs(to.row - from.row) === 2)
        ? { row: (to.row + from.row) / 2, col: from.col }
        : null;

    if (type === "K") {
        s.castling[color + "K"] = false;
        s.castling[color + "Q"] = false;
    }
    if (type === "R") {
        const homeRow = color === "w" ? 7 : 0;
        if (from.row === homeRow && from.col === 0) s.castling[color + "Q"] = false;
        if (from.row === homeRow && from.col === 7) s.castling[color + "K"] = false;
    }
    if (captured && captured[1] === "R") {
        const oc = captured[0];
        const homeRow = oc === "w" ? 7 : 0;
        if (to.row === homeRow && to.col === 0) s.castling[oc + "Q"] = false;
        if (to.row === homeRow && to.col === 7) s.castling[oc + "K"] = false;
    }

    s.halfmove = (type === "P" || captured) ? 0 : s.halfmove + 1;
    if (color === "b") s.fullmove += 1;
    s.turn = opponentOf(color);

    return undo;
}

function unmakeMove(s, undo) {
    const { move } = undo;
    const { from, to, piece, isCastle } = move;
    const color = piece[0];

    if (isCastle === "K") {
        const row = from.row;
        s.board[row][7] = s.board[row][5];
        s.board[row][5] = null;
    } else if (isCastle === "Q") {
        const row = from.row;
        s.board[row][0] = s.board[row][3];
        s.board[row][3] = null;
    }

    s.board[from.row][from.col] = piece;
    s.board[to.row][to.col] = null;

    if (undo.capturedSquare) {
        s.board[undo.capturedSquare.row][undo.capturedSquare.col] = undo.capturedPiece;
    }

    s.castling = undo.prevCastling;
    s.enPassant = undo.prevEnPassant;
    s.halfmove = undo.prevHalfmove;
    s.fullmove = undo.prevFullmove;
    s.turn = color;
}

function makeNullMove(s) {
    const undo = { prevEnPassant: s.enPassant, prevTurn: s.turn };
    s.enPassant = null;
    s.turn = opponentOf(s.turn);
    return undo;
}

function unmakeNullMove(s, undo) {
    s.enPassant = undo.prevEnPassant;
    s.turn = undo.prevTurn;
}

function wouldLeaveKingInCheckFast(s, move, color) {
    const undo = makeMove(s, move);
    const inCheck = isInCheck(s, color);
    unmakeMove(s, undo);
    return inCheck;
}

function getAllLegalMovesFast(s, color) {
    const all = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = s.board[r][c];
            if (p && p[0] === color) {
                const pseudo = generatePseudoMoves(s, r, c);
                for (const m of pseudo) {
                    if (!wouldLeaveKingInCheckFast(s, m, color)) all.push(m);
                }
            }
        }
    }
    return all;
}

/* =========================================
   EVALUATION + AI (iterative deepening with a
   time budget, alpha-beta, transposition table,
   null-move pruning, history heuristic,
   quiescence search)
========================================= */

function evaluateBoard(s) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = s.board[r][c];
            if (!p) continue;
            const color = p[0], type = p[1];
            const tableIndex = color === "w" ? r * 8 + c : (7 - r) * 8 + c;
            const value = PIECE_VALUE[type] + PST[type][tableIndex];
            score += color === "w" ? value : -value;
        }
    }
    return score;
}

function sameMove(a, b) {
    if (!a || !b) return false;
    return a.from.row === b.from.row && a.from.col === b.from.col &&
        a.to.row === b.to.row && a.to.col === b.to.col &&
        a.promotion === b.promotion;
}

function historyKey(m) {
    return m.from.row + "," + m.from.col + "-" + m.to.row + "," + m.to.col;
}

function orderMoves(moves, priorityMove, killerMove, historyTable) {
    return moves.slice().sort((a, b) => {
        const scoreOf = (m) => {
            if (priorityMove && sameMove(m, priorityMove)) return 10000000;
            if (m.captured) return 1000000 + PIECE_VALUE[m.captured[1]] - PIECE_VALUE[m.piece[1]] / 10;
            if (m.promotion === "Q") return 500000;
            if (killerMove && sameMove(m, killerMove)) return 400000;
            if (historyTable) return historyTable.get(historyKey(m)) || 0;
            return 0;
        };
        return scoreOf(b) - scoreOf(a);
    });
}

class SearchTimeout extends Error {}

let nodeCounter = 0;
let searchDeadline = Infinity;

function checkTime() {
    nodeCounter++;
    if ((nodeCounter & 2047) === 0 && Date.now() > searchDeadline) {
        throw new SearchTimeout();
    }
}

function quiescence(s, alpha, beta, qDepth) {
    checkTime();
    const standPat = evaluateBoard(s) * (s.turn === "w" ? 1 : -1);
    if (qDepth <= 0) return standPat;
    if (standPat >= beta) return beta;
    if (alpha < standPat) alpha = standPat;

    const legalMoves = getAllLegalMovesFast(s, s.turn);
    const captures = legalMoves.filter(m => m.captured || m.isEnPassant);
    const ordered = orderMoves(captures, null, null, null);

    for (const m of ordered) {
        const undo = makeMove(s, m);
        let score;
        try {
            score = -quiescence(s, -beta, -alpha, qDepth - 1);
        } finally {
            unmakeMove(s, undo);
        }
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
    }
    return alpha;
}

function negamax(s, depth, alpha, beta, killers, historyTable) {
    checkTime();
    const alphaOrig = alpha;
    const key = encodePosition(s);
    const cached = transpositionTable.get(key);
    if (cached && cached.depth >= depth) {
        if (cached.flag === "EXACT") return cached.score;
        if (cached.flag === "LOWER") alpha = Math.max(alpha, cached.score);
        else if (cached.flag === "UPPER") beta = Math.min(beta, cached.score);
        if (alpha >= beta) return cached.score;
    }

    const inCheck = isInCheck(s, s.turn);

    if (!inCheck && depth >= 3 && hasNonPawnMaterial(s, s.turn)) {
        const nullUndo = makeNullMove(s);
        let nullScore;
        try {
            nullScore = -negamax(s, depth - 3, -beta, -beta + 1, killers, historyTable);
        } finally {
            unmakeNullMove(s, nullUndo);
        }
        if (nullScore >= beta) return beta;
    }

    const legalMoves = getAllLegalMovesFast(s, s.turn);
    if (legalMoves.length === 0) {
        if (inCheck) return -100000 - depth;
        return 0;
    }
    if (depth === 0) {
        return quiescence(s, alpha, beta, 4);
    }

    const priorityMove = cached ? cached.bestMove : null;
    const killerMove = killers ? killers[depth] : null;
    const ordered = orderMoves(legalMoves, priorityMove, killerMove, historyTable);

    let best = -INF;
    let bestMove = null;
    for (const m of ordered) {
        const undo = makeMove(s, m);
        let score;
        try {
            score = -negamax(s, depth - 1, -beta, -alpha, killers, historyTable);
        } finally {
            unmakeMove(s, undo);
        }
        if (score > best) { best = score; bestMove = m; }
        if (best > alpha) alpha = best;
        if (alpha >= beta) {
            if (!m.captured && killers) {
                killers[depth] = m;
                historyTable.set(historyKey(m), (historyTable.get(historyKey(m)) || 0) + depth * depth);
            }
            break;
        }
    }

    let flag;
    if (best <= alphaOrig) flag = "UPPER";
    else if (best >= beta) flag = "LOWER";
    else flag = "EXACT";
    transpositionTable.set(key, { depth, score: best, flag, bestMove });

    return best;
}

function findBestMove(sourceState, maxDepth, noise, timeLimitMs) {
    const s = cloneState(sourceState);
    const legalMoves = getAllLegalMovesFast(s, s.turn);
    if (legalMoves.length === 0) return null;

    if (maxDepth <= 0) {
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    transpositionTable.clear();
    nodeCounter = 0;
    searchDeadline = Date.now() + (timeLimitMs || 5000);

    const killers = {};
    const historyTable = new Map();
    let orderHint = null;
    let finalSorted = [{ move: legalMoves[0], score: 0 }];

    for (let depth = 1; depth <= maxDepth; depth++) {
        const scored = [];
        try {
            const ordered = orderMoves(legalMoves, orderHint, null, historyTable);
            let alpha = -INF;
            const beta = INF;

            for (const m of ordered) {
                const undo = makeMove(s, m);
                let score;
                try {
                    score = -negamax(s, depth - 1, -beta, -alpha, killers, historyTable);
                } finally {
                    unmakeMove(s, undo);
                }
                if (noise && depth === maxDepth) score += (Math.random() * 2 - 1) * noise;
                scored.push({ move: m, score });
                if (score > alpha) alpha = score;
            }
        } catch (e) {
            if (e instanceof SearchTimeout) break;
            throw e;
        }

        if (scored.length === 0) break;
        scored.sort((a, b) => b.score - a.score);
        orderHint = scored[0].move;
        finalSorted = scored;

        if (Math.abs(scored[0].score) > 90000) break; // forced mate found — no need to search deeper
    }

    return finalSorted[0].move;
}

/* =========================================
   SAN NOTATION
========================================= */

function moveToSAN(s, move, legalMovesAll, resultingState) {
    let san;

    if (move.isCastle === "K") {
        san = "O-O";
    } else if (move.isCastle === "Q") {
        san = "O-O-O";
    } else {
        const pieceLetter = move.piece[1] === "P" ? "" : move.piece[1];
        const destSquare = colToFile(move.to.col) + rowToRank(move.to.row);
        const isCapture = !!move.captured || move.isEnPassant;
        let disambiguation = "";

        if (move.piece[1] !== "P") {
            const others = legalMovesAll.filter(m =>
                m.piece === move.piece &&
                !(m.from.row === move.from.row && m.from.col === move.from.col) &&
                m.to.row === move.to.row && m.to.col === move.to.col
            );
            if (others.length > 0) {
                const sameFile = others.some(m => m.from.col === move.from.col);
                const sameRank = others.some(m => m.from.row === move.from.row);
                if (!sameFile) disambiguation = colToFile(move.from.col);
                else if (!sameRank) disambiguation = rowToRank(move.from.row);
                else disambiguation = colToFile(move.from.col) + rowToRank(move.from.row);
            }
        } else if (isCapture) {
            disambiguation = colToFile(move.from.col);
        }

        const promo = move.promotion ? "=" + move.promotion : "";
        san = pieceLetter + disambiguation + (isCapture ? "x" : "") + destSquare + promo;
    }

    const opp = opponentOf(move.piece[0]);
    const oppLegal = getAllLegalMoves(resultingState, opp);
    const oppInCheck = isInCheck(resultingState, opp);
    if (oppInCheck && oppLegal.length === 0) san += "#";
    else if (oppInCheck) san += "+";

    return san;
}


/* =========================================
   SOUND ENGINE
   Browser-generated sounds. No audio files required.
========================================= */

let soundEnabled = true;
let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        audioContext = new AudioContextClass();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
    }
    return audioContext;
}

function tone(frequency, duration, type = "sine", volume = 0.045, delay = 0) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + delay;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
}

function playGameSound(type) {
    if (!soundEnabled) return;

    if (type === "select") {
        tone(620, .07, "sine", .035);
    } else if (type === "move") {
        tone(420, .07, "triangle", .045);
        tone(560, .09, "triangle", .035, .055);
    } else if (type === "capture") {
        tone(250, .09, "square", .045);
        tone(170, .13, "square", .035, .07);
    } else if (type === "castle") {
        tone(420, .07, "triangle", .04);
        tone(520, .07, "triangle", .035, .08);
        tone(650, .11, "triangle", .03, .16);
    } else if (type === "promotion") {
        tone(520, .08, "sine", .04);
        tone(660, .08, "sine", .04, .08);
        tone(820, .14, "sine", .035, .16);
    } else if (type === "check") {
        tone(740, .10, "sawtooth", .04);
        tone(920, .13, "sawtooth", .03, .10);
    } else if (type === "win") {
        tone(523, .12, "sine", .05);
        tone(659, .12, "sine", .05, .13);
        tone(784, .16, "sine", .05, .26);
        tone(1047, .30, "sine", .045, .43);
    } else if (type === "lose") {
        tone(392, .16, "sawtooth", .04);
        tone(311, .18, "sawtooth", .035, .15);
        tone(233, .30, "sine", .03, .31);
    } else if (type === "draw") {
        tone(440, .13, "triangle", .04);
        tone(370, .18, "triangle", .035, .14);
    }
}

function updateSoundButton() {
    if (!soundButton) return;
    soundButton.textContent = soundEnabled ? "🔊" : "🔇";
    soundButton.setAttribute("aria-label", soundEnabled ? "Mute game sounds" : "Enable game sounds");
    soundButton.title = soundEnabled ? "Mute game sounds" : "Enable game sounds";
    soundButton.setAttribute("aria-pressed", String(!soundEnabled));
}

soundButton?.addEventListener("click", event => {
    event.stopPropagation();
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        getAudioContext();
        playGameSound("select");
    }
    updateSoundButton();
});

document.addEventListener("pointerdown", () => {
    if (soundEnabled) getAudioContext();
}, { once: true });

updateSoundButton();

/* =========================================
   TOAST
========================================= */

let toastTimeout = null;

function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.remove("hidden");
    requestAnimationFrame(() => toastEl.classList.add("visible"));
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastEl.classList.remove("visible");
        setTimeout(() => toastEl.classList.add("hidden"), 250);
    }, 2200);
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) { /* fall through to legacy method */ }
    }
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch (e) {
        return false;
    }
}

/* =========================================
   CONFIRM MODAL
========================================= */

function showConfirm(title, message, onYes) {
    confirmTitleEl.textContent = title;
    confirmMessageEl.textContent = message;
    confirmModal.classList.remove("hidden");

    const cleanup = () => {
        confirmModal.classList.add("hidden");
        confirmYesBtn.removeEventListener("click", yesHandler);
        confirmNoBtn.removeEventListener("click", noHandler);
    };
    const yesHandler = () => { cleanup(); onYes(); };
    const noHandler = () => { cleanup(); };

    confirmYesBtn.addEventListener("click", yesHandler);
    confirmNoBtn.addEventListener("click", noHandler);
}

/* =========================================
   SCREEN NAVIGATION
========================================= */

function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
}

aiModeButton.addEventListener("click", () => {
    gameConfig.mode = "AI";
    setupTitle.textContent = "Play vs DEV AI";
    setupSubtitle.textContent = "Configure your game before challenging DEV AI.";
    aiSettings.classList.remove("hidden");
    localSettings.classList.add("hidden");
    showScreen(setupScreen);
});

localModeButton.addEventListener("click", () => {
    gameConfig.mode = "LOCAL";
    setupTitle.textContent = "Play with Friend";
    setupSubtitle.textContent = "Two players. One board. No AI.";
    aiSettings.classList.add("hidden");
    localSettings.classList.remove("hidden");
    showScreen(setupScreen);
});

document.querySelectorAll(".color-choice").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".color-choice").forEach(o => o.classList.remove("selected"));
        button.classList.add("selected");
        gameConfig.playerColor = button.dataset.color;
    });
});

document.querySelectorAll(".difficulty-option").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".difficulty-option").forEach(o => o.classList.remove("selected"));
        button.classList.add("selected");
        gameConfig.difficulty = button.dataset.level;
    });
});

document.querySelectorAll(".time-option").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".time-option").forEach(o => o.classList.remove("selected"));
        button.classList.add("selected");
        gameConfig.time = Number(button.dataset.time);
    });
});

document.querySelectorAll(".orientation-choice").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".orientation-choice").forEach(o => o.classList.remove("selected"));
        button.classList.add("selected");
        gameConfig.orientation = button.dataset.orientation;
    });
});

setupBackButton.addEventListener("click", () => {
    showScreen(landingScreen);
});

startGameButton.addEventListener("click", () => {
    startNewGame();
    showScreen(gameScreen);
});

/* =========================================
   GAME SETUP
========================================= */

function startNewGame() {
    stopTimer();

    if (gameConfig.mode === "AI") {
        let color = gameConfig.playerColor;
        if (color === "random") color = Math.random() < 0.5 ? "white" : "black";
        playerColor = color === "white" ? "w" : "b";
        aiColor = opponentOf(playerColor);
        boardFlipped = playerColor === "b";
    } else {
        playerColor = "w";
        aiColor = null;
        boardFlipped = false;
    }

    state = createInitialState();
    moveLog = [];
    selectedSquare = null;
    legalMovesForSelected = [];
    lastMove = null;
    isGameOver = false;
    aiThinking = false;
    aiRequestId++;
    reviewIndex = null;
    lastPGNResult = "*";
    clocks = { w: gameConfig.time, b: gameConfig.time };

    evalDisplayEl.classList.add("hidden");
    analysisOn = false;
    gameScreen.classList.remove("game-result-active");
    document.querySelector(".board-wrapper")?.classList.remove("board-victory", "board-defeat", "board-draw");

    updateGameHeader();
    updateReviewBar();
    renderMoveList();
    renderCaptured();
    renderBoard();
    updateStatusText();
    startTimer();

    if (gameConfig.mode === "AI" && state.turn === aiColor) {
        scheduleAIMove();
    }
}

function updateGameHeader() {
    if (gameConfig.mode === "AI") {
        opponentNameEl.textContent = "DEV AI";
        playerNameEl.textContent = "You";
    } else {
        opponentNameEl.textContent = "Player 2 (Black)";
        playerNameEl.textContent = "Player 1 (White)";
    }
    updateClockDisplay();
}

/* =========================================
   REVIEW MODE HELPERS
========================================= */

function isReviewing() {
    return reviewIndex !== null;
}

function getHistoricalState(idx) {
    if (idx <= 0) return createInitialState();
    return moveLog[idx - 1].stateAfter;
}

function historicalLastMove(idx) {
    if (idx <= 0) return null;
    const entry = moveLog[idx - 1];
    return { from: entry.from, to: entry.to };
}

function updateReviewBar() {
    if (!isReviewing()) {
        reviewBar.classList.add("hidden");
        return;
    }
    reviewBar.classList.remove("hidden");
    reviewLabel.textContent = reviewIndex === 0 ? "Reviewing: start position" : `Reviewing move ${reviewIndex} of ${moveLog.length}`;
}

function jumpToMove(idx) {
    reviewIndex = idx;
    selectedSquare = null;
    legalMovesForSelected = [];
    renderBoard();
    renderMoveList();
    renderCaptured();
    updateReviewBar();
}

reviewLiveBtn.addEventListener("click", () => {
    reviewIndex = null;
    renderBoard();
    renderMoveList();
    renderCaptured();
    updateReviewBar();
});

/* =========================================
   BOARD RENDERING
========================================= */

function renderBoard() {
    chessBoardEl.innerHTML = "";

    const reviewing = isReviewing();
    const displayState = reviewing ? getHistoricalState(reviewIndex) : state;
    const displayLastMove = reviewing ? historicalLastMove(reviewIndex) : lastMove;

    for (let displayRow = 0; displayRow < 8; displayRow++) {
        for (let displayCol = 0; displayCol < 8; displayCol++) {
            const row = boardFlipped ? 7 - displayRow : displayRow;
            const col = boardFlipped ? 7 - displayCol : displayCol;

            const square = document.createElement("div");
            square.className = "square " + ((row + col) % 2 === 0 ? "light" : "dark");
            square.dataset.row = String(row);
            square.dataset.col = String(col);

            let coord = "";
            if (displayCol === 0) coord += rowToRank(row);
            if (displayRow === 7) coord += colToFile(col);
            if (coord) square.dataset.coordinate = coord;

            const piece = displayState.board[row][col];
            if (piece) {
                square.classList.add(piece[0] === "w" ? "white-piece" : "black-piece");
                const pieceSpan = document.createElement("span");
                pieceSpan.className = "piece";
                pieceSpan.textContent = PIECE_UNICODE[piece];
                square.appendChild(pieceSpan);

                if (!reviewing) attachPieceDrag(pieceSpan, row, col);
            }

            if (!reviewing && selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
                square.classList.add("selected");
            }

            if (displayLastMove && ((displayLastMove.from.row === row && displayLastMove.from.col === col) ||
                (displayLastMove.to.row === row && displayLastMove.to.col === col))) {
                square.classList.add("last-move");
            }

            const kingPos = findKing(displayState.board, displayState.turn);
            if (kingPos && kingPos.row === row && kingPos.col === col && isInCheck(displayState, displayState.turn)) {
                square.classList.add("in-check");
            }

            if (!reviewing) {
                const legalMove = legalMovesForSelected.find(m => m.to.row === row && m.to.col === col);
                if (legalMove) {
                    square.classList.add("legal-target");
                    const marker = document.createElement("div");
                    marker.className = legalMove.captured || legalMove.isEnPassant ? "capture-ring" : "move-dot";
                    square.appendChild(marker);
                }
            }

            square.addEventListener("click", () => handleSquareClick(row, col));
            chessBoardEl.appendChild(square);
        }
    }

    updateEvalDisplay();
}

/* =========================================
   INTERACTION
========================================= */

function isHumanTurn() {
    if (isGameOver || aiThinking || isReviewing()) return false;
    if (gameConfig.mode === "AI") return state.turn === playerColor;
    return true;
}

function handleSquareClick(row, col) {
    if (!isHumanTurn()) return;

    const piece = state.board[row][col];

    if (selectedSquare) {
        const chosenMove = legalMovesForSelected.find(m => m.to.row === row && m.to.col === col);
        if (chosenMove) {
            const candidates = legalMovesForSelected.filter(m => m.to.row === row && m.to.col === col);
            if (candidates.length > 1) {
                promptPromotion(candidates, chosen => {
                    commitMove(chosen);
                });
            } else {
                commitMove(chosenMove);
            }
            return;
        }

        if (piece && piece[0] === state.turn) {
            selectSquare(row, col);
        } else {
            selectedSquare = null;
            legalMovesForSelected = [];
            renderBoard();
        }
        return;
    }

    if (piece && piece[0] === state.turn) {
        selectSquare(row, col);
    }
}

function selectSquare(row, col) {
    selectedSquare = { row, col };
    legalMovesForSelected = getLegalMovesFrom(state, row, col);
    renderBoard();
}

function promptPromotion(candidates, onChoose) {
    promotionChoicesEl.innerHTML = "";
    const color = candidates[0].piece[0];
    const order = ["Q", "R", "B", "N"];

    for (const promo of order) {
        const move = candidates.find(m => m.promotion === promo);
        if (!move) continue;
        const btn = document.createElement("button");
        btn.textContent = PIECE_UNICODE[color + promo];
        btn.addEventListener("click", () => {
            promotionModal.classList.add("hidden");
            onChoose(move);
        });
        promotionChoicesEl.appendChild(btn);
    }

    promotionModal.classList.remove("hidden");
}

function commitMove(move) {
    const legalMovesAll = getAllLegalMoves(state, state.turn);
    const resultingState = applyMove(state, move);
    const san = moveToSAN(state, move, legalMovesAll, resultingState);
    const color = state.turn;
    const capturedPiece = move.captured || (move.isEnPassant ? opponentOf(color) + "P" : null);

    moveLog.push({
        san, color,
        stateAfter: cloneState(resultingState),
        clocks: { ...clocks },
        captured: capturedPiece,
        from: move.from,
        to: move.to
    });

    if (move.isCastle) playGameSound("castle");
    else if (move.promotion) playGameSound("promotion");
    else if (move.captured || move.isEnPassant) playGameSound("capture");
    else playGameSound("move");

    state = resultingState;
    lastMove = { from: move.from, to: move.to };
    selectedSquare = null;
    legalMovesForSelected = [];

    if (gameConfig.mode === "LOCAL" && gameConfig.orientation === "flip-each-move") {
        boardFlipped = state.turn === "b";
    }

    renderMoveList();
    renderCaptured();
    renderBoard();
    updateStatusText();
    checkGameEnd();

    if (!isGameOver && isInCheck(state, state.turn)) {
        playGameSound("check");
    }

    if (!isGameOver && gameConfig.mode === "AI" && state.turn === aiColor) {
        scheduleAIMove();
    }
}

/* =========================================
   DRAG AND DROP
========================================= */

function attachPieceDrag(pieceEl, row, col) {
    pieceEl.addEventListener("pointerdown", event => {
        if (!isHumanTurn()) return;
        const piece = state.board[row][col];
        if (!piece || piece[0] !== state.turn) return;

        event.preventDefault();
        selectSquare(row, col);

        dragState = {
            row, col,
            pieceEl: chessBoardEl.querySelector(`.square[data-row="${row}"][data-col="${col}"] .piece`),
            startX: event.clientX,
            startY: event.clientY,
            dragging: false
        };

        window.addEventListener("pointermove", onDragMove);
        window.addEventListener("pointerup", onDragEnd);
    });
}

function onDragMove(event) {
    if (!dragState) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;

    if (!dragState.dragging && Math.hypot(dx, dy) > 6) {
        dragState.dragging = true;
        dragState.pieceEl.classList.add("dragging");
        dragState.pieceEl.closest(".square")?.classList.add("drag-source");
    }

    if (dragState.dragging) {
        dragState.pieceEl.style.left = event.clientX + "px";
        dragState.pieceEl.style.top = event.clientY + "px";
        dragState.pieceEl.style.transform = "translate(-50%, -50%) scale(1.18)";

        document.querySelectorAll(".square.drag-over").forEach(sq => sq.classList.remove("drag-over"));
        const el = document.elementFromPoint(event.clientX, event.clientY);
        const targetSquare = el ? el.closest(".square") : null;
        if (targetSquare) targetSquare.classList.add("drag-over");
    }
}

function onDragEnd(event) {
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", onDragEnd);
    if (!dragState) return;

    const wasDragging = dragState.dragging;
    const { pieceEl } = dragState;

    document.querySelectorAll(".square.drag-over").forEach(sq => sq.classList.remove("drag-over"));
    document.querySelectorAll(".square.drag-source").forEach(sq => sq.classList.remove("drag-source"));
    pieceEl?.classList.remove("dragging");
    if (pieceEl) {
        pieceEl.style.left = "";
        pieceEl.style.top = "";
        pieceEl.style.transform = "";
    }

    if (wasDragging) {
        const el = document.elementFromPoint(event.clientX, event.clientY);
        const targetSquare = el ? el.closest(".square") : null;
        dragState = null;

        if (targetSquare) {
            const tr = Number(targetSquare.dataset.row), tc = Number(targetSquare.dataset.col);
            const candidates = legalMovesForSelected.filter(m => m.to.row === tr && m.to.col === tc);
            if (candidates.length > 1) {
                promptPromotion(candidates, chosen => commitMove(chosen));
            } else if (candidates.length === 1) {
                commitMove(candidates[0]);
            } else {
                selectedSquare = null;
                legalMovesForSelected = [];
                renderBoard();
            }
        } else {
            selectedSquare = null;
            legalMovesForSelected = [];
            renderBoard();
        }
    } else {
        dragState = null;
    }
}

/* =========================================
   AI MOVE
   The heavy search runs in a Web Worker so the
   UI never freezes, however deep it searches.
   The worker's source is embedded below (as a
   string) and turned into a Blob URL at runtime
   so everything still lives in this one file —
   no separate worker file to keep track of.
   Falls back to a bounded main-thread search if
   workers are unavailable.
========================================= */

const AI_WORKER_SOURCE = `
/*
 * =========================================
 * DEV CHESS — AI SEARCH WORKER
 * Runs the full search off the main thread so
 * the UI stays responsive at any search depth.
 * Self-contained: no imports, classic worker.
 * =========================================
 */

const PIECE_VALUE = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };

// A large-but-finite sentinel used for alpha/beta bounds instead of
// JS Infinity — using real Infinity breaks null-move pruning's window
// arithmetic (-Infinity + 1 === -Infinity collapses the window).
const INF = 10000000;

const PAWN_TABLE = [
    0, 0, 0, 0, 0, 0, 0, 0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5, 5, 10, 25, 25, 10, 5, 5,
    0, 0, 0, 20, 20, 0, 0, 0,
    5, -5, -10, 0, 0, -10, -5, 5,
    5, 10, 10, -20, -20, 10, 10, 5,
    0, 0, 0, 0, 0, 0, 0, 0
];

const KNIGHT_TABLE = [
    -50, -40, -30, -30, -30, -30, -40, -50,
    -40, -20, 0, 0, 0, 0, -20, -40,
    -30, 0, 10, 15, 15, 10, 0, -30,
    -30, 5, 15, 20, 20, 15, 5, -30,
    -30, 0, 15, 20, 20, 15, 0, -30,
    -30, 5, 10, 15, 15, 10, 5, -30,
    -40, -20, 0, 5, 5, 0, -20, -40,
    -50, -40, -30, -30, -30, -30, -40, -50
];

const BISHOP_TABLE = [
    -20, -10, -10, -10, -10, -10, -10, -20,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -10, 0, 5, 10, 10, 5, 0, -10,
    -10, 5, 5, 10, 10, 5, 5, -10,
    -10, 0, 10, 10, 10, 10, 0, -10,
    -10, 10, 10, 10, 10, 10, 10, -10,
    -10, 5, 0, 0, 0, 0, 5, -10,
    -20, -10, -10, -10, -10, -10, -10, -20
];

const ROOK_TABLE = [
    0, 0, 0, 0, 0, 0, 0, 0,
    5, 10, 10, 10, 10, 10, 10, 5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5,
    0, 0, 0, 5, 5, 0, 0, 0
];

const QUEEN_TABLE = [
    -20, -10, -10, -5, -5, -10, -10, -20,
    -10, 0, 0, 0, 0, 0, 0, -10,
    -10, 0, 5, 5, 5, 5, 0, -10,
    -5, 0, 5, 5, 5, 5, 0, -5,
    0, 0, 5, 5, 5, 5, 0, -5,
    -10, 5, 5, 5, 5, 5, 0, -10,
    -10, 0, 5, 0, 0, 0, 0, -10,
    -20, -10, -10, -5, -5, -10, -10, -20
];

const KING_TABLE = [
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -30, -40, -40, -50, -50, -40, -40, -30,
    -20, -30, -30, -40, -40, -30, -30, -20,
    -10, -20, -20, -20, -20, -20, -20, -10,
    20, 20, 0, 0, 0, 0, 20, 20,
    20, 30, 10, 0, 0, 10, 30, 20
];

const PST = { P: PAWN_TABLE, N: KNIGHT_TABLE, B: BISHOP_TABLE, R: ROOK_TABLE, Q: QUEEN_TABLE, K: KING_TABLE };

function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function opponentOf(color) {
    return color === "w" ? "b" : "w";
}

/* ---------- attack detection ---------- */

function isSquareAttacked(board, row, col, byColor) {
    const pawnDir = byColor === "w" ? 1 : -1;
    for (const dc of [-1, 1]) {
        const pr = row + pawnDir, pc = col + dc;
        if (inBounds(pr, pc) && board[pr][pc] === byColor + "P") return true;
    }

    const knightOffsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (const [dr, dc] of knightOffsets) {
        const nr = row + dr, nc = col + dc;
        if (inBounds(nr, nc) && board[nr][nc] === byColor + "N") return true;
    }

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr, nc = col + dc;
            if (inBounds(nr, nc) && board[nr][nc] === byColor + "K") return true;
        }
    }

    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        let nr = row + dr, nc = col + dc;
        while (inBounds(nr, nc)) {
            const p = board[nr][nc];
            if (p) {
                if (p[0] === byColor && (p[1] === "B" || p[1] === "Q")) return true;
                break;
            }
            nr += dr; nc += dc;
        }
    }

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        let nr = row + dr, nc = col + dc;
        while (inBounds(nr, nc)) {
            const p = board[nr][nc];
            if (p) {
                if (p[0] === byColor && (p[1] === "R" || p[1] === "Q")) return true;
                break;
            }
            nr += dr; nc += dc;
        }
    }

    return false;
}

function findKing(board, color) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === color + "K") return { row: r, col: c };
        }
    }
    return null;
}

function isInCheck(s, color) {
    const kingPos = findKing(s.board, color);
    if (!kingPos) return false;
    return isSquareAttacked(s.board, kingPos.row, kingPos.col, opponentOf(color));
}

/* ---------- move generation ---------- */

function addPawnMove(moves, from, to, piece, captured, isEnPassant, promoRow) {
    if (to.row === promoRow) {
        for (const promo of ["Q", "R", "B", "N"]) {
            moves.push({ from, to, piece, captured, isEnPassant: !!isEnPassant, isCastle: null, promotion: promo });
        }
    } else {
        moves.push({ from, to, piece, captured, isEnPassant: !!isEnPassant, isCastle: null, promotion: null });
    }
}

function generatePseudoMoves(s, row, col) {
    const board = s.board;
    const piece = board[row][col];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];
    const moves = [];
    const from = { row, col };

    if (type === "P") {
        const dir = color === "w" ? -1 : 1;
        const startRow = color === "w" ? 6 : 1;
        const promoRow = color === "w" ? 0 : 7;

        const oneRow = row + dir;
        if (inBounds(oneRow, col) && !board[oneRow][col]) {
            addPawnMove(moves, from, { row: oneRow, col }, piece, null, false, promoRow);
            const twoRow = row + 2 * dir;
            if (row === startRow && !board[twoRow][col]) {
                moves.push({ from, to: { row: twoRow, col }, piece, captured: null, isEnPassant: false, isCastle: null, promotion: null });
            }
        }

        for (const dc of [-1, 1]) {
            const nr = row + dir, nc = col + dc;
            if (!inBounds(nr, nc)) continue;
            const target = board[nr][nc];
            if (target && target[0] !== color) {
                addPawnMove(moves, from, { row: nr, col: nc }, piece, target, false, promoRow);
            } else if (!target && s.enPassant && s.enPassant.row === nr && s.enPassant.col === nc) {
                moves.push({ from, to: { row: nr, col: nc }, piece, captured: opponentOf(color) + "P", isEnPassant: true, isCastle: null, promotion: null });
            }
        }
    } else if (type === "N") {
        const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        for (const [dr, dc] of offsets) {
            const nr = row + dr, nc = col + dc;
            if (!inBounds(nr, nc)) continue;
            const target = board[nr][nc];
            if (!target || target[0] !== color) {
                moves.push({ from, to: { row: nr, col: nc }, piece, captured: target, isEnPassant: false, isCastle: null, promotion: null });
            }
        }
    } else if (type === "B" || type === "R" || type === "Q") {
        const dirs = [];
        if (type === "B" || type === "Q") dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
        if (type === "R" || type === "Q") dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
        for (const [dr, dc] of dirs) {
            let nr = row + dr, nc = col + dc;
            while (inBounds(nr, nc)) {
                const target = board[nr][nc];
                if (!target) {
                    moves.push({ from, to: { row: nr, col: nc }, piece, captured: null, isEnPassant: false, isCastle: null, promotion: null });
                } else {
                    if (target[0] !== color) {
                        moves.push({ from, to: { row: nr, col: nc }, piece, captured: target, isEnPassant: false, isCastle: null, promotion: null });
                    }
                    break;
                }
                nr += dr; nc += dc;
            }
        }
    } else if (type === "K") {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr, nc = col + dc;
                if (!inBounds(nr, nc)) continue;
                const target = board[nr][nc];
                if (!target || target[0] !== color) {
                    moves.push({ from, to: { row: nr, col: nc }, piece, captured: target, isEnPassant: false, isCastle: null, promotion: null });
                }
            }
        }

        const homeRow = color === "w" ? 7 : 0;
        if (row === homeRow && col === 4) {
            const opp = opponentOf(color);
            if (s.castling[color + "K"] && !board[homeRow][5] && !board[homeRow][6] &&
                board[homeRow][7] === color + "R" &&
                !isSquareAttacked(board, homeRow, 4, opp) &&
                !isSquareAttacked(board, homeRow, 5, opp) &&
                !isSquareAttacked(board, homeRow, 6, opp)) {
                moves.push({ from, to: { row: homeRow, col: 6 }, piece, captured: null, isEnPassant: false, isCastle: "K", promotion: null });
            }
            if (s.castling[color + "Q"] && !board[homeRow][1] && !board[homeRow][2] && !board[homeRow][3] &&
                board[homeRow][0] === color + "R" &&
                !isSquareAttacked(board, homeRow, 4, opp) &&
                !isSquareAttacked(board, homeRow, 3, opp) &&
                !isSquareAttacked(board, homeRow, 2, opp)) {
                moves.push({ from, to: { row: homeRow, col: 2 }, piece, captured: null, isEnPassant: false, isCastle: "Q", promotion: null });
            }
        }
    }

    return moves;
}

/* ---------- make / unmake (mutating, fast) ---------- */

function hasNonPawnMaterial(s, color) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = s.board[r][c];
            if (p && p[0] === color && p[1] !== "P" && p[1] !== "K") return true;
        }
    }
    return false;
}

function makeMove(s, move) {
    const { from, to, piece, captured, isEnPassant, isCastle, promotion } = move;
    const color = piece[0];
    const type = piece[1];

    const undo = {
        move,
        prevCastling: { ...s.castling },
        prevEnPassant: s.enPassant,
        prevHalfmove: s.halfmove,
        prevFullmove: s.fullmove,
        capturedSquare: null,
        capturedPiece: null
    };

    if (isEnPassant) {
        undo.capturedSquare = { row: from.row, col: to.col };
        undo.capturedPiece = s.board[from.row][to.col];
        s.board[from.row][to.col] = null;
    } else if (captured) {
        undo.capturedSquare = { row: to.row, col: to.col };
        undo.capturedPiece = captured;
    }

    s.board[from.row][from.col] = null;
    s.board[to.row][to.col] = promotion ? color + promotion : piece;

    if (isCastle === "K") {
        const row = from.row;
        s.board[row][5] = s.board[row][7];
        s.board[row][7] = null;
    } else if (isCastle === "Q") {
        const row = from.row;
        s.board[row][3] = s.board[row][0];
        s.board[row][0] = null;
    }

    s.enPassant = (type === "P" && Math.abs(to.row - from.row) === 2)
        ? { row: (to.row + from.row) / 2, col: from.col }
        : null;

    if (type === "K") {
        s.castling[color + "K"] = false;
        s.castling[color + "Q"] = false;
    }
    if (type === "R") {
        const homeRow = color === "w" ? 7 : 0;
        if (from.row === homeRow && from.col === 0) s.castling[color + "Q"] = false;
        if (from.row === homeRow && from.col === 7) s.castling[color + "K"] = false;
    }
    if (captured && captured[1] === "R") {
        const oc = captured[0];
        const homeRow = oc === "w" ? 7 : 0;
        if (to.row === homeRow && to.col === 0) s.castling[oc + "Q"] = false;
        if (to.row === homeRow && to.col === 7) s.castling[oc + "K"] = false;
    }

    s.halfmove = (type === "P" || captured) ? 0 : s.halfmove + 1;
    if (color === "b") s.fullmove += 1;
    s.turn = opponentOf(color);

    return undo;
}

function unmakeMove(s, undo) {
    const { move } = undo;
    const { from, to, piece, isCastle } = move;
    const color = piece[0];

    if (isCastle === "K") {
        const row = from.row;
        s.board[row][7] = s.board[row][5];
        s.board[row][5] = null;
    } else if (isCastle === "Q") {
        const row = from.row;
        s.board[row][0] = s.board[row][3];
        s.board[row][3] = null;
    }

    s.board[from.row][from.col] = piece;
    s.board[to.row][to.col] = null;

    if (undo.capturedSquare) {
        s.board[undo.capturedSquare.row][undo.capturedSquare.col] = undo.capturedPiece;
    }

    s.castling = undo.prevCastling;
    s.enPassant = undo.prevEnPassant;
    s.halfmove = undo.prevHalfmove;
    s.fullmove = undo.prevFullmove;
    s.turn = color;
}

function makeNullMove(s) {
    const undo = { prevEnPassant: s.enPassant, prevTurn: s.turn };
    s.enPassant = null;
    s.turn = opponentOf(s.turn);
    return undo;
}

function unmakeNullMove(s, undo) {
    s.enPassant = undo.prevEnPassant;
    s.turn = undo.prevTurn;
}

function wouldLeaveKingInCheck(s, move, color) {
    const undo = makeMove(s, move);
    const inCheck = isInCheck(s, color);
    unmakeMove(s, undo);
    return inCheck;
}

function getAllLegalMoves(s, color) {
    const all = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = s.board[r][c];
            if (p && p[0] === color) {
                const pseudo = generatePseudoMoves(s, r, c);
                for (const m of pseudo) {
                    if (!wouldLeaveKingInCheck(s, m, color)) all.push(m);
                }
            }
        }
    }
    return all;
}

/* ---------- evaluation ---------- */

function evaluateBoard(s) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = s.board[r][c];
            if (!p) continue;
            const color = p[0], type = p[1];
            const tableIndex = color === "w" ? r * 8 + c : (7 - r) * 8 + c;
            const value = PIECE_VALUE[type] + PST[type][tableIndex];
            score += color === "w" ? value : -value;
        }
    }
    return score;
}

function encodePosition(s) {
    let key = "";
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            key += s.board[r][c] || "--";
        }
    }
    key += "_" + s.turn;
    key += "_" + (s.castling.wK ? 1 : 0) + (s.castling.wQ ? 1 : 0) + (s.castling.bK ? 1 : 0) + (s.castling.bQ ? 1 : 0);
    key += "_" + (s.enPassant ? s.enPassant.row + "," + s.enPassant.col : "x");
    return key;
}

function sameMove(a, b) {
    if (!a || !b) return false;
    return a.from.row === b.from.row && a.from.col === b.from.col &&
        a.to.row === b.to.row && a.to.col === b.to.col &&
        a.promotion === b.promotion;
}

function historyKey(m) {
    return m.from.row + "," + m.from.col + "-" + m.to.row + "," + m.to.col;
}

function orderMoves(moves, priorityMove, killerMove, historyTable) {
    return moves.slice().sort((a, b) => {
        const scoreOf = (m) => {
            if (priorityMove && sameMove(m, priorityMove)) return 10000000;
            if (m.captured) return 1000000 + PIECE_VALUE[m.captured[1]] - PIECE_VALUE[m.piece[1]] / 10;
            if (m.promotion === "Q") return 500000;
            if (killerMove && sameMove(m, killerMove)) return 400000;
            if (historyTable) return historyTable.get(historyKey(m)) || 0;
            return 0;
        };
        return scoreOf(b) - scoreOf(a);
    });
}

/* ---------- search ---------- */

class SearchTimeout extends Error {}

const transpositionTable = new Map();
let nodeCounter = 0;
let searchDeadline = Infinity;

function checkTime() {
    nodeCounter++;
    if ((nodeCounter & 2047) === 0 && Date.now() > searchDeadline) {
        throw new SearchTimeout();
    }
}

function quiescence(s, alpha, beta, qDepth) {
    checkTime();
    const standPat = evaluateBoard(s) * (s.turn === "w" ? 1 : -1);
    if (qDepth <= 0) return standPat;
    if (standPat >= beta) return beta;
    if (alpha < standPat) alpha = standPat;

    const legalMoves = getAllLegalMoves(s, s.turn);
    const captures = legalMoves.filter(m => m.captured || m.isEnPassant);
    const ordered = orderMoves(captures, null, null, null);

    for (const m of ordered) {
        const undo = makeMove(s, m);
        let score;
        try {
            score = -quiescence(s, -beta, -alpha, qDepth - 1);
        } finally {
            unmakeMove(s, undo);
        }
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
    }
    return alpha;
}

function negamax(s, depth, alpha, beta, killers, historyTable) {
    checkTime();
    const alphaOrig = alpha;
    const key = encodePosition(s);
    const cached = transpositionTable.get(key);
    if (cached && cached.depth >= depth) {
        if (cached.flag === "EXACT") return cached.score;
        if (cached.flag === "LOWER") alpha = Math.max(alpha, cached.score);
        else if (cached.flag === "UPPER") beta = Math.min(beta, cached.score);
        if (alpha >= beta) return cached.score;
    }

    const inCheck = isInCheck(s, s.turn);

    if (!inCheck && depth >= 3 && hasNonPawnMaterial(s, s.turn)) {
        const nullUndo = makeNullMove(s);
        let nullScore;
        try {
            nullScore = -negamax(s, depth - 3, -beta, -beta + 1, killers, historyTable);
        } finally {
            unmakeNullMove(s, nullUndo);
        }
        if (nullScore >= beta) return beta;
    }

    const legalMoves = getAllLegalMoves(s, s.turn);
    if (legalMoves.length === 0) {
        if (inCheck) return -100000 - depth;
        return 0;
    }
    if (depth === 0) {
        return quiescence(s, alpha, beta, 4);
    }

    const priorityMove = cached ? cached.bestMove : null;
    const killerMove = killers ? killers[depth] : null;
    const ordered = orderMoves(legalMoves, priorityMove, killerMove, historyTable);

    let best = -INF;
    let bestMove = null;
    for (const m of ordered) {
        const undo = makeMove(s, m);
        let score;
        try {
            score = -negamax(s, depth - 1, -beta, -alpha, killers, historyTable);
        } finally {
            unmakeMove(s, undo);
        }
        if (score > best) { best = score; bestMove = m; }
        if (best > alpha) alpha = best;
        if (alpha >= beta) {
            if (!m.captured && killers) {
                killers[depth] = m;
                historyTable.set(historyKey(m), (historyTable.get(historyKey(m)) || 0) + depth * depth);
            }
            break;
        }
    }

    let flag;
    if (best <= alphaOrig) flag = "UPPER";
    else if (best >= beta) flag = "LOWER";
    else flag = "EXACT";
    transpositionTable.set(key, { depth, score: best, flag, bestMove });

    return best;
}

function findBestMove(s, maxDepth, noise, timeLimitMs) {
    const legalMoves = getAllLegalMoves(s, s.turn);
    if (legalMoves.length === 0) return null;

    if (maxDepth <= 0) {
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    transpositionTable.clear();
    nodeCounter = 0;
    searchDeadline = Date.now() + (timeLimitMs || 5000);

    const killers = {};
    const historyTable = new Map();
    let orderHint = null;
    let finalSorted = [{ move: legalMoves[0], score: 0 }];

    for (let depth = 1; depth <= maxDepth; depth++) {
        const scored = [];
        try {
            const ordered = orderMoves(legalMoves, orderHint, null, historyTable);
            let alpha = -INF;
            const beta = INF;

            for (const m of ordered) {
                const undo = makeMove(s, m);
                let score;
                try {
                    score = -negamax(s, depth - 1, -beta, -alpha, killers, historyTable);
                } finally {
                    unmakeMove(s, undo);
                }
                if (noise && depth === maxDepth) score += (Math.random() * 2 - 1) * noise;
                scored.push({ move: m, score });
                if (score > alpha) alpha = score;
            }
        } catch (e) {
            if (e instanceof SearchTimeout) break;
            throw e;
        }

        if (scored.length === 0) break;
        scored.sort((a, b) => b.score - a.score);
        orderHint = scored[0].move;
        finalSorted = scored;

        if (Math.abs(scored[0].score) > 90000) break; // forced mate found
    }

    return finalSorted[0].move;
}

/* ---------- worker entry point ---------- */

self.onmessage = function (event) {
    const data = event.data || {};
    const s = {
        board: data.board.map(row => row.slice()),
        turn: data.turn,
        castling: { ...data.castling },
        enPassant: data.enPassant ? { ...data.enPassant } : null,
        halfmove: data.halfmove,
        fullmove: data.fullmove
    };

    let move = null;
    try {
        move = findBestMove(s, data.maxDepth, data.noise, data.timeLimit);
    } catch (e) {
        move = null;
    }

    self.postMessage({ move });
};
`;

let aiWorker = null;
let aiWorkerFailed = false;
let aiWorkerUrl = null;
let aiRequestId = 0;

function getAIWorker() {
    if (aiWorkerFailed) return null;
    if (!aiWorker) {
        try {
            if (!aiWorkerUrl) {
                const blob = new Blob([AI_WORKER_SOURCE], { type: "application/javascript" });
                aiWorkerUrl = URL.createObjectURL(blob);
            }
            aiWorker = new Worker(aiWorkerUrl);
            aiWorker.onerror = () => {
                aiWorkerFailed = true;
                aiWorker = null;
            };
        } catch (e) {
            aiWorkerFailed = true;
            aiWorker = null;
        }
    }
    return aiWorker;
}

function scheduleAIMove() {
    aiThinking = true;
    opponentStatusEl.textContent = "Thinking...";

    const settings = DIFFICULTY_SETTINGS[gameConfig.difficulty] || DIFFICULTY_SETTINGS.intermediate;
    const requestId = ++aiRequestId;
    const worker = getAIWorker();

    const applyAIMove = move => {
        if (requestId !== aiRequestId || isGameOver || !state || state.turn !== aiColor) return;
        aiThinking = false;
        if (move) commitMove(move);
    };

    if (worker) {
        worker.onmessage = event => {
            if (requestId !== aiRequestId) return;
            if (event.data && event.data.move) {
                applyAIMove(event.data.move);
            } else {
                // Worker found nothing usable — fall back once, synchronously, at a safe depth.
                const move = findBestMove(state, Math.min(settings.maxDepth, 4), settings.noise, 400);
                applyAIMove(move);
            }
        };
        worker.postMessage({
            board: state.board,
            turn: state.turn,
            castling: state.castling,
            enPassant: state.enPassant,
            halfmove: state.halfmove,
            fullmove: state.fullmove,
            maxDepth: settings.maxDepth,
            noise: settings.noise,
            timeLimit: settings.timeLimit
        });
    } else {
        setTimeout(() => {
            if (requestId !== aiRequestId || isGameOver) { aiThinking = false; return; }
            const move = findBestMove(state, settings.maxDepth, settings.noise, settings.timeLimit);
            applyAIMove(move);
        }, 200);
    }
}

/* =========================================
   CAPTURED PIECES / MATERIAL
========================================= */

function materialValue(list) {
    return list.reduce((sum, p) => sum + DISPLAY_VALUE[p[1]], 0);
}

function renderCapturedList(container, list) {
    container.innerHTML = "";
    for (const p of list) {
        const span = document.createElement("span");
        span.className = "cap-piece";
        span.textContent = PIECE_UNICODE[p];
        container.appendChild(span);
    }
}

function renderCaptured() {
    const count = isReviewing() ? reviewIndex : moveLog.length;
    const byWhite = [];
    const byBlack = [];

    for (let i = 0; i < count; i++) {
        const entry = moveLog[i];
        if (!entry.captured) continue;
        if (entry.color === "w") byWhite.push(entry.captured);
        else byBlack.push(entry.captured);
    }

    const sortFn = (a, b) => PIECE_VALUE[b[1]] - PIECE_VALUE[a[1]];
    byWhite.sort(sortFn);
    byBlack.sort(sortFn);

    const whiteMaterial = materialValue(byWhite);
    const blackMaterial = materialValue(byBlack);
    const diff = whiteMaterial - blackMaterial;

    const topColor = gameConfig.mode === "AI" ? aiColor : "b";
    const bottomColor = opponentOf(topColor);

    renderCapturedList(opponentCapturedEl, topColor === "w" ? byWhite : byBlack);
    renderCapturedList(playerCapturedEl, bottomColor === "w" ? byWhite : byBlack);

    materialDiffEl.textContent = diff === 0 ? "" : `${diff > 0 ? "White" : "Black"} +${Math.abs(diff)}`;
}

/* =========================================
   STATUS / GAME END
========================================= */

function updateStatusText() {
    const inCheck = isInCheck(state, state.turn);

    let statusText;
    if (gameConfig.mode === "AI") {
        statusText = state.turn === playerColor ? "Your turn" : "Waiting...";
    } else {
        statusText = (state.turn === "w" ? "White" : "Black") + " to move";
    }
    if (inCheck && !isGameOver) statusText += " — Check!";

    const activeEl = (gameConfig.mode === "AI" && state.turn === aiColor) || (gameConfig.mode === "LOCAL" && state.turn === "b")
        ? opponentStatusEl
        : playerStatusEl;
    const inactiveEl = activeEl === opponentStatusEl ? playerStatusEl : opponentStatusEl;

    activeEl.textContent = statusText;
    activeEl.classList.toggle("status-check", inCheck && !isGameOver);
    inactiveEl.classList.remove("status-check");
    if (gameConfig.mode === "AI") {
        inactiveEl.textContent = state.turn === playerColor ? "Waiting..." : "Your turn";
    } else {
        inactiveEl.textContent = "";
    }

    playerClockEl.classList.toggle("active-clock", isActiveClock("player"));
    opponentClockEl.classList.toggle("active-clock", isActiveClock("opponent"));
}

function isActiveClock(which) {
    const topIsAI = gameConfig.mode === "AI" ? aiColor : "b";
    if (which === "opponent") return state.turn === topIsAI;
    return state.turn !== topIsAI;
}

function checkGameEnd() {
    const status = evaluateGameStatus(state);
    if (status.over) {
        isGameOver = true;
        stopTimer();
        showGameOver(status.result, status.winner);
        return;
    }

    if (repetitionCount(moveLog.length) >= 5) {
        isGameOver = true;
        stopTimer();
        showGameOver("repetition", null);
    }
}

function describeWinner(winner) {
    if (!winner) return "No one";
    if (gameConfig.mode === "AI") {
        return winner === playerColor ? "You" : "DEV AI";
    }
    return winner === "w" ? "White" : "Black";
}

function showGameOver(result, winner) {
    let title, message, icon = "♛";
    let resultClass = "result-draw";

    if (result === "checkmate") {
        title = "Checkmate";
        icon = winner === "w" ? "♔" : "♚";
        message = describeWinner(winner) + " wins by checkmate.";
        resultClass = winner === (gameConfig.mode === "AI" ? playerColor : "w") ? "result-win" : "result-loss";
    } else if (result === "stalemate") {
        title = "Stalemate";
        message = "The game is a draw.";
    } else if (result === "fifty-move") {
        title = "Draw";
        message = "Draw by the fifty-move rule.";
    } else if (result === "insufficient-material") {
        title = "Draw";
        message = "Draw by insufficient material.";
    } else if (result === "repetition") {
        title = "Draw";
        message = "Draw by repetition.";
    } else if (result === "agreement") {
        title = "Draw";
        message = "Draw by agreement.";
    } else if (result === "timeout") {
        title = "Time's Up";
        icon = winner === "w" ? "♔" : "♚";
        message = describeWinner(winner) + " wins on time.";
        resultClass = winner === (gameConfig.mode === "AI" ? playerColor : "w") ? "result-win" : "result-loss";
    } else if (result === "resignation") {
        title = "Game Over";
        icon = winner === "w" ? "♔" : "♚";
        message = describeWinner(winner) + " wins by resignation.";
        resultClass = winner === (gameConfig.mode === "AI" ? playerColor : "w") ? "result-win" : "result-loss";
    }

    lastPGNResult = winner === "w" ? "1-0" : winner === "b" ? "0-1" : (winner === null ? "1/2-1/2" : "*");

    resultIconEl.textContent = icon;
    resultTitleEl.textContent = title;
    resultMessageEl.textContent = message;

    gameOverModal.classList.remove("result-win", "result-loss", "result-draw");
    gameOverModal.classList.add(resultClass);
    gameOverModal.classList.remove("hidden");

    gameScreen.classList.add("game-result-active");
    const boardWrapper = document.querySelector(".board-wrapper");
    boardWrapper?.classList.remove("board-victory", "board-defeat", "board-draw");

    if (resultClass === "result-win") {
        boardWrapper?.classList.add("board-victory");
        playGameSound("win");
        createCelebration();
    } else if (resultClass === "result-loss") {
        boardWrapper?.classList.add("board-defeat");
        playGameSound("lose");
    } else {
        boardWrapper?.classList.add("board-draw");
        playGameSound("draw");
    }
}

function createCelebration() {
    const layer = document.getElementById("celebration-layer");
    if (!layer) return;
    layer.innerHTML = "";

    const symbols = ["♟", "♞", "♝", "♛", "✦", "◆", "•"];
    for (let i = 0; i < 48; i++) {
        const item = document.createElement("span");
        item.className = "celebration-piece";
        item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        item.style.setProperty("--x", `${Math.random() * 100}%`);
        item.style.setProperty("--size", `${10 + Math.random() * 18}px`);
        item.style.setProperty("--duration", `${2.2 + Math.random() * 2.2}s`);
        item.style.setProperty("--delay", `${Math.random() * .55}s`);
        item.style.setProperty("--drift", `${-140 + Math.random() * 280}px`);
        layer.appendChild(item);
    }
    setTimeout(() => { layer.innerHTML = ""; }, 5000);
}

/* =========================================
   MOVE LIST
========================================= */

function renderMoveList() {
    moveCountEl.textContent = String(moveLog.length);

    if (moveLog.length === 0) {
        movesListEl.innerHTML = '<p class="empty-message">No moves yet</p>';
        return;
    }

    movesListEl.innerHTML = "";
    for (let i = 0; i < moveLog.length; i += 2) {
        const row = document.createElement("div");
        row.className = "move-row";

        const num = document.createElement("span");
        num.className = "move-number";
        num.textContent = String(Math.floor(i / 2) + 1) + ".";

        const whiteMove = document.createElement("span");
        whiteMove.className = "white-move";
        if (moveLog[i]) {
            whiteMove.textContent = moveLog[i].san;
            if (reviewIndex === i + 1) whiteMove.classList.add("move-active");
            whiteMove.addEventListener("click", () => jumpToMove(i + 1));
        }

        const blackMove = document.createElement("span");
        blackMove.className = "black-move";
        if (moveLog[i + 1]) {
            blackMove.textContent = moveLog[i + 1].san;
            if (reviewIndex === i + 2) blackMove.classList.add("move-active");
            blackMove.addEventListener("click", () => jumpToMove(i + 2));
        }

        row.appendChild(num);
        row.appendChild(whiteMove);
        row.appendChild(blackMove);
        movesListEl.appendChild(row);
    }

    if (!isReviewing()) movesListEl.scrollTop = movesListEl.scrollHeight;
}

/* =========================================
   CLOCK / TIMER
========================================= */

function startTimer() {
    stopTimer();
    if (gameConfig.time === 0) return;
    timerInterval = setInterval(tickClock, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function tickClock() {
    if (isGameOver || gameConfig.time === 0) return;
    clocks[state.turn] = Math.max(0, clocks[state.turn] - 1);
    updateClockDisplay();

    if (clocks[state.turn] === 0) {
        isGameOver = true;
        stopTimer();
        showGameOver("timeout", opponentOf(state.turn));
    }
}

function updateClockDisplay() {
    if (gameConfig.time === 0) {
        playerClockEl.textContent = "∞";
        opponentClockEl.textContent = "∞";
        return;
    }

    const topIsAI = gameConfig.mode === "AI" ? aiColor : "b";
    const topColor = topIsAI;
    const bottomColor = opponentOf(topIsAI);

    opponentClockEl.textContent = formatTime(clocks[topColor]);
    playerClockEl.textContent = formatTime(clocks[bottomColor]);

    opponentClockEl.classList.toggle("low-time", gameConfig.time > 0 && clocks[topColor] <= 20);
    playerClockEl.classList.toggle("low-time", gameConfig.time > 0 && clocks[bottomColor] <= 20);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(remainingSeconds).padStart(2, "0");
}

/* =========================================
   CONTROLS: UNDO / RESTART / HINT / ANALYSIS
========================================= */

undoBtn.addEventListener("click", () => {
    if (isGameOver || aiThinking || isReviewing() || moveLog.length === 0) return;

    if (gameConfig.mode === "AI") {
        const last = moveLog.pop();
        if (last.color === aiColor && moveLog.length > 0 && moveLog[moveLog.length - 1].color === playerColor) {
            moveLog.pop();
        }
    } else {
        moveLog.pop();
    }

    if (moveLog.length > 0) {
        const prev = moveLog[moveLog.length - 1];
        state = cloneState(prev.stateAfter);
        clocks = { ...prev.clocks };
    } else {
        state = createInitialState();
        clocks = { w: gameConfig.time, b: gameConfig.time };
    }

    selectedSquare = null;
    legalMovesForSelected = [];
    lastMove = moveLog.length > 0 ? { from: moveLog[moveLog.length - 1].from, to: moveLog[moveLog.length - 1].to } : null;
    isGameOver = false;
    aiThinking = false;
    aiRequestId++;

    if (gameConfig.mode === "LOCAL" && gameConfig.orientation === "flip-each-move") {
        boardFlipped = state.turn === "b";
    }

    renderMoveList();
    renderCaptured();
    renderBoard();
    updateStatusText();
    updateClockDisplay();
    gameOverModal.classList.add("hidden");

    if (!timerInterval && gameConfig.time > 0) startTimer();
});

restartBtn.addEventListener("click", () => {
    gameOverModal.classList.add("hidden");
    startNewGame();
});

hintBtn.addEventListener("click", () => {
    if (isGameOver || aiThinking || !isHumanTurn()) return;
    const hintMove = findBestMove(state, 6, 0, 600);
    if (!hintMove) return;

    document.querySelectorAll(".square").forEach(sq => {
        sq.classList.remove("hint-from", "hint-to");
    });

    const fromSel = `.square[data-row="${hintMove.from.row}"][data-col="${hintMove.from.col}"]`;
    const toSel = `.square[data-row="${hintMove.to.row}"][data-col="${hintMove.to.col}"]`;
    const fromEl = chessBoardEl.querySelector(fromSel);
    const toEl = chessBoardEl.querySelector(toSel);
    if (fromEl) fromEl.classList.add("hint-from");
    if (toEl) toEl.classList.add("hint-to");

    setTimeout(() => {
        if (fromEl) fromEl.classList.remove("hint-from");
        if (toEl) toEl.classList.remove("hint-to");
    }, 2200);
});

analysisBtn.addEventListener("click", () => {
    analysisOn = !analysisOn;
    evalDisplayEl.classList.toggle("hidden", !analysisOn);
    updateEvalDisplay();
});

function updateEvalDisplay() {
    if (!analysisOn || !state) return;
    const displayState = isReviewing() ? getHistoricalState(reviewIndex) : state;
    const score = evaluateBoard(displayState) / 100;
    const sign = score > 0 ? "+" : "";
    evalDisplayEl.textContent = sign + score.toFixed(1);
}

flipBtn.addEventListener("click", () => {
    boardFlipped = !boardFlipped;
    renderBoard();
});

pgnBtn.addEventListener("click", async () => {
    const pgn = generatePGN();
    const ok = await copyText(pgn);
    showToast(ok ? "PGN copied to clipboard" : "Could not copy PGN");
});

drawBtn.addEventListener("click", () => {
    if (isGameOver || isReviewing()) return;
    const canClaim = repetitionCount(moveLog.length) >= 3 || state.halfmove >= 100;

    if (canClaim) {
        showConfirm(
            "Claim Draw",
            "This position has repeated, or 50 moves have passed without a capture or pawn move. Claim a draw?",
            () => {
                isGameOver = true;
                stopTimer();
                showGameOver("repetition", null);
            }
        );
    } else {
        showConfirm(
            "Offer a Draw",
            gameConfig.mode === "AI" ? "End the game as a draw by agreement?" : "Do both players agree to a draw?",
            () => {
                isGameOver = true;
                stopTimer();
                showGameOver("agreement", null);
            }
        );
    }
});

resignBtn.addEventListener("click", () => {
    if (isGameOver || isReviewing()) return;
    showConfirm("Resign the Game?", "You will lose immediately. This cannot be undone.", () => {
        isGameOver = true;
        stopTimer();
        const winner = gameConfig.mode === "AI" ? aiColor : opponentOf(state.turn);
        showGameOver("resignation", winner);
    });
});

menuBtn.addEventListener("click", () => {
    stopTimer();
    isGameOver = true;
    aiThinking = false;
    aiRequestId++;
    gameOverModal.classList.add("hidden");
    gameScreen.classList.remove("game-result-active");
    document.querySelector(".board-wrapper")?.classList.remove("board-victory", "board-defeat", "board-draw");
    showScreen(landingScreen);
});

newGameBtn.addEventListener("click", () => {
    gameOverModal.classList.add("hidden");
    showScreen(landingScreen);
});

reviewGameBtn.addEventListener("click", () => {
    gameOverModal.classList.add("hidden");
});

/* =========================================
   PGN EXPORT
========================================= */

function generatePGN() {
    const whiteName = gameConfig.mode === "AI" ? (playerColor === "w" ? "You" : "DEV AI") : "Player 1";
    const blackName = gameConfig.mode === "AI" ? (playerColor === "b" ? "You" : "DEV AI") : "Player 2";

    const headers = [
        `[Event "DEV CHESS Casual Game"]`,
        `[Site "DEV CHESS"]`,
        `[Date "${new Date().toISOString().slice(0, 10).replace(/-/g, ".")}"]`,
        `[White "${whiteName}"]`,
        `[Black "${blackName}"]`,
        `[Result "${lastPGNResult}"]`
    ];

    let movesStr = "";
    for (let i = 0; i < moveLog.length; i += 2) {
        movesStr += (Math.floor(i / 2) + 1) + ". " + moveLog[i].san + " ";
        if (moveLog[i + 1]) movesStr += moveLog[i + 1].san + " ";
    }
    movesStr += lastPGNResult;

    return headers.join("\n") + "\n\n" + movesStr.trim();
}

/* =========================================
   INITIAL STATE
========================================= */

showScreen(landingScreen);