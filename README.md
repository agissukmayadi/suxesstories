# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## CORS Issues

If you encounter CORS (Cross-Origin Resource Sharing) issues while accessing the application locally, you can disable the CORS policy temporarily in your browser. Below are the instructions for doing this in **Chromium** and **Google Chrome** on **Windows** and **Linux**.

### Disabling CORS in Chromium on Windows

1. **Close** all running Chromium windows.

2. **Open Command Prompt** (press `Windows + R`, type `cmd`, and hit Enter).

3. Run the following command in Command Prompt to launch Chrome with CORS disabled:

   ```bash
   start chrome --disable-web-security --user-data-dir="C:\chrome_dev"

### Disabling CORS in Chromium on Linux 

1.  Run the following command in Command Prompt to launch Chromium with CORS disabled:

   ```bash
   chromium --disable-web-security --user-data-dir="/tmp/ChromiumDevSession"
