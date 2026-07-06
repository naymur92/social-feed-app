"use client";

export default function Avatar({ src, name = "", size = 40, className = "" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={className}
        width={size}
        height={size}
        style={{ borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <span
      className={className}
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1890FF",
        color: "#fff",
        fontWeight: 600,
        fontSize: Math.max(11, Math.round(size * 0.4)),
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {initials || "?"}
    </span>
  );
}