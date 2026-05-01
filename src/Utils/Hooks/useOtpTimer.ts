import { useEffect, useState, useCallback } from "react";

export const useOtpTimer = (duration: number = 60) => {
    const [seconds, setSeconds] = useState(duration);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    const start = useCallback(() => {
        setSeconds(duration);
        setIsActive(true);
    }, [duration]);

    const reset = useCallback(() => {
        setSeconds(duration);
        setIsActive(false);
    }, [duration]);

    const canResend = seconds === 0;

    const formatTime = useCallback((secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }, []);

    return {
        seconds,
        formatted: formatTime(seconds),
        isActive,
        canResend,
        start,
        reset,
    };
};