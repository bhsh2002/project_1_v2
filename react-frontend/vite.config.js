import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    // port: 5173,
    // https: {
    //   key: fs.readFileSync('./192.168.188.245+1-key.pem'),
    //   cert: fs.readFileSync('./192.168.188.245+1.pem'),
    // }
  }
})
