import type { Metadata } from "next";
import "./globals.css";

const assetBasePath =
  process.env.GITHUB_PAGES === "true"
    ? `/${process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "campaign-intelligence-demo"}`
    : "";

export const metadata: Metadata = {
  title: "Campaign Intelligence Demo",
  description: "将ChatGPT研究结果整理成Campaign时间轴、详情页与平台入口。",
  other: { "codex-preview": "development" },
  icons: {
    icon: `${assetBasePath}/favicon.svg`,
    shortcut: `${assetBasePath}/favicon.svg`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className="antialiased">{children}</body></html>;
}
