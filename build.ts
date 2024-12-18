import { build } from "electron-builder";
import pkg from "./package.json";

build({
  config: {
    appId: `com.${pkg.name}.app`,
    productName: pkg.name.toLocaleUpperCase(),
    artifactName: "${productName}-${version}_${platform}_${arch}.${ext}",
    buildDependenciesFromSource: true,
    files: ["out/**/*"],
    directories: {
      output: "release/${version}",
    },
    mac: {
      target: ["dmg"],
      icon: "build/assets/icon.ico",
    },
    win: {
      icon: "build/assets/icon.png",
      target: [
        {
          target: "msi",
          arch: ["x64"],
        },
      ],
    },
    linux: {
      icon: "build/assets/icon.png",
      target: [
        {
          target: "AppImage",
        },
      ],
    },
    msi: {
      oneClick: true,
      perMachine: true,
      runAfterFinish: true,
    },
  },
});
