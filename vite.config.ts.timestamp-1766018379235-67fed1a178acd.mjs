// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import { writeFileSync } from "fs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "copy-htaccess",
      closeBundle() {
        const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Redirect all requests to HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Handle Authorization Header
  RewriteCond %{HTTP:Authorization} .
  RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Rewrite everything else to index.html to allow html5 state links
  RewriteRule ^ index.html [L]
</IfModule>

# Disable directory browsing
Options -Indexes

# Set default charset
AddDefaultCharset UTF-8

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Set proper MIME types
<IfModule mod_mime.c>
  AddType application/javascript js
  AddType text/css css
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>`;
        writeFileSync(resolve(__vite_injected_original_dirname, "dist/.htaccess"), htaccessContent);
      }
    }
  ],
  base: "./",
  // Para rutas relativas en Hostinger
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    // Desactivar sourcemaps para producción
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["chart.js", "react-chartjs-2"],
          icons: ["lucide-react"]
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  server: {
    port: 5173,
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyB3cml0ZUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAge1xuICAgICAgbmFtZTogJ2NvcHktaHRhY2Nlc3MnLFxuICAgICAgY2xvc2VCdW5kbGUoKSB7XG4gICAgICAgIGNvbnN0IGh0YWNjZXNzQ29udGVudCA9IGA8SWZNb2R1bGUgbW9kX3Jld3JpdGUuYz5cbiAgUmV3cml0ZUVuZ2luZSBPblxuICBSZXdyaXRlQmFzZSAvXG5cbiAgIyBSZWRpcmVjdCBhbGwgcmVxdWVzdHMgdG8gSFRUUFNcbiAgUmV3cml0ZUNvbmQgJXtIVFRQU30gb2ZmXG4gIFJld3JpdGVSdWxlIF4oLiopJCBodHRwczovLyV7SFRUUF9IT1NUfSV7UkVRVUVTVF9VUkl9IFtMLFI9MzAxXVxuXG4gICMgSGFuZGxlIEF1dGhvcml6YXRpb24gSGVhZGVyXG4gIFJld3JpdGVDb25kICV7SFRUUDpBdXRob3JpemF0aW9ufSAuXG4gIFJld3JpdGVSdWxlIC4qIC0gW0U9SFRUUF9BVVRIT1JJWkFUSU9OOiV7SFRUUDpBdXRob3JpemF0aW9ufV1cblxuICAjIERvbid0IHJld3JpdGUgZmlsZXMgb3IgZGlyZWN0b3JpZXNcbiAgUmV3cml0ZUNvbmQgJXtSRVFVRVNUX0ZJTEVOQU1FfSAtZiBbT1JdXG4gIFJld3JpdGVDb25kICV7UkVRVUVTVF9GSUxFTkFNRX0gLWRcbiAgUmV3cml0ZVJ1bGUgXiAtIFtMXVxuXG4gICMgUmV3cml0ZSBldmVyeXRoaW5nIGVsc2UgdG8gaW5kZXguaHRtbCB0byBhbGxvdyBodG1sNSBzdGF0ZSBsaW5rc1xuICBSZXdyaXRlUnVsZSBeIGluZGV4Lmh0bWwgW0xdXG48L0lmTW9kdWxlPlxuXG4jIERpc2FibGUgZGlyZWN0b3J5IGJyb3dzaW5nXG5PcHRpb25zIC1JbmRleGVzXG5cbiMgU2V0IGRlZmF1bHQgY2hhcnNldFxuQWRkRGVmYXVsdENoYXJzZXQgVVRGLThcblxuIyBDb21wcmVzc2lvblxuPElmTW9kdWxlIG1vZF9kZWZsYXRlLmM+XG4gIEFkZE91dHB1dEZpbHRlckJ5VHlwZSBERUZMQVRFIHRleHQvaHRtbCB0ZXh0L3BsYWluIHRleHQveG1sIHRleHQvY3NzIHRleHQvamF2YXNjcmlwdCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0IGFwcGxpY2F0aW9uL2pzb25cbjwvSWZNb2R1bGU+XG5cbiMgQ2FjaGUgY29udHJvbFxuPElmTW9kdWxlIG1vZF9leHBpcmVzLmM+XG4gIEV4cGlyZXNBY3RpdmUgT25cbiAgRXhwaXJlc0J5VHlwZSBpbWFnZS9qcGcgXCJhY2Nlc3MgcGx1cyAxIHllYXJcIlxuICBFeHBpcmVzQnlUeXBlIGltYWdlL2pwZWcgXCJhY2Nlc3MgcGx1cyAxIHllYXJcIlxuICBFeHBpcmVzQnlUeXBlIGltYWdlL2dpZiBcImFjY2VzcyBwbHVzIDEgeWVhclwiXG4gIEV4cGlyZXNCeVR5cGUgaW1hZ2UvcG5nIFwiYWNjZXNzIHBsdXMgMSB5ZWFyXCJcbiAgRXhwaXJlc0J5VHlwZSBpbWFnZS9zdmcreG1sIFwiYWNjZXNzIHBsdXMgMSB5ZWFyXCJcbiAgRXhwaXJlc0J5VHlwZSB0ZXh0L2NzcyBcImFjY2VzcyBwbHVzIDEgbW9udGhcIlxuICBFeHBpcmVzQnlUeXBlIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQgXCJhY2Nlc3MgcGx1cyAxIG1vbnRoXCJcbiAgRXhwaXJlc0J5VHlwZSB0ZXh0L2phdmFzY3JpcHQgXCJhY2Nlc3MgcGx1cyAxIG1vbnRoXCJcbjwvSWZNb2R1bGU+XG5cbiMgU2V0IHByb3BlciBNSU1FIHR5cGVzXG48SWZNb2R1bGUgbW9kX21pbWUuYz5cbiAgQWRkVHlwZSBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0IGpzXG4gIEFkZFR5cGUgdGV4dC9jc3MgY3NzXG48L0lmTW9kdWxlPlxuXG4jIFNlY3VyaXR5IGhlYWRlcnNcbjxJZk1vZHVsZSBtb2RfaGVhZGVycy5jPlxuICBIZWFkZXIgc2V0IFgtQ29udGVudC1UeXBlLU9wdGlvbnMgXCJub3NuaWZmXCJcbiAgSGVhZGVyIHNldCBYLUZyYW1lLU9wdGlvbnMgXCJTQU1FT1JJR0lOXCJcbiAgSGVhZGVyIHNldCBYLVhTUy1Qcm90ZWN0aW9uIFwiMTsgbW9kZT1ibG9ja1wiXG48L0lmTW9kdWxlPmA7XG4gICAgICAgIHdyaXRlRmlsZVN5bmMocmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0Ly5odGFjY2VzcycpLCBodGFjY2Vzc0NvbnRlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgXSxcbiAgYmFzZTogJy4vJywgLy8gUGFyYSBydXRhcyByZWxhdGl2YXMgZW4gSG9zdGluZ2VyXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLCAvLyBEZXNhY3RpdmFyIHNvdXJjZW1hcHMgcGFyYSBwcm9kdWNjaVx1MDBGM25cbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgIGNoYXJ0czogWydjaGFydC5qcycsICdyZWFjdC1jaGFydGpzLTInXSxcbiAgICAgICAgICBpY29uczogWydsdWNpZGUtcmVhY3QnXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIGhvc3Q6IHRydWVcbiAgfVxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxlQUFlO0FBSHhCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixjQUFjO0FBQ1osY0FBTSxrQkFBa0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBeUR4QixzQkFBYyxRQUFRLGtDQUFXLGdCQUFnQixHQUFHLGVBQWU7QUFBQSxNQUNyRTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUE7QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxZQUFZLGlCQUFpQjtBQUFBLFVBQ3RDLE9BQU8sQ0FBQyxjQUFjO0FBQUEsUUFDeEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
