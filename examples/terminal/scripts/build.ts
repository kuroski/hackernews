import { build, BuildOptions } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const config: BuildOptions = {
  entryPoints: ["src/index.ts", "src/cli.ts"],
  outdir: "lib",
  bundle: true,
  platform: "node",
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
};

build({
  ...config,
}).catch(() => process.exit(1));

build({
  ...config,
  format: "esm",
  entryNames: "[dir]/[name].esm",
}).catch(() => process.exit(1));
