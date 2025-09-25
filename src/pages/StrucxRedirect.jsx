import { useEffect } from "react";

export default function StrucxRedirect() {
  useEffect(() => {
    window.location.replace("https://strucx.ai");
  }, []);
  return null;
}
