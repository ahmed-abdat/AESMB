import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Match Champions";
    const subtitle = searchParams.get("subtitle");
    const logosParam = searchParams.get("logos");
    const logos = logosParam ? JSON.parse(decodeURIComponent(logosParam)) : [];

    // Load the font
    const tajawalData = await fetch(
      new URL(
        "https://fonts.gstatic.com/s/tajawal/v9/Iurf6YBj_oCad4k1l4qkLrY.woff2"
      )
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#f8f9fa",
              opacity: 0.5,
              zIndex: 0,
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              zIndex: 1,
              padding: "40px",
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: 60,
                fontFamily: "Tajawal",
                fontWeight: 700,
                color: "#1a1a1a",
                margin: 0,
                lineHeight: 1.2,
                marginBottom: subtitle ? "20px" : "0",
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <h2
                style={{
                  fontSize: 32,
                  fontFamily: "Tajawal",
                  fontWeight: 500,
                  color: "#666666",
                  margin: 0,
                  marginBottom: "40px",
                }}
              >
                {subtitle}
              </h2>
            )}

            {/* Team Logos */}
            {logos.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "40px",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                {logos.map((logo: string, index: number) => (
                  <img
                    key={index}
                    src={logo}
                    alt={`Team ${index + 1}`}
                    width={120}
                    height={120}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Tajawal",
            data: tajawalData,
            style: "normal",
          },
        ],
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Type": "image/png",
        },
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
