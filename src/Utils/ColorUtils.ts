export const getGradientFromString = (value?: string) => {
    if (!value) return "linear-gradient(135deg,#8b5cf6,#ec4899)";

    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 40) % 360;

    return `linear-gradient(135deg, hsl(${hue1},70%,55%), hsl(${hue2},70%,55%))`;
};