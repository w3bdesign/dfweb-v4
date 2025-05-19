import React from "react";
import { Meta } from "@ladle/react";
import ProsjektCard from "@/components/Prosjekter/ProsjektCard.component";
import type { Project } from "@/types/sanity.types";
import "@/app/globals.css";

export default {
  title: "Prosjekter/ProsjektCard",
  component: ProsjektCard,
} as Meta;

// Mock project factory with sensible defaults
const project = (props = {}): Project => ({
  _id: "mock-project",
  _type: "project",
  _createdAt: "2023-01-01T00:00:00Z",
  _updatedAt: "2023-01-01T00:00:00Z",
  _rev: "rev1",
  name: "Sample Project",
  description: "This is a sample project description",
  subdescription: "Built with React, TypeScript, and Next.js",
  projectimage: {
    _type: "image",
    asset: {
      _ref: "image-1fbc6a91ed51fa9870504faf332f16823953d716-1207x614-png",
      _type: "reference",
    },
  },
  urlwww: [
    {
      _key: "link1",
      _type: "link",
      url: "https://example.com",
    },
  ],
  urlgithub: [
    {
      _key: "github1",
      _type: "link",
      url: "https://github.com/example/repo",
    },
  ],
  ...props,
});

// Story variants
export const Default = () => (
  <div className="max-w-lg mx-auto p-4">
    <ProsjektCard {...project()} />
  </div>
);

export const Featured = () => (
  <div className="max-w-lg mx-auto p-4">
    <ProsjektCard
      {...project({
        featured: true,
        name: "Featured Project",
        description: "Project with instant animation",
      })}
    />
  </div>
);

export const WebsiteOnly = () => (
  <div className="max-w-lg mx-auto p-4">
    <ProsjektCard
      {...project({
        urlgithub: undefined,
        name: "Website Only",
      })}
    />
  </div>
);

export const GitHubOnly = () => (
  <div className="max-w-lg mx-auto p-4">
    <ProsjektCard
      {...project({
        urlwww: undefined,
        name: "GitHub Only",
      })}
    />
  </div>
);

export const NoLinks = () => (
  <div className="max-w-lg mx-auto p-4">
    <ProsjektCard
      {...project({
        urlwww: undefined,
        urlgithub: undefined,
        name: "No Links Project",
      })}
    />
  </div>
);

export const Grid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
    <div className="max-w-lg mx-auto">
      <ProsjektCard {...project()} />
    </div>
    <div className="max-w-lg mx-auto">
      <ProsjektCard
        {...project({
          featured: true,
          name: "Featured Project",
          description: "Mobile app for iOS and Android",
        })}
      />
    </div>
    <div className="max-w-lg mx-auto">
      <ProsjektCard
        {...project({
          name: "Backend API",
          description: "Node.js & MongoDB service",
          urlwww: undefined,
        })}
      />
    </div>
  </div>
);
