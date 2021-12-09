import { build, BuildOptions } from "esbuild";
import { dependencies } from "../package.json";

const config: BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  external: Object.keys(dependencies),
};

build({
  ...config,
  outfile: "dist/index.js",
});

build({
  ...config,
  outfile: "dist/index.esm.js",
  format: "esm",
});
