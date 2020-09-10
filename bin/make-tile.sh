#! /bin/bash

# https://wiki.openstreetmap.org/wiki/GDAL2Tiles

# www.gdal.org/gdal_translate.html

set -e

gdal_translate -strict -of GTiff -a_srs 'EPSG:3857' \
    -gcp 0 0 -6000 5000 \
    -gcp 0 20000 -6000 -5000 \
    -gcp 24000 0 6000 5000 \
    -gcp 24000 20000 6000 -5000 \
    BotW-Map-FULL.png BotW-Map-FULL.tiff

gdal2tiles.py --profile=mercator --xyz --zoom 13-18 --webviewer none \
    BotW-Map-FULL.tiff out



