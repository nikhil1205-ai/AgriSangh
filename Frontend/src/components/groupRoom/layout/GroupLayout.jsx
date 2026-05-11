const GroupLayout = ({ sidebar, mobileSidebar, navbar, children }) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="lg:flex">
        <div className="hidden lg:block lg:w-[300px] xl:w-[320px]">{sidebar}</div>
        <div className="flex flex-1 flex-col">
          {mobileSidebar}
          {navbar}
          <main className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default GroupLayout;
