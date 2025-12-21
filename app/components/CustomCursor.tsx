"use client";

import { useEffect, useState } from "react";
import { BsHandIndexThumb } from "react-icons/bs";

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if the element is clickable (or inside a clickable element)
            const clickableElement = target.closest("a, button, [role='button'], .cursor-pointer");

            // Check if the element is an input field (or inside one)
            const inputElement = target.closest("input, textarea, [contenteditable='true']");

            if (clickableElement && !inputElement) {
                setIsHovering(true);
                document.body.classList.add('custom-cursor-active');
            } else {
                setIsHovering(false);
                document.body.classList.remove('custom-cursor-active');
            }
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
            setIsHovering(false);
            document.body.classList.remove('custom-cursor-active');
        };

        window.addEventListener("mousemove", updatePosition);
        window.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", updatePosition);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.body.classList.remove('custom-cursor-active');
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <style jsx global>{`
        .custom-cursor-active, .custom-cursor-active * {
          cursor: none !important;
        }
        /* Force hide cursor on video controls */
        .custom-cursor-active video,
        .custom-cursor-active video::-webkit-media-controls,
        .custom-cursor-active video::-webkit-media-controls-overlay-enclosure,
        .custom-cursor-active video::-webkit-media-controls-enclosure,
        .custom-cursor-active video::-webkit-media-controls-panel,
        .custom-cursor-active video::-webkit-media-controls-play-button,
        .custom-cursor-active video::-webkit-media-controls-timeline,
        .custom-cursor-active video::-webkit-media-controls-current-time-display,
        .custom-cursor-active video::-webkit-media-controls-time-remaining-display,
        .custom-cursor-active video::-webkit-media-controls-mute-button,
        .custom-cursor-active video::-webkit-media-controls-toggle-closed-captions-button,
        .custom-cursor-active video::-webkit-media-controls-volume-slider,
        .custom-cursor-active video::-webkit-media-controls-fullscreen-button,
        .custom-cursor-active video::-webkit-media-controls-overflow-button {
          cursor: none !important;
        }
      `}</style>
            {isHovering && (
                <div
                    className="fixed pointer-events-none z-[9999] text-white dark:text-white"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: 'translate(-50%, -50%)' // Center the icon on the cursor
                    }}
                >
                    <BsHandIndexThumb className="w-5 h-5 drop-shadow-lg" />
                </div>
            )}
        </>
    );
}
