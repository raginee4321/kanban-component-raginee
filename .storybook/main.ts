import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [], // no need to manually add built-in addons in v10
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
