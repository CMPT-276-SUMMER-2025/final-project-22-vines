// Based on https://www.youtube.com/watch?v=pR1r-1KGtNU

import {useState, useEffect, useRef, useCallback} from 'react';

const useUndoRedo = (initialValue, limit = 10) => {
    const [history, setHistory] = useState([initialValue]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const inputRef = useRef(null);

    const set = (value, pushToHistory = true) => {
        if (pushToHistory) {
            let newHistory = history.slice(0, currentIndex + 1);
            newHistory.push(value);
            if (newHistory.length > limit) {
                newHistory = newHistory.slice(newHistory.length - limit);
            }
            setHistory(newHistory);
            setCurrentIndex(newHistory.length - 1);
        } else {
            const newHistory = [...history];
            newHistory[currentIndex] = value;
            setHistory(newHistory);
        }
    };

    const undo = useCallback(() => {
        setCurrentIndex((i) => Math.max(i - 1, 0));
    }, []);

    const redo = useCallback(() => {
        setCurrentIndex((i) => Math.min(i + 1, history.length - 1));
    }, [history.length]);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (inputRef.current && inputRef.current === document.activeElement) {
                if (event.ctrlKey && event.key === 'z') {
                    event.preventDefault();
                    undo();
                } else if (event.ctrlKey && event.key === 'y') {
                    event.preventDefault();
                    redo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [undo, redo]);


    return [history[currentIndex], set, undo, redo, inputRef];
};

export default useUndoRedo