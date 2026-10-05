import { INTRO_PRELOAD } from '@/components/v2/intro/timing'
import { paletteIds } from '@/content/v3/palettes'

/*
 * Pre-paint scripts for any version built on the /v3 shell. Each runs inline as
 * the root's first children, so nothing flashes before it applies.
 */

/** The stored or system theme, the colour option (?palette=<id> first, then this device's pick), and the lens strength. */
export const themeScript = `(function(){try{var r=document.currentScript.parentElement;var s=localStorage.getItem('v3-theme');r.dataset.theme=(s==='light'||s==='dark')?s:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');var ids=${JSON.stringify(paletteIds)};var q=(location.search.match(/[?&]palette=([a-z]+)/)||[])[1];if(q&&ids.indexOf(q)>=0){localStorage.setItem('v3-palette',q)}var p=q&&ids.indexOf(q)>=0?q:localStorage.getItem('v3-palette');if(p&&ids.indexOf(p)>=0)r.dataset.palette=p;var ab=localStorage.getItem('v3-aberration');if(['off','subtle','strong','wild'].indexOf(ab)>=0)r.dataset.aberration=ab}catch(e){}})()`

/**
 * The /v2 preflight, flown under the host's own cookie: it plays when a visitor
 * first lands on the version's home in a browser session, or on ?intro, never
 * under reduced motion, and the model is requested at once when it will.
 */
export const introScript = (path: string, cookie: string) =>
  `(function(){try{var r=document.currentScript.parentElement;var q=/[?&]intro(?:[=&]|$)/.test(location.search);var home=location.pathname.replace(/\\/$/,'')==='${path}';var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=/(?:^|; )${cookie}=seen/.test(document.cookie);var on=q||(home&&!rm&&!seen);r.dataset.intro=on?'on':'off';if(on)${JSON.stringify(INTRO_PRELOAD)}.forEach(function(h){var l=document.createElement('link');l.rel='preload';l.as='fetch';l.crossOrigin='anonymous';l.href=h;document.head.appendChild(l)})}catch(e){}})()`
