import { useState } from "react";
import Piano from "@/components/Piano";
import { Input } from "@/components/ui/input";
import { Chord, Interval, Midi } from "tonal";
import { Json } from "@/components/Json";
import { toDropTwo } from "@/lib/tonal";
import { Slider } from "@/components/ui/slider";

export default function () {
  const [inputText, setInputText] = useState("A7");
  const [selected, setSelected] = useState<number[]>([]);
  const [inversion, setInversion] = useState(0);

  const handleKeyPress = (keyNum: number) => {
    if (selected.includes(keyNum)) {
      setSelected(selected.filter((x) => x !== keyNum));
    } else {
      setSelected((x) => [...x, keyNum]);
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputText(value);
  }

  const chord = Chord.get(inputText);
  const transposition = Interval.distance("C4", chord.tonic + "4");
  const chosenChord = {
    chord,
  };
  const chosenNotes = Chord.getChord(
    chord.aliases[0],
    chord.tonic + "4",
    chord.notes[inversion]
  ).notes;

  const notes = toDropTwo(chosenNotes).map(Midi.toMidi).filter(Boolean);
  return (
    <div className="px-8 py-8 space-y-8">
      <div>
        <Input placeholder="chord" onChange={handleChange} value={inputText} />
      </div>
      <Slider
        max={4}
        step={1}
        value={[inversion]}
        onValueChange={([value]) => setInversion(value)}
      />
      <div>
        <Piano selected={notes} onKeyPress={handleKeyPress} />
      </div>
      <Json obj={chord} />
    </div>
  );
}
