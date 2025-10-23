
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircleIcon, ChevronDownIcon, UploadIcon } from '../components/IconComponents';

const LearningPathComponent: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { getStudentById, getLearningPathById, toggleTopicComplete } = useAppContext();
    const student = studentId ? getStudentById(studentId) : undefined;
    const learningPath = student?.assignedLearningPathId ? getLearningPathById(student.assignedLearningPathId) : undefined;
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    if (!learningPath || !student) {
        return <div className="bg-base-200 p-6 rounded-xl shadow-lg text-center"><p>No learning path assigned.</p></div>;
    }

    const handleToggleTopic = (category: string, topicId: string) => {
        toggleTopicComplete(student.id, learningPath.id, category, topicId);
    };

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    return (
        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-secondary">Your Learning Path for {learningPath.company}</h2>
            <div className="space-y-3">
                {Object.entries(learningPath.topics).map(([category, topics]) => (
                    <div key={category} className="bg-base-300 rounded-lg">
                        <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center p-4 font-bold text-lg text-left">
                            <span>{category}</span>
                            <ChevronDownIcon className={`w-6 h-6 transition-transform ${openCategories[category] ? 'rotate-180' : ''}`} />
                        </button>
                        {openCategories[category] && (
                            <ul className="px-4 pb-4 border-t border-base-100">
                                {topics.map(topic => (
                                    <li key={topic.id} className="flex items-center py-2">
                                        <button onClick={() => handleToggleTopic(category, topic.id)} className="flex items-center w-full text-left">
                                            <div className={`w-6 h-6 mr-3 flex-shrink-0 rounded-full flex items-center justify-center ${topic.completed ? 'bg-green-500' : 'border-2 border-gray-400'}`}>
                                                {topic.completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <span className={`${topic.completed ? 'line-through text-gray-400' : ''}`}>{topic.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProgressSection: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { getStudentById, getLearningPathById } = useAppContext();
    const student = studentId ? getStudentById(studentId) : undefined;
    const learningPath = student?.assignedLearningPathId ? getLearningPathById(student.assignedLearningPathId) : undefined;

    const { progress, totalTopics, completedTopics } = useMemo(() => {
        if (!learningPath) return { progress: 0, totalTopics: 0, completedTopics: 0 };
        const allTopics = Object.values(learningPath.topics).flat();
        const completed = allTopics.filter(t => t.completed).length;
        const total = allTopics.length;
        const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
        return { progress: progressPercentage, totalTopics: total, completedTopics: completed };
    }, [learningPath]);

    const pieData = [
        { name: 'Completed', value: completedTopics },
        { name: 'Remaining', value: totalTopics - completedTopics },
    ];
    const COLORS = ['#10B981', '#4B5563'];

    return (
        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-secondary">Your Progress</h2>
            <div className="mb-4">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-blue-300">Overall Completion</span>
                    <span className="text-sm font-medium text-blue-300">{completedTopics} / {totalTopics} Topics</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-4">
                    <div className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value">
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none' }}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const PlaceholderSection: React.FC<{ title: string; buttonText: string }> = ({ title, buttonText }) => (
    <div className="bg-base-200 p-6 rounded-xl shadow-lg text-center">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-gray-400 mb-4">This feature is coming soon.</p>
        <button className="bg-base-300 text-white font-bold py-2 px-6 rounded-lg hover:bg-base-100 transition-colors">
            {buttonText}
        </button>
    </div>
);

const StudentDashboard: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { getStudentById } = useAppContext();
    const student = studentId ? getStudentById(studentId) : undefined;
    
    if (!student) return <div className="p-6">Student not found.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-xl shadow-lg mb-6">
                    <h1 className="text-3xl font-bold text-white">Welcome, {student.name}!</h1>
                    <p className="text-purple-200">Ready to tackle your learning path and get placement-ready?</p>
                </div>
                <LearningPathComponent />
            </div>
            <div className="space-y-6">
                <ProgressSection />
                <PlaceholderSection title="Mock Tests" buttonText="Take a Test" />
                <PlaceholderSection title="Resume Upload" buttonText="Upload Resume" />
            </div>
        </div>
    );
};

export default StudentDashboard;
