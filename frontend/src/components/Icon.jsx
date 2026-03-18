import React from "react";

// Petit wrapper pour uniformiser taille/couleur des icônes Lucide
export function Icon({ as: As, size = 18, color = "currentColor", style, ...props }) {
  if (!As) return null;
  return (
    <As
      size={size}
      color={color}
      style={{ verticalAlign: "-0.2em", flexShrink: 0, ...style }}
      {...props}
    />
  );
}

