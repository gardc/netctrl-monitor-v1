echo "building on AMD64"
wails build -platform darwin/amd64 -clean -ldflags "-s -w"
echo "Signing Package"
gon -log-level=info ./build/darwin/gon-sign.json
echo "Zipping Package"
ditto -c -k --keepParent ./build/bin/Monitor.app ./monitor-darwin-amd64.zip
echo "Cleaning up"
rm -rf ./build/bin/NetCTRL-Monitor.app
echo "building on ARM64"
wails build -platform darwin/arm64 -clean -ldflags "-s -w"
echo "Signing Package"
gon -log-level=info -log-json ./build/darwin/gon-sign.json
echo "Zipping Package"
ditto -c -k --keepParent ./build/bin/Monitor.app ./monitor-darwin-arm64.zip
echo "Cleaning up"
rm -rf ./build/bin/Monitor.app
echo "Notarizing Zip Files"
gon -log-level=info ./build/darwin/gon-notarize.json