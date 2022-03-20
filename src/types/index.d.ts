interface GiteaConfig {
  url: string;
  owner: string;
  repo: string;
  token: string;
  path?: string;
}


interface RemoveFile {
    fileName: string;
    width: number;
    height: number;
    extname: number;
    imgUrl: string;
    type: string;
    id: string;
}