import * as React from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export interface Ministries {
  title: string,
  timingsLabel: string,
  timings: string[],
  scripture: string,
  description: string
}

const works: Ministries[] = [
    {
        title: 'Kids Ministry – FLK.I.D.S',
        timingsLabel: 'Timings: Every Sunday:',
        timings: ['1st Service timing: 8:00am', '2nd Service Timing: 9:45am'],
        scripture: '“From the lips of children and infants you have ordained praise…” (Ps. 8:2)',
        description:
        'This is the place where your kids aging from Nursery to 12 years old dive into the exciting journey of growing in the word, in love, learning, and purpose. Send your kids to be ready, inspired, empowered, and part of a dynamic kids’ ministry, making a difference!',
    },
    {
        title: 'Youth Ministry',
        timingsLabel: 'Timings:',
        timings: ['Every Saturday: 5:00pm'],
        scripture: '“Let no one despise you for your youth...” (1 Tim. 4:12)',
        description:
        'A vibrant space for teens to encounter Jesus, grow in the Word, and build godly friendships through fun, worship, and service.',
    },
    {
        title: 'Women’s Fellowship',
        timingsLabel: 'Timings:',
        timings: ['Every Wednesday: 11:00am'],
        scripture: '“She is clothed with strength and dignity...” (Prov. 31:25)',
        description:
        'Equipping women to flourish in faith and life through prayer, teaching, mentoring, and community support.',
    },
    {
        title: 'Men’s Fellowship',
        timingsLabel: 'Timings:',
        timings: ['Every Friday: 7:00pm'],
        scripture: '“As iron sharpens iron, so one person sharpens another.” (Prov. 27:17)',
        description:
        'Strengthening men to lead at home, church, and society with integrity, courage, and Christlike character.',
    },
    {
        title: 'Outreach & Missions',
        timingsLabel: 'Timings:',
        timings: ['Monthly Outreaches'],
        scripture: '“Go therefore and make disciples of all nations...” (Matt. 28:19)',
        description:
        'Taking the Gospel beyond our walls through outreach events, service projects, and missions partnerships.',
    },
];

export function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-4 p-4">
        {works.map((i) => (
          <figure key={i.title} className="shrink-0 w-[280px] sm:w-[340px] md:w-[360px] lg:w-[378px]">
            <figcaption className="relative w-full h-[550px] mx-auto rounded-[14px] bg-gray-100 overflow-hidden">
              <span className="absolute top-0 left-0 block w-full h-[220px] sm:h-[260px] md:h-[280px] lg:h-[296px] bg-[#6F6B6B]" />
              <span className="absolute left-4 top-[316px] block text-black text-[28px] font-lora font-bold text-left pr-4 whitespace-normal break-words">
                {i.title}
              </span>
              <span className="absolute left-4 top-[364px] block text-left pr-4">
                <span className="block text-[15px] font-lora font-semibold text-black whitespace-normal break-words">{i.timingsLabel}</span>
                <span className="block text-[14px] font-lora font-normal text-black whitespace-normal break-words">
                  {i.timings.map((t, idx) => (
                    <span key={idx} className="block">{t}</span>
                  ))}
                </span>
              </span>
              <span className="absolute left-4 top-[428px] block text-[10px] font-lora font-semibold text-black text-left pr-4 whitespace-normal break-words">
                {i.scripture}
              </span>
              <span className="absolute left-4 top-[452px] block w-[341px] text-[12px] font-lora font-normal text-black text-left pr-4 leading-snug whitespace-normal break-words">
                {i.description}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

