import { simplifyNote } from "@/lib/tonal";
import { Note } from "tonal";

type DisplayNoteProps = {
  note: string;
};

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
