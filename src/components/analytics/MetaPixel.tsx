"use client"

import Script from "next/script"
import React from "react"

const DEFAULT_META_PIXEL_ID = "1826423055376624"

interface MetaPixelProps {
  pixelId?: string | null
}

export function MetaPixel({ pixelId }: MetaPixelProps) {
  const activePixelId = (pixelId && pixelId.trim() !== "") ? pixelId.trim() : DEFAULT_META_PIXEL_ID

  return (
    <>
      <Script
        id={`meta-pixel-${activePixelId}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${activePixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${activePixelId}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
    </>
  )
}
