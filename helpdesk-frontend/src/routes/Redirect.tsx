import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Redirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/entrar", { replace: true });
  }, [navigate]);
  return (
    <div>
      <p>Indentificando usuário e redirecionando...</p>
    </div>
  );
}
