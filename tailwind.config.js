/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary brand colors
                primaryColor: "#0067FF",
                yellowColor: "#FEB60D",
                purpleColor: "#9771FF",
                irisBlueColor: "#01B5C5",
                headingColor: "#181A1E",
                textColor: "#4E545F",

                // Premium Dark Mode Palette
                dark: {
                    bg: {
                        primary: "#0A0E1A",      // Deep navy-black
                        secondary: "#12172B",    // Slightly lighter
                        tertiary: "#1A2035",     // Card backgrounds
                        elevated: "#242B45",     // Elevated surfaces
                    },
                    text: {
                        primary: "#F1F5F9",      // Almost white
                        secondary: "#CBD5E1",    // Soft gray
                        tertiary: "#94A3B8",     // Muted gray
                        muted: "#64748B",        // Very muted
                    },
                    border: {
                        primary: "#1E293B",      // Subtle borders
                        secondary: "#334155",    // More visible borders
                        accent: "#475569",       // Accent borders
                    }
                }
            },

            boxShadow: {
                panelShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;",
                'dark-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.4)',
                'dark-md': '0 4px 16px 0 rgba(0, 0, 0, 0.5)',
                'dark-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
                'dark-xl': '0 16px 48px 0 rgba(0, 0, 0, 0.7)',
            },

            backgroundImage: {
                'dark-gradient': 'linear-gradient(135deg, #0A0E1A 0%, #12172B 100%)',
                'dark-gradient-radial': 'radial-gradient(circle at top right, #1A2035 0%, #0A0E1A 100%)',
            }
        },
    },
    plugins: [],
};