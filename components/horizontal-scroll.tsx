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
          <figure key={i.title} className="shrink-0 w-[378px]">
            <figcaption className="relative w-[378px] h-[550px] mx-auto rounded-[14px] bg-gray-100 overflow-hidden flex flex-col">
              <div className="w-full bg-[#6F6B6B] h-[296px] shrink-0" />
              <div className="flex-1 p-4 text-left flex flex-col gap-2">
                <h3 className="text-[24px] font-lora font-bold text-black leading-tight break-words line-clamp-2">
                  {i.title}
                </h3>
                <div>
                  <div className="text-[15px] font-lora font-semibold text-black">{i.timingsLabel}</div>
                  <div className="text-[14px] font-lora font-normal text-black leading-snug line-clamp-2">
                    {i.timings.map((t, idx) => (
                      <div key={idx}>{t}</div>
                    ))}
                  </div>
                </div>
                <div className="text-[11px] font-lora font-semibold text-black leading-snug line-clamp-2">
                  {i.scripture}
                </div>
                <p className="text-[12px] font-lora font-normal text-black leading-snug line-clamp-4">
                  {i.description}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

