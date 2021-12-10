import { build, BuildOptions } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const config: BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
};

build({
  ...config,
  outfile: "dist/cjs/index.cjs.js",
  format: "cjs",
});

build({
  ...config,
  outfile: "dist/esm/index.esm.js",
  format: "esm",
});
