interface ButtonProps{
    text: string,
    className?: string

}

function Button({text="Button", className} : ButtonProps) {
  return (
    <>
      <button className={className}>
        {text}
      </button>
    </>
  );
}

export default Button;