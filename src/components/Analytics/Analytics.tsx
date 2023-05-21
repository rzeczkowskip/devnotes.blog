import Script from 'next/script';
import React from 'react';
import container from '../../../config/container';
import { Site } from '@/types/SiteConfig';

const Analytics = () => {
  const { params: { cfAnalyticsId } = {} } = container.get<Site>('params.site_config');

  if (!cfAnalyticsId) {
    return null;
  }

  return <Script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon={ JSON.stringify({ token: cfAnalyticsId }) }
  />;
};

export default Analytics;
