import {BackgroundTask} from "../interface/background-task";

export const BackgroundTaskDefaultImpl: BackgroundTask = {
  setTimeout: window.setTimeout.bind(window),
  setInterval: window.setInterval.bind(window),
  clearTimeout: window.clearTimeout.bind(window),
  clearInterval: window.clearInterval.bind(window),
};

