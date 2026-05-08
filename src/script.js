import { createPlayground, compress, decompress } from 'livecodes';

const defaultConfig = {
  markup: {
    language: 'html',
    content: '<h1>Hello World</h1>',
  },
  style: {
    language: 'css',
    content: 'h1 { color: royalblue; font-family: system-ui; }',
  },
  script: {
    language: 'javascript',
    content: 'console.log("Hello from LiveCodes!");',
  },
};

function getConfigFromHash() {
  const hash = location.hash.slice(1);
  if (!hash) return defaultConfig;
  try {
    const decompressed = decompress(hash);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
  } catch {
    // invalid hash
  }
  return defaultConfig;
}

const config = getConfigFromHash();

const playground = await createPlayground('#playground', { config });

document.getElementById('shareBtn').addEventListener('click', async () => {
  const currentConfig = await playground.getConfig();
  const compressed = compress(JSON.stringify(currentConfig));

  const url = new URL(location.href);
  url.hash = compressed;

  try {
    await navigator.clipboard.writeText(url.href);
    document.getElementById('shareStatus').textContent = 'URL copied to clipboard!';
    setTimeout(() => {
      document.getElementById('shareStatus').textContent = '';
    }, 2000);
  } catch {
    document.getElementById('shareStatus').textContent = 'Copy failed. URL: ' + url.href;
  }
});
