import { useState } from 'react';
import { Brain, Search, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useResearchStore } from '../store/research';
import { useBookmarkStore, type Bookmark as BookmarkType } from '../store/bookmarks';
import { useThemeStore } from '../store/theme';

export function ResearchDashboard() {
  const { topic, setTopic, isLoading, setLoading } = useResearchStore();
  const { isDarkMode } = useThemeStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const agents = [
    { id: 'generationAgent', name: 'Generation Agent', icon: '🧠' },
    { id: 'reflectionAgent', name: 'Reflection Agent', icon: '🔍' },
    { id: 'rankingAgent', name: 'Ranking Agent', icon: '📊' },
    { id: 'evolutionAgent', name: 'Evolution Agent', icon: '🔄' },
    { id: 'proximityAgent', name: 'Proximity Agent', icon: '🔗' },
    { id: 'metaReviewAgent', name: 'Meta-Review Agent', icon: '📝' }
  ];

  const handleSearch = async () => {
    if (!topic.trim()) {
      alert('Please enter a research topic');
      return;
    }

    setLoading(true);
    setResults(null);
    setProgress(0);

    try {
      for (const agent of agents) {
        setActiveAgent(agent.id);
        setProgress((prev) => prev + 20);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const response = await fetch('http://localhost:5000/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error('Research failed');
      
      const data = await response.json();
      setResults(data);
      setProgress(100);
    } catch (error) {
      console.error('Research failed:', error);
    } finally {
      setLoading(false);
      setActiveAgent(null);
    }
  };

  const toggleBookmark = () => {
    if (!results) return;

    if (isBookmarked(topic)) {
      removeBookmark(topic);
    } else {
      const bookmark: BookmarkType = {
        id: Date.now().toString(),
        topic,
        date: new Date().toISOString(),
        score: results.score,
        topPaper: results.top_paper,
      };
      addBookmark(bookmark);
    }
  };

  return (
    <div className={`min-h-screen pt-16 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Brain className={`w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h2 className="text-2xl font-bold">Research Assistant</h2>
              </div>
              {results && (
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  {isBookmarked(topic) ? (
                    <BookmarkCheck className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <Bookmark className="w-6 h-6 text-gray-400 hover:text-indigo-600" />
                  )}
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Machine Unlearning, Quantum Computing"
                className={`w-full px-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              <Search className="absolute right-3 top-3 text-gray-400" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={isLoading}
              className={`w-full mt-4 ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Start Research
                </>
              )}
            </motion.button>

            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{isLoading ? 'Processing...' : 'Ready'}</span>
                <span>{progress}%</span>
              </div>
              <div className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full bg-indigo-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Agent Activity</h3>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`flex items-center p-3 rounded-lg ${activeAgent === agent.id ? (isDarkMode ? 'bg-gray-700 text-indigo-400' : 'bg-indigo-50 text-indigo-600') : (isDarkMode ? 'bg-gray-700' : 'bg-gray-50')}`}
                  >
                    <span className="text-2xl mr-3">{agent.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{agent.name}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activeAgent === agent.id ? 'Processing...' : 'Ready'}
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${activeAgent === agent.id ? 'bg-indigo-600 animate-pulse' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className="text-2xl font-bold mb-6">Research Results</h2>
            {!results && !isLoading && (
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Enter a research topic to begin the discovery process.
              </p>
            )}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            )}
            {results && (
              <div className="space-y-6">
                <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'} rounded-lg`}>
                  <div className="text-lg font-semibold mb-2">Research Quality Score</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {results.score}/10
                  </div>
                </div>

                {results.top_paper && (
                  <div className={`border-l-4 border-indigo-600 pl-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} rounded-r-lg`}>
                    <h3 className="text-xl font-semibold mb-2">Top Result</h3>
                    <div className="result-card">
                      <h4 className="result-title">{results.top_paper.title}</h4>
                      <div className="result-meta">
                        {results.top_paper.authors && (
                          <span>{results.top_paper.authors.join(', ')}</span>
                        )}
                        {results.top_paper.published && (
                          <span>{results.top_paper.published}</span>
                        )}
                        {results.top_paper.source && (
                          <span className={`badge badge-${results.top_paper.source.toLowerCase()}`}>{results.top_paper.source}</span>
                        )}
                      </div>
                      {results.top_paper.abstract && (
                        <div className="result-abstract">{results.top_paper.abstract}</div>
                      )}
                      {results.top_paper.link && (
                        <a href={results.top_paper.link} target="_blank" className="result-link">View paper →</a>
                      )}
                      {results.top_paper.pdf_link && (
                        <a href={results.top_paper.pdf_link} target="_blank" className="result-link">Download PDF →</a>
                      )}
                    </div>
                  </div>
                )}

                {results.related && (
                  <div className="related-research">
                    <h3>Related Research Insights</h3>
                    <ul className="related-list">
                      {Array.isArray(results.related) ? results.related.map((item, index) => <li key={index}>{item}</li>) : <p>{results.related}</p>}
                    </ul>
                  </div>
                )}

                <h3>Research Process</h3>
                {results.insights && (
                  <div className="research-steps">
                    {results.insights.map((insight, index) => (
                      <div key={index} className="research-step">
                        <div className="step-icon">🔍</div>
                        <div className="step-content">
                          <p className="step-detail">{insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.meta_feedback && (
                  <div className="process-feedback">
                    <h3>Process Feedback</h3>
                    {results.meta_feedback.map((fb, index) => (
                      <div key={index} className="research-step">
                        <div className="step-icon">📝</div>
                        <div className="step-content">
                          <p className="step-detail">{fb}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.related_papers && (
                  <div className="related-papers">
                    <h3>Related Papers</h3>
                    {results.related_papers.map((paper) => (
                      <div className="result-card">
                        <h4 className="result-title">{paper.title}</h4>
                        <div className="result-meta">
                          <span>Score: {paper.score}/10</span>
                          <span className={`badge badge-${paper.source.toLowerCase()}`}>{paper.source}</span>
                        </div>
                        <a href={paper.link} target="_blank" className="result-link">View paper →</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}