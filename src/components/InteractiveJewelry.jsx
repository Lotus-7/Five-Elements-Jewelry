import React from "react";
import { motion } from "framer-motion";

/**
 * 虚拟珠宝橱窗组件 - 基于高品质 SVG 渐变绘制金木水火土代表性中式珠宝
 * @param {string} element 五行元素 ('木', '火', '土', '金', '水')
 * @param {string} colorHex 推荐珠宝的主色值
 */
export default function InteractiveJewelry({ element, colorHex }) {
  // 根据五行类型渲染对应的三维感中式珠宝矢量图形
  const renderJewelrySVG = () => {
    switch (element) {
      case "木": // 推荐木系：金镶玉·平安扣
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_20px_rgba(75,110,87,0.3)]">
            <defs>
              {/* 翡翠玉石渐变：深翠绿到冰种白绿 */}
              <radialGradient id="jadeGrad" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#A3E4D7" />
                <stop offset="30%" stopColor="#4B6E57" />
                <stop offset="85%" stopColor="#2E4A37" />
                <stop offset="100%" stopColor="#1E3224" />
              </radialGradient>
              {/* 古法黄金渐变 */}
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9E6" />
                <stop offset="30%" stopColor="#D4AF37" />
                <stop offset="70%" stopColor="#AA820A" />
                <stop offset="100%" stopColor="#6A5002" />
              </linearGradient>
            </defs>
            {/* 翡翠平安扣外环 */}
            <circle cx="100" cy="100" r="70" fill="url(#jadeGrad)" />
            {/* 玉石高光保护层 */}
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <ellipse cx="80" cy="65" rx="35" ry="12" fill="rgba(255,255,255,0.15)" transform="rotate(-25, 80, 65)" />
            
            {/* 中间镂空圈 */}
            <circle cx="100" cy="100" r="22" fill="#FFFFFF" />
            
            {/* 金镶玉内扣：纯金祥云纹理 */}
            <circle cx="100" cy="100" r="22" fill="none" stroke="url(#goldGrad)" strokeWidth="4.5" />
            <path
              d="M 90,100 A 10,10 0 0,1 110,100"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="2.5"
            />
            {/* 挂绳金珠 */}
            <circle cx="100" cy="22" r="8" fill="url(#goldGrad)" />
            <line x1="100" y1="0" x2="100" y2="14" stroke="#8A1C14" strokeWidth="3" /> {/* 红丝绳 */}
            <line x1="100" y1="22" x2="100" y2="30" stroke="#8A1C14" strokeWidth="3" />
          </svg>
        );

      case "火": // 推荐火系：南红玛瑙·如意祥云葫芦
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_20px_rgba(205,69,50,0.35)]">
            <defs>
              {/* 南红柿子红玉石渐变 */}
              <radialGradient id="agateGrad" cx="35%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#FFA07A" />
                <stop offset="35%" stopColor="#CD4532" />
                <stop offset="85%" stopColor="#8B1A0E" />
                <stop offset="100%" stopColor="#5C0D05" />
              </radialGradient>
              {/* 赤金材质渐变 */}
              <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2E6" />
                <stop offset="40%" stopColor="#E6A08E" />
                <stop offset="80%" stopColor="#CD4532" strokeWidth="0.5" />
                <stop offset="100%" stopColor="#7A1D11" />
              </linearGradient>
            </defs>
            {/* 葫芦上半球 */}
            <circle cx="100" cy="72" r="32" fill="url(#agateGrad)" />
            {/* 葫芦下半球 */}
            <circle cx="100" cy="125" r="48" fill="url(#agateGrad)" />
            {/* 葫芦纤细腰身遮罩 */}
            <path d="M 82,92 Q 100,97 118,92 L 114,102 Q 100,98 86,102 Z" fill="#8B1A0E" opacity="0.3" />
            
            {/* 腰缠金腰带 */}
            <rect x="79" y="93" width="42" height="6" rx="3" fill="url(#roseGoldGrad)" />
            <circle cx="100" cy="96" r="5" fill="#FFF9E6" />

            {/* 葫芦顶端龙头藤蔓 */}
            <path
              d="M 100,40 Q 105,25 92,20 Q 86,22 94,30 Q 98,32 100,40"
              fill="none"
              stroke="url(#roseGoldGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* 葫芦肚子上的金如意纹饰 */}
            <path
              d="M 85,125 Q 100,105 115,125 Q 100,145 85,125 Z"
              fill="none"
              stroke="url(#roseGoldGrad)"
              strokeWidth="2.5"
              opacity="0.8"
            />
            <circle cx="100" cy="125" r="3" fill="url(#roseGoldGrad)" />
          </svg>
        );

      case "土": // 推荐土系：温润老蜜蜡·水滴挂件
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_20px_rgba(154,125,70,0.3)]">
            <defs>
              {/* 蜜蜡有机质感渐变 */}
              <radialGradient id="amberGrad" cx="30%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#FFF4D0" />
                <stop offset="25%" stopColor="#F5D061" />
                <stop offset="70%" stopColor="#D49B25" />
                <stop offset="95%" stopColor="#9E6B05" />
                <stop offset="100%" stopColor="#6E4800" />
              </radialGradient>
              {/* 挂头古铜渐变 */}
              <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFEAA7" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#8C6D1F" />
              </linearGradient>
            </defs>
            {/* 蜜蜡饱满的水滴造型 */}
            <path
              d="M 100,35 C 100,35 148,105 148,135 C 148,165 126,182 100,182 C 74,182 52,165 52,135 C 52,105 100,35 100,35 Z"
              fill="url(#amberGrad)"
            />
            {/* 蜜蜡内部的天然爆花/流淌纹效果 */}
            <path
              d="M 85,120 Q 95,95 105,130 T 115,100"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 75,145 Q 100,165 125,140"
              fill="none"
              stroke="rgba(255,235,160,0.12)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            
            {/* 水滴边缘高光 */}
            <path
              d="M 60,135 C 60,115 90,55 95,45"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* 祥云蝙蝠挂扣 */}
            <path
              d="M 90,36 Q 100,22 110,36 L 100,48 Z"
              fill="url(#bronzeGrad)"
            />
            <circle cx="100" cy="22" r="6" fill="url(#bronzeGrad)" />
            <line x1="100" y1="0" x2="100" y2="16" stroke="#4A3423" strokeWidth="2.5" /> {/* 褐色挂绳 */}
          </svg>
        );

      case "金": // 推荐金系：流光溢彩·南洋金珠吊坠
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_25px_rgba(212,175,55,0.35)]">
            <defs>
              {/* 金珠炫彩珍珠光泽渐变 */}
              <radialGradient id="pearlGrad" cx="32%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="15%" stopColor="#FFF9E6" />
                <stop offset="55%" stopColor="#F3D17C" />
                <stop offset="90%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#997813" />
              </radialGradient>
              {/* 镶嵌白金/钻石质感渐变 */}
              <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#E2E8F0" />
                <stop offset="70%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>
            {/* 顶端精美银饰挂件：莲花/皇冠造型 */}
            <path
              d="M 80,68 C 80,48 100,44 100,44 C 100,44 120,48 120,68 C 110,65 100,72 100,72 C 100,72 90,65 80,68 Z"
              fill="url(#silverGrad)"
            />
            {/* 挂钩顶环 */}
            <circle cx="100" cy="36" r="8" fill="url(#silverGrad)" />
            <circle cx="100" cy="36" r="3" fill="#FFFFFF" />
            <line x1="100" y1="0" x2="100" y2="28" stroke="#1A1A1A" strokeWidth="1.5" /> {/* 黑色皮绳/金链 */}
            
            {/* 黄金大珍珠 */}
            <circle cx="100" cy="116" r="54" fill="url(#pearlGrad)" />
            {/* 珍珠晕彩高光 */}
            <circle cx="100" cy="116" r="54" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <ellipse cx="84" cy="98" rx="20" ry="8" fill="rgba(255,255,255,0.4)" transform="rotate(-30, 84, 98)" />
            
            {/* 金托底部流苏小珠 */}
            <circle cx="100" cy="178" r="4" fill="url(#silverGrad)" />
            <line x1="100" y1="170" x2="100" y2="174" stroke="#94A3B8" strokeWidth="2" />
          </svg>
        );

      case "水": // 推荐水系：深海幽蓝·水滴海蓝宝
        return (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_20px_rgba(44,62,80,0.3)]">
            <defs>
              {/* 海蓝宝水晶切割与折射渐变 */}
              <radialGradient id="aquaGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#E0F7FA" />
                <stop offset="35%" stopColor="#4FC3F7" />
                <stop offset="75%" stopColor="#0288D1" />
                <stop offset="100%" stopColor="#01579B" />
              </radialGradient>
            </defs>
            {/* 水滴形宝石琢面外廓 */}
            <path
              d="M 100,32 C 100,32 152,102 152,136 C 152,168 128,184 100,184 C 72,184 48,168 48,136 C 48,102 100,32 100,32 Z"
              fill="url(#aquaGrad)"
            />

            {/* 宝石切割折射线与几何琢面 */}
            {/* 中心琢面 */}
            <path d="M 100,60 L 126,115 L 100,162 L 74,115 Z" fill="rgba(255, 255, 255, 0.15)" />
            {/* 顶角琢线 */}
            <line x1="100" y1="32" x2="100" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="48" y1="136" x2="74" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="152" y1="136" x2="126" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="100" y1="184" x2="100" y2="162" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            
            {/* 边缘斜面 */}
            <line x1="100" y1="60" x2="126" y2="115" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="100" y1="60" x2="74" y2="115" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="100" y1="162" x2="126" y2="115" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="100" y1="162" x2="74" y2="115" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            
            {/* 宝石星光高光 */}
            <path
              d="M 60,110 Q 75,70 100,50"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* 顶端银扣 */}
            <rect x="94" y="22" width="12" height="12" fill="url(#silverGrad)" rx="2" transform="rotate(45, 100, 28)" />
            <circle cx="100" cy="18" r="5" fill="#E2E8F0" />
            <line x1="100" y1="0" x2="100" y2="14" stroke="#475569" strokeWidth="2" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{
        delay: 0.3,
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // 新中式顺滑阻尼缓动
      }}
      className="w-48 h-48 flex items-center justify-center relative my-4 cursor-pointer group"
    >
      {/* 底部扩散光晕背景 */}
      <div
        className="absolute inset-4 rounded-full filter blur-xl opacity-30 group-hover:opacity-45 transition-opacity duration-700"
        style={{ backgroundColor: colorHex }}
      />
      
      {/* 旋转装饰双圆环 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-dashed border-stone-200/60 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-full border border-stone-100 pointer-events-none"
      />

      {/* 虚拟珠宝主体 - 悬浮缓动效果 */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-40 h-40 flex items-center justify-center relative z-10"
      >
        {renderJewelrySVG()}
      </motion.div>
      
      {/* 中式小印章装饰标签 */}
      <div 
        className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] tracking-widest text-white font-serif shadow-sm transform rotate-6 z-20"
        style={{ backgroundColor: colorHex }}
      >
        {element}品
      </div>
    </motion.div>
  );
}
