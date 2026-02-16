# HA Auto Refresh

**HA Auto Refresh** is a script for Home Assistant that automatically detects and clicks the "Refresh" toast notification.

This is particularly useful for **wall-mounted tablets, kiosks, and dedicated kiosk setups**. When changing the UI (e.g., YAML configuration), Home Assistant displays a toast requiring a manual refresh. This script handles it automatically.

## 🚀 Features

- **Zero-Config (by default):** Works out of the box after being added as custom resource.
- **Fast**: Reacts so quickly that the user doesn't even notice.
- **Conditional Loading:** Can be configured to only run when a specific URL parameter is present (e.g., `?kiosk=true`).

## 📥 Installation

### 1. Download

Download `ha-auto-refresh.js` file from the [Releases][github-releases] page:

- `ha-auto-refresh.js`: Use this if you want the script to run always.
- `ha-auto-refresh-kiosk.js`: Use this if you want the script to run _only_ when the query parameter `?kiosk` is present in the URL.

### 2. Upload to Home Assistant

Upload the selected file to your Home Assistant `config/www/` folder as `ha-auto-refresh.js`.

### 3. Add Resource

Go to **Settings** > **Dashboards** > **... (Top Right)** > **Resources** and add the following:

- **URL:** `/local/ha-auto-refresh.js`
- **Resource Type:** JavaScript Module

Once installed, the script runs automatically. When Home Assistant prompts a "Refresh" toast, the script clicks it instantly, making the interaction invisible.

## ⚙️ Development

This project uses TypeScript and Vite.

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Build with Query Parameter Requirement

To enforce a required URL parameter (e.g., `?kiosk`) for the script to load:

```bash
# Linux / Mac
VITE_REQUIRED_QUERY_PARAM=kiosk npm run build

# Windows (PowerShell)
$env:VITE_REQUIRED_QUERY_PARAM="kiosk"; npm run build
```

## 📝 TODO

- **Internationalization:** Currently, the script relies on the English "Refresh" string. The build process needs to be updated to automatically fetch translation files from the Home Assistant frontend repository and bundle all language strings.

## 🙏 Contributing

Since the Home Assistant frontend changes frequently, please file an issue if you encounter any problems, including your HA version and console logs. Contributions and Pull Requests are highly welcome!

## 🤝 Support

If you have any questions, need assistance, or wish to share your ideas,
please use [GitHub Discussions][github-discussions].

Professional support by [Czetech] is also available at <hello@cze.tech>.

## 📜 Source Code

The source code is available at [GitHub][github-source].

[github-discussions]: https://github.com/czetech/ha-auto-refresh/discussions
[github-releases]: https://github.com/czetech/ha-auto-refresh/releases
[github-source]: https://github.com/czetech/ha-auto-refresh/tree/main
