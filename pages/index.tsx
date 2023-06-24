import { useState } from "react";
import Piano from "@/components/Piano";
import { Input } from "@/components/ui/input";
import { Chord, Midi } from "tonal";
import { getChordWithOctave } from "@/lib/tonal";
import { Slider } from "@/components/ui/slider";
import { Chord as TChord } from "@tonaljs/chord";

type DisplayChordProps = {
  inputText: string;
  inversion: number;
};

function DisplayChord(props: DisplayChordProps) {
  const { inputText, inversion } = props;
  const chord = Chord.get(inputText);

  if (chord.tonic === null) {
    return null;
  }

  function applyVoicing(chord: TChord) {
    return getChordWithOctave(chord, 4, inversion)
      .notes.map(Midi.toMidi)
      .filter(Boolean);
  }

  const selection = {
    "#f1ff5e": applyVoicing(chord),
    // "#78BEFF": applyVoicing(Chord.get("Ddim7")),
  };

  return <Piano selection={selection} />;
}

export default function Index() {
  const [inputText, setInputText] = useState("C6");
  const [inversion, setInversion] = useState(0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputText(value);
  }

  return (
    <div className="px-8 py-8 space-y-8">
      <Input placeholder="chord" onChange={handleChange} value={inputText} />

      <Slider
        max={3}
        step={1}
        value={[inversion]}
        onValueChange={([value]) => setInversion(value)}
      />

      <DisplayChord inputText={inputText} inversion={inversion} />
    </div>
  );
}
