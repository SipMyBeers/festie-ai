# Mac Mini Setup — Ollama AI Server

This guide sets up the Mac Mini as a self-hosted AI server for the Festie SMS bot.

## Requirements
- Mac Mini M4 (or any Apple Silicon Mac)
- Internet connection (WiFi or Ethernet)
- Power supply (keep plugged in 24/7)

## 1. Install Ollama

```bash
brew install ollama
```

## 2. Pull the Gemma Model

```bash
ollama pull gemma3:4b
```

This downloads ~3.3GB. Takes a few minutes on good internet.

## 3. Start Ollama

```bash
ollama serve
```

Ollama runs on `http://localhost:11434` by default.

## 4. Test It

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "gemma3:4b",
  "messages": [{"role": "user", "content": "hello"}],
  "stream": false
}'
```

You should get a JSON response with the model's reply.

## 5. Install Cloudflare Tunnel

This makes your Mac Mini accessible from the internet without port forwarding.

```bash
brew install cloudflared
```

## 6. Create Tunnel

```bash
cloudflared tunnel --url http://localhost:11434
```

This outputs a URL like `https://random-words.trycloudflare.com`. Copy this URL — it's your `OLLAMA_URL` for the Vercel environment variables.

**Note:** Free quick tunnels generate a random URL each time. For a persistent URL, create a named tunnel:

```bash
cloudflared tunnel login
cloudflared tunnel create festie-ai
cloudflared tunnel route dns festie-ai ai.festie.ai
cloudflared tunnel run festie-ai --url http://localhost:11434
```

## 7. Make Everything Auto-Start on Boot

### Auto-start Ollama

Create `~/Library/LaunchAgents/com.ollama.serve.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.serve</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

Load it:
```bash
launchctl load ~/Library/LaunchAgents/com.ollama.serve.plist
```

### Auto-start Cloudflare Tunnel

Create `~/Library/LaunchAgents/com.cloudflared.tunnel.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cloudflared.tunnel</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/cloudflared</string>
        <string>tunnel</string>
        <string>run</string>
        <string>festie-ai</string>
        <string>--url</string>
        <string>http://localhost:11434</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

Load it:
```bash
launchctl load ~/Library/LaunchAgents/com.cloudflared.tunnel.plist
```

## 8. Mac Mini System Settings

- **System Settings → Energy:** Set "Prevent automatic sleeping" ON
- **System Settings → Energy:** Set "Start up automatically after a power failure" ON
- **System Settings → General → Login Items:** Verify Ollama and cloudflared appear

## 9. Verify Everything Works

After reboot:
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Check tunnel is running
curl https://your-tunnel-url.trycloudflare.com/api/tags
```

Both should return a JSON list of models.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Ollama not responding | `brew services restart ollama` or `ollama serve` |
| Tunnel URL changed | Re-run `cloudflared tunnel` and update Vercel env var |
| Model not found | `ollama pull gemma3:4b` |
| Slow responses | Check WiFi signal, consider Ethernet |
| Mac went to sleep | System Settings → Energy → disable sleep |
