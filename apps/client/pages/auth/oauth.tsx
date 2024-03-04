import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export async function getServerSideProps({ query }: any) {
  //   console.log(query);

  if (process.env.API_URL.includes("localhost")) {
    const sso = await fetch(
      `/api/v1/auth/sso/login/callback?code=${query.code}&state=${query.state}`
    ).then((res) => res.json());

    if (!sso.success) {
      return {
        redirect: {
          destination: "/auth/login?error=account_not_found",
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          token: sso.token,
          permanent: true,
        },
      };
    }
  } else {
    const sso = await fetch(
      `/api/v1/auth/sso/login/check?code=${query.code}&state=${query.state}`
    ).then((res) => res.json());
    console.log(sso);

    if (!sso.success) {
      return {
        redirect: {
          destination: "/auth/login?error=account_not_found",
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          token: sso.token,
          permanent: true,
        },
      };
    }
  }
}

export default function Login({ token }) {
  const router = useRouter();

  function setandRedirect() {
    setCookie("session", token, { maxAge: 60 * 6 * 24 });
    router.push("/onboarding");
    router.push("/");
  }

  useEffect(() => {
    setandRedirect();
  }, []);

  return <div></div>;
}
