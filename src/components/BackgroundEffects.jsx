import React, { useEffect, useRef } from "react";

/**
 * 五行专属动态粒子背景组件
 * @param {string} element 当前推荐的五行 ('木', '火', '土', '金', '水')，若无则显示中性背景
 */
export default function BackgroundEffects({ element }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // 设置 Canvas 大小自适应视口
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 粒子类定义
    class Particle {
      constructor(type) {
        this.type = type;
        this.reset();
      }

      // 根据不同的五行重置粒子的位置、速度、大小和寿命
      reset() {
        this.x = Math.random() * canvas.width;
        this.size = Math.random() * 3 + 1.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.maxLife = Math.random() * 200 + 100;
        this.life = 0;

        // 根据五行定义不同的物理特性
        switch (this.type) {
          case "木": // 绿叶飘落：从上方/左侧飘落
            this.y = -20;
            this.vx = Math.random() * 0.8 + 0.2;
            this.vy = Math.random() * 1.0 + 0.5;
            this.color = Math.random() > 0.5 ? "rgba(75, 110, 87, " : "rgba(143, 188, 143, "; // 竹青/淡绿
            this.angle = Math.random() * Math.PI * 2;
            this.spin = Math.random() * 0.02 - 0.01;
            break;
          case "火": // 星火上升：从下方往上升腾
            this.y = canvas.height + 20;
            this.vx = Math.random() * 1.0 - 0.5;
            this.vy = -(Math.random() * 1.5 + 0.8);
            this.color = Math.random() > 0.4 ? "rgba(205, 69, 50, " : "rgba(255, 140, 0, "; // 朱砂/橘红
            break;
          case "土": // 大地尘埃：悬浮无规则漂移，微弱收缩
            this.y = Math.random() * canvas.height;
            this.vx = Math.random() * 0.4 - 0.2;
            this.vy = Math.random() * 0.4 - 0.2;
            this.color = "rgba(154, 125, 70, "; // 赭石
            break;
          case "金": // 金属闪烁：星芒无位移闪烁
            this.y = Math.random() * canvas.height;
            this.vx = 0;
            this.vy = 0;
            this.size = Math.random() * 2.5 + 1;
            this.color = Math.random() > 0.6 ? "rgba(212, 175, 55, " : "rgba(230, 230, 250, "; // 赤金/冷白
            this.flashSpeed = Math.random() * 0.02 + 0.005;
            this.flashDir = 1;
            break;
          case "水": // 水珠上升或水波膨胀
            this.y = canvas.height + 20;
            this.vx = Math.random() * 0.4 - 0.2;
            this.vy = -(Math.random() * 0.8 + 0.3);
            this.size = Math.random() * 5 + 2; // 水珠稍大
            this.color = "rgba(44, 62, 80, "; // 黛蓝
            break;
          default: // 默认中性背景：宣纸墨点微尘
            this.y = Math.random() * canvas.height;
            this.vx = Math.random() * 0.2 - 0.1;
            this.vy = Math.random() * 0.2 - 0.1;
            this.color = "rgba(26, 26, 26, "; // 徽墨色
        }
      }

      // 更新粒子状态
      update() {
        this.life++;

        if (this.type === "木") {
          this.x += this.vx + Math.sin(this.life * 0.02) * 0.5; // 带有摆动飘落
          this.y += this.vy;
          this.angle += this.spin;
        } else if (this.type === "金") {
          // 金系闪烁变化 alpha
          this.alpha += this.flashSpeed * this.flashDir;
          if (this.alpha > 0.7) {
            this.alpha = 0.7;
            this.flashDir = -1;
          } else if (this.alpha < 0.05) {
            this.flashDir = 1;
          }
        } else {
          this.x += this.vx;
          this.y += this.vy;
        }

        // 寿命耗尽、出界则重置
        if (
          this.life >= this.maxLife ||
          this.x < -50 ||
          this.x > canvas.width + 50 ||
          this.y < -50 ||
          this.y > canvas.height + 50
        ) {
          this.reset();
        }
      }

      // 绘制粒子
      draw() {
        ctx.beginPath();
        const drawAlpha = this.type === "金" ? this.alpha : this.alpha * (1 - this.life / this.maxLife);
        ctx.fillStyle = `${this.color}${drawAlpha})`;

        if (this.type === "木") {
          // 绘制树叶形状粒子
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle);
          ctx.ellipse(0, 0, this.size * 2, this.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (this.type === "水") {
          // 绘制水泡（空心圆，带高光感）
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(44, 62, 80, ${drawAlpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          // 微小高光点
          ctx.beginPath();
          ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${drawAlpha})`;
          ctx.fill();
        } else {
          // 默认绘制圆形粒子
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 初始化粒子数组
    const particleCount = 45;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(element));
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [element]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity: element ? 0.8 : 0.3 }}
    />
  );
}
