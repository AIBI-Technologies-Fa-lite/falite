type Props = {
  title: string;
  icon: any;
};

const Button = (props: Props) => {
  return <div>{props.title}</div>;
};

export default Button;
