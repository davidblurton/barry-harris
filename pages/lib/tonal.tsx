"use client";
import { Note, PcSet, Range } from "tonal";
import { Pcset } from "@tonaljs/pcset";

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

const fifthDistance = Range.numeric([-8 - 7, 13 + 7]).reduce((prev, curr) => {
  prev[Note.transposeFifths("C", curr)] = Math.abs(curr);
  return prev;
}, {} as Record<string, number>);


