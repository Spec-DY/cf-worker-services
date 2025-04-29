import Button from "../app/components/Button";

export default function Home() {
  return (
    <div className="min-h-screen p-6">
      <h3 className="mb-4 pb-2 font-normal text-xl">
        Check the weather forecast
      </h3>
      <div className="flex mb-3">
        <select
          className="rounded border px-3 py-2 w-full mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search"
          aria-describedby="search-addon"
          id="location-select"
        >
          <option value="burnaby">Burnaby, Canada</option>
          <option value="wuhan">Wuhan, China</option>
          <option value="london">London, UK</option>
          <option value="new-york">New York, US</option>
          <option value="los-angeles">Los Angeles, US</option>
        </select>
        <Button />
      </div>
    </div>
  );
}
