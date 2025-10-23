
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Student, LearningPath, Topic } from '../types';
import { DUMMY_STUDENTS, DUMMY_LEARNING_PATH } from '../constants';

interface AppContextType {
  students: Student[];
  learningPaths: LearningPath[];
  addLearningPath: (path: LearningPath) => void;
  assignPathToStudents: (pathId: string, studentIds: string[]) => void;
  toggleTopicComplete: (studentId: string, pathId: string, category: string, topicId: string) => void;
  getStudentById: (studentId: string) => Student | undefined;
  getLearningPathById: (pathId: string) => LearningPath | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(DUMMY_STUDENTS);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([DUMMY_LEARNING_PATH]);

  const addLearningPath = useCallback((path: LearningPath) => {
    setLearningPaths(prev => [...prev, path]);
  }, []);

  const assignPathToStudents = useCallback((pathId: string, studentIds: string[]) => {
    setStudents(prev => 
      prev.map(student => 
        studentIds.includes(student.id) ? { ...student, assignedLearningPathId: pathId } : student
      )
    );
  }, []);

  const toggleTopicComplete = useCallback((studentId: string, pathId: string, category: string, topicId: string) => {
      // In a real app, progress would be stored per-student.
      // For this demo, we are modifying the shared learning path to simulate progress.
      // This means all students assigned to the same path will see the same progress.
      setLearningPaths(prev => prev.map(path => {
          if (path.id === pathId) {
              const newTopics = { ...path.topics };
              if (newTopics[category]) {
                  newTopics[category] = newTopics[category].map(topic => 
                      topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
                  );
              }
              return { ...path, topics: newTopics };
          }
          return path;
      }));
  }, []);

  const getStudentById = useCallback((studentId: string) => {
    return students.find(s => s.id === studentId);
  }, [students]);

  const getLearningPathById = useCallback((pathId: string) => {
    return learningPaths.find(lp => lp.id === pathId);
  }, [learningPaths]);

  const value = {
    students,
    learningPaths,
    addLearningPath,
    assignPathToStudents,
    toggleTopicComplete,
    getStudentById,
    getLearningPathById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
