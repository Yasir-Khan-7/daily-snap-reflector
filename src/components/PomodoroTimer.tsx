import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Clock, Coffee, List } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type TimerMode = 'work' | 'break';

const PomodoroTimer: React.FC = () => {
    // Timer settings
    const [workDuration, setWorkDuration] = useState(25); // minutes
    const [breakDuration, setBreakDuration] = useState(5); // minutes

    // Timer state
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(workDuration * 60); // in seconds
    const [sessions, setSessions] = useState(0);

    // References
    const timerRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-988.mp3');
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Update timeLeft when durations change and timer is not running
    useEffect(() => {
        if (!isRunning) {
            setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
        }
    }, [workDuration, breakDuration, mode, isRunning]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Start/resume timer
    const startTimer = () => {
        if (timerRef.current) return; // Don't start if already running

        setIsRunning(true);
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Timer completed
                    if (audioRef.current) {
                        audioRef.current.play().catch(e => console.error('Error playing sound:', e));
                    }

                    clearInterval(timerRef.current!);
                    timerRef.current = null;

                    // Switch modes
                    const nextMode = mode === 'work' ? 'break' : 'work';
                    setMode(nextMode);

                    // Increment session count if work mode just finished
                    if (mode === 'work') {
                        setSessions(prev => prev + 1);
                        toast({
                            title: "Work session completed!",
                            description: "Time for a break.",
                        });
                    } else {
                        toast({
                            title: "Break time over!",
                            description: "Ready to get back to work?",
                        });
                    }

                    setIsRunning(false);
                    return nextMode === 'work' ? workDuration * 60 : breakDuration * 60;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Pause timer
    const pauseTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setIsRunning(false);
        }
    };

    // Reset timer
    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsRunning(false);
        setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
    };

    // Switch mode manually
    const switchMode = (newMode: TimerMode) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(newMode === 'work' ? workDuration * 60 : breakDuration * 60);
    };

    // Calculate progress percentage
    const calculateProgress = (): number => {
        const totalSeconds = mode === 'work' ? workDuration * 60 : breakDuration * 60;
        return 100 - (timeLeft / totalSeconds * 100);
    };

    return (
        <Card className={mode === 'work' ? 'bg-gradient-to-br from-blue-50 to-white border-blue-100' : 'bg-gradient-to-br from-green-50 to-white border-green-100'}>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {mode === 'work' ? (
                            <>
                                <Clock className="h-5 w-5 text-blue-500" />
                                <span>Work Time</span>
                            </>
                        ) : (
                            <>
                                <Coffee className="h-5 w-5 text-green-500" />
                                <span>Break Time</span>
                            </>
                        )}
                    </div>
                    <div className="text-sm font-normal flex items-center gap-1">
                        <List className="h-4 w-4" />
                        <span>Sessions: {sessions}</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                    <span className="text-5xl font-mono font-semibold mb-3 text-gray-800">
                        {formatTime(timeLeft)}
                    </span>
                    <Progress value={calculateProgress()} className="h-2 w-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Work</span>
                            <span className="text-sm font-medium">{workDuration} min</span>
                        </div>
                        <Slider
                            value={[workDuration]}
                            min={5}
                            max={60}
                            step={5}
                            disabled={isRunning}
                            onValueChange={(value) => setWorkDuration(value[0])}
                            className={isRunning ? 'opacity-50' : ''}
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Break</span>
                            <span className="text-sm font-medium">{breakDuration} min</span>
                        </div>
                        <Slider
                            value={[breakDuration]}
                            min={1}
                            max={30}
                            step={1}
                            disabled={isRunning}
                            onValueChange={(value) => setBreakDuration(value[0])}
                            className={isRunning ? 'opacity-50' : ''}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-0 justify-between">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => switchMode('work')}
                        disabled={isRunning || mode === 'work'}
                        className="w-24"
                    >
                        <Clock className="h-4 w-4 mr-2" />
                        Work
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => switchMode('break')}
                        disabled={isRunning || mode === 'break'}
                        className="w-24"
                    >
                        <Coffee className="h-4 w-4 mr-2" />
                        Break
                    </Button>
                </div>
                <div className="flex gap-2">
                    {isRunning ? (
                        <Button onClick={pauseTimer} variant="outline" size="icon" className="h-9 w-9">
                            <Pause className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={startTimer} variant="default" size="icon" className="h-9 w-9">
                            <Play className="h-4 w-4" />
                        </Button>
                    )}
                    <Button onClick={resetTimer} variant="outline" size="icon" className="h-9 w-9">
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default PomodoroTimer; 