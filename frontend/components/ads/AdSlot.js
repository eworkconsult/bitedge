'use client';

import React, { useEffect, useRef } from 'react';

const AdSlot = ({ adCode }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current || !adCode) {
      return;
    }

    // Clear previous ad content
    adRef.current.innerHTML = '';

    // Create a temporary container to parse the ad code string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = adCode;

    // Separate script tags from other HTML content
    const scripts = Array.from(tempDiv.getElementsByTagName('script'));
    const nonScriptHtml = adCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Set the non-script HTML content
    adRef.current.innerHTML = nonScriptHtml;

    // Append and execute scripts
    scripts.forEach(script => {
      const newScript = document.createElement('script');

      // Copy attributes (src, async, etc.)
      for (let i = 0; i < script.attributes.length; i++) {
        const attr = script.attributes[i];
        newScript.setAttribute(attr.name, attr.value);
      }

      // Copy inline script content
      if (script.innerHTML) {
        newScript.innerHTML = script.innerHTML;
      }

      adRef.current.appendChild(newScript);
    });

    // Cleanup function to remove scripts when component unmounts
    return () => {
        if (adRef.current) {
            adRef.current.innerHTML = '';
        }
    };

  }, [adCode]); // Rerun effect if the ad code changes

  // The key is important to force a re-render if multiple AdSlots are used
  // with different ad codes, ensuring the useEffect runs correctly for each.
  return <div ref={adRef} className="ad-slot-container" />;
};

export default AdSlot;
