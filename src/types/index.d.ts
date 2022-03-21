interface GiteaConfig {
  url: string;
  owner: string;
  repo: string;
  token: string;
  ignoreCertErr?: boolean;
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