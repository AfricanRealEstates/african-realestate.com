"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
interface TeamMemberProps {
    name: string;
    role: string;
    imageSrc: string;
    link?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, imageSrc, link }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="rounded-full bg-ui w-32 h-32 border p-0.5 shadow shadow-gray-950/5">
                <Image
                    className="rounded-full object-cover w-full h-full"
                    src={imageSrc}
                    alt={name}
                    width={80}
                    height={80}
                    loading="lazy"
                />
            </div>
            <span className="text-title mt-2 block text-sm font-medium">{name}</span>
            <span className="text-caption block text-xs">{role}</span>
            {link && isHovered && (
                <Link
                    target='_blank'
                    href={link}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full text-white text-sm transition-opacity duration-300"
                >
                    View Profile
                </Link>
            )}
        </div>
    );
};

export default TeamMember;