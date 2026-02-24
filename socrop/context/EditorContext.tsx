import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";

export type AdjustmentKey =
  | "brightness"
  | "contrast"
  | "saturation"
  | "warmth"
  | "sharpness"
  | "highlights"
  | "shadows"
  | "vignette"
  | "grain"
  | "fade"
  | "tint"
  | "exposure";

export interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  sharpness: number;
  highlights: number;
  shadows: number;
  vignette: number;
  grain: number;
  fade: number;
  tint: number;
  exposure: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textAlign: "left" | "center" | "right";
  shadowEnabled: boolean;
  shadowColor: string;
  opacity: number;
  letterSpacing: number;
  backgroundColor: string;
}

export interface DrawPath {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export interface CropSettings {
  aspectRatio: string;
  label: string;
}

export interface EditorState {
  imageUri: string | null;
  adjustments: Adjustments;
  activeFilter: string | null;
  filterIntensity: number;
  textOverlays: TextOverlay[];
  drawPaths: DrawPath[];
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  cropRatio: CropSettings | null;
}

const defaultAdjustments: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  sharpness: 0,
  highlights: 0,
  shadows: 0,
  vignette: 0,
  grain: 0,
  fade: 0,
  tint: 0,
  exposure: 0,
};

const initialState: EditorState = {
  imageUri: null,
  adjustments: { ...defaultAdjustments },
  activeFilter: null,
  filterIntensity: 100,
  textOverlays: [],
  drawPaths: [],
  rotation: 0,
  flipH: false,
  flipV: false,
  cropRatio: null,
};

interface EditorContextValue {
  state: EditorState;
  canUndo: boolean;
  canRedo: boolean;
  setImageUri: (uri: string | null) => void;
  setAdjustment: (key: AdjustmentKey, value: number) => void;
  resetAdjustment: (key: AdjustmentKey) => void;
  resetAllAdjustments: () => void;
  setActiveFilter: (filter: string | null) => void;
  setFilterIntensity: (intensity: number) => void;
  addTextOverlay: (overlay: TextOverlay) => void;
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void;
  removeTextOverlay: (id: string) => void;
  addDrawPath: (path: DrawPath) => void;
  clearDrawPaths: () => void;
  rotate: () => void;
  rotateBy: (deg: number) => void;
  flipHorizontal: () => void;
  flipVertical: () => void;
  setCropRatio: (crop: CropSettings | null) => void;
  undo: () => void;
  redo: () => void;
  resetEditor: () => void;
  commitToHistory: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditorState>(initialState);
  const historyRef = useRef<EditorState[]>([initialState]);
  const historyIndexRef = useRef(0);
  const [, forceUpdate] = useState(0);

  const commitToHistory = useCallback(() => {
    setState((current) => {
      const trimmed = historyRef.current.slice(0, historyIndexRef.current + 1);
      trimmed.push(current);
      if (trimmed.length > 80) trimmed.shift();
      historyRef.current = trimmed;
      historyIndexRef.current = trimmed.length - 1;
      forceUpdate((n) => n + 1);
      return current;
    });
  }, []);

  const setImageUri = useCallback((uri: string | null) => {
    const newState = { ...initialState, imageUri: uri };
    setState(newState);
    historyRef.current = [newState];
    historyIndexRef.current = 0;
    forceUpdate((n) => n + 1);
  }, []);

  const setAdjustment = useCallback((key: AdjustmentKey, value: number) => {
    setState((prev) => ({
      ...prev,
      adjustments: { ...prev.adjustments, [key]: value },
    }));
  }, []);

  const resetAdjustment = useCallback((key: AdjustmentKey) => {
    setState((prev) => ({
      ...prev,
      adjustments: { ...prev.adjustments, [key]: 0 },
    }));
  }, []);

  const resetAllAdjustments = useCallback(() => {
    setState((prev) => ({
      ...prev,
      adjustments: { ...defaultAdjustments },
      activeFilter: null,
      filterIntensity: 100,
    }));
  }, []);

  const setActiveFilter = useCallback((filter: string | null) => {
    setState((prev) => ({ ...prev, activeFilter: filter }));
  }, []);

  const setFilterIntensity = useCallback((intensity: number) => {
    setState((prev) => ({ ...prev, filterIntensity: intensity }));
  }, []);

  const addTextOverlay = useCallback((overlay: TextOverlay) => {
    setState((prev) => ({
      ...prev,
      textOverlays: [...prev.textOverlays, overlay],
    }));
  }, []);

  const updateTextOverlay = useCallback(
    (id: string, updates: Partial<TextOverlay>) => {
      setState((prev) => ({
        ...prev,
        textOverlays: prev.textOverlays.map((t) =>
          t.id === id ? { ...t, ...updates } : t,
        ),
      }));
    },
    [],
  );

  const removeTextOverlay = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      textOverlays: prev.textOverlays.filter((t) => t.id !== id),
    }));
  }, []);

  const addDrawPath = useCallback((path: DrawPath) => {
    setState((prev) => ({
      ...prev,
      drawPaths: [...prev.drawPaths, path],
    }));
  }, []);

  const clearDrawPaths = useCallback(() => {
    setState((prev) => ({ ...prev, drawPaths: [] }));
  }, []);

  const rotate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  }, []);

  const rotateBy = useCallback((deg: number) => {
    setState((prev) => ({
      ...prev,
      rotation: (prev.rotation + deg) % 360,
    }));
  }, []);

  const flipHorizontal = useCallback(() => {
    setState((prev) => ({ ...prev, flipH: !prev.flipH }));
  }, []);

  const flipVertical = useCallback(() => {
    setState((prev) => ({ ...prev, flipV: !prev.flipV }));
  }, []);

  const setCropRatio = useCallback((crop: CropSettings | null) => {
    setState((prev) => ({ ...prev, cropRatio: crop }));
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setState(historyRef.current[historyIndexRef.current]);
      forceUpdate((n) => n + 1);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      setState(historyRef.current[historyIndexRef.current]);
      forceUpdate((n) => n + 1);
    }
  }, []);

  const resetEditor = useCallback(() => {
    setState(initialState);
    historyRef.current = [initialState];
    historyIndexRef.current = 0;
    forceUpdate((n) => n + 1);
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const value = useMemo(
    () => ({
      state,
      canUndo,
      canRedo,
      setImageUri,
      setAdjustment,
      resetAdjustment,
      resetAllAdjustments,
      setActiveFilter,
      setFilterIntensity,
      addTextOverlay,
      updateTextOverlay,
      removeTextOverlay,
      addDrawPath,
      clearDrawPaths,
      rotate,
      rotateBy,
      flipHorizontal,
      flipVertical,
      setCropRatio,
      undo,
      redo,
      resetEditor,
      commitToHistory,
    }),
    [state, canUndo, canRedo],
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}
