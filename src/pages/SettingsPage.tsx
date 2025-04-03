import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  Database, 
  Shield, 
  RefreshCw,
  Save,
  Check
} from 'lucide-react';
import { useThemeStore } from '../store/theme';

export function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [dataRetention, setDataRetention] = useState('30');
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${textColor}`}>Settings</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {showSaved ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bgColor} rounded-lg shadow-lg p-6`}
          >
            <h2 className={`text-xl font-semibold ${textColor} mb-4 flex items-center`}>
              <Globe className="w-5 h-5 mr-2" />
              Appearance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className={`font-medium ${textColor}`}>Dark Mode</label>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Toggle dark mode on or off
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className={`font-medium ${textColor}`}>Language</label>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Choose your preferred language
                  </p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`rounded-lg border ${borderColor} ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  } px-3 py-2`}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${bgColor} rounded-lg shadow-lg p-6`}
          >
            <h2 className={`text-xl font-semibold ${textColor} mb-4 flex items-center`}>
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className={`font-medium ${textColor}`}>Research Updates</label>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Get notified about new research findings
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    notifications ? 'bg-indigo-600' : 'bg-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${bgColor} rounded-lg shadow-lg p-6`}
          >
            <h2 className={`text-xl font-semibold ${textColor} mb-4 flex items-center`}>
              <Database className="w-5 h-5 mr-2" />
              Data Management
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`font-medium ${textColor}`}>Data Retention</label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                  Choose how long to keep your research history
                </p>
                <select
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className={`w-full rounded-lg border ${borderColor} ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  } px-3 py-2`}
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              <div>
                <button
                  className={`flex items-center px-4 py-2 ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } rounded-lg transition-colors`}
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Sync Data
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${bgColor} rounded-lg shadow-lg p-6`}
          >
            <h2 className={`text-xl font-semibold ${textColor} mb-4 flex items-center`}>
              <Shield className="w-5 h-5 mr-2" />
              Privacy & Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className={`font-medium ${textColor}`}>Two-Factor Authentication</label>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Add an extra layer of security
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Enable
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}