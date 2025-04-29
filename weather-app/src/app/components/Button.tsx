"use client";
import { useRouter } from "next/navigation";

export default function Button() {
  const router = useRouter();
  if (!router) {
    return null;
  }

  const handleClick = () => {
    let location = document.getElementById(
      "location-select"
    ) as unknown as HTMLSelectElement;

    router.push(`/api/weather/${location.value}`);
  };
  return (
    <a href="#" type="button" className="no-underline" onClick={handleClick}>
      <span className="font-bold border-0" id="search-addon"></span>
      <button className="rounded-md shadow-md hover:bg-cyan-400 border-2 p-2">
        Check!
      </button>
    </a>
  );
}
