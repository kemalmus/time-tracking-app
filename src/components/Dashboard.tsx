import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Play, Pause, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const Dashboard = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);

  useEffect(() => {
    const loadUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.isWorking) {
            setIsWorking(true);
            setStartTime(new Date(userData.startTime.toDate()));
          }
          setTodayTotal(userData.todayTotal || 0);
        }
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    let interval: number;
    if (isWorking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
        
        // Auto-stop after 8 hours
        if (elapsed >= 8 * 60 * 60) {
          handleStopWork();
          toast.info("You've been working for 8 hours. The timer has been automatically stopped.");
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking, startTime]);

  const handleStartWork = async () => {
    const now = new Date();
    setIsWorking(true);
    setStartTime(now);
    setElapsedTime(0);

    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        isWorking: true,
        startTime: now,
        todayTotal: todayTotal
      }, { merge: true });
    }
  };

  const handleStopWork = async () => {
    if (startTime) {
      const now = new Date();
      const sessionDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const newTodayTotal = todayTotal + sessionDuration;
      
      setIsWorking(false);
      setStartTime(null);
      setElapsedTime(0);
      setTodayTotal(newTodayTotal);

      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          isWorking: false,
          todayTotal: newTodayTotal
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-gray-200">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">Work Time Dashboard</h1>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Clock className="mr-2 text-gray-500" />
            <span className="font-semibold text-xl">{format(new Date(), 'MMMM d, yyyy')}</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Today's Total</p>
            <p className="font-bold text-xl">{formatTime(todayTotal)}</p>
          </div>
        </div>
        <div className="mb-6">
          <div className="text-center mb-2">
            <span className="text-4xl font-bold">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex justify-center">
            {!isWorking ? (
              <button
                onClick={handleStartWork}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              >
                <Play className="mr-2" /> Start Working
              </button>
            ) : (
              <button
                onClick={handleStopWork}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                <Pause className="mr-2" /> Stop Working
              </button>
            )}
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          <AlertCircle className="inline mr-1" size={16} />
          Remember to take regular breaks!
        </div>
      </div>
    </div>
  );
};

export default Dashboard;