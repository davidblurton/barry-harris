import "react";

function range(length: number): Array<number> {
  return Array.from({ length }, (_, i) => i);
}

type PianoOptions = {
  start: number;
  end: number;
};

type Piano = {
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
  selected: boolean;
}[];

function makePiano(selected: number[] = [], opt: PianoOptions) {
  const widthRatio = 0.625;
  const heightRatio = 0.667;

  const defaults = {
    start: 29,
    end: 101,
  };

  let options = Object.assign({}, defaults, opt);

  const lowestNote = options.start;
  const highestNote = options.end;

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

  return range(numKeys).map((i) => {
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
      selected: selected.includes(i + lowestNote),
    };
  });
}

type PianoProps = {
  selected: number[];
  onKeyPress: (keyNum: number) => void;
};

export default function Piano(props: PianoProps) {
  const { selected, onKeyPress } = props;

  const middleC = 60;
  const selectedColor = "#f1ff5e";
  const border = 2;
  const opts = { start: 48, end: 88 };
  const piano = makePiano(selected, opts);
  const strokeColor = "#444";

  const height =
    piano.filter((key) => key.type == "white")[0].coord.y.max + 2 * border;

  const handleKeyPress = (keyNum: number) => {
    onKeyPress(keyNum);
  };

  return (
    <svg width={600} height={height}>
      {piano
        .filter((key) => key.type == "white")
        .map((key) => (
          <rect
            key={"white" + key.num}
            x={key.coord.x.min + border}
            y={key.coord.y.min + border}
            width={key.coord.x.max - key.coord.x.min}
            height={key.coord.y.max - key.coord.y.min}
            stroke={strokeColor}
            fill={key.selected ? selectedColor : "#fff"}
            strokeWidth={border}
            onClick={() => handleKeyPress(key.num)}
          ></rect>
        ))}

      {piano
        .filter((key) => key.type == "black")
        .map((key) => (
          <rect
            key={"black" + key.num}
            x={key.coord.x.min + border}
            y={0 + border}
            width={key.coord.x.max - key.coord.x.min}
            height={key.coord.y.max - key.coord.y.min}
            stroke={strokeColor}
            fill={key.selected ? selectedColor : strokeColor}
            strokeWidth={border}
            onClick={() => handleKeyPress(key.num)}
          ></rect>
        ))}

      {piano
        .filter((key) => key.num === middleC)
        .map((key) => (
          <circle
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
