import { Link } from "react-router-dom";

interface LogoProps {
  url?: string;
}

const Logo = ({ url = "/" }: LogoProps) => {
  return (
    <Link to={url} className="flex items-center gap-2">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
        <span className="text-lg font-bold text-primary-foreground">WP</span>
      </div>
      <span className="text-xl font-bold tracking-tight">WorkPulse</span>
    </Link>
  );
};

export default Logo;
