import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseVideo {
  id: string;
  title: string;
  duration: number; // in seconds
  steps: string[];
  description: string;
}

interface ExerciseVideoPlayerProps {
  exercise: ExerciseVideo;
  onComplete?: () => void;
}

export function ExerciseVideoPlayer({ exercise, onComplete }: ExerciseVideoPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise.duration);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (intervalId) return;
    
    setIsPlaying(true);
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          clearInterval(id);
          setIntervalId(null);
          if (currentStep < exercise.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setTimeLeft(exercise.duration);
          } else {
            onComplete?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPlaying(false);
  };

  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPlaying(false);
    setCurrentStep(0);
    setTimeLeft(exercise.duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{exercise.title}</h3>
      
      {/* Visual Exercise Demonstration */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 mb-6 text-center">
        <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="text-4xl">
            {exercise.id === 'eye-focus' && '👁️'}
            {exercise.id === 'neck-stretch' && '🧘'}
            {exercise.id === 'shoulder-roll' && '💪'}
            {exercise.id === 'wrist-flex' && '✋'}
            {exercise.id === 'deep-breathing' && '🫁'}
          </div>
        </div>
        
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {formatTime(timeLeft)}
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Step {currentStep + 1} of {exercise.steps.length}
        </div>
        
        <div className="text-lg font-medium text-gray-800 mb-4">
          {exercise.steps[currentStep]}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ 
              width: `${((exercise.duration - timeLeft) / exercise.duration) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3 mb-4">
        <Button
          onClick={isPlaying ? pauseTimer : startTimer}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start</span>
            </>
          )}
        </Button>
        <Button
          onClick={resetTimer}
          variant="outline"
          className="px-4 py-2"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-sm text-gray-600 text-center">
        {exercise.description}
      </p>
    </div>
  );
}

// Exercise definitions
export const exerciseLibrary: ExerciseVideo[] = [
  {
    id: 'eye-focus',
    title: '20-20-20 Eye Exercise',
    duration: 20,
    steps: [
      'Look at something 20 feet away',
      'Focus on the distant object',
      'Blink naturally while focusing',
      'Take a deep breath and relax'
    ],
    description: 'Look at something 20 feet away for 20 seconds to reduce eye strain.'
  },
  {
    id: 'neck-stretch',
    title: 'Neck Stretch Routine',
    duration: 8,
    steps: [
      'Slowly tilt your head to the right',
      'Hold the stretch gently',
      'Return to center',
      'Slowly tilt your head to the left',
      'Hold the stretch gently',
      'Return to center',
      'Gently nod up and down',
      'Relax and breathe'
    ],
    description: 'Gentle neck stretches to relieve tension and improve posture.'
  },
  {
    id: 'shoulder-roll',
    title: 'Shoulder Roll Exercise',
    duration: 10,
    steps: [
      'Roll shoulders forward slowly',
      'Continue the circular motion',
      'Roll shoulders backward slowly',
      'Feel the stretch in your shoulders',
      'Repeat the forward motion',
      'Continue with smooth movements',
      'Roll backward again',
      'Finish with shoulders relaxed'
    ],
    description: 'Shoulder rolls to release tension and improve circulation.'
  },
  {
    id: 'wrist-flex',
    title: 'Wrist and Hand Stretches',
    duration: 12,
    steps: [
      'Extend your arm forward',
      'Flex your wrist up gently',
      'Hold the stretch',
      'Flex your wrist down gently',
      'Hold the stretch',
      'Make gentle fist movements',
      'Rotate your wrist clockwise',
      'Rotate your wrist counterclockwise',
      'Wiggle your fingers',
      'Shake out your hands',
      'Repeat with other hand',
      'Relax both hands'
    ],
    description: 'Wrist and hand exercises to prevent repetitive strain injuries.'
  },
  {
    id: 'deep-breathing',
    title: 'Deep Breathing Exercise',
    duration: 15,
    steps: [
      'Sit up straight and relax',
      'Inhale slowly through your nose (4 counts)',
      'Hold your breath gently (2 counts)',
      'Exhale slowly through your mouth (6 counts)',
      'Feel your body relax',
      'Inhale again slowly (4 counts)',
      'Hold gently (2 counts)',
      'Exhale completely (6 counts)',
      'Continue this rhythm',
      'Focus on your breathing',
      'Feel the stress leaving your body',
      'Take one final deep breath',
      'Return to normal breathing',
      'Notice how relaxed you feel'
    ],
    description: 'Deep breathing to reduce stress and improve focus.'
  }
];