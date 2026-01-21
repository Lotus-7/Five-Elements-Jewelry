import React, { useState } from "react";
import { motion } from "framer-motion";

export default function InputForm({ onSubmit }) {
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date) {
      onSubmit(date);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-stone-100"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif text-ink mb-2 tracking-widest">
          五行 · 佩戴
        </h1>
        <p className="text-xs text-stone-500 uppercase tracking-[0.2em]">
          Daily Energy Jewelry
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="block text-sm font-serif text-stone-600 text-center tracking-wider">
            请输入您的公历生日
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-3 bg-paper border-b border-stone-300 focus:border-ink focus:outline-none text-center font-serif text-lg text-ink transition-colors rounded-t-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-ink text-paper font-serif tracking-[0.2em] rounded-lg hover:bg-stone-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300"
        >
          开启今日能量
        </button>
      </form>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-stone-400 font-light leading-relaxed">
          我们尊重传统智慧，更相信理性的生活美学。
          <br />
          不问吉凶，只求身心平衡。
        </p>
      </div>
    </motion.div>
  );
}
