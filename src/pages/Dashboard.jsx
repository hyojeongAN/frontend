export default function Dashboard() {
  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-6 rounded-xl bg-[#1A1C21]">Card 1</div>
        <div className="p-6 rounded-xl bg-[#1A1C21]">Card 2</div>
        <div className="p-6 rounded-xl bg-[#1A1C21]">Card 3</div>
      </div>
    </div>
  );
}