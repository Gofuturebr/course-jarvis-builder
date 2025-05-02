
import { CourseData, initialCourseData } from "@/types";

/**
 * Saves course data to local storage
 */
export const saveCourseData = (data: CourseData): void => {
  try {
    localStorage.setItem('jarvisEduCourseData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving course data:', error);
  }
};

/**
 * Fetches course data from local storage or returns initial data
 */
export const fetchCourseData = async (): Promise<CourseData> => {
  try {
    const storedData = localStorage.getItem('jarvisEduCourseData');
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error fetching course data:', error);
  }
  
  // Return initial data if no saved data or error occurs
  return { ...initialCourseData };
};
