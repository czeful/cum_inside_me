import { useLoading } from "../context/LoadingContext";

const Loader = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 border-b-4 border-emerald-400"></div>
    </div>
  );
};

export default Loader;
