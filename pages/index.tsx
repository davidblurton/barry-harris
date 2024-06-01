import Piano from "@/components/Piano";
import { Input } from "@/components/ui/input";
import { Chord, Interval, Midi, Note, Scale } from "tonal";
import { Chord as TChord } from "@tonaljs/chord";
import { range } from "@/lib/functools";
import { Json } from "@/components/Json";
import { chordColor, dimColor } from "@/styles/colors";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Link from "next/link";
import Head from "next/head";

type DisplayChordProps = {
  inputText: string;
};

const chordMap = [
  {
    root: "C",
    type: "major",
    chord: "C6",
  },
  {
    root: "C",
    type: "minor",
    chord: "Cm6",
  },
  {
    root: "C",
    type: "sixth",
    chord: "C6",
  },
  {
    root: "C",
    type: "minor sixth",
    chord: "Cm6",
  },
  {
    root: "C",
    type: "major seventh",
    chord: "G6",
  },
  {
    root: "C",
    type: "dominant seventh",
    chord: "Gm6",
  },
  {
    root: "C",
    type: "minor seventh",
    chord: "Eb6",
  },
  {
    root: "B",
    type: "half-diminished",
    chord: "Dm6",
  },
];

function Examples() {
  const examples = ["Dm7", "G7", "Em7b5", "Cmaj7"];

  return (
    <div className="space-x-2">
      <span className="mr-2">Examples:</span>
      {examples.map((example) => (
        <Link
          key={example}
          href={`?input=${example}`}
          className="underline text-blue-700"
        >
          {example}
        </Link>
      ))}
    </div>
  );
}

function DisplayChord(props: DisplayChordProps) {
  const { inputText } = props;
  const chord = Chord.get(inputText);

  if (chord.tonic === null) {
    return <Examples />;
  }

  const output = chordMap.find((x) => x.type === chord.type);

  if (output === undefined) {
    return <Json obj={chord} />;
  }

  const transposition = Interval.distance(
    output.root,
    Chord.get(output.chord).tonic!
  );
  const target =
    Note.transpose(chord.tonic, transposition) +
    Chord.get(output.chord).aliases[0];

  const chosen = Chord.get(target);

  function getScaleOfChords(chord: TChord) {
    if (chord.tonic === null) {
      return [];
    }

    if (chord.type === "sixth" || chord.type === "minor sixth") {
      // const root = Note.transpose(chord.tonic, "2M");
      // const diminished = Chord.get(root + "dim7");

      const range = Scale.rangeOf(chord.notes);
      const scale = range(chord.tonic + "4", chord.tonic + "6");

      return scale.filter(Boolean);
    }

    return [];
  }

  const scale = getScaleOfChords(chosen);

  const selections = range(4)
    .map((i) => scale[i])
    .map((note: string, i) => ({
      note,
      noteNum: Midi.toMidi(note) ?? 0,
      color: chordColor,
    }));

  const rootSelection = {
    noteNum: Midi.toMidi(chord.tonic + "3") ?? 0,
    color: dimColor,
  };

  return (
    <div className="max-w-sm">
      <Head>
        <title>Chord finder</title>
      </Head>
      <Piano selection={[rootSelection, ...selections]} />
      <div className="text-xl my-2">
        For <span className="font-bold">{inputText}</span> play{" "}
        <span className="font-bold">{target}</span>
      </div>
      {/* <Json obj={chosen} /> */}
    </div>
  );
}

export default function Index() {
  const [inputText, setInputText] = useQueryParam(
    "input",
    withDefault(StringParam, "")
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputText(value);
  }

  return (
    <div className="px-2 py-8 md:p-8">
      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Enter a chord"
          onChange={handleChange}
          value={inputText}
        />
      </div>

      <DisplayChord inputText={inputText} />
    </div>
  );
}
