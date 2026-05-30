#!/usr/bin/env node

const path = require("node:path");
const esbuild = require("esbuild");

const projectRoot = path.join(__dirname, "..");

esbuild
  .build({
    entryPoints: [path.join(projectRoot, "practice-harness", "react-src", "App.jsx")],
    bundle: true,
    minify: false,
    sourcemap: false,
    format: "iife",
    target: ["es2022"],
    outfile: path.join(projectRoot, "practice-harness", "public", "practice-app.js"),
    jsx: "automatic",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
