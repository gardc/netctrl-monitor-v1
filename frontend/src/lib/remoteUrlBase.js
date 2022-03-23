const remote_env = process.env.REACT_APP_NETCTRL_REMOTE_URL;

export default function remoteUrlBase() {
  return remote_env;
}
