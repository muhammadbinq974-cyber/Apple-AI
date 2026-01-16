import React, { useState, useEffect } from 'react';
import { generateReportData } from '../services/geminiService';
import { StrategicReport } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, RefreshCcw, Cpu, BarChart3 } from './Icons';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<StrategicReport | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('Voice Assistant');

  const topics = ['Voice Assistant', 'Maps Navigation', 'Search Engine', 'Cloud Storage', 'AI Photography'];

  const fetchReport = async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);
    try {
      const data = await generateReportData(topic);
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(selectedTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Strategic Analysis</h2>
          <p className="text-[#86868B] mt-1">Comparative performance metrics: Apple vs. Google</p>
        </div>
        
        <div className="flex space-x-2 bg-[#E8E8ED] p-1 rounded-full overflow-x-auto max-w-full">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => fetchReport(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                selectedTopic === t 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-[#86868B] hover:text-black'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
          <RefreshCcw className="w-8 h-8 animate-spin text-[#0071E3]" />
          <p className="text-[#86868B]">Analyzing global intelligence data...</p>
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-[#0071E3] mb-4">
                <Cpu className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Analysis Core</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">{report.title}</h3>
              <p className="text-[#1D1D1F] leading-relaxed mb-6">{report.summary}</p>
              
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-6">
                <h4 className="text-red-600 font-medium text-sm mb-2 uppercase tracking-wide">Competitive Gap</h4>
                <p className="text-gray-800 font-medium">{report.googleAdvantage}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
               <h4 className="text-[#0071E3] font-medium text-sm mb-2 uppercase tracking-wide">Recommended Action</h4>
               <p className="text-gray-800">{report.recommendation}</p>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <div className="flex items-center space-x-2 text-[#86868B] mb-6">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Performance Index</span>
              </div>
              
              <div className="h-[300px] w-full">
                {report.metrics && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={report.metrics}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5E5" />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#86868B'}} />
                      <Tooltip 
                        cursor={{fill: '#F5F5F7'}}
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                      />
                      <Bar dataKey="apple" name="Apple Current" fill="#86868B" barSize={20} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="google" name="Google Benchmark" fill="#0071E3" barSize={20} radius={[0, 4, 4, 0]} >
                        {
                            report.metrics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.google > entry.apple ? "#0071E3" : "#34C759"} />
                            ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <p className="text-center text-xs text-[#86868B] mt-4">
                *Data simulated by Gemini 3 Analysis based on technical specifications.
              </p>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 text-[#86868B]">Select a topic to begin analysis.</div>
      )}
    </div>
  );
};

export default Dashboard;