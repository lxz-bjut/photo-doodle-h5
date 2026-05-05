import { STYLE_PACKS, StyleKey } from "@/lib/styles";

function esc(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function drawHeart(x: number, y: number, s = 22) {
  return `
    <path d="
      M ${x} ${y + s * 0.35}
      C ${x} ${y}, ${x + s * 0.5} ${y}, ${x + s * 0.5} ${y + s * 0.3}
      C ${x + s * 0.5} ${y}, ${x + s} ${y}, ${x + s} ${y + s * 0.35}
      C ${x + s} ${y + s * 0.7}, ${x + s * 0.5} ${y + s}, ${x + s * 0.5} ${y + s * 1.1}
      C ${x + s * 0.5} ${y + s}, ${x} ${y + s * 0.7}, ${x} ${y + s * 0.35}
    " fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  `;
}

function drawStar(x: number, y: number, s = 18) {
  return `
    <path d="M ${x} ${y - s} L ${x} ${y + s}" stroke="white" stroke-width="4" stroke-linecap="round"/>
    <path d="M ${x - s} ${y} L ${x + s} ${y}" stroke="white" stroke-width="4" stroke-linecap="round"/>
    <path d="M ${x - s * 0.7} ${y - s * 0.7} L ${x + s * 0.7} ${y + s * 0.7}" stroke="white" stroke-width="4" stroke-linecap="round"/>
    <path d="M ${x + s * 0.7} ${y - s * 0.7} L ${x - s * 0.7} ${y + s * 0.7}" stroke="white" stroke-width="4" stroke-linecap="round"/>
  `;
}

function drawSpark(x: number, y: number, s = 18) {
  return `
    <path d="M ${x} ${y - s} L ${x + s * 0.35} ${y} L ${x} ${y + s} L ${x - s * 0.35} ${y} Z"
      fill="none" stroke="white" stroke-width="4" stroke-linejoin="round"/>
  `;
}

function drawSmile(x: number, y: number, r = 18) {
  return `
    <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="white" stroke-width="4"/>
    <circle cx="${x - 6}" cy="${y - 4}" r="2.5" fill="white"/>
    <circle cx="${x + 6}" cy="${y - 4}" r="2.5" fill="white"/>
    <path d="M ${x - 8} ${y + 4} Q ${x} ${y + 12} ${x + 8} ${y + 4}" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
  `;
}

function wrapText(text: string, lineWidth = 8) {
  if (text.includes("\n")) return text.split("\n");
  const chars = [...text];
  const lines: string[] = [];
  for (let i = 0; i < chars.length; i += lineWidth) {
    lines.push(chars.slice(i, i + lineWidth).join(""));
  }
  return lines;
}

function bubble(x: number, y: number, width: number, height: number) {
  const r = 28;
  return `
    <rect x="${x}" y="${y}" rx="${r}" ry="${r}" width="${width}" height="${height}"
      fill="none" stroke="white" stroke-width="4"/>
    <path d="M ${x + width * 0.28} ${y + height}
             Q ${x + width * 0.36} ${y + height + 26}
             ${x + width * 0.46} ${y + height + 10}"
      fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/>
  `;
}

function arrow(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 30;
  return `
    <path d="M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}"
      fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/>
    <path d="M ${x2 - 16} ${y2 - 8} L ${x2} ${y2} L ${x2 - 8} ${y2 - 18}"
      fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  `;
}

export function buildDoodleSvg(
  width: number,
  height: number,
  style: StyleKey,
  customText?: string
) {
  const pack = STYLE_PACKS[style];
  const captions = [...pack.captions];

  if (customText && customText.trim()) {
    captions[captions.length - 1] = {
      ...captions[captions.length - 1],
      text: customText.trim()
    };
  }

  let svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="softShadow">
        <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.22)"/>
      </filter>
    </defs>
  `;

  const decoPositions = [
    [0.1, 0.22],
    [0.82, 0.18],
    [0.88, 0.78],
    [0.14, 0.86],
    [0.7, 0.52],
    [0.52, 0.12]
  ];

  pack.decorations.forEach((type, i) => {
    const pos = decoPositions[i % decoPositions.length];
    const x = width * pos[0];
    const y = height * pos[1];
    if (type === "heart") svg += drawHeart(x, y, 20);
    if (type === "star") svg += drawStar(x, y, 14);
    if (type === "spark") svg += drawSpark(x, y, 16);
    if (type === "smile") svg += drawSmile(x, y, 16);
  });

  captions.forEach((item, idx) => {
    const x = width * item.x;
    const y = height * item.y;
    const size = item.size || 38;
    const lines = wrapText(item.text, 8);
    const lineHeight = size * 1.35;
    const textWidth = Math.max(...lines.map((line) => line.length)) * size * 0.9;
    const textHeight = lines.length * lineHeight;

    if (item.type === "bubble") {
      svg += bubble(x - 24, y - 46, textWidth + 52, textHeight + 56);
    }

    svg += `<g filter="url(#softShadow)">`;
    lines.forEach((line, lineIdx) => {
      svg += `
        <text
          x="${x}"
          y="${y + lineIdx * lineHeight}"
          fill="white"
          font-size="${size}"
          font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif"
          font-weight="700"
          letter-spacing="1"
        >${esc(line)}</text>
      `;
    });
    svg += `</g>`;

    const ax1 = x + textWidth * 0.45;
    const ay1 = y + textHeight + 16;
    const ax2 = width * ((0.45 + idx * 0.07 > 0.82) ? 0.72 : 0.45 + idx * 0.07);
    const ay2 = height * ((0.4 + idx * 0.08 > 0.82) ? 0.7 : 0.4 + idx * 0.08);

    svg += arrow(ax1, ay1, ax2, ay2);
  });

  svg += `</svg>`;
  return svg;
}
