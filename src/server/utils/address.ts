import os from 'os';

export const getLanIPAddress = (): string => {
  const networkInterfaces = os.networkInterfaces();
  let lanIP = 'localhost';
  let fallbackIP = '';

  const isPrivateNetwork = (ip: string): boolean => {
    const parts = ip.split('.').map(Number);
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    return false;
  };

  const isAPIPA = (ip: string): boolean => {
    const parts = ip.split('.').map(Number);
    return parts[0] === 169 && parts[1] === 254;
  };

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    if (interfaces) {
      for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          if (isPrivateNetwork(iface.address)) {
            lanIP = iface.address;
            break;
          } else if (!isAPIPA(iface.address) && !fallbackIP) {
            fallbackIP = iface.address;
          } else if (isAPIPA(iface.address) && !fallbackIP) {
            fallbackIP = iface.address;
          }
        }
      }
      if (lanIP !== 'localhost') break;
    }
  }

  if (lanIP === 'localhost' && fallbackIP) {
    lanIP = fallbackIP;
  }

  return lanIP;
};
