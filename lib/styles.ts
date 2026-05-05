export type StyleKey = "cute" | "cool" | "minimal";

export type CaptionItem = {
  text: string;
  x: number;
  y: number;
  size?: number;
  type?: "plain" | "bubble";
};

export type StylePack = {
  name: string;
  decorations: ("star" | "heart" | "spark" | "smile")[];
  captions: CaptionItem[];
};

export const STYLE_PACKS: Record<StyleKey, StylePack> = {
  cute: {
    name: "日系可爱手账风",
    decorations: ["star", "heart", "spark", "smile"],
    captions: [
      { text: "今天这张也太喜欢了～", x: 0.08, y: 0.10, size: 42, type: "plain" },
      { text: "这一幕很有氛围感", x: 0.62, y: 0.18, size: 36, type: "bubble" },
      { text: "随手一拍都很治愈♡", x: 0.12, y: 0.82, size: 38, type: "plain" },
      { text: "今天也有一点小幸福～", x: 0.58, y: 0.86, size: 34, type: "plain" }
    ]
  },
  cool: {
    name: "帅气随拍批注风",
    decorations: ["star", "spark"],
    captions: [
      { text: "镜头一开\n状态在线", x: 0.08, y: 0.10, size: 46, type: "plain" },
      { text: "气场直接拉满", x: 0.63, y: 0.22, size: 40, type: "bubble" },
      { text: "这张很稳", x: 0.15, y: 0.82, size: 42, type: "plain" },
      { text: "不用太满\n有感觉就够了", x: 0.62, y: 0.84, size: 34, type: "plain" }
    ]
  },
  minimal: {
    name: "高级留白手写风",
    decorations: ["spark"],
    captions: [
      { text: "留住这一刻", x: 0.08, y: 0.10, size: 42, type: "plain" },
      { text: "刚刚好的光线", x: 0.62, y: 0.22, size: 34, type: "plain" },
      { text: "安静，但很有力量", x: 0.58, y: 0.86, size: 34, type: "plain" }
    ]
  }
};
