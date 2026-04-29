import { useEffect } from "react";

export function useWebOTP(
  // @ts-ignore
  onReceive: (code: string) => void,
  // @ts-ignore
  onLog: (msg: string) => void = () => {},
) {
  useEffect(() => {
    const ac = new AbortController();
    console.group("sc");
    console.log(ac, new Date().toISOString());
    console.groupEnd();
    navigator.credentials
      .get({
        // @ts-ignore
        otp: { transport: ["sms"] },
        signal: ac.signal,
      })
      .then((otp) => {
        console.log("OTP received:", otp);
      })
      .catch((err) => {
        console.log(err);
      });

    // const ts = () => new Date().toISOString();

    // if (typeof window === "undefined") {
    //   onLog(`[${ts()}] window is undefined — skipping`);
    //   return;
    // }

    // onLog(`[${ts()}] userAgent: ${navigator.userAgent}`);
    // onLog(`[${ts()}] OTPCredential in window: ${"OTPCredential" in window}`);

    // if (!("OTPCredential" in window)) {
    //   onLog(`[${ts()}] Web OTP API not supported — aborting`);
    //   console.warn("Web OTP API is not supported in this environment.");
    //   return;
    // }

    // onLog(`[${ts()}] Creating AbortController`);
    // const abortController = new AbortController();

    // onLog(
    //   `[${ts()}] Calling navigator.credentials.get({ otp: { transport: ["sms"] } })`,
    // );

    // navigator.credentials
    //   .get({
    //     // @ts-ignore
    //     otp: { transport: ["sms"] },
    //     signal: abortController.signal,
    //   })
    //   .then((credential) => {
    //     onLog(`[${ts()}] credentials.get resolved`);
    //     onLog(`[${ts()}] credential type: ${credential?.type ?? "null"}`);
    //     onLog(`[${ts()}] credential id: ${(credential as any)?.id ?? "n/a"}`);
    //     onLog(
    //       `[${ts()}] credential code: ${(credential as any)?.code ?? "n/a"}`,
    //     );
    //     onLog(`[${ts()}] full credential JSON: ${JSON.stringify(credential)}`);
    //     console.group("creds");
    //     console.log(credential);
    //     console.groupEnd();
    //     if (credential && "code" in credential) {
    //       onReceive(credential.code as string);
    //     }
    //   })
    //   .catch((error) => {
    //     onLog(`[${ts()}] credentials.get rejected`);
    //     onLog(`[${ts()}] error name: ${error?.name}`);
    //     onLog(`[${ts()}] error message: ${error?.message}`);
    //     onLog(`[${ts()}] error stack: ${error?.stack}`);
    //     console.error("Error while retrieving OTP:", error);
    //   });

    // return () => {
    //   onLog(`[${ts()}] cleanup called — aborting`);
    //   // abortController.abort();
    // };}
  }, []);
}
