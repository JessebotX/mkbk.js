# mkbk.js Reference
## mkbk.yml
```yml
title: 'My Book Collection Title'
languageCode: 'en'
baseURL: 'https://example.com' # required for RSS feeds and anything requiring absolute paths
description: 'This is my book collection.'
customCSSRelPath: './custom.css'
customJSRelPath: './custom.js'
faviconRelPath: './favicon.png'

# Internals (optional; CHANGE NOT RECOMMENDED)
workingDir: '.' # The build path passed into the build command
layoutRelDir: './layout' # Storing
outputRelDir: './out' # Optional
```
