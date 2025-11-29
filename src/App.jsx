import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ShoppingBag, X, Zap, Crown, Sparkles, BookOpen, Coffee, ScrollText, CheckCircle2, Circle, Heart, Minus, Plus, AlertTriangle, Shield, ShieldAlert, Monitor, Smartphone, Music, Volume2, VolumeX, PenLine, Save } from 'lucide-react';
import confetti from 'canvas-confetti'; 

// --- 音效系統設定 ---
const audioAssets = {
  click: new Audio('/sounds/click.mp3'),
  coin: new Audio('/sounds/coin.mp3'),
  start: new Audio('/sounds/start.mp3'),
  meow: new Audio('/sounds/meow.mp3'),
  rain: new Audio('/sounds/rain.mp3'),
  piano: new Audio('/sounds/piano.mp3'),
  '8bit': new Audio('/sounds/8bit.mp3'),
};

const initAudio = () => {
  ['rain', 'piano', '8bit'].forEach(key => {
    if (audioAssets[key]) {
      audioAssets[key].loop = true; 
      audioAssets[key].volume = 0.4; 
    }
  });
  if (audioAssets.meow) audioAssets.meow.volume = 0.6;
  if (audioAssets.start) audioAssets.start.volume = 0.5;
  if (audioAssets.coin) audioAssets.coin.volume = 0.5;
  if (audioAssets.click) audioAssets.click.volume = 0.4;
};

initAudio();

const playSfx = (name) => {
  const audio = audioAssets[name];
  if (audio) {
    audio.currentTime = 0; 
    audio.play().catch(e => console.log("Audio blocked:", e));
  }
};

// --- 動態天氣組件 ---
const WeatherOverlay = ({ type }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const count = type === 'rain' ? 30 : type === 'piano' ? 20 : 10;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 2 + 's',
      duration: Math.random() * 1 + 1 + 's', 
      opacity: Math.random() * 0.5 + 0.3
    }));
    setParticles(newParticles);
  }, [type]);

  if (type === 'rain') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map(p => (
          <div key={p.id} className="absolute bg-indigo-300 w-[2px] h-4 rounded-full animate-[rain_1s_linear_infinite]"
            style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity, top: '-20px' }} 
          />
        ))}
        <style>{`@keyframes rain { 0% { transform: translateY(0); } 100% { transform: translateY(100vh); } }`}</style>
      </div>
    );
  }

  if (type === 'piano') { 
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-indigo-900/20">
        {particles.map(p => (
          <div key={p.id} className="absolute bg-white w-1 h-1 rounded-full animate-[twinkle_3s_ease-in-out_infinite]"
            style={{ left: p.left, top: Math.random() * 80 + '%', animationDelay: p.delay, opacity: p.opacity }} 
          />
        ))}
        <style>{`@keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }`}</style>
      </div>
    );
  }
  
  if (type === '8bit') { 
     return (
       <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-[-20%] text-4xl opacity-40 animate-[cloud_20s_linear_infinite]">☁️</div>
          <div className="absolute top-32 left-[-10%] text-2xl opacity-30 animate-[cloud_25s_linear_infinite]" style={{animationDelay: '5s'}}>☁️</div>
          <style>{`@keyframes cloud { 0% { transform: translateX(-50px); } 100% { transform: translateX(120vw); } }`}</style>
       </div>
     )
  }

  return null;
};

// --- 組件：像素寵物 ---
const PixelPet = ({ stage, color, mode, isActive, isPetting, onClick, emotion, message, dna }) => {
  const designs = {
    egg: ["0000000000000000", "0000002222000000", "0000221111220000", "0002111111112000", "0021113311111200", "0021133311111200", "0211111111111120", "0211111441111120", "0211111441111120", "0211111111111120", "0211111111111120", "0021111111111200", "0002111111112000", "0000221111220000", "0000002222000000", "0000000000000000"],
    baby: ["0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000", "0000000222000000", "0000002111200000", "0000002111112000", "0000002111111120", "0002111111111200", "0002122111221200", "0002123111231200", "0021111111111120", "0021111444111120", "0000221111112200", "0000002222222000", "0000000000000000"],
    adult: ["0000000000000000", "0000000000000000", "0002200000002200", "0021200000021200", "0021122222211200", "0021111111111200", "0021122111221200", "0021123111231200", "0021111111111200", "0002111111112000", "0002111111112002", "0021111111111221", "0021111111111121", "0021111111112212", "0002222222221120", "0000000000002200"],
    master: ["0000000000000000", "0000002222200000", "0000021111120000", "0000211111112000", "0000212212212000", "0002111111111200", "0002444444444200", "0024444444444420", "0021111111111220", "0211111111111120", "0212211111112120", "0221122222221120", "0002200000002200", "0000000000000000", "0000000000000000", "0000000000000000"]
  };

  const currentDesign = designs[stage] || designs.egg;
  const size = 20; 
  
  let animationClass = '';
  if (isPetting) animationClass = 'animate-bounce';
  else if (emotion === 'sad') animationClass = 'animate-[shake_0.5s_ease-in-out_infinite]';
  else if (stage === 'master') animationClass = 'animate-[float_3s_ease-in-out_infinite]';
  else if (!isActive && mode !== 'break') animationClass = 'animate-[breathe_3s_ease-in-out_infinite]';

  return (
    <div className="relative group cursor-pointer flex flex-col items-center justify-end z-10" onClick={onClick}>
      
      <div className={`absolute -top-24 transition-all duration-500 transform ${message ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'} z-20 w-max max-w-[200px]`}>
        <div className="relative bg-white text-slate-800 px-4 py-2.5 rounded-2xl shadow-xl font-bold text-sm text-center border-2 border-slate-100 animate-[bounce_3s_ease-in-out_infinite]">
          {message}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-100 transform rotate-45"></div>
        </div>
      </div>

      {isPetting && <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 animate-ping"><Heart size={32} className="text-rose-500 fill-current" /></div>}
      {emotion === 'sad' && <div className="absolute -top-10 right-0 text-3xl animate-bounce">😭</div>}
      
      <div className={`relative transition-all duration-500 ${animationClass}`}>
        <svg viewBox="0 0 320 320" className={`w-48 h-48 drop-shadow-2xl filter transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'} ${emotion === 'sad' ? 'grayscale-[0.5] sepia-[0.5]' : ''}`}>
          {currentDesign.map((row, y) => row.split('').map((cell, x) => {
              if (cell === '0') return null;
              let finalColor = color; 
              if (cell === '2') finalColor = '#1e1b4b'; 
              if (cell === '3') finalColor = '#ffffff'; 
              if (cell === '4') finalColor = '#fb7185'; 
              return <rect key={`px-${x}-${y}`} x={x * size} y={y * size} width={size} height={size} fill={finalColor} />;
            }))}
          {isActive && mode === 'focus' && stage !== 'egg' && emotion !== 'sad' && (
             <g className="animate-pulse">
                <rect x="100" y="100" width="40" height="10" fill="#1e1b4b" rx="2" opacity="0.8" />
                <rect x="180" y="100" width="40" height="10" fill="#1e1b4b" rx="2" opacity="0.8" />
                <rect x="140" y="105" width="40" height="2" fill="#1e1b4b" opacity="0.8" />
             </g>
          )}
        </svg>
      </div>
      <div className={`mx-auto bg-black/10 rounded-[100%] blur-sm transition-all duration-1000 ${stage === 'master' ? 'w-32 h-3 animate-[shadow_3s_ease-in-out_infinite]' : 'w-36 h-4 mt-2'}`}></div>
      {mode === 'break' && <div className="absolute -top-6 right-4 text-3xl animate-bounce">💤</div>}
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes shadow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(0.8); opacity: 0.1; } }
        @keyframes breathe { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-3px) scale(1.02); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
        @keyframes errorShake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .animate-error-shake { animation: errorShake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

const App = () => {
  const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
      try {
        const persistedValue = localStorage.getItem(key);
        return persistedValue ? JSON.parse(persistedValue) : defaultValue;
      } catch (e) { return defaultValue; }
    });
    useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
    return [state, setState];
  };

  const [xp, setXp] = usePersistedState('focusPet_xp', 0);
  const [coins, setCoins] = usePersistedState('focusPet_coins', 150);
  const [evolutionStage, setEvolutionStage] = usePersistedState('focusPet_stage', 'egg');
  const [petColor, setPetColor] = usePersistedState('focusPet_color', '#fbbf24');
  const [bgTheme, setBgTheme] = usePersistedState('focusPet_theme', 'minimal');
  
  const [petName, setPetName] = usePersistedState('focusPet_name', '神秘的蛋');
  const [petDNA, setPetDNA] = usePersistedState('focusPet_dna', Math.random()); 
  const [diaryEntries, setDiaryEntries] = usePersistedState('focusPet_diary', []);

  const inventoryList = [
    { id: 'skin_orange', type: 'skin', name: '暖陽橘', price: 0, value: '#fbbf24', owned: true },
    { id: 'skin_gray', type: 'skin', name: '月岩灰', price: 100, value: '#94a3b8', owned: false },
    { id: 'bg_minimal', type: 'bg', name: '極簡白', price: 0, value: 'minimal', owned: true },
    { id: 'bg_lofi', type: 'bg', name: 'Lo-Fi 午夜', price: 150, value: 'lofi', owned: false },
  ];
  const [inventory, setInventory] = usePersistedState('focusPet_inventory', inventoryList);

  const [focusDuration, setFocusDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); 
  const [isEvolving, setIsEvolving] = useState(false);
  
  const [taskName, setTaskName] = useState('');
  const [inputError, setInputError] = useState(false); 
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundType, setSoundType] = useState('rain'); 

  const [strictMode, setStrictMode] = useState(false);
  const [isCheatDetected, setIsCheatDetected] = useState(false);
  const [petEmotion, setPetEmotion] = useState('normal'); 

  const isIdle = timeLeft === focusDuration * 60 && mode === 'focus';
  
  const [isPetting, setIsPetting] = useState(false);
  const [petMessage, setPetMessage] = useState('');
  const messageTimerRef = useRef(null);
  
  const [showShop, setShowShop] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showSounds, setShowSounds] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const [quests, setQuests] = useState([
    { id: 1, text: '完成 1 次專注', target: 1, current: 0, reward: 50, claimed: false },
    { id: 2, text: '賺取 100 XP', target: 100, current: 0, reward: 30, claimed: false },
    { id: 3, text: '使用背景音樂', target: 1, current: 0, reward: 20, claimed: false },
  ]);

  const expectedCoins = focusDuration * 2;
  const expectedXp = Math.floor(focusDuration * 1.5);

  // --- BGM ---
  useEffect(() => {
    ['rain', 'piano', '8bit'].forEach(key => { if (audioAssets[key]) audioAssets[key].pause(); });
    if (isPlayingSound) {
      const currentBgm = audioAssets[soundType];
      if (currentBgm) currentBgm.play().catch(e => { console.warn("BGM blocked:", e); setIsPlayingSound(false); });
    }
  }, [isPlayingSound, soundType]);

  // --- Visibility ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive && mode === 'focus' && strictMode) {
        setIsActive(false); setIsCheatDetected(true); setPetEmotion('sad'); setPetMessage(`別走... ${petName} 會怕...`);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive, mode, strictMode, petName]);

  const adjustTime = (amount) => {
    if (!isIdle) return; 
    playSfx('click'); 
    setFocusDuration(prev => {
      const newVal = Math.max(5, Math.min(120, prev + amount));
      setTimeLeft(newVal * 60);
      return newVal;
    });
  };

  const handleReset = () => {
    playSfx('click');
    setIsActive(false); setTimeLeft(focusDuration * 60); setMode('focus'); setIsCheatDetected(false); setPetEmotion('normal'); setTaskName('');
  };

  const handleResumeFromCheat = () => {
    playSfx('click');
    setIsCheatDetected(false); setPetEmotion('normal'); setIsActive(true); setPetMessage("歡迎回來！這次要專心喔！");
  };

  const handleToggleTimer = () => {
    if (!isActive) playSfx('start'); else playSfx('click');
    setIsActive(!isActive);
    setInputError(false);
  };

  const updateQuestProgress = (type, amount = 1) => {
    setQuests(prev => prev.map(q => {
      if (type === 'focus_complete' && q.id === 1) return { ...q, current: Math.min(q.current + amount, q.target) };
      if (type === 'xp_gain' && q.id === 2) return { ...q, current: Math.min(q.current + amount, q.target) };
      if (type === 'use_sound' && q.id === 3) return { ...q, current: Math.min(q.current + amount, q.target) };
      return q;
    }));
  };

  const claimReward = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && quest.current >= quest.target && !quest.claimed) {
      playSfx('coin'); 
      setCoins(c => c + quest.reward);
      setQuests(prev => prev.map(q => q.id === questId ? { ...q, claimed: true } : q));
    }
  };

  const hasUnclaimedQuests = quests.some(q => q.current >= q.target && !q.claimed);
  const STAGES = { egg: { threshold: 0, label: '神秘的蛋' }, baby: { threshold: 100, label: '好奇寶寶' }, adult: { threshold: 300, label: '得力助手' }, master: { threshold: 800, label: '專注大師' } };

  const toggleSound = (type) => {
    playSfx('click');
    if (isPlayingSound && soundType === type) setIsPlayingSound(false);
    else { setSoundType(type); setIsPlayingSound(true); updateQuestProgress('use_sound'); }
  };

  const handlePetClick = () => {
    if (isPetting || isActive || isCheatDetected) return;
    playSfx('meow'); 
    setIsPetting(true); updateQuestProgress('interact');
    const clickMessages = [`${petName} 好開心！`, "最喜歡你了！❤️", "充滿活力！", "摸摸頭～"];
    setPetMessage(clickMessages[Math.floor(Math.random() * clickMessages.length)]);
    setTimeout(() => { setIsPetting(false); updateContextMessage(); }, 1000);
  };

  const updateContextMessage = () => {
    if (isEvolving) { setPetMessage("充滿力量...！✨"); return; }
    if (isCheatDetected) { setPetMessage("不要離開我..."); return; }
    
    if (mode === 'focus') {
      if (isActive) {
        if (Math.random() > 0.6 && taskName) { setPetMessage(`${petName} 專注於：${taskName}`); return; }
        const totalTime = focusDuration * 60;
        const progress = 1 - (timeLeft / totalTime);
        let messages = [];
        if (progress < 0.2) messages = ["深呼吸... 準備好了嗎？", "好的開始！", "專注當下。"];
        else if (progress < 0.8) messages = ["保持節奏...", `${petName} 在修煉中...`, "噓... (認真)", "經驗值匯集中..."];
        else messages = ["最後衝刺！", "金幣在等著你！", "快完成了！"];
        setPetMessage(messages[Math.floor(Math.random() * messages.length)]);
      } else {
        if (isIdle) {
           const idleMessages = [`設定 ${focusDuration} 分鐘？`, "今天學點什麼？", "我準備好了！"];
           setPetMessage(idleMessages[Math.floor(Math.random() * idleMessages.length)]);
        } else { setPetMessage("暫停中..."); }
      }
    } else if (mode === 'break') { setPetMessage("休息一下吧。"); }
  };

  useEffect(() => {
    updateContextMessage();
    if (isActive && mode === 'focus' && !isEvolving && !isPetting && !isCheatDetected) {
      messageTimerRef.current = setInterval(() => updateContextMessage(), 10000);
    } else if (!isActive) { if (messageTimerRef.current) clearInterval(messageTimerRef.current); }
    return () => { if (messageTimerRef.current) clearInterval(messageTimerRef.current); };
  }, [isActive, mode, isEvolving, isPetting, focusDuration, isIdle, isCheatDetected, taskName, petName]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
        if (mode === 'focus' && Math.random() > 0.9) { setXp(x => x + 1); updateQuestProgress('xp_gain', 1); }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false); handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  useEffect(() => {
    let nextStage = evolutionStage;
    if (xp >= STAGES.master.threshold) nextStage = 'master';
    else if (xp >= STAGES.adult.threshold) nextStage = 'adult';
    else if (xp >= STAGES.baby.threshold && evolutionStage === 'egg') nextStage = 'baby';
    if (nextStage !== evolutionStage) {
      playSfx('coin'); 
      setIsEvolving(true); setPetMessage("進化的時刻...！");
      setTimeout(() => { setEvolutionStage(nextStage); setIsEvolving(false); setPetMessage(`我是${STAGES[nextStage].label.split(' ')[0]}！🎉`); }, 2500);
    }
  }, [xp]);

  const generateDiaryEntry = (task) => {
    const date = new Date().toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    let content = "";
    if (evolutionStage === 'egg') content = "蛋晃動了一下...";
    else if (evolutionStage === 'baby') content = `今天玩了 ${focusDuration} 分鐘！好開心！`;
    else if (evolutionStage === 'adult') content = `完成了「${task || '專注練習'}」。感覺變得更強了。`;
    else content = `心流狀態持續 ${focusDuration} 分鐘。平靜，專注。`;
    
    return { id: Date.now(), date, content, stage: evolutionStage };
  };

  const handleComplete = () => {
    if (mode === 'focus') {
      playSfx('coin'); 
      // 觸發彩帶特效！
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#818CF8', '#34D399']
      });

      setCoins(c => c + expectedCoins); setXp(x => x + expectedXp);
      updateQuestProgress('focus_complete', 1); updateQuestProgress('xp_gain', expectedXp);
      
      const newEntry = generateDiaryEntry(taskName);
      setDiaryEntries(prev => [newEntry, ...prev].slice(0, 10)); 

      setMode('break'); setTimeLeft(5 * 60);
      setPetMessage(`獲得 ${expectedCoins} 金幣！🎉`);
      setIsCheatDetected(false); setPetEmotion('normal');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else {
      setMode('focus'); setTimeLeft(focusDuration * 60);
      setPetMessage("休息結束！⚡️"); setTaskName('');
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  const themeStyles = { minimal: 'bg-slate-50 text-slate-800', lofi: 'bg-indigo-950 text-indigo-100' };
  const progress = Math.min((xp / STAGES.master.threshold) * 100, 100);

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-700 ${themeStyles[bgTheme]}`}>
      
      <div className={`
        w-full max-w-md mx-auto
        flex flex-col relative
        bg-white/10 backdrop-blur-md 
        md:my-8 md:rounded-[2.5rem] md:shadow-2xl md:border-8 border-0 md:min-h-[800px]
        ${bgTheme === 'lofi' ? 'md:border-indigo-900 bg-indigo-900/50' : 'md:border-white bg-white/60'}
      `}>
        
        {/* 移至最外層：動態天氣背景 */}
        {isPlayingSound && <WeatherOverlay type={soundType} />}

        {/* 移至最外層：嚴格模式警告 (覆蓋整個卡片) */}
        {isCheatDetected && (
             <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300 rounded-[2.5rem] overflow-hidden">
               <div className="bg-white w-full rounded-2xl p-6 text-center shadow-2xl">
                 <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><AlertTriangle size={32} /></div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">專注中斷！</h3>
                 <p className="text-sm text-slate-600 mb-6 leading-relaxed">嚴格模式下切換視窗<br/>會導致任務暫停！</p>
                 <button onClick={handleResumeFromCheat} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all">我回來了 (繼續計時)</button>
               </div>
             </div>
        )}

        {/* Top Info */}
        <div className="px-6 pt-8 pb-4 flex justify-between items-start z-10 shrink-0 relative">
          <div>
             <h2 className="text-[10px] font-bold opacity-60 tracking-widest uppercase mb-1">Companion</h2>
             <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="text" 
                      value={petName} 
                      onChange={(e) => setPetName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                      autoFocus
                      className="bg-white/50 border border-slate-300 rounded px-1 py-0.5 text-sm w-24 font-bold outline-none text-slate-800"
                    />
                    <button onClick={() => setIsEditingName(false)}><Save size={14} className="text-green-600"/></button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditingName(true)} className="font-bold text-lg flex items-center gap-2 hover:opacity-70 transition-opacity">
                    {petName}
                    <PenLine size={14} className="opacity-40" />
                  </button>
                )}
             </div>
             <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium opacity-70">{STAGES[evolutionStage].label}</span>
                {evolutionStage === 'master' && <Crown size={14} className="text-yellow-500" />}
             </div>
             <div className="w-28 h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
          </div>
          <div className="flex gap-2">
             <button onClick={() => { playSfx('click'); setShowSounds(!showSounds); }} className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-all ${isPlayingSound ? 'bg-indigo-500 text-white border-indigo-600 animate-pulse' : 'bg-white/20 border-black/5 text-slate-700'}`}>
               {isPlayingSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
             </button>
             <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full border border-black/5 shadow-sm backdrop-blur-md">
               <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] text-yellow-900 font-bold">$</div><span className="font-bold text-sm">{coins}</span>
             </div>
          </div>
        </div>

        {/* Sound Menu */}
        {showSounds && (
          <div className="mx-6 mb-2 p-3 bg-white/80 backdrop-blur-md rounded-2xl flex justify-around shadow-sm animate-in slide-in-from-top-2 border border-white/50 relative z-10">
             {[ {id:'rain', label:'雨聲', icon:'🌧️'}, {id:'piano', label:'鋼琴', icon:'🎹'}, {id:'8bit', label:'8-Bit', icon:'👾'} ].map(s => (
               <button 
                 key={s.id} 
                 onClick={() => toggleSound(s.id)}
                 className={`flex flex-col items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all ${isPlayingSound && soundType === s.id ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-100 text-slate-500'}`}
               >
                 <span className="text-lg">{s.icon}</span>
                 {s.label}
               </button>
             ))}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-grow flex flex-col items-center justify-center relative w-full px-6 py-4 z-10">
           
           {/* 移除舊的嚴格模式警告位置 */}
           
           {isEvolving && <div className="absolute inset-0 flex items-center justify-center z-20"><Sparkles className="w-48 h-48 text-yellow-300 animate-spin opacity-80" /><div className="absolute inset-0 bg-white/30 animate-pulse rounded-full blur-xl"></div></div>}
           
           <div className={`transition-all duration-700 ${isEvolving ? 'opacity-0 scale-50' : 'opacity-100 scale-100'} mt-16 z-10`}>
              <PixelPet stage={evolutionStage} color={petColor} mode={mode} isActive={isActive} isPetting={isPetting} onClick={handlePetClick} emotion={petEmotion} message={petMessage} />
           </div>

           <div className="my-8 text-center w-full z-10">
             <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-colors mb-6 shadow-sm ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100/50 text-slate-500'}`}>
                {mode === 'focus' ? (isActive ? <><BookOpen size={14} className="animate-pulse"/> 專注中</> : (isIdle ? '設定時間' : '已暫停')) : <><Coffee size={14} className="animate-bounce"/> 休息一下</>}
             </div>
             
             {isIdle && (
               <div className="mb-6 w-full max-w-[280px] mx-auto animate-in fade-in zoom-in duration-300">
                 <div className={`relative transition-transform ${inputError ? 'animate-error-shake' : ''}`}>
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><PenLine size={16} /></div>
                   <input 
                     type="text" 
                     placeholder="這次要專注做什麼？"
                     value={taskName}
                     onChange={(e) => setTaskName(e.target.value)}
                     className={`w-full bg-white/50 border rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:font-normal transition-colors
                       ${inputError ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50' : 'border-slate-200'}`}
                   />
                 </div>
               </div>
             )}
             
             {!isIdle && taskName && (
               <div className="mb-4 text-sm font-bold text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full inline-block animate-in fade-in">
                 🎯 {taskName}
               </div>
             )}

             {isIdle ? (
               <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-300 w-full max-w-[280px] mx-auto">
                 <div className="flex items-center justify-between bg-black/5 rounded-2xl p-3 backdrop-blur-sm">
                    <button onClick={() => adjustTime(-5)} className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center active:scale-90 transition-all text-slate-600"><Minus size={24} /></button>
                    <div className="flex flex-col items-center min-w-[100px]">
                      <span className="text-5xl font-black text-slate-800 tabular-nums">{focusDuration}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MINUTES</span>
                    </div>
                    <button onClick={() => adjustTime(5)} className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center active:scale-90 transition-all text-slate-600"><Plus size={24} /></button>
                 </div>
                 
                 <button onClick={() => { playSfx('click'); setStrictMode(!strictMode); }} className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all border shadow-sm ${strictMode ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white/50 border-slate-200 text-slate-400'}`}>
                    {strictMode ? <ShieldAlert size={16} /> : <Shield size={16} />}
                    {strictMode ? '嚴格模式：ON' : '嚴格模式：OFF'}
                 </button>
               </div>
             ) : (
               <div className="relative mb-6">
                 <div className={`text-8xl font-black tracking-tighter tabular-nums opacity-90 ${!isActive && mode === 'focus' ? 'text-slate-400' : ''}`}>
                   {Math.floor(timeLeft/60).toString().padStart(2,'0')}:{Math.floor(timeLeft%60).toString().padStart(2,'0')}
                 </div>
                 {!isActive && mode === 'focus' && !isCheatDetected && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-black text-slate-800/10 tracking-[0.8em] w-full select-none">PAUSED</div>}
               </div>
             )}

             {isIdle && (
                <div className="flex justify-center gap-3 text-xs font-bold text-slate-400 animate-in fade-in slide-in-from-bottom-2 mt-6">
                  <span className="flex items-center gap-1 bg-yellow-400/20 px-3 py-1.5 rounded-lg text-yellow-800">預計 +{expectedCoins} 金幣</span>
                  <span className="flex items-center gap-1 bg-indigo-500/10 px-3 py-1.5 rounded-lg text-indigo-700">+{expectedXp} XP</span>
                </div>
             )}

             {!isIdle && !isActive && mode === 'focus' && !isCheatDetected && (
               <button onClick={handleReset} className="mx-auto flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors py-4 active:opacity-60"><RotateCcw size={14} /> 放棄進度並重置</button>
             )}
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="pb-12 pt-4 px-8 w-full shrink-0 z-10">
           <div className="flex justify-between items-center max-w-sm mx-auto gap-4">
              <button onClick={() => { playSfx('click'); setShowQuests(true); }} className="w-16 h-16 rounded-full bg-emerald-100/90 backdrop-blur-sm text-emerald-700 flex items-center justify-center transition-all active:scale-90 shadow-lg relative border-2 border-white/50">
                <ScrollText size={24} />
                {hasUnclaimedQuests && <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
              </button>
              
              <button 
                onClick={handleToggleTimer} 
                className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-xl transition-all active:scale-95 border-4 border-white/50 ${isActive ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-indigo-600 text-white shadow-indigo-200'}`}
              >
                 {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
              </button>

              <button onClick={() => { playSfx('click'); setShowShop(true); }} className="w-16 h-16 rounded-full bg-yellow-400/90 backdrop-blur-sm text-yellow-900 flex items-center justify-center shadow-lg shadow-yellow-100 transition-all active:scale-90 border-2 border-white/50">
                <ShoppingBag size={24} />
              </button>
           </div>
        </div>

        {/* Modals */}
        {showQuests && (
           <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end">
             <div className="bg-white w-full h-[85vh] rounded-t-[2.5rem] p-6 flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl safe-area-bottom">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ScrollText className="text-emerald-600" size={24} /> <span>每日修行</span></h2>
                  <button onClick={() => { playSfx('click'); setShowQuests(false); }} className="p-2 bg-slate-100 rounded-full active:bg-slate-200"><X size={20} /></button>
                </div>
                <div className="space-y-6 flex-1 overflow-y-auto px-2 pb-8 custom-scrollbar">
                   <div className="space-y-3">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">今日目標</h3>
                     {quests.map(quest => {
                       const isCompleted = quest.current >= quest.target;
                       return (
                         <div key={quest.id} className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-[0.98] ${isCompleted ? (quest.claimed ? 'border-slate-100 bg-slate-50 opacity-60' : 'border-emerald-500 bg-emerald-50') : 'border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}</div>
                               <div><div className="font-bold text-sm text-slate-800">{quest.text}</div><div className="text-xs text-slate-400 mt-0.5">進度: {quest.current}/{quest.target}</div></div>
                            </div>
                            {isCompleted && !quest.claimed ? (<button onClick={() => claimReward(quest.id)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold animate-bounce shadow-md">領取 ${quest.reward}</button>) : quest.claimed ? (<span className="text-xs font-bold text-slate-400">已領取</span>) : (<span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">${quest.reward}</span>)}
                         </div>
                       );
                     })}
                   </div>

                   <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{petName} 的日記</h3>
                      {diaryEntries.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">這裡還空空的...<br/>完成一次專注來寫日記吧！</div>
                      ) : (
                        diaryEntries.map(entry => (
                          <div key={entry.id} className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                             <div className="flex justify-between items-center mb-1">
                               <span className="text-[10px] font-bold text-indigo-400 uppercase">{entry.date}</span>
                               <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-indigo-300 border border-indigo-100">{STAGES[entry.stage].label}</span>
                             </div>
                             <p className="text-sm text-indigo-900 font-medium leading-relaxed">{entry.content}</p>
                          </div>
                        ))
                      )}
                   </div>
                </div>
             </div>
           </div>
        )}
        
        {/* Shop Modal */}
        {showShop && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end">
            <div className="bg-white w-full h-[85vh] rounded-t-[2.5rem] p-6 flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl safe-area-bottom">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="text-indigo-500" /> 風格商店</h2>
                <button onClick={() => { playSfx('click'); setShowShop(false); }} className="p-2 bg-slate-100 rounded-full active:bg-slate-200"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 px-2 pb-8 custom-scrollbar">
                 <div className="grid grid-cols-2 gap-4">
                   {inventory.filter(i => i.type === 'skin').map(item => (
                     <button key={item.id} onClick={() => { playSfx('click'); if(item.owned) setPetColor(item.value); else if(coins>=item.price) { playSfx('coin'); setCoins(c=>c-item.price); setInventory(inv=>inv.map(i=>i.id===item.id?{...i,owned:true}:i)); setPetColor(item.value); } }} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 active:scale-95 transition-transform ${item.owned && petColor === item.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100'}`}>
                        <div className="w-12 h-12 rounded-full shadow-sm" style={{ backgroundColor: item.value }}></div>
                        <div className="text-sm font-bold">{item.owned ? '已擁有' : `$${item.price}`}</div>
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;