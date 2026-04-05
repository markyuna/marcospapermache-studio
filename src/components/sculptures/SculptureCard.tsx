"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type SculptureCardProps = {
  slug: string;
  src: string;
  title: string;
};

export default function SculptureCard({
  slug,
  src,
  title,
}: SculptureCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="group">
      <Link href={`/sculptures/${slug}`} className="block">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <Image
            src={src}
            alt={title}
            width={800}
            height={1000}
            className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <p className="mt-4 text-base font-medium text-neutral-900">{title}</p>
      </Link>
    </motion.div>
  );
}