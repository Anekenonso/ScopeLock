import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          borderRadius: 8,
          position: "relative",
        }}
      >
        {/* Shackle */}
        <div
          style={{
            position: "absolute",
            top: 5,
            width: 14,
            height: 12,
            border: "2.5px solid #FFFFFF",
            borderBottom: "none",
            borderTopLeftRadius: 7,
            borderTopRightRadius: 7,
          }}
        />
        {/* Lock / Scope body */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            width: 18,
            height: 13,
            backgroundColor: "#0284C7",
            borderRadius: 3.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Aperture */}
          <div
            style={{
              width: 4,
              height: 4,
              backgroundColor: "#FFFFFF",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
