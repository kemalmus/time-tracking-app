import React, { useState, useEffect } from 'react';
import { format, parse, startOfWeek, addDays } from 'date-fns';
import { Clock, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const TimeAllocation = () => {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [allocations, setAllocations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadAllocations = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.allocations) {
            setAllocations(userData.allocations);
          }
        }
      }
    };
    loadAllocations();
  }, []);

  const handleAllocationChange = (day: string, value: string) => {
    setAllocations(prev => ({ ...prev, [day]: value }));
  };

  const saveAllocations = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { allocations }, { merge: true });
      toast.success('Time allocations saved successfully!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-gray-200">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">Time Allocation</h1>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Week of {format(weekStart, 'MMMM d, yyyy')}</h2>
        </div>
        <div className="space-y-4">
          {[0, 1, 2, 3, 4].map((dayOffset) => {
            const date = addDays(weekStart, dayOffset);
            const dayKey = format(date, 'yyyy-MM-dd');
            return (
              <div key={dayKey} className="flex items-center justify-between">
                <span className="font-medium">{format(date, 'EEEE, MMM d')}</span>
                <div className="flex items-center">
                  <Clock className="mr-2 text-gray-500" />
                  <input
                    type="time"
                    value={allocations[dayKey] || ''}
                    onChange={(e) => handleAllocationChange(dayKey, e.target.value)}
                    className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={saveAllocations}
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 mx-auto"
          >
            <Save className="mr-2" /> Save Allocations
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeAllocation;