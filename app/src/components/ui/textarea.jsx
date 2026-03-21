import React from "react";

export function Textarea({ className = "", ...props }) {
    return (
        <textarea
            {...props}
            className={`bg-[#080807] border border-[#C9A84C]/20 text-[#F5F0E8] placeholder:text-[#F5F0E8]/30 focus:border-[#C9A84C] min-h-[120px] resize-none w-full p-2 ${className}`}
        />
    );
}