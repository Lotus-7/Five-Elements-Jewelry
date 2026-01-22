import React, { useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Share2, Download } from "lucide-react";
import html2canvas from "html2canvas";

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
      // 颜色转换辅助函数：将 hex + alpha (e.g., #CD453266) 转为 rgba
      const hexToRgba = (hex, alpha = 0.4) => {
        if (!hex) return "rgba(0,0,0,0.1)";
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        scrollY: 0, // 防止滚动导致的偏移
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('[data-card-root="true"]');
          if (clonedCard) {
            clonedCard.style.transform = "none";
            clonedCard.style.borderRadius = "0px"; // 截图时先取消外层圆角，避免背景白边，最后由容器裁切

            // 修正阴影颜色，使用纯 RGBA 提高兼容性
            const shadowColor = hexToRgba(recommendation.colorHex, 0.4);
            const centerCircle = clonedCard.querySelector(
              'div[style*="box-shadow"]',
            );
            if (centerCircle) {
              centerCircle.style.boxShadow = `0 20px 40px -10px ${shadowColor}`;
            }

            // 修正字体间距 (canvas 渲染 tracking 会偏大)
            const wideText = clonedCard.querySelectorAll(
              '[class*="tracking-"]',
            );
            wideText.forEach((el) => {
              const currentTracking = window.getComputedStyle(el).letterSpacing;
              if (currentTracking && currentTracking !== "normal") {
                // 减半字间距
                const val = parseFloat(currentTracking);
                el.style.letterSpacing = `${val * 0.5}px`;
              }
            });

            // 清理 Framer Motion
            const motionDivs = clonedCard.querySelectorAll("div");
            motionDivs.forEach((div) => {
              if (div.style.transform) div.style.transform = "none";
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

          {/* 核心视觉：色块/五行 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="w-48 h-48 rounded-full flex items-center justify-center relative my-4"
            style={{
              backgroundColor: recommendation.colorHex,
              boxShadow: `0 20px 40px -10px ${recommendation.colorHex}66`,
            }}
          >
            <div className="absolute inset-2 border border-white/20 rounded-full" />
            <div className="text-white font-serif flex flex-col items-center">
              <span className="text-5xl mb-2">{recommendation.element}</span>
              <span className="text-xs tracking-[0.3em] opacity-80 uppercase">
                {recommendation.materials[0]}
              </span>
            </div>
          </motion.div>

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

          {/* 推荐语 */}
          <div className="relative px-6 py-6 bg-paper/50 rounded-xl w-full">
            <p className="text-sm font-serif text-stone-700 leading-loose text-justify">
              <span className="text-2xl float-left mr-1 text-stone-300">“</span>
              {recommendation.reason}
              <span className="text-2xl float-right ml-1 text-stone-300">
                ”
              </span>
            </p>
          </div>

          {/* 底部信息：用户日主 */}
          <div className="pt-6 border-t border-stone-100 w-full flex justify-between items-end">
            <div className="text-left">
              <p className="text-[10px] text-stone-400 mb-1">您的日主</p>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-ink text-paper flex items-center justify-center text-xs font-serif">
                  {user.dayGan}
                </span>
                <span className="text-xs text-stone-600 font-serif">
                  {user.element}身
                </span>
                {user.hourGan && (
                  <>
                    <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-serif ml-1">
                      {user.hourGan}
                    </span>
                    <span className="text-xs text-stone-400 font-serif">
                      时
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-stone-300 tracking-widest uppercase">
                Five Elements Jewelry
              </p>
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
