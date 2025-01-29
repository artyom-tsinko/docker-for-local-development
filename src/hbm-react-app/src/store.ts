
export interface IHbmApp {
  name: string;
  host: string;
  port: string;
  localPort: string;
  devPort: string;
}

export enum KnownHbmApps {
  NodeApp = "node",
  DotNetApp = "dotnet",
  JavaApp = "java",
  PythonApp = "python"
}

export const hbmApps: { [key in KnownHbmApps]: IHbmApp } = {

  [KnownHbmApps.NodeApp]: {
    name: 'Node App',
    host: 'hbm-node-app',
    port: '3000',
    localPort: '8081',
    devPort: '9081'
  },

  [KnownHbmApps.DotNetApp]: {
    name: 'DotNet App',
    host: 'hbm-dotnet-app',
    port: '8080',
    localPort: '8082',
    devPort: '9082'
  },

  [KnownHbmApps.JavaApp]: {
    name: 'Java App',
    host: 'hbm-java-app',
    port: '8080',
    localPort: '8083',
    devPort: '9083'
  },

  [KnownHbmApps.PythonApp]: {
    name: 'Python App',
    host: 'hbm-python-app',
    port: '8080',
    localPort: '8084',
    devPort: '9084'
  },

};
