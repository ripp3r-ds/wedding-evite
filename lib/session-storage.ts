export function readSessionValue(key: string) {
  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    console.error(`Unable to read session value "${key}".`, error);
    return null;
  }
}

export function writeSessionValue(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch (error) {
    console.error(`Unable to save session value "${key}".`, error);
  }
}

export function removeSessionValue(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Unable to remove session value "${key}".`, error);
  }
}
