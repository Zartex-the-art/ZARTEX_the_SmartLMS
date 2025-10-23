
import React from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_STUDENTS } from '../constants';

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="bg-base-200 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
    <h3 className="text-xl font-bold text-secondary mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  const firstStudentId = DUMMY_STUDENTS[0]?.id || 'S1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-gray-900 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            SmartLMS
          </span>
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-300">
          AI-powered Placement Readiness Platform
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/admin"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Login as Admin
          </Link>
          <Link
            to={`/student/${firstStudentId}`}
            className="w-full sm:w-auto bg-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
          >
            Login as Student
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          <FeatureCard
            title="Upload Job Descriptions"
            description="Admins can effortlessly upload or paste job descriptions to kickstart the learning path generation."
          />
          <FeatureCard
            title="Generate Learning Paths"
            description="Our AI analyzes JDs to extract key skills and automatically creates a structured, personalized learning path."
          />
          <FeatureCard
            title="Track Student Progress"
            description="Monitor learning progress with intuitive dashboards and analytics to ensure placement readiness."
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
