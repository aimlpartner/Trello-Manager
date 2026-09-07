'use client';

import React, { useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useMounted } from '@/hooks/useMounted';
import { Download, CheckCircle2, Loader2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const isMounted = useMounted();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [status, setStatus] = useState<'idle' | 'installing' | 'done'>('idle');

  // Avoid hydration mismatch by waiting until component mounts on client
  if (!isMounted) {
    return null;
  }

  // If already installed and running in standalone mode, show subtle active badge
  if (isInstalled) {
    return (
      <div
        className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
        title="Running as an installed PWA"
      >
        <CheckCircle2 className="h-3 w-3" />
        <span>PWA Active</span>
      </div>
    );
  }

  const triggerDesktopDownload = () => {
    if (typeof window === 'undefined') return;

    const currentUrl = window.location.href;
    const origin = window.location.origin;

    // Standalone Desktop App Launcher HTML
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BrandToPost Command Center</title>
  <style>
    body {
      background-color: #090D16;
      color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #0F172A;
      border: 1px solid #1E293B;
      padding: 32px 28px;
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      max-width: 440px;
      width: 100%;
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #2563EB, #4F46E5);
      color: white;
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 18px;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 10px;
      color: #FFFFFF;
    }
    p {
      color: #94A3B8;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 24px;
    }
    .btn {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 12px 20px;
      background: #2563EB;
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      transition: background 0.15s;
    }
    .btn:hover {
      background: #1D4ED8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">BP</div>
    <h1>Launching BrandToPost...</h1>
    <p>Opening your executive product command center workspace.</p>
    <a class="btn" href="${currentUrl}" target="_self">Click to Open BrandToPost</a>
  </div>
  <script>
    // Automatically redirect into the active workspace
    window.location.replace("${currentUrl}");
  </script>
</body>
</html>`;

    // Download Desktop HTML Launcher
    const blobHtml = new Blob([htmlContent], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(blobHtml);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'BrandToPost-App.html';
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);
    setTimeout(() => {
      URL.revokeObjectURL(htmlUrl);
    }, 2000);
  };

  const handleInstallClick = async () => {
    setStatus('installing');

    try {
      if (isInstallable) {
        // Trigger native browser install prompt directly (zero instructions)
        await install();
      } else {
        // Direct download of the desktop application launcher right away
        triggerDesktopDownload();
      }
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      // Fallback: download directly
      triggerDesktopDownload();
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      disabled={status === 'installing'}
      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all"
      title="Install / Download BrandToPost directly"
    >
      {status === 'installing' ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Installing...</span>
        </>
      ) : status === 'done' ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </>
      )}
    </button>
  );
};
