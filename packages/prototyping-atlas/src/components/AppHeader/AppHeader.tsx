export const AppHeader = (props: { className?: string }) => {

  const className = `${props.className || ''} w-full p-3 bg-black text-white`.trim();

  return (
    <header className={className}>
      <h1 className="font-dm-display font-light text-3xl">
        Atlas
      </h1>
    </header>
  )

}