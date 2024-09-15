export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-gray-900 text-white p-4">
        {children}
      </div>
    </div>
  );
};
