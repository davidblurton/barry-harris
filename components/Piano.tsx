import { range } from "@/lib/functools";

type PianoOptions = {
  start: number;
  end: number;
};

type KeyData = {
  index: number;
  num: number;
  type: "white" | "black";
  coord: {
    x: {
      min: number;
      max: number;
    };
    y: {
      min: number;
      max: number;
    };
  };
  selected: string | undefined;
};

type PianoData = { keys: KeyData[]; height: number; width: number };

function makePiano(selection: KeySelection, options: PianoOptions): PianoData {
  const widthRatio = 0.625;
  const heightRatio = 0.667;

  const lowestNote = options.start;
  const highestNote = options.end;

  const selectionMap = new Map<number, string>();

  Object.entries(selection).map(([key, value]) => {
    value.forEach((v) => selectionMap.set(v, key));
  });

  const numKeys = highestNote - lowestNote + 1;

  const isWhite = (num: number) =>
    ![1, 4, 6, 9, 11].includes((num + lowestNote + 3) % 12);

  const numLowerWhites = (keyIndex: number) =>
    range(keyIndex).reduce(
      (acc: number, val: number) => (isWhite(val) ? acc + 1 : acc),
      0
    );

  // Total # of white keys
  const numWhiteKeys = numLowerWhites(numKeys);

  // Dimension of keys
  const height = 70;
  const whiteWidth = height / 4;
  const blackWidth = whiteWidth * widthRatio;
  const width = numWhiteKeys * whiteWidth;

  const keys = range(numKeys).map((i) => {
    const num = i + lowestNote;
    const offset = isWhite(i) ? 0 : -blackWidth / 2;
    return {
      index: i,
      num,
      type: isWhite(i) ? ("white" as const) : ("black" as const),
      // Piano coordinate: x: lower to higher key, y: near to far
      coord: {
        x: {
          min: whiteWidth * numLowerWhites(i) + offset,
          max:
            whiteWidth * numLowerWhites(i) +
            offset +
            (isWhite(i) ? whiteWidth : blackWidth),
        },
        y: {
          min: isWhite(i) ? 0 : (1 - heightRatio) * height,
          max: height,
        },
      },
      selected: selectionMap.get(i + lowestNote),
    };
  });

  return {
    keys,
    height,
    width,
  };
}

type KeySelection = {
  [color: string]: number[];
};

type PianoProps = {
  onKeyPress?: (keyNum: number) => void;
  selection: KeySelection;
};

export default function Piano(props: PianoProps) {
  const middleC = 60;
  const border = 2;
  const opts = { start: 48, end: 101 };
  const strokeColor = "#444";

  const { selection, onKeyPress } = props;
  const { height, width, keys } = makePiano(selection, opts);

  const handleKeyPress = (keyNum: number) => {
    if (onKeyPress !== undefined) {
      onKeyPress(keyNum);
    }
  };

  return (
    <svg width={width + 2 * border} height={height + 2 * border}>
      {keys
        .filter((key) => key.type == "white")
        .map((key) => (
          <rect
            key={"white" + key.num}
            x={key.coord.x.min + border}
            y={key.coord.y.min + border}
            width={key.coord.x.max - key.coord.x.min}
            height={key.coord.y.max - key.coord.y.min}
            stroke={strokeColor}
            fill={key.selected || "#fff"}
            strokeWidth={border}
            onClick={() => handleKeyPress(key.num)}
          ></rect>
        ))}

      {keys
        .filter((key) => key.type == "black")
        .map((key) => (
          <rect
            key={"black" + key.num}
            x={key.coord.x.min + border}
            y={0 + border}
            width={key.coord.x.max - key.coord.x.min}
            height={key.coord.y.max - key.coord.y.min}
            stroke={strokeColor}
            fill={key.selected || strokeColor}
            strokeWidth={border}
            onClick={() => handleKeyPress(key.num)}
          ></rect>
        ))}

      {keys
        .filter((key) => key.num === middleC)
        .map((key) => (
          <circle
            key={"dot" + key.num}
            cx={
              key.coord.x.min + border + (key.coord.x.max - key.coord.x.min) / 2
            }
            cy={key.coord.y.max - 8}
            r={3}
            fill={strokeColor}
          ></circle>
        ))}
    </svg>
  );
}
