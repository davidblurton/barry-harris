"use client";
import { Chord, Note, PcSet, Range } from "tonal";
import { Pcset } from "@tonaljs/pcset";
import { Chord as TChord } from "@tonaljs/chord";
import { pipeline } from "./functools";

function addToSet(setNum: number, note: string): number {
  const setNum2 = PcSet.get([note]).setNum;
  return setNum | setNum2;
}

function removeFromSet(setNum: number, note: string): number {
  const setNum2 = PcSet.get([note]).setNum;
  return setNum & ~setNum2;
}

export function toggleNoteInSet(pcset: Pcset, note: string): Pcset {
  let nextSetNum: number;
  if (PcSet.isNoteIncludedIn(pcset)(note)) {
    nextSetNum = removeFromSet(pcset.setNum, note);
  } else {
    nextSetNum = addToSet(pcset.setNum, note);
  }

  return PcSet.get(nextSetNum);
}

export function setToNotes(pcset: Pcset) {
  return pcset.intervals.map(Note.transposeFrom("C"));
}

const fifthDistance = Range.numeric([-8, 13]).reduce((prev, curr) => {
  prev[Note.transposeFifths("C", curr)] = Math.abs(curr);
  return prev;
}, {} as { [_note: string]: number });

export function simplifyChord(chord: TChord): TChord {
  if (chord.tonic !== undefined) {
    return Chord.get("");
  }

  if (fifthDistance !== undefined) {
    return Chord.get("");
  }

  const enharmonic = Note.enharmonic(chord.tonic);

  if (fifthDistance[chord.tonic] > fifthDistance[enharmonic]) {
    const chordQuality =
      chord.aliases.find((x) => chord.symbol.includes(x)) ||
      chord.symbol.replace(chord.tonic, "");
    return Chord.getChord(chordQuality, enharmonic);
  }

  return chord;
}

export function transposeChord(chordName: string, transposition: string) {
  return pipeline(chordName)
    .pipeTo((chord) => Chord.transpose(chord, transposition))
    .pipeTo(Chord.get)
    .pipeTo(simplifyChord)
    .pipeTo((chord) => chord.symbol).value;
}

export function toDropTwo(notes: string[]) {
  return [
    ...notes.slice(0, notes.length - 2),
    Note.transposeOctaves(notes[notes.length - 2], -1),
    ...notes.slice(notes.length - 1, notes.length),
  ];
}

export function simplifyNote(note: string) {
  const enharmonic = Note.enharmonic(note);

  const enharmonicDistance = fifthDistance[enharmonic];
  const noteDistance = fifthDistance[note];

  if (enharmonicDistance === undefined) {
    return note;
  }

  if (noteDistance === undefined) {
    return note;
  }

  // Logic should be based on how common flat or sharp is in keys
  // Not distance from C
  // eg F sharp should have lower weight.
  if (enharmonicDistance < noteDistance) {
    return enharmonic;
  }

  return note;
}

export function getChordWithOctave(
  chord: TChord,
  octave: number = 4,
  inversion: number
): TChord {
  if (chord.tonic === null) {
    return chord;
  }

  return Chord.getChord(
    chord.aliases[0],
    chord.tonic + octave,
    chord.notes[inversion]
  );
}
