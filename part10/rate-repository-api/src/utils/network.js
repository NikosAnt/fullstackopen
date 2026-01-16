import os from 'os';

export const getLanIPv4 = () => {
  const interfaces = os.networkInterfaces();

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries ?? []) {
      const isIpv4 = entry.family === 'IPv4' || entry.family === 4;
      if (isIpv4 && !entry.internal) {
        return entry.address;
      }
    }
  }

  return null;
};
