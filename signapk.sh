#!/bin/bash

APK=build-1700332182730
KEY=cs-release-key.jks
zipalign -v -p 4 $APK.apk $APK-aligned.apk
apksigner sign --ks $KEY --out $APK-release.apk $APK-aligned.apk
