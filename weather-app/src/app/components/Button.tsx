"use client";
import { useRouter } from "next/navigation";

export default function Button() {
  const router = useRouter();
  if (!router) {
    return null;
  }

  const handleClick = () => {
    // get location from element id
    let location = document.getElementById(
      "location-select"
    ) as unknown as HTMLSelectElement;

    // go to this url with location when button clicked
    router.push(`/weather/${location.value}`);
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
