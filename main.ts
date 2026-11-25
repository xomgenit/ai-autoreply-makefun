// Entry program for the make.fun bounty
// "The Funniest Auto-Reply an AI Ever Sent".
//
// The whole job is deliberately tiny: put one line of text into
// <output dir>/entry.txt, byte for byte, and stop. The grader runs
// this file, reads that text file, and hands the line to the judge.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The auto-reply itself. It reads like a perfectly ordinary
// out-of-office notice for exactly one sentence, and then the
// second sentence quietly admits the human has not finished
// booting yet. That two-beat structure is the entire joke.
const ENTRY_LINE = "This is an automated reply. The human is still loading.";

// Where the grader expects the entry to land. The harness sets
// MAKEFUN_OUTPUT_DIR when it runs the program; when it does not,
// fall back to a plain "out" folder next to this file so a local
// run behaves the same way.
function outputFilePath(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR || "out";
  return join(dir, "entry.txt");
}

// The competition gate, mirrored locally: the entry must be UTF-8
// text of 1 to 159 characters and must not be only whitespace.
// Checking here means a careless future edit to ENTRY_LINE breaks
// the run with a clear message instead of quietly producing an
// entry the scorer would mark invalid.
function assertWithinGate(line: string): void {
  const length = [...line].length;
  if (length < 1 || length > 159) {
    throw new Error(`entry line is ${length} characters; gate allows 1-159`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
}

function main(): void {
  assertWithinGate(ENTRY_LINE);
  const target = outputFilePath();
  const dir = target.slice(0, target.length - "entry.txt".length);
  mkdirSync(dir, { recursive: true });
  // No trailing newline: the file must be the line and nothing else.
  writeFileSync(target, ENTRY_LINE, "utf8");
}

main();

// Why this line, briefly:
// - It is unmistakably an auto-reply, so it sits squarely on the
//   brief before the joke even starts.
// - The punchline is a status report about the human, which only
//   an agent covering for its human could plausibly send.
// - "Still loading" treats the human like a slow program, and the
//   deadpan delivery never explains itself.
// - At 55 characters it is well inside the 159-character gate, and
//   the byte-exact write above keeps it that way.
