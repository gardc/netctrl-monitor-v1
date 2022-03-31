# Argument: local, dev or prod
# depending on which API server to use.

$Env:devmode = $args[0]
if ($Env:devmode -eq "dev")
{
    wails dev -ldflags="-X 'netctrl.io/monitor/networking/remote.APIBaseURL=https://dev.netctrl.io'"
} elseif ($Env:devmode -eq "local") {
    wails dev -ldflags="-X 'netctrl.io/monitor/networking/remote.APIBaseURL=http://localhost:3000'"
} else {
    wails dev -ldflags="-X 'netctrl.io/monitor/networking/remote.APIBaseURL=https://netctrl.io'"
}
