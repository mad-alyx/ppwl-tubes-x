import React from 'react';

/**
 * 1. Ikon X Original (Dipakai untuk Menu Premium)
 */
export const XIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M 21.742 21.75 l -7.563 -11.179 l 7.056 -8.321 h -2.456 l -5.691 6.714 l -4.54 -6.714 H 2.359 l 7.29 10.776 L 2.25 21.75 h 2.456 l 6.035 -7.118 l 4.818 7.118 h 6.191 h -0.008 Z M 7.739 3.818 L 18.81 20.182 h -2.447 L 5.29 3.818 h 2.447 Z" />
  </svg>
);

/**
 * 2. Ikon Grok Original (viewBox disesuaikan)
 */
export const GrokIcon = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 33 33" width={size} height={size} fill="currentColor">
    <path d="M 12.745 20.54 l 10.97 -8.19 c 0.539 -0.4 1.307 -0.244 1.564 0.38 c 1.349 3.288 0.746 7.241 -1.938 9.955 c -2.683 2.714 -6.417 3.31 -9.83 1.954 l -3.728 1.745 c 5.347 3.697 11.84 2.782 15.898 -1.324 c 3.219 -3.255 4.216 -7.692 3.284 -11.693 l 0.008 0.009 c -1.351 -5.878 0.332 -8.227 3.782 -13.031 L 33 0 l -4.54 4.59 v -0.014 L 12.743 20.544 m -2.263 1.987 c -3.837 -3.707 -3.175 -9.446 0.1 -12.755 c 2.42 -2.449 6.388 -3.448 9.852 -1.979 l 3.72 -1.737 c -0.67 -0.49 -1.53 -1.017 -2.515 -1.387 c -4.455 -1.854 -9.789 -0.931 -13.41 2.728 c -3.483 3.523 -4.579 8.94 -2.697 13.561 c 1.405 3.454 -0.899 5.898 -3.22 8.364 C 1.49 30.2 0.666 31.074 0 32 l 10.478 -9.466" />
  </svg>
);

/**
 * FIX VISUAL: Ikon Notifikasi (Lonceng) Original Versi Tipis Estetik
 * strokeWidth diturunkan ke 1.5 agar ramping, ditambah round agar lekukannya halus.
 */
export const NotificationIconOri = ({ size = 28, active = false }: { size?: number, active?: boolean }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={active ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth={active ? "0" : "1.5"} // UNTUK MENIPISKAN: Ganti angka ini (bisa 1.5 atau 1.2 kalau mau super tipis)
    strokeLinecap="round"              // Biar ujung garis halus
    strokeLinejoin="round"             // Biar sudut tekukan rapi
  >
    <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path>
  </svg>
);