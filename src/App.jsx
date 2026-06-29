import React, { useState } from "react";
import InputForm from "./components/InputForm";
import ResultCard from "./components/ResultCard";
import BackgroundEffects from "./components/BackgroundEffects";
import { getDailyRecommendation } from "./utils/fiveElements";

function App() {
  // 存储测算结果的 state
  const [result, setResult] = useState(null);

  // 处理测算计算
  const handleCalculate = (dateStr, timeStr) => {
    const data = getDailyRecommendation(dateStr, timeStr);
    setResult(data);
  };

  // 重置测算状态，返回输入表单
  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-paper relative overflow-hidden">
      {/* 动态粒子背景：根据推荐的五行展现专属的新中式意境动效 */}
      <BackgroundEffects element={result ? result.recommendation.element : null} />

      <div className="relative z-10 w-full flex justify-center">
        {!result ? (
          <InputForm onSubmit={handleCalculate} />
        ) : (
          <ResultCard data={result} onReset={handleReset} />
        )}
      </div>

      {/* 底部极简中式文字装饰 */}
      <div className="absolute bottom-4 text-[10px] text-stone-300 font-serif tracking-widest z-10">
        FIVE ELEMENTS JEWELRY
      </div>
    </div>
  );
}

export default App;
