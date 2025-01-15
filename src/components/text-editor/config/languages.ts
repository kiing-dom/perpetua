import js from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';

import { LanguageFn } from 'lowlight';

const languages: [string, LanguageFn][] = [
  ['js', js],
  ['java', java],
  ['python', python],
  ['cpp', cpp],
  ['c', c],
  ['csharp', csharp],
  ['php', php],
];