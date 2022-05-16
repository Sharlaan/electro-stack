import { writeFile } from 'fs';

/**
 * HEX to HSL color converter
 *
 * Execute directly in node REPL:
 * $ node path/to/colorConverterHex2HSL.mjs
 */

function convert2HSL(hexColor) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h;
  let s;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

const colors = {
  '--color-amber-50': '#fff8e1',
  '--color-amber-100': '#ffecb3',
  '--color-amber-200': '#ffe082',
  '--color-amber-300': '#ffd54f',
  '--color-amber-400': '#ffca28',
  '--color-amber-500': '#ffc107',
  '--color-amber-600': '#ffb300',
  '--color-amber-700': '#ffa000',
  '--color-amber-800': '#ff8f00',
  '--color-amber-900': '#ff6f00',
  '--color-amber-A100': '#ffe57f',
  '--color-amber-A200': '#ffd740',
  '--color-amber-A400': '#ffc400',
  '--color-amber-A700': '#ffab00',

  '--color-blue-50': '#e3f2fd',
  '--color-blue-100': '#bbdefb',
  '--color-blue-200': '#90caf9',
  '--color-blue-300': '#64b5f6',
  '--color-blue-400': '#42a5f5',
  '--color-blue-500': '#2196f3',
  '--color-blue-600': '#1e88e5',
  '--color-blue-700': '#1976d2',
  '--color-blue-800': '#1565c0',
  '--color-blue-900': '#0d47a1',
  '--color-blue-A100': '#82b1ff',
  '--color-blue-A200': '#448aff',
  '--color-blue-A400': '#2979ff',
  '--color-blue-A700': '#2962ff',

  '--color-blueGrey-50': '#eceff1',
  '--color-blueGrey-100': '#cfd8dc',
  '--color-blueGrey-200': '#b0bec5',
  '--color-blueGrey-300': '#90a4ae',
  '--color-blueGrey-400': '#78909c',
  '--color-blueGrey-500': '#607d8b',
  '--color-blueGrey-600': '#546e7a',
  '--color-blueGrey-700': '#455a64',
  '--color-blueGrey-800': '#37474f',
  '--color-blueGrey-900': '#263238',
  '--color-blueGrey-A100': '#cfd8dc',
  '--color-blueGrey-A200': '#b0bec5',
  '--color-blueGrey-A400': '#78909c',
  '--color-blueGrey-A700': '#455a64',

  '--color-brown-50': '#efebe9',
  '--color-brown-100': '#d7ccc8',
  '--color-brown-200': '#bcaaa4',
  '--color-brown-300': '#a1887f',
  '--color-brown-400': '#8d6e63',
  '--color-brown-500': '#795548',
  '--color-brown-600': '#6d4c41',
  '--color-brown-700': '#5d4037',
  '--color-brown-800': '#4e342e',
  '--color-brown-900': '#3e2723',
  '--color-brown-A100': '#d7ccc8',
  '--color-brown-A200': '#bcaaa4',
  '--color-brown-A400': '#8d6e63',
  '--color-brown-A700': '#5d4037',

  '--color-cyan-50': '#e0f7fa',
  '--color-cyan-100': '#b2ebf2',
  '--color-cyan-200': '#80deea',
  '--color-cyan-300': '#4dd0e1',
  '--color-cyan-400': '#26c6da',
  '--color-cyan-500': '#00bcd4',
  '--color-cyan-600': '#00acc1',
  '--color-cyan-700': '#0097a7',
  '--color-cyan-800': '#00838f',
  '--color-cyan-900': '#006064',
  '--color-cyan-A100': '#84ffff',
  '--color-cyan-A200': '#18ffff',
  '--color-cyan-A400': '#00e5ff',
  '--color-cyan-A700': '#00b8d4',

  '--color-deepOrange-50': '#fbe9e7',
  '--color-deepOrange-100': '#ffccbc',
  '--color-deepOrange-200': '#ffab91',
  '--color-deepOrange-300': '#ff8a65',
  '--color-deepOrange-400': '#ff7043',
  '--color-deepOrange-500': '#ff5722',
  '--color-deepOrange-600': '#f4511e',
  '--color-deepOrange-700': '#e64a19',
  '--color-deepOrange-800': '#d84315',
  '--color-deepOrange-900': '#bf360c',
  '--color-deepOrange-A100': '#ff9e80',
  '--color-deepOrange-A200': '#ff6e40',
  '--color-deepOrange-A400': '#ff3d00',
  '--color-deepOrange-A700': '#dd2c00',

  '--color-deepPurple-50': '#ede7f6',
  '--color-deepPurple-100': '#d1c4e9',
  '--color-deepPurple-200': '#b39ddb',
  '--color-deepPurple-300': '#9575cd',
  '--color-deepPurple-400': '#7e57c2',
  '--color-deepPurple-500': '#673ab7',
  '--color-deepPurple-600': '#5e35b1',
  '--color-deepPurple-700': '#512da8',
  '--color-deepPurple-800': '#4527a0',
  '--color-deepPurple-900': '#311b92',
  '--color-deepPurple-A100': '#b388ff',
  '--color-deepPurple-A200': '#7c4dff',
  '--color-deepPurple-A400': '#651fff',
  '--color-deepPurple-A700': '#6200ea',

  '--color-green-50': '#e8f5e9',
  '--color-green-100': '#c8e6c9',
  '--color-green-200': '#a5d6a7',
  '--color-green-300': '#81c784',
  '--color-green-400': '#66bb6a',
  '--color-green-500': '#4caf50',
  '--color-green-600': '#43a047',
  '--color-green-700': '#388e3c',
  '--color-green-800': '#2e7d32',
  '--color-green-900': '#1b5e20',
  '--color-green-A100': '#b9f6ca',
  '--color-green-A200': '#69f0ae',
  '--color-green-A400': '#00e676',
  '--color-green-A700': '#00c853',

  '--color-grey-50': '#fafafa',
  '--color-grey-100': '#f5f5f5',
  '--color-grey-200': '#eeeeee',
  '--color-grey-300': '#e0e0e0',
  '--color-grey-400': '#bdbdbd',
  '--color-grey-500': '#9e9e9e',
  '--color-grey-600': '#757575',
  '--color-grey-700': '#616161',
  '--color-grey-800': '#424242',
  '--color-grey-900': '#212121',
  '--color-grey-A100': '#d5d5d5',
  '--color-grey-A200': '#aaaaaa',
  '--color-grey-A400': '#303030',
  '--color-grey-A700': '#616161',

  '--color-indigo-50': '#e8eaf6',
  '--color-indigo-100': '#c5cae9',
  '--color-indigo-200': '#9fa8da',
  '--color-indigo-300': '#7986cb',
  '--color-indigo-400': '#5c6bc0',
  '--color-indigo-500': '#3f51b5',
  '--color-indigo-600': '#3949ab',
  '--color-indigo-700': '#303f9f',
  '--color-indigo-800': '#283593',
  '--color-indigo-900': '#1a237e',
  '--color-indigo-A100': '#8c9eff',
  '--color-indigo-A200': '#536dfe',
  '--color-indigo-A400': '#3d5afe',
  '--color-indigo-A700': '#304ffe',

  '--color-lightBlue-50': '#e1f5fe',
  '--color-lightBlue-100': '#b3e5fc',
  '--color-lightBlue-200': '#81d4fa',
  '--color-lightBlue-300': '#4fc3f7',
  '--color-lightBlue-400': '#29b6f6',
  '--color-lightBlue-500': '#03a9f4',
  '--color-lightBlue-600': '#039be5',
  '--color-lightBlue-700': '#0288d1',
  '--color-lightBlue-800': '#0277bd',
  '--color-lightBlue-900': '#01579b',
  '--color-lightBlue-A100': '#80d8ff',
  '--color-lightBlue-A200': '#40c4ff',
  '--color-lightBlue-A400': '#00b0ff',
  '--color-lightBlue-A700': '#0091ea',

  '--color-lightGreen-50': '#f1f8e9',
  '--color-lightGreen-100': '#dcedc8',
  '--color-lightGreen-200': '#c5e1a5',
  '--color-lightGreen-300': '#aed581',
  '--color-lightGreen-400': '#9ccc65',
  '--color-lightGreen-500': '#8bc34a',
  '--color-lightGreen-600': '#7cb342',
  '--color-lightGreen-700': '#689f38',
  '--color-lightGreen-800': '#558b2f',
  '--color-lightGreen-900': '#33691e',
  '--color-lightGreen-A100': '#ccff90',
  '--color-lightGreen-A200': '#b2ff59',
  '--color-lightGreen-A400': '#76ff03',
  '--color-lightGreen-A700': '#64dd17',

  '--color-lime-50': '#f9fbe7',
  '--color-lime-100': '#f0f4c3',
  '--color-lime-200': '#e6ee9c',
  '--color-lime-300': '#dce775',
  '--color-lime-400': '#d4e157',
  '--color-lime-500': '#cddc39',
  '--color-lime-600': '#c0ca33',
  '--color-lime-700': '#afb42b',
  '--color-lime-800': '#9e9d24',
  '--color-lime-900': '#827717',
  '--color-lime-A100': '#f4ff81',
  '--color-lime-A200': '#eeff41',
  '--color-lime-A400': '#c6ff00',
  '--color-lime-A700': '#aeea00',

  '--color-orange-50': '#fff3e0',
  '--color-orange-100': '#ffe0b2',
  '--color-orange-200': '#ffcc80',
  '--color-orange-300': '#ffb74d',
  '--color-orange-400': '#ffa726',
  '--color-orange-500': '#ff9800',
  '--color-orange-600': '#fb8c00',
  '--color-orange-700': '#f57c00',
  '--color-orange-800': '#ef6c00',
  '--color-orange-900': '#e65100',
  '--color-orange-A100': '#ffd180',
  '--color-orange-A200': '#ffab40',
  '--color-orange-A400': '#ff9100',
  '--color-orange-A700': '#ff6d00',

  '--color-pink-50': '#fce4ec',
  '--color-pink-100': '#f8bbd0',
  '--color-pink-200': '#f48fb1',
  '--color-pink-300': '#f06292',
  '--color-pink-400': '#ec407a',
  '--color-pink-500': '#e91e63',
  '--color-pink-600': '#d81b60',
  '--color-pink-700': '#c2185b',
  '--color-pink-800': '#ad1457',
  '--color-pink-900': '#880e4f',
  '--color-pink-A100': '#ff80ab',
  '--color-pink-A200': '#ff4081',
  '--color-pink-A400': '#f50057',
  '--color-pink-A700': '#c51162',

  '--color-purple-50': '#f3e5f5',
  '--color-purple-100': '#e1bee7',
  '--color-purple-200': '#ce93d8',
  '--color-purple-300': '#ba68c8',
  '--color-purple-400': '#ab47bc',
  '--color-purple-500': '#9c27b0',
  '--color-purple-600': '#8e24aa',
  '--color-purple-700': '#7b1fa2',
  '--color-purple-800': '#6a1b9a',
  '--color-purple-900': '#4a148c',
  '--color-purple-A100': '#ea80fc',
  '--color-purple-A200': '#e040fb',
  '--color-purple-A400': '#d500f9',
  '--color-purple-A700': '#aa00ff',

  '--color-red-50': '#ffebee',
  '--color-red-100': '#ffcdd2',
  '--color-red-200': '#ef9a9a',
  '--color-red-300': '#e57373',
  '--color-red-400': '#ef5350',
  '--color-red-500': '#f44336',
  '--color-red-600': '#e53935',
  '--color-red-700': '#d32f2f',
  '--color-red-800': '#c62828',
  '--color-red-900': '#b71c1c',
  '--color-red-A100': '#ff8a80',
  '--color-red-A200': '#ff5252',
  '--color-red-A400': '#ff1744',
  '--color-red-A700': '#d50000',

  '--color-teal-50': '#e0f2f1',
  '--color-teal-100': '#b2dfdb',
  '--color-teal-200': '#80cbc4',
  '--color-teal-300': '#4db6ac',
  '--color-teal-400': '#26a69a',
  '--color-teal-500': '#009688',
  '--color-teal-600': '#00897b',
  '--color-teal-700': '#00796b',
  '--color-teal-800': '#00695c',
  '--color-teal-900': '#004d40',
  '--color-teal-A100': '#a7ffeb',
  '--color-teal-A200': '#64ffda',
  '--color-teal-A400': '#1de9b6',
  '--color-teal-A700': '#00bfa5',

  '--color-yellow-50': '#fffde7',
  '--color-yellow-100': '#fff9c4',
  '--color-yellow-200': '#fff59d',
  '--color-yellow-300': '#fff176',
  '--color-yellow-400': '#ffee58',
  '--color-yellow-500': '#ffeb3b',
  '--color-yellow-600': '#fdd835',
  '--color-yellow-700': '#fbc02d',
  '--color-yellow-800': '#f9a825',
  '--color-yellow-900': '#f57f17',
  '--color-yellow-A100': '#ffff8d',
  '--color-yellow-A200': '#ffff00',
  '--color-yellow-A400': '#ffea00',
  '--color-yellow-A700': '#ffd600',
};

const result = Object.fromEntries(
  Object.entries(colors).map(([key, value]) => [key, convert2HSL(value)])
);

writeFile('./colors-hsl.css', JSON.stringify(result, null, 2), 'utf-8', (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
