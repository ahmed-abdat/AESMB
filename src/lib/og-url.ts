export function getOgImageUrl(title: string, subtitle?: string, logos?: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const url = new URL('/api/og', baseUrl);
    url.searchParams.set('title', title);
    if (subtitle) {
      url.searchParams.set('subtitle', subtitle);
    }
    if (logos && logos.length > 0) {
      url.searchParams.set('logos', encodeURIComponent(JSON.stringify(logos)));
    }
    return url.toString();
  } catch (error) {
    console.error('Error generating OG image URL:', error);
    return `${baseUrl}/logo.jpg`;
  }
} 