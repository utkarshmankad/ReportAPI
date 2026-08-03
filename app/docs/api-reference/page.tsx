import type { Metadata } from "next";
import { ApiReferenceClient } from "./ApiReferenceClient";

export const metadata: Metadata = {
  title: "API Reference — ReportAPI",
  description: "Interactive API reference for the endpoints that are live today, generated from our OpenAPI spec.",
};

export default function ApiReferencePage() {
  return <ApiReferenceClient />;
}
