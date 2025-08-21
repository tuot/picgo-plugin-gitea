# picgo-plugin-gitea

[![npm version](https://img.shields.io/npm/v/picgo-plugin-gitea.svg)](https://www.npmjs.com/package/picgo-plugin-gitea)
[![npm license](https://img.shields.io/npm/l/picgo-plugin-gitea.svg)](https://github.com/tuot/picgo-plugin-gitea/blob/master/License)

A [PicGo](https://github.com/Molunerfinn/PicGo) plugin for uploading images to a [Gitea](https://gitea.io) repository.

## Installation

1.  Open PicGo's main window.
2.  Go to the `Plugin` section.
3.  Search for `gitea` and install this plugin.
4.  Restart PicGo.

## Configuration

Configure the plugin in the `Uploader` section of PicGo.

| Name                | Description                                                                                                | Required |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | -------- |
| **URL**             | The URL of your Gitea instance. Example: `https://try.gitea.io`                                            | Yes      |
| **Username**        | The owner of the repository (your Gitea username or an organization).                                      | Yes      |
| **Repository**      | The name of the repository to store the images.                                                            | Yes      |
| **Token**           | A Gitea [Personal Access Token](https://docs.gitea.io/en-us/development/api-guide/#authentication) with `write` access to the repository. | Yes      |
| **Path**            | The path within the repository to save the images. Supports date variables like `{YYYY}/{M}/{D}`. Example: `images/` | No       |
| **Ignore Cert Error** | Set to `true` to ignore self-signed certificate errors, for example if your Gitea instance uses a self-signed SSL certificate. | Yes      |

## License

[MIT](https://github.com/tuot/picgo-plugin-gitea/blob/master/License)