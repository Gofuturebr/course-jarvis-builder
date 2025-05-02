
import { AiUpdateResponse, ConversationContext, CourseData } from "@/types";
import { saveCourseData, fetchCourseData } from "@/services/course-storage";
import { updateCourseStep } from "@/services/course-analysis";

// Re-export storage functions
export { saveCourseData, fetchCourseData };

// Re-export analysis function
export { updateCourseStep };

// This function is deprecated with .env approach
export const setApiKey = (key: string): void => {
  console.warn('setApiKey is deprecated when using .env files');
};
