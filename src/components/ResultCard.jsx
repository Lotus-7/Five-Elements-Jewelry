import React, { useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Share2, Download } from "lucide-react";
import html2canvas from "html2canvas";
import InteractiveJewelry from "./InteractiveJewelry";

export default function ResultCard({ data, onReset }) {
  const { user, today, recommendation } = data;
  const cardRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      // 颜色转换辅助函数：将 hex + alpha (例如 #CD453266) 转为 rgba，提高 canvas 渲染兼容性
      const hexToRgba = (hex, alpha = 0.4) => {
        if (!hex) return "rgba(0,0,0,0.1)";
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      // 获取元素的当前视口尺寸，确保截图精确度
      const rect = cardRef.current.getBoundingClientRect();

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, // 设置为 null，保留 transparent 透明背景，保证圆角过渡平滑无白边
        scale: 3, // 3倍缩放，确保导出图片的高清质感
        logging: false,
        useCORS: true, // 启用跨域资源共享，防止外部图片或字体资源被污染/无法加载
        allowTaint: true,
        scrollX: 0, // 强制 x 轴滚动归零，避免页面滚动导致截图发生位移
        scrollY: 0, // 强制 y 轴滚动归零，避免页面滚动导致截图发生位移
        width: rect.width, // 限制 canvas 的宽为元素的实际宽度
        height: rect.height, // 限制 canvas 的高为元素的实际高度
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('[data-card-root="true"]');
          if (clonedCard) {
            // 截图时保持完美的 24px 圆角
            clonedCard.style.borderRadius = "24px";
            clonedCard.style.transform = "none";

            // 修正阴影颜色，使用纯 RGBA 提升 html2canvas 阴影的渲染兼容性
            const shadowColor = hexToRgba(recommendation.colorHex, 0.4);
            const centerCircle = clonedCard.querySelector(
              'div[style*="box-shadow"]',
            );
            if (centerCircle) {
              centerCircle.style.boxShadow = `0 20px 40px -10px ${shadowColor}`;
            }

            // 修正字体间距 (canvas 渲染 letter-spacing 有时会偏大，进行合理折减)
            const wideText = clonedCard.querySelectorAll(
              '[class*="tracking-"]',
            );
            wideText.forEach((el) => {
              const currentTracking = window.getComputedStyle(el).letterSpacing;
              if (currentTracking && currentTracking !== "normal") {
                const val = parseFloat(currentTracking);
                el.style.letterSpacing = `${val * 0.5}px`;
              }
            });

            // 彻底清理克隆 DOM 中所有的 Framer Motion 临时动画状态，防止截图截到动画播到一半的半透明或缩放状态
            const allClonedEl = clonedCard.querySelectorAll("*");
            allClonedEl.forEach((el) => {
              // 强制清除 transform 位移和缩放
              if (el.style.transform && el.style.transform !== "none") {
                el.style.transform = "none";
              }
              // 强制不透明度为 100%，防止渐入动画未播放完毕导致截图卡片半透明
              if (el.style.opacity && el.style.opacity !== "1") {
                el.style.opacity = "1";
              }
            });
          }
        },
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `五行佩戴建议_${new Date().toISOString().split("T")[0]}.png`;
      link.click();
    } catch (error) {
      console.error("生成图片失败:", error);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full max-w-md"
    >
      <div
        ref={cardRef}
        data-card-root="true"
        className="bg-white shadow-2xl overflow-hidden relative"
        style={{ borderRadius: "24px" }}
      >
        {/* 顶部装饰 - 模拟日历撕纸或印章效果 */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-50" />

        {/* 核心内容区 */}
        <div className="p-8 pb-12 flex flex-col items-center text-center space-y-6">
          {/* 日期信息 */}
          <div className="space-y-1 mt-4">
            <p className="text-xs tracking-[0.2em] text-stone-400 uppercase">
              {new Date().toDateString()}
            </p>
            <p className="font-serif text-stone-500 text-sm tracking-widest">
              {today.ganZhi} · {today.element}日
            </p>
          </div>

          {/* 核心视觉：3D感悬浮 SVG 珠宝展示 */}
          <InteractiveJewelry
            element={recommendation.element}
            colorHex={recommendation.colorHex}
          />

          {/* 推荐标题 */}
          <div className="space-y-3">
            <h2 className="text-2xl font-serif text-ink tracking-widest">
              今日宜佩戴 ·{" "}
              <span style={{ color: recommendation.colorHex }}>
                {recommendation.colors[0]}
              </span>
            </h2>
            <div className="flex justify-center gap-2">
              {recommendation.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-stone-50 text-[10px] text-stone-500 tracking-wider rounded-full border border-stone-100"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* 推荐语：采用绝对定位的双引号代替 float，确保 html2canvas 渲染时不会发生文字重叠或遮挡 */}
          <div className="relative px-8 py-6 bg-paper/50 rounded-xl w-full">
            <span className="absolute top-2 left-3 text-4xl text-stone-300 font-serif leading-none">“</span>
            <p className="text-sm font-serif text-stone-700 leading-loose text-justify px-2">
              {recommendation.reason}
            </p>
            <span className="absolute bottom-2 right-3 text-4xl text-stone-300 font-serif leading-none">”</span>
          </div>

          {/* 八字命盘简析与五行能量配比（新中式风） */}
          <div className="w-full pt-6 border-t border-stone-100 flex flex-col gap-3 text-left">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400">您的八字命盘：</span>
              <span className="font-serif font-medium text-ink tracking-wider bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
                {user.baziText}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400">八字格局：</span>
              <span className="font-serif text-stone-700">
                日元【<span style={{ color: recommendation.colorHex }}>{user.dayGan}</span>】{user.element}命 · <span className="font-medium">{user.analysis.isStrong ? "身强" : "身弱"}</span>格
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400">本命喜用五行：</span>
              <span className="font-serif px-2 py-0.5 rounded bg-stone-50 text-stone-700 font-medium border border-stone-100">
                {user.analysis.favorableText}
              </span>
            </div>

            {/* 五行能量分布简易色条 */}
            <div className="mt-1 space-y-1.5">
              <div className="text-[10px] text-stone-400 flex justify-between">
                <span>五行能量配比：</span>
                <span className="font-mono text-stone-500">
                  {Object.entries(user.analysis.scores)
                    .map(([el, score]) => `${el}${score}%`)
                    .join(" ")}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 flex overflow-hidden">
                {/* 遍历五行分数渲染比例色条 */}
                {Object.entries(user.analysis.scores).map(([el, score]) => {
                  const elementColorMap = {
                    '金': '#D4AF37', // 流光金
                    '木': '#4B6E57', // 竹青
                    '水': '#2C3E50', // 黛蓝
                    '火': '#CD4532', // 朱砂红
                    '土': '#9A7D46'  // 琥珀黄
                  };
                  return score > 0 ? (
                    <div
                      key={el}
                      style={{
                        width: `${score}%`,
                        backgroundColor: elementColorMap[el]
                      }}
                      title={`${el}: ${score}%`}
                    />
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮栏 (不包含在截图中) */}
      <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-6">
        <button
          onClick={onReset}
          className="p-3 bg-white rounded-full text-stone-400 hover:text-ink hover:bg-stone-50 transition-all shadow-sm"
          title="重新测试"
        >
          <RefreshCcw size={20} />
        </button>
        <button
          onClick={handleShare}
          className="p-3 bg-ink rounded-full text-paper hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          title="保存日签"
        >
          <Download size={20} />
        </button>
      </div>
    </motion.div>
  );
}
