import { AI_RESPONSES_KNOWLEDGE } from '../data/mockChat';

export const aiService = {
  async askCoach(userMessage) {
    await new Promise((res) => setTimeout(res, 1200));

    const query = userMessage.toLowerCase();
    let reply = "";

    if (query.includes("dinner")) {
      reply = AI_RESPONSES_KNOWLEDGE.dinner;
    } else if (query.includes("protein")) {
      reply = AI_RESPONSES_KNOWLEDGE.protein;
    } else if (query.includes("healthy") || query.includes("diet")) {
      reply = AI_RESPONSES_KNOWLEDGE.healthy;
    } else if (query.includes("breakfast")) {
      reply = AI_RESPONSES_KNOWLEDGE.breakfast;
    } else if (query.includes("score")) {
      reply = AI_RESPONSES_KNOWLEDGE.score;
    } else {
      reply = `Thanks for asking! Based on your target goals and active meal logs, maintaining a balanced ratio of 30% Protein, 45% Carbs, and 25% Fat will keep your energy peak and optimize recovery. Would you like me to suggest a recipe or adjust your macro goals?`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: "ai",
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};
