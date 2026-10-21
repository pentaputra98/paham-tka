/**
 * Ikon Lucide (ISC) disematkan sebagai SVG sebaris. Hanya ikon yang benar-benar dipakai (PRD §13.7).
 * Dibuat dari lucide-static; tambahkan nama di sini bila perlu ikon baru.
 */
import arrowLeft from 'lucide-static/icons/arrow-left.svg?raw';
import arrowRight from 'lucide-static/icons/arrow-right.svg?raw';
import play from 'lucide-static/icons/play.svg?raw';
import pause from 'lucide-static/icons/pause.svg?raw';
import rotateCcw from 'lucide-static/icons/rotate-ccw.svg?raw';
import penLine from 'lucide-static/icons/pen-line.svg?raw';
import eraser from 'lucide-static/icons/eraser.svg?raw';
import highlighter from 'lucide-static/icons/highlighter.svg?raw';
import undo2 from 'lucide-static/icons/undo-2.svg?raw';
import redo2 from 'lucide-static/icons/redo-2.svg?raw';
import trash2 from 'lucide-static/icons/trash-2.svg?raw';
import eye from 'lucide-static/icons/eye.svg?raw';
import eyeOff from 'lucide-static/icons/eye-off.svg?raw';
import list from 'lucide-static/icons/list.svg?raw';
import maximize from 'lucide-static/icons/maximize.svg?raw';
import minimize from 'lucide-static/icons/minimize.svg?raw';
import music from 'lucide-static/icons/music.svg?raw';
import volume2 from 'lucide-static/icons/volume-2.svg?raw';
import volumeX from 'lucide-static/icons/volume-x.svg?raw';
import settings from 'lucide-static/icons/settings.svg?raw';
import check from 'lucide-static/icons/check.svg?raw';
import x from 'lucide-static/icons/x.svg?raw';
import lock from 'lucide-static/icons/lock.svg?raw';
import printer from 'lucide-static/icons/printer.svg?raw';
import download from 'lucide-static/icons/download.svg?raw';
import upload from 'lucide-static/icons/upload.svg?raw';
import fileText from 'lucide-static/icons/file-text.svg?raw';
import timer from 'lucide-static/icons/timer.svg?raw';
import flag from 'lucide-static/icons/flag.svg?raw';
import circleHelp from 'lucide-static/icons/circle-help.svg?raw';
import chevronDown from 'lucide-static/icons/chevron-down.svg?raw';
import chevronRight from 'lucide-static/icons/chevron-right.svg?raw';
import circleDot from 'lucide-static/icons/circle-dot.svg?raw';
import listChecks from 'lucide-static/icons/list-checks.svg?raw';
import table from 'lucide-static/icons/table.svg?raw';
import search from 'lucide-static/icons/search.svg?raw';
import share from 'lucide-static/icons/share.svg?raw';
import squarePlus from 'lucide-static/icons/square-plus.svg?raw';
import wifiOff from 'lucide-static/icons/wifi-off.svg?raw';
import smartphone from 'lucide-static/icons/smartphone.svg?raw';
import info from 'lucide-static/icons/info.svg?raw';
import circleCheck from 'lucide-static/icons/circle-check.svg?raw';
import cloudDownload from 'lucide-static/icons/cloud-download.svg?raw';
import house from 'lucide-static/icons/house.svg?raw';
import refreshCw from 'lucide-static/icons/refresh-cw.svg?raw';
import clipboardCopy from 'lucide-static/icons/clipboard-copy.svg?raw';
import circleAlert from 'lucide-static/icons/circle-alert.svg?raw';

const RAW = {
  'arrow-left': arrowLeft,
  'arrow-right': arrowRight,
  play: play,
  pause: pause,
  'rotate-ccw': rotateCcw,
  'pen-line': penLine,
  eraser: eraser,
  highlighter: highlighter,
  'undo-2': undo2,
  'redo-2': redo2,
  'trash-2': trash2,
  eye: eye,
  'eye-off': eyeOff,
  list: list,
  maximize: maximize,
  minimize: minimize,
  music: music,
  'volume-2': volume2,
  'volume-x': volumeX,
  settings: settings,
  check: check,
  x: x,
  lock: lock,
  printer: printer,
  download: download,
  upload: upload,
  'file-text': fileText,
  timer: timer,
  flag: flag,
  'circle-help': circleHelp,
  'chevron-down': chevronDown,
  'chevron-right': chevronRight,
  'circle-dot': circleDot,
  'list-checks': listChecks,
  table: table,
  search: search,
  share: share,
  'square-plus': squarePlus,
  'wifi-off': wifiOff,
  smartphone: smartphone,
  info: info,
  'circle-check': circleCheck,
  'cloud-download': cloudDownload,
  house: house,
  'refresh-cw': refreshCw,
  'clipboard-copy': clipboardCopy,
  'circle-alert': circleAlert,
} as const;

export type IconName = keyof typeof RAW;

const cache = new Map<IconName, string>();

/** SVG ikon siap sisip; selalu `aria-hidden` (label ada pada tombolnya). */
export function icon(name: IconName, cls = ''): string {
  let svg = cache.get(name);
  if (!svg) {
    svg = RAW[name]
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s*\n\s*/g, ' ')
      .replace(/ width="24" height="24"/, '')
      .replace('<svg', '<svg aria-hidden="true" focusable="false"')
      .trim();
    cache.set(name, svg);
  }
  return cls ? svg.replace('class="lucide', `class="${cls} lucide`) : svg;
}
