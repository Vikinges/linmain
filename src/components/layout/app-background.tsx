export function AppBackground() {
  return (
    <>
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
    </>
  )
}
