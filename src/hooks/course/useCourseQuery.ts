
import { useQuery } from '@tanstack/react-query';
import { queryKeys, CourseData } from '@/types';
import { fetchCourseData } from '@/lib/api';

export const useCourseQuery = () => {
  return useQuery({
    queryKey: queryKeys.courseData,
    queryFn: fetchCourseData,
  });
};
