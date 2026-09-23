'use client';

import { useState, useEffect } from 'react';
import { WebGLSupportStatus } from '@/types/three';

/**
 * Checks whether WebGL or WebGL2 is supported and active in the current browser environment.
 */
export function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!(gl && gl instanceof WebGLRenderingContext || (window.WebGL2RenderingContext && gl instanceof WebGL2RenderingContext));
  } catch {
    return false;
  }
}

/**
 * React hook to reactively track WebGL support on client mount.
 */
export function useWebGLSupport(): WebGLSupportStatus {
  const [status, setStatus] = useState<WebGLSupportStatus>('checking');

  useEffect(() => {
    const isSupported = checkWebGLSupport();
    setStatus(isSupported ? 'supported' : 'unsupported');
  }, []);

  return status;
}
