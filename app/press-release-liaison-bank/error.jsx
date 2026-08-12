"use client";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold text-red-600">
        Failed to Fetch Data from Server
      </h1>
      <p className="mt-3 text-gray-600">
        Please try again later.
      </p>
    </div>
  );
}