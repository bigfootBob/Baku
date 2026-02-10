import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressContextType {
    xp: number;
    level: number;
    addXp: (amount: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType>({
    xp: 0,
    level: 1,
    addXp: async () => { },
});

export const useProgress = () => useContext(ProgressContext);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const storedXp = await AsyncStorage.getItem('baku_xp');
            const storedLevel = await AsyncStorage.getItem('baku_level');
            if (storedXp) setXp(parseInt(storedXp, 10));
            if (storedLevel) setLevel(parseInt(storedLevel, 10));
        } catch (e) {
            console.error("Failed to load progress", e);
        }
    };

    const addXp = async (amount: number) => {
        try {
            const newXp = xp + amount;
            let newLevel = level;

            // Simple leveling logic: Every 100 XP is a level
            // Level 1: 0-99
            // Level 2: 100-199
            // etc.
            const calculatedLevel = Math.floor(newXp / 100) + 1;

            if (calculatedLevel > level) {
                newLevel = calculatedLevel;
                // Could trigger a level-up modal or effect here
                console.log("Level Up!", newLevel);
            }

            setXp(newXp);
            setLevel(newLevel);

            await AsyncStorage.setItem('baku_xp', newXp.toString());
            await AsyncStorage.setItem('baku_level', newLevel.toString());
        } catch (e) {
            console.error("Failed to save progress", e);
        }
    };

    return (
        <ProgressContext.Provider value={{ xp, level, addXp }}>
            {children}
        </ProgressContext.Provider>
    );
}
