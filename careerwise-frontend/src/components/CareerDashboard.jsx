import CareerCard from "./CareerCard";

export default function CareerDashboard({ data }) {
  const recommendations = data.recommendations || [];

  return (
    <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {recommendations.map((rec, idx) => (
        <CareerCard key={idx} careerData={rec} apiData={data} />
      ))}
    </div>
  );
}
