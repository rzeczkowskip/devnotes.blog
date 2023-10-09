import Script from 'next/script';
import React from 'react';

type CloudflareAnalyticsProps = {
  isProd: boolean;
  token?: string;
};

const CloudflareAnalytics: React.FC<CloudflareAnalyticsProps> = ({
  isProd,
  token,
}) => {
  if (!isProd || !token) {
    return null;
  }

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
};

export default CloudflareAnalytics;
