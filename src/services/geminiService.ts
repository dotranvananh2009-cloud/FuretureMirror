import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateFutureSimulation(input: UserInput): Promise<AnalysisResult> {
  const prompt = `
    Bạn là chuyên gia thiết kế sản phẩm AI và chuyên gia giáo dục hướng nghiệp.
    Hãy phân tích dữ liệu sau của một học sinh và mô phỏng 3 kịch bản tương lai trong 5 năm tới.

    Dữ liệu học sinh:
    - Tên: ${input.name}
    - Điểm trung bình: ${input.gpa}
    - Kỹ năng nổi bật: ${input.strengths}
    - Kỹ năng cần cải thiện: ${input.improvements}
    - Thích làm việc với: ${input.workPreference.join(", ")}
    - Trạng thái định hướng: ${input.careerStatus}
    - Ngành nghề mơ ước/phân vân: ${input.careerGoal} (${input.careerDetail})
    - Môi trường mong muốn: ${input.workEnvironment}
    - Mức độ kiên trì: ${input.persistence}/5
    - Thời gian tự học: ${input.selfStudyTime}

    Yêu cầu xuất kết quả theo cấu trúc JSON chính xác:
    1. PHẦN 1 - Hồ sơ năng lực hiện tại: 
       - academicAnalysis: Phân tích học lực (ngắn gọn).
       - disciplineAnalysis: Phân tích tính kỷ luật (ngắn gọn).
       - careerFit: Độ phù hợp ngành (ngắn gọn).
       - orientationIndex: Chỉ số định hướng (0-100).
       - institutionAnalysis: Phân tích chuyên sâu về các ngành nghề tiềm năng và danh sách các trường đại học/cao đẳng cụ thể phù hợp với điểm số và sở thích của user. Cần giải thích lý do tại sao các lựa chọn này lại tối ưu. ĐẶC BIỆT: Phải tham khảo thông tin thực tế trên Internet để cung cấp mức học phí tham khảo cho mỗi trường (phân loại: Rẻ, Trung bình, Đắt) và các thông tin cập nhật mới nhất.
    2. PHẦN 2 - Dự báo tương lai & Chỉ số quỹ đạo: 
       - 3 Kịch bản tương lai 5 năm (Giữ nguyên, Nỗ lực, Giảm động lực).
       - Future Trajectory Score (0-100).
    3. PHẦN 3 - Kế hoạch hành động chi tiết (90 ngày): 5-7 bước hành động chiến lược, tạo thành một lộ trình (roadmap) hoàn chỉnh. Mỗi bước phải cực kỳ chi tiết, bao gồm: mục tiêu cụ thể, phương pháp thực hiện từng ngày/tuần, tài liệu tham khảo gợi ý và tiêu chí đo lường thành công (KPI) rõ ràng.

    Văn phong: Truyền cảm hứng, súc tích nhưng đầy đủ thông tin, sử dụng ngôn ngữ hiện đại của GenZ.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          profile: {
            type: Type.OBJECT,
            properties: {
              academicAnalysis: { type: Type.STRING },
              disciplineAnalysis: { type: Type.STRING },
              careerFit: { type: Type.STRING },
              orientationIndex: { type: Type.NUMBER },
              institutionAnalysis: { type: Type.STRING },
            },
            required: ["academicAnalysis", "disciplineAnalysis", "careerFit", "orientationIndex", "institutionAnalysis"],
          },
          scenarios: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                probability: { type: Type.NUMBER },
                description: { type: Type.STRING },
                income: { type: Type.STRING },
                satisfaction: { type: Type.NUMBER },
                mentalState: { type: Type.STRING },
              },
              required: ["title", "probability", "description", "income", "satisfaction", "mentalState"],
            },
          },
          trajectoryScore: { type: Type.NUMBER },
          actionPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                description: { type: Type.STRING },
                metric: { type: Type.STRING },
              },
              required: ["step", "description", "metric"],
            },
          },
        },
        required: ["profile", "scenarios", "trajectoryScore", "actionPlan"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
