import React, { useState } from "react";
import InputForm from "./components/InputForm";
import ResultCard from "./components/ResultCard";
import { getDailyRecommendation } from "./utils/fiveElements";

function App() {
  const [result, setResult] = useState(null);

  const handleCalculate = (dateStr, timeStr) => {
    const data = getDailyRecommendation(dateStr, timeStr);
    setResult(data);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-paper relative overflow-hidden">
      {/* Background Texture/Decoration */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-stone-900 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stone-500 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        {!result ? (
          <InputForm onSubmit={handleCalculate} />
        ) : (
          <ResultCard data={result} onReset={handleReset} />
        )}
      </div>

      {/* Footer / Branding */}
      <div className="absolute bottom-4 text-[10px] text-stone-300 font-serif tracking-widest z-10">
        FIVE ELEMENTS JEWELRY
      </div>
    </div>
  );
}

export default App;
