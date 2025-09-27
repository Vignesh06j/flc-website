"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export type ServicesCardProps = {
  title: string;
  subtitle: string;
  addressLines: string[];
  imageUrl?: string;
  iconUrl?: string;
};

const ServicesCard: React.FC<ServicesCardProps> = ({
  title,
  subtitle,
  addressLines,
  imageUrl,
  iconUrl,
}) => {
  return (
    <Card className="relative rounded-[14px] border-[3px] border-slate-400 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} image`}
            className="w-full aspect-[347/255] object-cover rounded-md"
          />
        ) : (
          <div className="w-full aspect-[347/255] bg-gray-300 rounded-md" />
        )}

        <h3 className="mt-6 text-2xl font-bold text-black font-lora">{title}</h3>
        <p className="mt-2 text-lg text-black font-work-sans">{subtitle}</p>

        <div className="mt-4 flex items-start gap-3">
          <img
            src={iconUrl ?? 'https://placehold.co/40x40'}
            alt="Location icon"
            width={40}
            height={40}
            className="rounded"
          />
          <p className="text-sm text-[#1F1F1F] leading-[21px] font-work-sans">
            {addressLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < addressLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>

        <div className="absolute bottom-6 right-6 w-[30px] h-[30px] bg-[#1F1F1F] rounded-md" />
      </CardContent>
    </Card>
  );
};

export default ServicesCard;
