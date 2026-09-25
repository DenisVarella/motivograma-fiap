import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O navegador de verificação abre por 127.0.0.1; o dev server precisa aceitar essa origem.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
