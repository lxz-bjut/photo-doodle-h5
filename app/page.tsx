"use client";

import { useMemo, useState } from "react";

type StyleKey = "cute" | "cool" | "minimal";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState<StyleKey>("cute");
  const [customText, setCustomText] = useState("");
  const [preview, setPreview] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const styleLabel = useMemo(() => {
    if (style === "cute") return "日系可爱手账风";
    if (style === "cool") return "帅气随拍批注风";
    return "高级留白手写风";
  }, [style]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResultUrl("");
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("请先上传图片");
      return;
    }

    setLoading(true);
    setResultUrl("");

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("style", style);
      fd.append("customText", customText);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "生成失败");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      alert("生成失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="header">
        <h1 className="title">手账风图片生成器</h1>
        <p className="desc">
          上传照片，自动生成白色手写批注风成图。适合探店、旅行、人像、日常随拍。手机端已适配，微信里也能直接打开。
        </p>
      </div>

      <div className="card">
        <label className="label">上传图片</label>
        <input className="input" type="file" accept="image/*" onChange={onFileChange} />
        <div className="tip">建议上传竖图，效果更接近你之前那组样式。</div>

        {preview && (
          <div className="preview">
            <img src={preview} alt="预览图" />
          </div>
        )}
      </div>

      <div className="card">
        <div className="grid2">
          <div>
            <label className="label">选择风格</label>
            <select
              className="select"
              value={style}
              onChange={(e) => setStyle(e.target.value as StyleKey)}
            >
              <option value="cute">日系可爱手账风</option>
              <option value="cool">帅气随拍批注风</option>
              <option value="minimal">高级留白手写风</option>
            </select>
          </div>

          <div>
            <label className="label">自定义一句话（可选）</label>
            <textarea
              className="textarea"
              placeholder="例如：今天这张我真的很喜欢 / 海边的风很舒服 / 状态在线"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
          </div>
        </div>

        <div className="badgeRow">
          <span className="badge">当前风格：{styleLabel}</span>
          <span className="badge">白色手写字</span>
          <span className="badge">箭头小装饰</span>
          <span className="badge">适合微信打开</span>
        </div>

        <button className="button" onClick={handleGenerate} disabled={loading}>
          {loading ? "生成中..." : "开始生成"}
        </button>

        {loading && <div className="loadingText">正在给图片加手写批注，请稍等…</div>}
      </div>

      {resultUrl && (
        <div className="card">
          <label className="label">生成结果</label>
          <div className="preview">
            <img src={resultUrl} alt="生成结果" />
          </div>
          <div className="resultActions">
            <a className="actionBtnPrimary" href={resultUrl} download="photo-doodle-result.png">
              保存图片
            </a>
            <button
              className="actionBtnGhost"
              onClick={() => {
                setResultUrl("");
              }}
            >
              重新生成
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
