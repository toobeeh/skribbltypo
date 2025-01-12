/**
 * Calculate the pressure point
 * The model is a sigmoid function crossing 0,0 and 1,1 with three parameters:
 * @param p pressure from 0-1
 * @param s sensitivity, optimal range 1-20
 * @param b balance, optimal range 0-1
 */
export const calculatePressurePoint = (p: number, s: number, b: number) => {
  const A = 1 / (1 + Math.exp(b * s));
  const B = 1 / (1 + Math.exp(-s * (p - b)));
  const C = 1 / (1 + Math.exp(-s * (1 - b)));
  return (B - A) / (C - A);
};