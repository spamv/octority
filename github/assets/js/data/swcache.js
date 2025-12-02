const resource = [
  /* --- CSS --- */
  '/octority/assets/css/jekyll-theme-chirpy.css',

  /* --- PWA --- */
  '/octority/app.js',
  '/octority/sw.js',

  /* --- HTML --- */
  '/octority/index.html',
  '/octority/404.html',

  
    '/octority/categories/',
  
    '/octority/tags/',
  
    '/octority/archives/',
  
    '/octority/about/',
  

  /* --- Favicons & compressed JS --- */
  
  
];

/* The request url with below domain will be cached */
const allowedDomains = [
  

  'spamv.github.io',

  

  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'cdn.jsdelivr.net',
  'polyfill.io'
];

/* Requests that include the following path will be banned */
const denyUrls = [];

