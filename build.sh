#!/bin/bash
# Uso: build.sh [pwa]
cd /home/claude/course
parts="head.html dataset.js glosario.js data1.js data2.js data3.js data4.js data5.js data11.js data9.js data10.js data8.js data7.js data6.js engine.js"
cat $parts > /tmp/body.tmp
printf '\n</script>\n</body>\n</html>\n' >> /tmp/body.tmp
if [ "$1" = "pwa" ]; then
  python3 - <<'PY'
s=open('/tmp/body.tmp').read()
tags='''<meta name="theme-color" content="#0E5C63">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Curso E-commerce">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<link rel="manifest" href="manifest.webmanifest">
<script>window.__PWA=1</script>'''
s=s.replace('<!--PWA_HEAD-->',tags)
open('/tmp/pwa_index.html','w').write(s)
PY
else
  sed -i 's/<!--PWA_HEAD-->//' /tmp/body.tmp
  mv /tmp/body.tmp /mnt/user-data/outputs/curso-operaciones-ecommerce.html
fi
