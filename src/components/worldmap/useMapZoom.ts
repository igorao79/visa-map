import { useState, useCallback } from 'react';
import * as d3Selection from 'd3-selection';

interface ZoomState {
  x: number;
  y: number;
  k: number;
}

interface UseMapZoomProps {
  svgRef: React.MutableRefObject<SVGSVGElement | null>;
}

export const useMapZoom = ({ svgRef }: UseMapZoomProps) => {
  const [zoomState, setZoomState] = useState<ZoomState>({ x: 0, y: 0, k: 1.2 }); // Начинаем с небольшого увеличения

  const resetZoom = useCallback(() => {
    if (svgRef.current) {
      const svg = d3Selection.select(svgRef.current as SVGSVGElement);
      const g = svg.select('g');
      const newZoomState = { x: 0, y: 0, k: 1.2 };
      setZoomState(newZoomState);
      g.attr('transform', `translate(${newZoomState.x},${newZoomState.y}) scale(${newZoomState.k})`);
    }
  }, [svgRef]);

  const centerMap = useCallback(() => {
    if (svgRef.current) {
      const svg = d3Selection.select(svgRef.current as SVGSVGElement);
      const g = svg.select('g');
      const newZoomState = { x: 0, y: 0, k: 1 };
      setZoomState(newZoomState);
      g.attr('transform', `translate(${newZoomState.x},${newZoomState.y}) scale(${newZoomState.k})`);
    }
  }, [svgRef]);

  const updateZoomState = useCallback((newState: ZoomState) => {
    setZoomState(newState);
  }, []);

  return {
    zoomState,
    resetZoom,
    centerMap,
    updateZoomState
  };
};
