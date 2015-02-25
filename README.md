# avsort.js
This is client-side Javascript application developed to create audiovisual introductions of sorting algorithms, and it 
is also the subject of my BSc thesis.

The idea of this project is based on [Timo Bingmann's](http://panthema.net/about/) excellent software called 
[sound-of-sorting](http://panthema.net/2013/sound-of-sorting/) however due to the nature of Javascript (and the lack 
of my C++ knowledge) this application is written from scratch.

## Live version

Live version is hosted at
[http://slapec.github.io/avsort/](http://slapec.github.io/avsort/)
by GitHub Pages.

Sometimes the built-in source codes are not indented in the editor (it isn't CodeMirror's fault). Try
to reload the page (`CTRL+F5`), it should work.

## Building
Node.js is required to build the application:

1. `npm install`
2. `npm test`

Build result will be placed under `avsort/dist`.

## Development
Because this is an offline application and I wanted to keep it simple, files are not served by HTTP server 
but served directly by the file system.

1. `npm install`
2. `npm run-script dev` or `gulp dev` if you've installed `gulp` globally.
3. Open `avsort/dev/index.html`. `gulp-livereload` listens to file changes and reloads the app automatically.

## Project home

[https://github.com/slapec/avsort](https://github.com/slapec/avsort)

This is an open-source project licensed under [GPLv2](https://github.com/slapec/avsort/blob/master/LICENSE). 
Hosted by GitHub.

## Project details
The thesis itself is hosted under a different repository:

[https://github.com/slapec/avsort-thesis](https://github.com/slapec/avsort-thesis)

Warning: It is written in Hungarian.

## Acknowledgements
This project using [CodeMirror](http://codemirror.net/) heavily as it is used as a simple but powerfull live editor.

I'd like to say thank you to [CSS-TRICKS](http://css-tricks.com) for their great CSS resources and to
[Chris Lowis'](http://blog.chrislowis.co.uk/about.html) blog for his WebAudi API and synthesizer tutorials.

## Pull requests
Please don't create any pull request as long as any of the major features are still missing (*This paragraph will be 
removed when the project will become ready*).