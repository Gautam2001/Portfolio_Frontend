let backendDown = false;

export const setBackendDown = (value) => {
  backendDown = value;
};

export const isBackendDown = () => backendDown;
