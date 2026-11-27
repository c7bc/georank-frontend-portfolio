import Link from "next/link";
import { GeoRankIcon } from "./georank-icon";

type LogoProps = {
  className?: string;
  href?: string;
};

export function Logo({ className = "", href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <GeoRankIcon className="text-foreground" size={28} />
      <span className="text-xl font-semibold tracking-tight text-foreground">
        GeoRank
      </span>
    </Link>
  );
}
