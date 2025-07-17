import { useState } from 'react';
import { Eye, UserCheck } from 'lucide-react';

export function ExerciseInstructions() {
  const [activeTab, setActiveTab] = useState<'eye' | 'posture'>('eye');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('eye')}
            className={`px-6 py-4 text-sm font-medium flex items-center space-x-2 ${
              activeTab === 'eye'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Eye Exercises</span>
          </button>
          <button
            onClick={() => setActiveTab('posture')}
            className={`px-6 py-4 text-sm font-medium flex items-center space-x-2 ${
              activeTab === 'posture'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Posture & Neck</span>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'eye' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                The 20-20-20 Rule
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">20</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Every 20 Minutes</h4>
                  <p className="text-sm text-gray-600">Take a break from your screen</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Look 20 Feet Away</h4>
                  <p className="text-sm text-gray-600">Focus on a distant object</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">20</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">For 20 Seconds</h4>
                  <p className="text-sm text-gray-600">Give your eyes a rest</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Additional Eye Exercises</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong>Blink exercises:</strong> Blink slowly and deliberately 10-15 times
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong>Eye rolls:</strong> Slowly roll your eyes clockwise and counterclockwise
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong>Focus shifting:</strong> Alternate between near and far objects
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'posture' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Posture & Neck Exercises
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">↕</span>
                      </div>
                      <h4 className="font-medium text-gray-900">Neck Stretches</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Gently tilt head left and right</li>
                      <li>• Slowly nod up and down</li>
                      <li>• Roll shoulders backwards 5 times</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-medium text-gray-900">Posture Reset</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Sit up straight, shoulders back</li>
                      <li>• Feet flat on the floor</li>
                      <li>• Monitor at eye level</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✋</span>
                      </div>
                      <h4 className="font-medium text-gray-900">Wrist & Hand</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Wrist circles (both directions)</li>
                      <li>• Finger stretches</li>
                      <li>• Make fists and release</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🫁</span>
                      </div>
                      <h4 className="font-medium text-gray-900">Deep Breathing</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Take 3-5 deep breaths</li>
                      <li>• Inhale for 4 counts</li>
                      <li>• Exhale for 6 counts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
