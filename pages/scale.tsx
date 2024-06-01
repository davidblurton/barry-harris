import { useState } from "react";
import Piano from "@/components/Piano";
import { Input } from "@/components/ui/input";
import { Chord, Midi, Note, Scale } from "tonal";
import { getChordWithOctave, toDropTwo } from "@/lib/tonal";
import { Slider } from "@/components/ui/slider";
import { Chord as TChord } from "@tonaljs/chord";
import { range } from "@/lib/functools";
import { Json } from "@/components/Json";

type DisplayChordProps = {
  inputText: string;
};

function DisplayChord(props: DisplayChordProps) {
  const { inputText } = props;
  const chord = Chord.get(inputText);
  const [inversion, setInversion] = useState(0);

  if (chord.tonic === null) {
    return null;
  }

  function applyVoicing(chord: TChord) {
    return getChordWithOctave(chord, 4, inversion)
      .notes.map(Midi.toMidi)
      .filter(Boolean);
  }

  function getDiminished(chord: TChord) {
    if (chord.tonic === null) {
      return undefined;
    }

    if (
      chord.type === "sixth" ||
      chord.type === "minor sixth" ||
      chord.type === "diminished seventh"
    ) {
      const root = Note.transpose(chord.tonic, "2M");
      return Chord.get(root + "dim7");
    }

    return undefined;
  }

  function getScaleOfChords(chord: TChord) {
    if (chord.tonic === null) {
      return [];
    }

    if (chord.type === "sixth" || chord.type === "minor sixth") {
      const root = Note.transpose(chord.tonic, "2M");
      const diminished = Chord.get(root + "dim7");

      const range = Scale.rangeOf([...chord.notes, ...diminished.notes]);
      const scale = range(chord.tonic + "4", chord.tonic + "6");

      return scale.filter(Boolean);
    }

    return [];
  }

  const scale = getScaleOfChords(chord);
  const chordColor = "#F1FF5E";
  const dimColor = "#78BEFF";

  console.log(
    range(scale.length)
      .map((i) => (i + inversion) * 2)
      .map((i) => scale[i])
  );

  const selections = range(scale.length)
    .map((i) => scale[i])
    .map((note: string, i) => ({
      note,
      noteNum: Midi.toMidi(note) ?? 0,
      color: scale.indexOf(note) % 2 === 0 ? chordColor : dimColor,
    }));

  return (
    <div className="space-y-8 max-w-sm">
      <Slider
        max={selections.length - 1}
        step={1}
        value={[inversion]}
        onValueChange={([value]) => setInversion(value)}
      />
      <Piano selection={selections} />
      <Json obj={scale} />
    </div>
  );
}

export default function Index() {
  const [inputText, setInputText] = useState("C6");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputText(value);
  }

  return (
    <div className="px-8 py-8 space-y-8">
      <div className="space-y-8 max-w-sm">
        <Input placeholder="Chord" onChange={handleChange} value={inputText} />
      </div>

      <DisplayChord inputText={inputText} />
    </div>
  );
}
