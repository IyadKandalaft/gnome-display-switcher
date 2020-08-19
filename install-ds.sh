#!/bin/bash

#
# This scripts install an display switching extension for Gnome 
# Shell 3.36+
#
# https://github.com/iyadkandalaft/gnome-display-switcher/
# Created by: Lucas Diedrich
# Maintained by: Iyad Kandalaft
#

clear
#
# Variables
#
v_extfolder=~/.local/share/gnome-shell/extensions/
v_file="display-switcher-latest.tar.gz"

#
# Install Area
#

cd /tmp

echo "Downloading zip file..."
wget -O $v_file https://github.com/iyadkandalaft/gnome-display-switcher/master.zip

echo "Extracting extension..."
unzip $v_file
mv gnome-display-switcher-master/display-switcher@iyadk.com $v_extfolder

echo "Creating extensions directory if it doesn't exist"
[[ -d $v_extfolder ]] || mkdir -p $v_extfolder

echo "Cleaning up temporary files"
rm -f $v_file gnome-display-switcher-master/

echo "Done!"
