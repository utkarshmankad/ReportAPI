"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";

export function ApiReferenceClient() {
  return (
    <ApiReferenceReact
      configuration={{
        url: "/openapi.yaml",
        theme: "purple",
        darkMode: true,
      }}
    />
  );
}
