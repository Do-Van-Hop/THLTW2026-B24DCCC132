import { useState, useEffect } from 'react';

export interface Course {
  id: string;
  name: string;
  instructor: string;
  studentCount: number;
  description: string;
  status: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
}

const INSTRUCTORS = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'];
const initialCourses: Course[] = [
  { id: '1', name: 'Lập trình React cơ bản', instructor: 'Nguyễn Văn A', studentCount: 50, description: '<p>Khóa học React từ A-Z</p>', status: 'Đang mở' },
  { id: '2', name: 'JavaScript nâng cao', instructor: 'Trần Thị B', studentCount: 30, description: '<p>JS chuyên sâu</p>', status: 'Đang mở' },
  { id: '3', name: 'Python cho người mới', instructor: 'Lê Văn C', studentCount: 0, description: '<p>Python cơ bản</p>', status: 'Tạm dừng' },
  { id: '4', name: 'UI/UX Design', instructor: 'Phạm Thị D', studentCount: 0, description: '<p>Thiết kế giao diện</p>', status: 'Đã kết thúc' },
];

export default function useCourseData() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('courses');
    if (stored) {
      setCourses(JSON.parse(stored));
    } else {
      setCourses(initialCourses);
      localStorage.setItem('courses', JSON.stringify(initialCourses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = (course: Omit<Course, 'id'>) => {
    const maxId = courses.reduce((max, c) => {
      const numId = parseInt(c.id, 10);
      return isNaN(numId) ? max : Math.max(max, numId);
    }, 0);
    const newId = (maxId + 1).toString();
    setCourses([...courses, { ...course, id: newId }]);
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCourse = (id: string) => {
    const newCourses = courses.filter(c => c.id !== id);
    const deletedIdNum = parseInt(id, 10);
    const reindexedCourses = newCourses.map(c => {
      const currentIdNum = parseInt(c.id, 10);
      if (currentIdNum > deletedIdNum) {
        return { ...c, id: (currentIdNum - 1).toString() };
      }
      return c;
    });
    setCourses(reindexedCourses);
  };

  const isNameExists = (name: string, excludeId?: string) => {
    return courses.some(c => c.name === name && c.id !== excludeId);
  };

  return {
    courses,
    instructors: INSTRUCTORS,
    addCourse,
    updateCourse,
    deleteCourse,
    isNameExists,
  };
}