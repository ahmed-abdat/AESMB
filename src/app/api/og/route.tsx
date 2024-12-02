import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { Inter } from "next/font/google";

export const runtime = "edge";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

const LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/marketplace-37e56.appspot.com/o/logo.jpg?alt=media&token=40434c2f-2d64-49d3-b808-299eef508ea7";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Match Champions";
    const subtitle = searchParams.get("subtitle") || "";
    const logosParam = searchParams.get("logos");
    const logos = logosParam ? JSON.parse(decodeURIComponent(logosParam)) : [];
    const type = searchParams.get("type") || "default"; // Can be 'default', 'match', 'standings', etc.

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
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            position: "relative",
            fontFamily: inter.style.fontFamily,
            overflow: "hidden",
          }}
        >
          {/* Decorative Elements */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              height: "8px",
              background: "linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "0",
              backgroundImage:
                "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)",
              backgroundSize: "50px 50px",
              opacity: 0.5,
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "60px",
              position: "relative",
              zIndex: 10,
              width: "100%",
              height: "100%",
            }}
          >
            {/* Logo */}
            <div
              style={{
                position: "absolute",
                top: "40px",
                left: "40px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <img
                src={LOGO_URL}
                alt="Match Champions Logo"
                width={48}
                height={48}
                style={{
                  borderRadius: "12px",
                }}
              />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#fff",
                  opacity: 0.9,
                }}
              >
                Match Champions
              </span>
            </div>

            {/* Main Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                maxWidth: "80%",
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #fff 0%, #E2E8F0 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: 1.2,
                  textAlign: "center",
                  marginBottom: subtitle ? "0" : "24px",
                }}
              >
                {title}
              </div>

              {/* Subtitle */}
              {subtitle && (
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: "#94A3B8",
                    marginBottom: "24px",
                  }}
                >
                  {subtitle}
                </div>
              )}

              {/* Team Logos */}
              {logos.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "40px",
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "24px 48px",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {logos.map((logo: string, index: number) => (
                    <div
                      key={index}
                      style={{
                        background: "white",
                        padding: "12px",
                        borderRadius: "12px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <img
                        src={logo}
                        alt="Team Logo"
                        width={80}
                        height={80}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                color: "#94A3B8",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              aesmb.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const error = e as Error;
    console.log(error.message);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
