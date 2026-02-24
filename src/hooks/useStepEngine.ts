import { useState, useEffect, useRef, useCallback } from "react";
import {
  STEPS_PER_POINT,
  MAX_POINTS_PER_VISIT,
  MANUAL_BOOST_STEPS,
  AUTO_INCREMENT_INTERVAL_MS,
  AUTO_INCREMENT_STEPS_PER_TICK,
  MOTION_STEP_THRESHOLD,
  MOTION_STEP_COOLDOWN_MS,
} from "@/config/rewards";

const SESSION_KEY = "walkgive_trip";

interface TripSession {
  steps: number;
  startTime: number;
  questBonusPoints: number;
}

function loadSession(): TripSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted — start fresh
  }
  return { steps: 0, startTime: Date.now(), questBonusPoints: 0 };
}

function saveSession(session: TripSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearTripSession() {
  localStorage.removeItem(SESSION_KEY);
}

export interface StepEngineState {
  steps: number;
  points: number;
  elapsedSeconds: number;
  motionAvailable: boolean;
  autoIncrementActive: boolean;
  addManualBoost: () => void;
  addQuestBonusPoints: (pts: number) => void;
  resetTrip: () => void;
}

export function useStepEngine(): StepEngineState {
  const session = useRef<TripSession>(loadSession());

  const [steps, setSteps] = useState(session.current.steps);
  const [questBonusPoints, setQuestBonusPoints] = useState(session.current.questBonusPoints);
  const [elapsedSeconds, setElapsedSeconds] = useState(
    Math.floor((Date.now() - session.current.startTime) / 1000)
  );
  const [motionAvailable, setMotionAvailable] = useState(false);
  const [autoIncrementActive, setAutoIncrementActive] = useState(false);

  // Use a ref so motion/auto-increment callbacks always see the latest value
  // without needing to be re-registered on every step change.
  const stepsRef = useRef(steps);
  const addSteps = useCallback((delta: number) => {
    stepsRef.current = stepsRef.current + delta;
    setSteps(stepsRef.current);
  }, []);

  // ── Session persistence ────────────────────────────────────────────────────
  useEffect(() => {
    session.current.steps = steps;
    session.current.questBonusPoints = questBonusPoints;
    saveSession(session.current);
  }, [steps, questBonusPoints]);

  // ── Trip duration clock ────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - session.current.startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ── DeviceMotion (primary) ─────────────────────────────────────────────────
  useEffect(() => {
    let lastStepTime = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const x = acc.x ?? 0;
      const y = acc.y ?? 0;
      const z = acc.z ?? 0;
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      const now = Date.now();
      if (magnitude > MOTION_STEP_THRESHOLD && now - lastStepTime > MOTION_STEP_COOLDOWN_MS) {
        lastStepTime = now;
        addSteps(1);
      }
    };

    const startMotion = () => {
      window.addEventListener("devicemotion", handleMotion);
      setMotionAvailable(true);
    };

    // iOS 13+ requires explicit permission
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === "function"
    ) {
      (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> })
        .requestPermission()
        .then((permission) => {
          if (permission === "granted") startMotion();
          // denied — fall through to auto-increment silently
        })
        .catch(() => {
          // unavailable on this device — fall through to auto-increment
        });
    } else if (typeof DeviceMotionEvent !== "undefined" && "ondevicemotion" in window) {
      // Android / non-iOS browsers — permission not required
      startMotion();
    }
    // If DeviceMotionEvent doesn't exist, motionAvailable stays false → auto-increment kicks in

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [addSteps]);

  // ── Auto-increment fallback ────────────────────────────────────────────────
  // Activates only when DeviceMotion is unavailable. Gives a ~2 steps/sec
  // walking pace so the demo always feels alive on any device.
  useEffect(() => {
    if (motionAvailable) return; // motion is running — no need for this

    let intervalId: ReturnType<typeof setInterval> | undefined;

    // Small delay so we don't race with the async permission request
    const startDelay = setTimeout(() => {
      setAutoIncrementActive(true);
      intervalId = setInterval(() => {
        addSteps(AUTO_INCREMENT_STEPS_PER_TICK);
      }, AUTO_INCREMENT_INTERVAL_MS);
    }, 800);

    return () => {
      clearTimeout(startDelay);
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [motionAvailable, addSteps]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const walkingPoints = Math.min(
    Math.floor(steps / STEPS_PER_POINT),
    MAX_POINTS_PER_VISIT
  );
  const points = walkingPoints + questBonusPoints;

  // ── Public API ─────────────────────────────────────────────────────────────
  const addManualBoost = useCallback(() => {
    addSteps(MANUAL_BOOST_STEPS);
  }, [addSteps]);

  const addQuestBonusPoints = useCallback((pts: number) => {
    setQuestBonusPoints((prev) => prev + pts);
  }, []);

  const resetTrip = useCallback(() => {
    const fresh: TripSession = { steps: 0, startTime: Date.now(), questBonusPoints: 0 };
    session.current = fresh;
    stepsRef.current = 0;
    setSteps(0);
    setQuestBonusPoints(0);
    setElapsedSeconds(0);
    saveSession(fresh);
  }, []);

  return {
    steps,
    points,
    elapsedSeconds,
    motionAvailable,
    autoIncrementActive,
    addManualBoost,
    addQuestBonusPoints,
    resetTrip,
  };
}
