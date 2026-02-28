/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, ArrowLeft, Loader2, Target, TrendingUp, Brain, 
  ShieldCheck, Calendar, Users, Database, Cpu, Palette, Plus, Zap, Heart, Star, Sun, Moon, School
} from 'lucide-react';
import { UserInput, AnalysisResult } from './types';
import { generateFutureSimulation } from './services/geminiService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Cell
} from 'recharts';

const MOTIVATIONAL_QUOTES = [
  "Đang kết nối với các khả năng trong tương lai...",
  "Phân tích quỹ đạo phát triển của bạn...",
  "Mô phỏng các kịch bản dựa trên dữ liệu hiện tại...",
  "Tương lai đang dần hiện rõ qua lăng kính AI...",
  "Sắp hoàn tất bản đồ hành trình 5 năm tới của bạn..."
];

const THEMES = [
  { name: 'Indigo', primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.2)' },
  { name: 'Emerald', primary: '#10b981', glow: 'rgba(16, 185, 129, 0.2)' },
  { name: 'Rose', primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.2)' },
  { name: 'Amber', primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.2)' },
  { name: 'Sky', primary: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.2)' },
];

const GPA_OPTIONS = [
  { label: 'Dưới 6.5', emoji: '🌱' },
  { label: '6.5 – 7.9', emoji: '🌿' },
  { label: '8.0 – 8.9', emoji: '🌳' },
  { label: 'Trên 9.0', emoji: '🔥' },
];

const WORK_PREFERENCES = [
  { label: 'Con người', icon: Users },
  { label: 'Dữ liệu/số liệu', icon: Database },
  { label: 'Máy móc/công nghệ', icon: Cpu },
  { label: 'Nghệ thuật/sáng tạo', icon: Palette },
  { label: 'Mục khác', icon: Plus },
];

const STUDY_TIME_OPTIONS = [
  'Dưới 1 giờ', '1–2 giờ', '2–4 giờ', 'Trên 4 giờ'
];

const PERSISTENCE_LABELS: Record<number, string> = {
  1: 'Rất thấp',
  2: 'Thấp',
  3: 'Trung bình',
  4: 'Cao',
  5: 'Rất cao'
};

function MarqueeExample({ text }: { text: string }) {
  return (
    <div className="marquee-container h-6 mt-1">
      <span className="marquee-text text-xs text-slate-400 italic font-medium">
        {text}
      </span>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    gpa: '',
    strengths: '',
    improvements: '',
    workPreference: [],
    careerStatus: '',
    careerGoal: '',
    careerDetail: '',
    workEnvironment: '',
    admissionGroup: '',
    persistence: 3,
    selfStudyTime: ''
  });

  // Reset form on load (ensures clean state)
  useEffect(() => {
    setFormData({
      name: '',
      gpa: '',
      strengths: '',
      improvements: '',
      workPreference: [],
      careerStatus: '',
      careerGoal: '',
      careerDetail: '',
      workEnvironment: '',
      admissionGroup: '',
      persistence: 3,
      selfStudyTime: ''
    });
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', activeTheme.primary);
    document.documentElement.style.setProperty('--theme-glow', activeTheme.glow);
  }, [activeTheme]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const simulationResult = await generateFutureSimulation(formData);
      setResult(simulationResult);
    } catch (error) {
      console.error("Simulation failed:", error);
      alert("Có lỗi xảy ra khi mô phỏng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgress = () => (
    <div className="flex items-center justify-center gap-4 mb-12">
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-[var(--theme-primary)] text-white shadow-lg shadow-[var(--theme-glow)]' : 'bg-slate-200 text-slate-400'}`}>1</div>
        <span className={`text-sm font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Cơ bản</span>
      </div>
      <div className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-[var(--theme-primary)]' : 'bg-slate-200'}`} />
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-[var(--theme-primary)] text-white shadow-lg shadow-[var(--theme-glow)]' : 'bg-slate-200 text-slate-400'}`}>2</div>
        <span className={`text-sm font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Chi tiết</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] bg-mesh flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <Loader2 className="w-16 h-16 text-[var(--theme-primary)]" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl font-bold text-slate-800 max-w-md"
          >
            {MOTIVATIONAL_QUOTES[quoteIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }

  if (result) {
    return <ResultView result={result} onReset={() => { setResult(null); setStep(1); }} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-mesh p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-3 mb-12">
          {THEMES.map((t) => (
            <button
              key={t.name}
              onClick={() => setActiveTheme(t)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${activeTheme.name === t.name ? 'border-slate-900 scale-125' : 'border-transparent opacity-50 hover:opacity-100'}`}
              style={{ backgroundColor: t.primary }}
              title={t.name}
            />
          ))}
        </div>

        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--theme-glow)] border border-[var(--theme-primary)]/20 text-[var(--theme-primary)] text-sm font-bold mb-6"
          >
            <Zap className="w-4 h-4" />
            AI Future Simulation
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tighter">
            Future Mirror
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Khám phá phiên bản rực rỡ nhất của bạn trong 5 năm tới.
          </p>
        </header>

        {renderProgress()}

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12"
        >
          {step === 1 ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tên của bạn</label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="glass-input w-full text-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ngành nghề mơ ước</label>
                  <div className="flex gap-2">
                    {['Có', 'Đang phân vân', 'Không'].map((status) => (
                      <button
                        key={`career-status-${status}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, careerStatus: status as any, careerGoal: status === 'Không' ? '' : formData.careerGoal })}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${formData.careerStatus === status ? 'bg-[var(--theme-primary)] border-[var(--theme-primary)] text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  {formData.careerStatus && formData.careerStatus !== 'Không' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mô tả chi tiết ngành nghề (nếu có)</label>
                      <motion.input
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        type="text"
                        autoComplete="off"
                        className="glass-input w-full"
                        value={formData.careerGoal}
                        onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                      />
                      <MarqueeExample text="Ví dụ: Em muốn trở thành Kỹ sư phần mềm tại các tập đoàn công nghệ lớn..." />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Điểm trung bình hiện tại</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {GPA_OPTIONS.map((opt) => (
                    <label
                      key={`gpa-${opt.label}`}
                      className={`selection-card relative ${formData.gpa === opt.label ? 'selection-card-active' : 'selection-card-inactive'}`}
                    >
                      <input
                        type="radio"
                        name="gpa-group"
                        className="sr-only"
                        checked={formData.gpa === opt.label}
                        onChange={() => setFormData({ ...formData, gpa: opt.label })}
                      />
                      <span className="text-3xl mb-1">{opt.emoji}</span>
                      <span className="text-sm font-bold">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Bạn thích làm việc với</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {WORK_PREFERENCES.map((opt) => {
                    const isSelected = formData.workPreference.includes(opt.label);
                    return (
                      <label
                        key={`work-${opt.label}`}
                        className={`selection-card relative ${isSelected ? 'selection-card-active' : 'selection-card-inactive'}`}
                      >
                        <input
                          type="checkbox"
                          name="work-pref-group"
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => {
                            const current = formData.workPreference;
                            const next = isSelected
                              ? current.filter(i => i !== opt.label)
                              : [...current, opt.label];
                            if (next.length > 0) {
                              setFormData({ ...formData, workPreference: next });
                            }
                          }}
                        />
                        <opt.icon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tổ hợp xét tuyển (nếu có)</label>
                <input
                  type="text"
                  autoComplete="off"
                  className="glass-input w-full"
                  value={formData.admissionGroup}
                  onChange={(e) => setFormData({ ...formData, admissionGroup: e.target.value })}
                />
                <MarqueeExample text="Ví dụ: A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Anh), D01 (Toán, Văn, Anh)..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Kỹ năng nổi bật (nếu có)</label>
                  <textarea
                    className="glass-input w-full h-28 resize-none"
                    value={formData.strengths}
                    onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  />
                  <MarqueeExample text="Ví dụ: Thuyết trình tự tin, Giải toán nhanh, Vẽ digital, Giao tiếp tiếng Anh tốt..." />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Kỹ năng cần cải thiện (nếu có)</label>
                  <textarea
                    className="glass-input w-full h-28 resize-none"
                    value={formData.improvements}
                    onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  />
                  <MarqueeExample text="Ví dụ: Quản lý thời gian chưa tốt, Hay trì hoãn, Ngại nói trước đám đông..." />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.gpa || formData.workPreference.length === 0 || !formData.careerStatus}
                  className="btn-primary flex items-center gap-3 text-lg"
                >
                  Tiếp tục <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Mô tả chi tiết ngành nghề</label>
                <textarea
                  className="glass-input w-full h-32 resize-none"
                  placeholder="Ví dụ: Em muốn trở thành Kỹ sư AI để phát triển các ứng dụng giúp ích cho cộng đồng, đặc biệt là trong lĩnh vực y tế..."
                  value={formData.careerDetail}
                  onChange={(e) => setFormData({ ...formData, careerDetail: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Môi trường làm việc mong muốn (nếu có)</label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="glass-input w-full"
                    value={formData.workEnvironment}
                    onChange={(e) => setFormData({ ...formData, workEnvironment: e.target.value })}
                  />
                  <MarqueeExample text="Ví dụ: Văn phòng sáng tạo, nhiều cây xanh, đồng nghiệp trẻ trung, năng động..." />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Thời gian tự học mỗi ngày</label>
                  <div className="flex flex-wrap gap-2">
                    {STUDY_TIME_OPTIONS.map((opt) => (
                      <label
                        key={`study-${opt}`}
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all cursor-pointer ${formData.selfStudyTime === opt ? 'bg-[var(--theme-primary)] border-[var(--theme-primary)] text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                      >
                        <input
                          type="radio"
                          name="study-time-group"
                          className="sr-only"
                          checked={formData.selfStudyTime === opt}
                          onChange={() => setFormData({ ...formData, selfStudyTime: opt })}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Mức độ kiên trì</label>
                  <span className="text-[var(--theme-primary)] font-black text-2xl bg-[var(--theme-glow)] px-4 py-1 rounded-xl">
                    {PERSISTENCE_LABELS[formData.persistence]}
                  </span>
                </div>
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[var(--theme-primary)]"
                    value={formData.persistence}
                    onChange={(e) => setFormData({ ...formData, persistence: parseInt(e.target.value) })}
                  />
                  <div className="flex justify-between mt-4">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <div key={val} className="flex flex-col items-center">
                        <div className={`w-1.5 h-1.5 rounded-full mb-2 ${formData.persistence >= val ? 'bg-[var(--theme-primary)]' : 'bg-slate-300'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${formData.persistence === val ? 'text-slate-900' : 'text-slate-400'}`}>
                          {PERSISTENCE_LABELS[val]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <button onClick={handleBack} className="btn-secondary flex items-center gap-3">
                  <ArrowLeft className="w-5 h-5" /> Quay lại
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={!formData.selfStudyTime}
                  className="btn-primary flex items-center gap-3 text-lg"
                >
                  Xem tương lai <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <footer className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium italic">
            “Tương lai không phải điều ngẫu nhiên – nó là kết quả của những lựa chọn bạn bắt đầu từ hôm nay.”
          </p>
        </footer>
      </div>
    </div>
  );
}

function ResultView({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] bg-mesh p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">Gương Thần Tương Lai</h1>
            <p className="text-slate-500 text-xl font-medium">Bản đồ quỹ đạo 5 năm của bạn đã sẵn sàng.</p>
          </div>
          <button onClick={onReset} className="btn-secondary text-lg px-10">Mô phỏng lại</button>
        </header>

        {/* Section 1: Current Capacity */}
        <div className="glass-card p-10 space-y-10">
          <h2 className="text-4xl font-black flex items-center gap-3 text-slate-900 uppercase tracking-tight">
            <Brain className="w-10 h-10 text-[var(--theme-primary)]" /> PHẦN 1 – Hồ sơ năng lực hiện tại
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-md transition-all">
              <h3 className="text-base font-black text-[var(--theme-primary)] uppercase tracking-widest mb-4">Phân tích học lực</h3>
              <p className="text-slate-700 text-xl leading-relaxed font-medium">{result.profile.academicAnalysis}</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-md transition-all">
              <h3 className="text-base font-black text-[var(--theme-primary)] uppercase tracking-widest mb-4">Phân tích tính kỷ luật</h3>
              <p className="text-slate-700 text-xl leading-relaxed font-medium">{result.profile.disciplineAnalysis}</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-md transition-all">
              <h3 className="text-base font-black text-[var(--theme-primary)] uppercase tracking-widest mb-4">Độ phù hợp ngành</h3>
              <p className="text-slate-700 text-xl leading-relaxed font-medium">{result.profile.careerFit}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50 border border-slate-100 hover:shadow-md transition-all">
              <h3 className="text-base font-black text-[var(--theme-primary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                <School className="w-5 h-5" /> Phân tích trường & ngành phù hợp
              </h3>
              <p className="text-slate-700 text-xl leading-relaxed font-medium">{result.profile.institutionAnalysis}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-[var(--theme-glow)] border border-[var(--theme-primary)]/10">
              <span className="text-base font-black text-[var(--theme-primary)] uppercase tracking-widest mb-6">Chỉ số định hướng</span>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[var(--theme-primary)]" strokeDasharray={402.1} strokeDashoffset={402.1 - (402.1 * result.profile.orientationIndex) / 100} strokeLinecap="round" />
                </svg>
                <span className="absolute text-5xl font-black text-slate-900">{result.profile.orientationIndex}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Scenarios & Trajectory Score */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <h2 className="text-4xl font-black flex items-center gap-3 text-slate-900 uppercase tracking-tight">
              <Target className="w-10 h-10 text-[var(--theme-primary)]" /> PHẦN 2 – Dự báo tương lai & Chỉ số quỹ đạo
            </h2>
            <div className="glass-card px-10 py-6 flex items-center gap-10 bg-[var(--theme-glow)] border-[var(--theme-primary)]/20">
              <div className="text-right">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Trajectory Score</h3>
                <div className="text-6xl font-black text-[var(--theme-primary)]">{result.trajectoryScore}</div>
              </div>
              <div className="w-48 h-4 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.trajectoryScore}%` }}
                  className="h-full bg-[var(--theme-primary)]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {result.scenarios.map((scenario, idx) => (
              <motion.div
                key={`scenario-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-card p-10 flex flex-col h-full border-t-[12px] ${
                  idx === 0 ? 'border-t-blue-500' : idx === 1 ? 'border-t-emerald-500' : 'border-t-amber-500'
                }`}
              >
                <div className="flex justify-between items-start mb-8">
                  <h3 className="font-black text-3xl text-slate-900 tracking-tight">{scenario.title}</h3>
                  <span className="px-4 py-1.5 rounded-2xl bg-slate-100 text-sm font-black text-[var(--theme-primary)] border border-slate-200">
                    {scenario.probability}%
                  </span>
                </div>
                <p className="text-slate-700 text-xl mb-10 flex-grow leading-relaxed font-medium">{scenario.description}</p>
                <div className="space-y-6 pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-400 uppercase">Thu nhập</span>
                    <span className="text-2xl font-black text-slate-900">{scenario.income}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-400 uppercase">Hài lòng</span>
                    <div className="flex gap-2">
                      {[...Array(10)].map((_, i) => (
                        <div key={`satisfaction-${idx}-${i}`} className={`w-3 h-6 rounded-full ${i < scenario.satisfaction ? 'bg-[var(--theme-primary)]' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-400 uppercase">Tâm lý</span>
                    <span className="text-base font-black px-5 py-2 rounded-full bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-tighter">{scenario.mentalState}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 3: Action Plan */}
        <div className="glass-card p-12 space-y-12 relative overflow-hidden">
          <h2 className="text-4xl font-black flex items-center gap-3 text-slate-900 uppercase tracking-tight">
            <Calendar className="w-10 h-10 text-[var(--theme-primary)]" /> PHẦN 3 – Lộ trình hành động chiến lược (90 ngày)
          </h2>
          
          <div className="grid grid-cols-1 gap-12 relative">
            {/* Roadmap Connector Line */}
            <div className="absolute left-[47px] top-24 bottom-24 w-1 bg-gradient-to-b from-[var(--theme-primary)]/40 via-[var(--theme-primary)]/10 to-transparent hidden md:block" />
            
            {result.actionPlan.map((step, idx) => (
              <motion.div 
                key={`action-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-12 rounded-[3rem] bg-white border border-slate-100 overflow-hidden group hover:shadow-xl transition-all flex flex-col md:flex-row gap-12 items-start z-10"
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-[2rem] bg-[var(--theme-glow)] text-[var(--theme-primary)] flex items-center justify-center text-5xl font-black shadow-inner">
                  {idx + 1}
                </div>
                <div className="flex-grow space-y-5">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-[var(--theme-primary)] transition-colors">{step.step}</h3>
                  <p className="text-slate-700 text-xl leading-relaxed font-medium">{step.description}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-black text-[var(--theme-primary)] uppercase tracking-widest">
                      <ShieldCheck className="w-6 h-6" /> Tiêu chí: {step.metric}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <footer className="text-center py-16 border-t border-slate-100">
          <p className="text-2xl font-black text-slate-400 italic tracking-tight">
            “Tương lai không phải điều ngẫu nhiên – nó là kết quả của những lựa chọn bạn bắt đầu từ hôm nay.”
          </p>
        </footer>
      </div>
    </div>
  );
}
