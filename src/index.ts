import PicGo from "picgo";
const nodeUrl = require("url");
const nodePath = require("path");

const UPLOADER_NAME = "gitea";
const PLUGIN_NAME = "Gitea Img";
const GITEA_CONFIG_NAME = `picBed.${UPLOADER_NAME}`;

const getHeaders = function (token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "User-Agent": "PicGo",
  };
};

const parseOptions = (
  method: string,
  url: string,
  headers: any,
  body: object = {}
) => {
  return {
    method: method,
    url: url,
    headers: headers,
    body: body,
    json: true,
    strictSSL: false,
  };
};

const parseUrl = (config: GiteaConfig, fileName: string) => {
  const { url, owner, repo, path } = config;
  const myUrl = new nodeUrl.URL(url);
  myUrl.pathname = nodePath.join(
    "/api/v1/repos",
    owner,
    repo,
    "contents",
    path,
    encodeURI(fileName)
  );
  return myUrl.toString();
};

const uploaderHandle = async (ctx: PicGo) => {
  const config: GiteaConfig = ctx.getConfig(GITEA_CONFIG_NAME);
  if (!config) {
    throw new Error("Can't find gitea config");
  }
  try {
    const imgList = ctx.output;
    for (const img of imgList) {
      if (img.fileName && img.buffer) {
        const base64Image =
          img.base64Image || Buffer.from(img.buffer).toString("base64");
        const options = parseOptions(
          "POST",
          parseUrl(config, img.fileName),
          getHeaders(config.token),
          {
            content: base64Image,
          }
        );
        const body = await ctx.request(options);
        if (body) {
          delete img.base64Image;
          delete img.buffer;
          img.imgUrl = body.content.download_url;
        } else {
          throw new Error("Server error, please try again");
        }
      }
    }
    return ctx;
  } catch (err) {
    ctx.log.error(JSON.stringify(err));
    ctx.emit("notification", {
      title: "Upload Failed",
      body: JSON.stringify(err),
    });
    throw err;
  }
};

const getFileSha = async function (
  ctx: PicGo,
  config: GiteaConfig,
  fileName: string
) {
  const opts = parseOptions(
    "GET",
    parseUrl(config, fileName),
    getHeaders(config.token)
  );
  let file_sha = "";
  const body = await ctx.request(opts).catch((e) => {
    ctx.log.error(e);
  });
  if (body) {
    file_sha = body.sha;
  } else {
    throw new Error("Server error, please try again");
  }
  return file_sha;
};

const config = (ctx: PicGo) => {
  let config: GiteaConfig = ctx.getConfig(GITEA_CONFIG_NAME);
  if (!config) {
    config = {
      url: "",
      owner: "",
      repo: "",
      token: "",
      path: "",
    };
  }
  return [
    {
      name: "url",
      type: "input",
      default: config.url,
      required: true,
      message: "example: https://try.gitea.io",
      alias: "URL",
    },
    {
      name: "owner",
      type: "input",
      default: config.owner,
      required: true,
      message: "username",
      alias: "Username",
    },
    {
      name: "repo",
      type: "input",
      default: config.repo,
      required: true,
      message: "repo",
      alias: "Repository",
    },
    {
      name: "token",
      type: "input",
      default: config.token,
      required: true,
      message: "token.",
      alias: "Token",
    },
    {
      name: "path",
      type: "input",
      default: config.path,
      required: false,
      message: "example: img/",
      alias: "Path",
    },
  ];
};

const onRemove = async function (ctx: PicGo, files: RemoveFile[], guiApi) {
  const rm_files = files.filter((each) => each.type === UPLOADER_NAME);
  if (rm_files.length === 0) {
    return;
  }
  const config: GiteaConfig = ctx.getConfig(GITEA_CONFIG_NAME);

  const fail = [];
  for (let i = 0; i < rm_files.length; i++) {
    const fileName = rm_files[i].fileName;
    const sha = await getFileSha(ctx, config, fileName);
    const opts = parseOptions(
      "DELETE",
      parseUrl(config, fileName),
      getHeaders(config.token),
      {
        sha: sha,
      }
    );
    await ctx.request(opts).catch((e) => {
      ctx.log.error(e);
      fail.push(fileName);
    });
  }

  ctx.emit("notification", {
    title: "Delete Notification",
    body: fail.length === 0 ? "Success" : `${fail.length} Failed`,
  });
};

export = (ctx: PicGo) => {
  const register = () => {
    ctx.helper.uploader.register(UPLOADER_NAME, {
      handle: uploaderHandle,
      name: PLUGIN_NAME,
      config: config,
    });
    ctx.on("remove", (files, guiApi) => onRemove(ctx, files, guiApi));
  };

  return {
    uploader: UPLOADER_NAME,
    register,
  };
};
