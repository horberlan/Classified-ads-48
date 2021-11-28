/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/views/easteregg/easteregg.js":
/*!******************************************!*\
  !*** ./src/views/easteregg/easteregg.js ***!
  \******************************************/
/***/ (() => {

eval("const wrapper = document.querySelector('.wrapper svg')\nconst btnDraw = document.querySelector('.btn-draw')\nconst btnErase = document.querySelector('.btn-erase')\n\n// We are only adding and removing the 'active' class,\n// the entire animation is defined in the CSS code\nfunction draw () {\n  wrapper.classList.add('active')\n}\n\nfunction erase () {\n  wrapper.classList.remove('active')\n}\n\n// Add handlers to our buttons\nbtnDraw.addEventListener('click', draw, false)\nbtnErase.addEventListener('click', erase, false)\n\n// Play draw animation once\nsetTimeout(draw, 300)\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGFzc2lmaWVkLWFkcy00OC1jbGllbnQvLi9zcmMvdmlld3MvZWFzdGVyZWdnL2Vhc3RlcmVnZy5qcz81NzNkIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiIuL3NyYy92aWV3cy9lYXN0ZXJlZ2cvZWFzdGVyZWdnLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53cmFwcGVyIHN2ZycpXG5jb25zdCBidG5EcmF3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1kcmF3JylcbmNvbnN0IGJ0bkVyYXNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1lcmFzZScpXG5cbi8vIFdlIGFyZSBvbmx5IGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlICdhY3RpdmUnIGNsYXNzLFxuLy8gdGhlIGVudGlyZSBhbmltYXRpb24gaXMgZGVmaW5lZCBpbiB0aGUgQ1NTIGNvZGVcbmZ1bmN0aW9uIGRyYXcgKCkge1xuICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG59XG5cbmZ1bmN0aW9uIGVyYXNlICgpIHtcbiAgd3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxufVxuXG4vLyBBZGQgaGFuZGxlcnMgdG8gb3VyIGJ1dHRvbnNcbmJ0bkRyYXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkcmF3LCBmYWxzZSlcbmJ0bkVyYXNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXJhc2UsIGZhbHNlKVxuXG4vLyBQbGF5IGRyYXcgYW5pbWF0aW9uIG9uY2VcbnNldFRpbWVvdXQoZHJhdywgMzAwKVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/views/easteregg/easteregg.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/views/easteregg/easteregg.js"]();
/******/ 	
/******/ })()
;