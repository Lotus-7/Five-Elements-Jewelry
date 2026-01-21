import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Share2 } from "lucide-react";

export default function ResultCard({ data, onReset }) {
  const { user, today, recommendation } = data;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden"
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
        <div className="relative px-6 py-6 bg-paper/50 rounded-xl">
          <p className="text-sm font-serif text-stone-700 leading-loose text-justify">
            <span className="text-2xl float-left mr-1 text-stone-300">“</span>
            {recommendation.reason}
            <span className="text-2xl float-right ml-1 text-stone-300">”</span>
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
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onReset}
              className="p-2 text-stone-400 hover:text-ink transition-colors"
            >
              <RefreshCcw size={18} />
            </button>
            {/* Share button placeholder */}
            <button className="p-2 text-stone-400 hover:text-ink transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
