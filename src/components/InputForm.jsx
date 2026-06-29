import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * 生日信息录入组件（支持 localStorage 多人档案库）
 * @param {function} onSubmit 提交测算的回调函数
 */
export default function InputForm({ onSubmit }) {
  // 核心生日和时辰 state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // 从 localStorage 获取已保存的档案列表
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem("five_elements_profiles");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("读取档案库失败:", e);
      return [];
    }
  });

  // 当前选中的档案 ID
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  // 是否勾选“保存为常用档案”
  const [saveProfile, setSaveProfile] = useState(false);
  // 新建档案的名称
  const [profileName, setProfileName] = useState("");

  // 选中常用档案时，自动回填日期和时辰
  const handleSelectProfile = (p) => {
    setSelectedProfileId(p.id);
    setDate(p.date);
    setTime(p.time);
  };

  // 清除选中的档案，恢复手动输入状态
  const handleClearSelection = () => {
    setSelectedProfileId(null);
    setDate("");
    setTime("");
    setSaveProfile(false);
    setProfileName("");
  };

  // 删除指定的常用档案
  const handleDeleteProfile = (e, id) => {
    e.stopPropagation(); // 阻止冒泡，防止触发选择该档案
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    localStorage.setItem("five_elements_profiles", JSON.stringify(updated));
    if (selectedProfileId === id) {
      handleClearSelection();
    }
  };

  // 表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) return;

    // 如果勾选了保存常用档案，且输入了名称，则存入 localStorage
    if (saveProfile && profileName.trim()) {
      const newProfile = {
        id: Date.now().toString(),
        name: profileName.trim(),
        date,
        time,
      };
      const updated = [...profiles, newProfile];
      setProfiles(updated);
      localStorage.setItem("five_elements_profiles", JSON.stringify(updated));
      // 重置保存相关状态
      setSaveProfile(false);
      setProfileName("");
      setSelectedProfileId(newProfile.id); // 默认设为选中当前新档案
    }

    onSubmit(date, time);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-stone-100"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-ink mb-2 tracking-widest">
          五行 · 佩戴
        </h1>
        <p className="text-xs text-stone-500 uppercase tracking-[0.2em]">
          Daily Energy Jewelry
        </p>
      </div>

      {/* 常用生日档案快速选择区 */}
      {profiles.length > 0 && (
        <div className="mb-8 space-y-2">
          <p className="text-[10px] text-center text-stone-400 font-serif tracking-widest uppercase">
            — 常用生日档案 —
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-h-24 overflow-y-auto p-1">
            {profiles.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectProfile(p)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif border tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedProfileId === p.id
                    ? "bg-ink text-paper border-ink"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                <span>{p.name}</span>
                {/* 悬浮显示的极简删除小按钮 */}
                <button
                  type="button"
                  onClick={(e) => handleDeleteProfile(e, p.id)}
                  className={`text-[9px] hover:text-red-500 transition-colors ml-0.5 ${
                    selectedProfileId === p.id ? "text-paper/60" : "text-stone-400"
                  }`}
                  title="删除档案"
                >
                  ✕
                </button>
              </div>
            ))}
            {selectedProfileId && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-2.5 py-1.5 text-xs text-stone-400 hover:text-ink font-serif transition-colors"
              >
                清除选择
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 出生日期录入 */}
        <div className="space-y-2">
          <label className="block text-sm font-serif text-stone-600 text-center tracking-wider">
            请输入您的公历生日
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              // 如果用户修改了回填数据，脱离选中档案状态
              if (selectedProfileId) setSelectedProfileId(null);
            }}
            required
            className="w-full px-4 py-3 bg-paper border-b border-stone-300 focus:border-ink focus:outline-none text-center font-serif text-lg text-ink transition-colors rounded-t-lg"
          />
        </div>

        {/* 出生时辰录入（选填） */}
        <div className="space-y-2">
          <label className="block text-sm font-serif text-stone-600 text-center tracking-wider">
            出生时辰 (选填)
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              if (selectedProfileId) setSelectedProfileId(null);
            }}
            className="w-full px-4 py-3 bg-paper border-b border-stone-300 focus:border-ink focus:outline-none text-center font-serif text-lg text-ink transition-colors rounded-t-lg"
          />
          <p className="text-[10px] text-center text-stone-400">
            填写时辰可激活八字“四柱”完整运盘
          </p>
        </div>

        {/* 保存为新档案的展开选项（仅在未选择已有档案时可见） */}
        {!selectedProfileId && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="saveProfileCheckbox"
                checked={saveProfile}
                onChange={(e) => setSaveProfile(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-ink focus:ring-ink cursor-pointer"
              />
              <label htmlFor="saveProfileCheckbox" className="text-xs text-stone-500 font-serif cursor-pointer select-none">
                保存此生日为常用档案
              </label>
            </div>
            
            {saveProfile && (
              <motion.input
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                type="text"
                placeholder="请输入档案姓名或备注 (如：自己、妈妈)"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required={saveProfile}
                className="w-full px-3 py-2 bg-paper border border-stone-300 focus:border-ink focus:outline-none text-center font-serif text-sm text-ink rounded-lg transition-all"
              />
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-ink text-paper font-serif tracking-[0.2em] rounded-lg hover:bg-stone-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300"
        >
          开启今日能量
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-[10px] text-stone-400 font-light leading-relaxed">
          我们尊重传统智慧，更相信理性的生活美学。
          <br />
          不问吉凶，只求身心平衡。
        </p>
      </div>
    </motion.div>
  );
}
