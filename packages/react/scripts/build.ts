import { build, BuildOptions } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const config: BuildOptions = {
  entryPoints: ["src/hooks.ts"],
  bundle: true,
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
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
