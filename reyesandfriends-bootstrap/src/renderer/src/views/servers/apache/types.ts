export type ApacheConfig = {
  domains: string;
  http: boolean;
  https: boolean;
  path: string;
  ssl: "certbot" | "snakeoil" | "custom";
  sslCustomCert?: string;
  sslCustomKey?: string;
  sslCustom?: string;
  redirect: boolean;
  isProxy: boolean;
  proxyTarget: string;
};
