"use client";

import { Chord, Note, PcSet } from "tonal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DisplayNote from "../components/DisplayNote";
import { Pcset } from "@tonaljs/pcset";

// Delete when https://github.com/tonaljs/tonal/pull/383 is merged
const setNumToChroma = (num: number): string =>
  Number(num).toString(2).padStart(12, "0");

type Params = {
  readonly pcset: Pcset;
  readonly root?: string;
};

type SetParams = (params: Params) => void;

function useParams(): [Params, SetParams] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const root = searchParams.get("root") || "C";
  const pcsetParam = parseInt(searchParams.get("pcset") || "0");
  const pcset = PcSet.get(setNumToChroma(pcsetParam));

  let params: Params = {
    pcset: pcset,
    root,
  };

  function setParams(params: Params) {
    const current = new URLSearchParams(searchParams.toString());
    current.set("pcset", params.pcset.setNum.toString());

    const url = pathname + "?" + current.toString();
    router.push(url);
  }

  return [params, setParams];
}

export default function Page() {
  const [params, setParams] = useParams();

  const { root, pcset } = params;

  const notes = Chord.get(root + "dim7").notes;

  function handleSelectNote(note: string) {
    setParams({ ...params, pcset: toggleNoteInSet(pcset, note) });
  }

  return (
    <div className="p-8">
      <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-2 gap-y-2">
        {notes.map((note, index) => {
          const parsedNote = Note.get(note);

          if (parsedNote.empty) {
            return null;
          }

          const selected = PcSet.isNoteIncludedIn(pcset)(note);

          return (
            <div
              className={`"px-8 py-4 ring-1 ring-inset ring-gray-300 col-span-2 h-full w-full lg:col-span-1 text-center cursor-pointer" ${
                selected ? "bg-yellow-300" : ""
              }`}
              key={index}
              onClick={() => handleSelectNote(note)}
            >
              <DisplayNote note={note} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function addToSet(setNum: number, note: string): number {
  const setNum2 = PcSet.get([note]).setNum;
  return setNum | setNum2;
}

function removeFromSet(setNum: number, note: string): number {
  const setNum2 = PcSet.get([note]).setNum;
  return setNum & ~setNum2;
}

function toggleNoteInSet(pcset: Pcset, note: string): Pcset {
  let nextSetNum: number;
  if (PcSet.isNoteIncludedIn(pcset)(note)) {
    nextSetNum = removeFromSet(pcset.setNum, note);
  } else {
    nextSetNum = addToSet(pcset.setNum, note);
  }

  return PcSet.get(setNumToChroma(nextSetNum));
}
