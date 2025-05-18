import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Time from "./Time";

const meta = {
  title: "Time",
  component: Time,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {};
