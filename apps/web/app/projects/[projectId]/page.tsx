export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
      <h1 className="text-2xl font-bold mb-4">Project {params.id}</h1>
      <p>list of test suites</p>
    </div>
  );
}