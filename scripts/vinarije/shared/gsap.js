import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
/* mobitel: traka adrese koja se skriva ne smije svaki put preračunavati sve pinove */
ScrollTrigger.config({ ignoreMobileResize: true });
export const GSAP = { gsap, ScrollTrigger };
export { gsap, ScrollTrigger, SplitText, useGSAP };
