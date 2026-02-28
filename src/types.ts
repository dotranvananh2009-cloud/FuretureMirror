
export interface UserInput {
  name: string;
  gpa: string;
  strengths: string;
  improvements: string;
  workPreference: string[];
  careerStatus: 'Có' | 'Đang phân vân' | 'Không' | '';
  careerGoal: string;
  careerDetail: string;
  workEnvironment: string;
  persistence: number;
  selfStudyTime: string;
}

export interface Scenario {
  title: string;
  probability: number;
  description: string;
  income: string;
  satisfaction: number;
  mentalState: string;
}

export interface ActionStep {
  step: string;
  description: string;
  metric: string;
}

export interface AnalysisResult {
  profile: {
    academicAnalysis: string;
    disciplineAnalysis: string;
    careerFit: string;
    orientationIndex: number;
    institutionAnalysis: string;
  };
  scenarios: Scenario[];
  trajectoryScore: number;
  actionPlan: ActionStep[];
}
