import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ??
  "campaign-intelligence-demo";
const githubPagesBasePath = isGitHubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: githubPagesBasePath,
        assetPrefix: githubPagesBasePath,
        trailingSlash: true,
        images: { unoptimized: true },
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
