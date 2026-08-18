import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface WalletQRCodeProps {
  data: string;
  imageSrc?: string;
  size?: number;
}

export const QRCodeGen: React.FC<WalletQRCodeProps> = ({
  data,
  imageSrc,
  size = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  const qrColor = "#000000";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous QR
    container.innerHTML = "";
    // Create new QRCode instance
    qrCodeRef.current = new QRCodeStyling({
      width: size,
      height: size,
      data,
      image: imageSrc,
      cornersDotOptions: {
        type: "extra-rounded",
        color: "#000000",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: qrColor,
      },
      dotsOptions: {
        color: qrColor,
        type: "dots", //"extra-rounded" | "square" | "dots" | "rounded" | "classy" | "classy-rounded"
      },
      backgroundOptions: {
        color: "transparent", // remove background color
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 4,
      },
      type: "svg",
    });

    // Append new QR code to DOM
    qrCodeRef.current.append(container);

    // Clean up on unmount
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [data, imageSrc, size]);

  return <div ref={containerRef} className="relative z-10" />;
};
