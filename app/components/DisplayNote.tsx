import { Range, Note } from "tonal";

type DisplayNoteProps = {
  note: string;
};

const fifthDistance = Range.numeric([-8 - 7, 13 + 7]).reduce((prev, curr) => {
  prev[Note.transposeFifths("C", curr)] = Math.abs(curr);
  return prev;
}, {} as Record<string, number>);

function simplifyNote(note: string) {
  const enharmonic = Note.enharmonic(note);

  // Logic should be based on how common flat or sharp is in keys
  // Not distance from C
  // eg F sharp should have lower weight.
  if (fifthDistance[enharmonic] < fifthDistance[note]) {
    return enharmonic;
  }

  return note;
}

export default function DisplayNote(props: DisplayNoteProps) {
  const { note } = props;
  const parsedNote = Note.get(simplifyNote(note));

  if (parsedNote.empty) {
    return null;
  }

  return (
    <div>
      {parsedNote.letter}
      {parsedNote.acc == "b" ? <span className="align-super">♭</span> : null}
      {parsedNote.acc == "bb" ? <span className="align-super">♭♭</span> : null}
      {parsedNote.acc == "#" ? <span className="align-super">♯</span> : null}
      {parsedNote.acc == "##" ? <span className="align-super">♯♯</span> : null}
    </div>
  );
}
