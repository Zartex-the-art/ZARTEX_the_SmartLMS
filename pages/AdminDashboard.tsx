
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { generateLearningPathFromJD } from '../services/geminiService';
import { LearningPath, LearningPathCategory, Student } from '../types';
import { UploadIcon, ChevronDownIcon, CheckCircleIcon } from '../components/IconComponents';

const UploadJD: React.FC<{ onPathGenerated: (path: LearningPath) => void }> = ({ onPathGenerated }) => {
  const [jdText, setJdText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jdText.trim() || !companyName.trim()) {
      alert('Please enter a company name and job description.');
      return;
    }
    setIsLoading(true);
    try {
      const pathCategories: LearningPathCategory = await generateLearningPathFromJD(jdText);
      const newPath: LearningPath = {
        id: `LP${Date.now()}`,
        company: companyName,
        jobDescription: jdText,
        topics: Object.entries(pathCategories).reduce((acc, [category, topics]) => {
          acc[category] = topics.map((topicName, index) => ({
            id: `t${Date.now()}${index}`,
            name: topicName,
            completed: false,
          }));
          return acc;
        }, {} as LearningPath['topics']),
      };
      onPathGenerated(newPath);
    } catch (error) {
      console.error('Failed to generate learning path', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-base-200 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-secondary">Generate New Learning Path</h2>
      <div className="space-y-4">
        <input
            type="text"
            placeholder="Enter Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3 bg-base-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste company Job Description (JD) here..."
          className="w-full h-40 p-3 bg-base-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <UploadIcon className="w-6 h-6" />
              Generate Learning Path
            </>
          )}
        </button>
      </div>
    </div>
  );
};


const LearningPathDisplay: React.FC<{ path: LearningPath | null }> = ({ path }) => {
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    if (!path) {
        return (
            <div className="bg-base-200 p-6 rounded-xl shadow-lg mt-6 text-center">
                <p className="text-gray-400">Generate a learning path to see it here.</p>
            </div>
        );
    }
    
    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({...prev, [category]: !prev[category]}));
    };

    return (
        <div className="bg-base-200 p-6 rounded-xl shadow-lg mt-6">
            <h3 className="text-xl font-bold mb-4">Generated Path for <span className="text-secondary">{path.company}</span></h3>
            <div className="space-y-2">
                {Object.entries(path.topics).map(([category, topics]) => (
                    <div key={category} className="bg-base-300 rounded-lg">
                        <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center p-3 font-semibold text-left">
                            <span>{category} ({topics.length} topics)</span>
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${openCategories[category] ? 'rotate-180' : ''}`} />
                        </button>
                        {openCategories[category] && (
                             <ul className="p-4 border-t border-base-100">
                                {topics.map(topic => (
                                    <li key={topic.id} className="py-1 text-gray-300">{topic.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const AssignToStudents: React.FC<{ path: LearningPath | null }> = ({ path }) => {
    const { students, assignPathToStudents } = useAppContext();
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [isAssigned, setIsAssigned] = useState(false);

    if (!path) return null;

    const handleToggleStudent = (studentId: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleAssign = () => {
        if (selectedStudentIds.length === 0) {
            alert("Please select at least one student.");
            return;
        }
        assignPathToStudents(path.id, selectedStudentIds);
        setIsAssigned(true);
        setTimeout(() => setIsAssigned(false), 3000); // Reset after 3s
    };

    return (
        <div className="bg-base-200 p-6 rounded-xl shadow-lg mt-6">
            <h3 className="text-xl font-bold mb-4">Assign Path to Students</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {students.map(student => (
                    <div key={student.id} className="flex items-center justify-between bg-base-300 p-2 rounded-lg">
                        <span>{student.name}</span>
                        <button onClick={() => handleToggleStudent(student.id)} className={`w-6 h-6 rounded-full border-2 ${selectedStudentIds.includes(student.id) ? 'bg-primary border-primary' : 'border-gray-500'}`}></button>
                    </div>
                ))}
            </div>
            <button onClick={handleAssign} className="w-full mt-4 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors">
                Assign to {selectedStudentIds.length} Student(s)
            </button>
            {isAssigned && <div className="mt-2 text-green-400 flex items-center justify-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Path assigned successfully!</div>}
        </div>
    );
};

const Analytics: React.FC = () => {
    const { students, learningPaths, getLearningPathById } = useAppContext();
    
    const data = students.map(student => {
        const path = student.assignedLearningPathId ? getLearningPathById(student.assignedLearningPathId) : null;
        if (!path) return { name: student.name, progress: 0 };
        
        const allTopics = Object.values(path.topics).flat();
        const completedTopics = allTopics.filter(t => t.completed).length;
        const progress = allTopics.length > 0 ? (completedTopics / allTopics.length) * 100 : 0;
        
        return { name: student.name, progress: parseFloat(progress.toFixed(1)) };
    });

    return (
        <div className="bg-base-200 p-6 rounded-xl shadow-lg mt-6 h-96">
            <h2 className="text-2xl font-bold mb-4 text-secondary">Student Progress</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis type="number" domain={[0, 100]} stroke="#F9FAFB" />
                    <YAxis dataKey="name" type="category" stroke="#F9FAFB" width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none' }} labelStyle={{ color: '#F9FAFB' }} />
                    <Legend />
                    <Bar dataKey="progress" fill="#8884d8" name="Completion (%)" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


const AdminDashboard: React.FC = () => {
    const { addLearningPath } = useAppContext();
    const [generatedPath, setGeneratedPath] = useState<LearningPath | null>(null);

    const handlePathGenerated = (path: LearningPath) => {
        addLearningPath(path);
        setGeneratedPath(path);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
                <UploadJD onPathGenerated={handlePathGenerated} />
                <LearningPathDisplay path={generatedPath} />
                <AssignToStudents path={generatedPath} />
            </div>
            <div>
                <Analytics />
            </div>
        </div>
    );
};

export default AdminDashboard;
