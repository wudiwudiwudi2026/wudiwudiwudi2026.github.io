import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { cpSync, mkdirSync } from 'node:fs';

const copyHardwareDownloads = () => ({
  name: 'copy-hardware-downloads',
  closeBundle() {
    const destination = resolve(process.cwd(), 'dist/hardware/downloads');
    mkdirSync(destination, { recursive: true });
    cpSync(resolve(process.cwd(), 'hardware/downloads'), destination, { recursive: true });
  },
});

export default defineConfig({
  plugins: [copyHardwareDownloads()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        hardware: resolve(process.cwd(), 'hardware/index.html'),
      },
      // These bare imports are intentionally resolved by index.html's import map.
      external: (id) => id === 'three' || id.startsWith('three/addons/'),
    },
  },
});
